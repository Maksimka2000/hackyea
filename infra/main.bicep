targetScope = 'resourceGroup'

@description('Azure region for the HubMi demo resources.')
param location string = 'polandcentral'

@secure()
@minLength(16)
@description('Password for the dedicated HubMi PostgreSQL administrator.')
param postgresAdministratorPassword string

@secure()
@minLength(16)
@description('Salt used to hash client addresses in matching request logs.')
param matchingClientKeySalt string

@secure()
@minLength(32)
@description('Signing key for access tokens (32 or more characters). The API refuses to start without it.')
param jwtSecretKey string

@allowed(['B2', 'B3'])
@description('App Service plan size. The API loads two local ONNX models and needs 2-3 GB of memory, so B1 (1.75 GB) is too small.')
param appServicePlanSku string = 'B3'

@description('Create the demo accounts and list them on the sign-in screen. Turn off for anything that is not a demo.')
param seedDemoAccounts bool = true

var suffix = uniqueString(subscription().id, resourceGroup().id)
var tags = { app: 'hubmi', env: 'demo' }
var planName = 'asp-hubmi-demo'
var registryName = 'acrhubmi${suffix}'
var vaultName = 'kv-hubmi-${suffix}'
var postgresName = 'pg-hubmi-${suffix}'
var apiName = 'app-hubmi-api-${suffix}'
var webName = 'app-hubmi-web-${suffix}'
var databaseName = 'hubmi'
var postgresAdministratorLogin = 'hubmiadmin'

var acrPullRole = subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '7f951dda-4ed3-4680-a7ca-43fe172d538d')
var vaultSecretsUserRole = subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '4633458b-17de-408a-b874-0445c86b69e6')

resource plan 'Microsoft.Web/serverfarms@2024-04-01' = {
  name: planName
  location: location
  kind: 'linux'
  tags: tags
  sku: {
    name: appServicePlanSku
    tier: 'Basic'
  }
  properties: { reserved: true }
}

resource registry 'Microsoft.ContainerRegistry/registries@2023-11-01-preview' = {
  name: registryName
  location: location
  tags: tags
  sku: { name: 'Basic' }
  properties: {
    adminUserEnabled: false
    publicNetworkAccess: 'Enabled'
  }
}

resource vault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: vaultName
  location: location
  tags: tags
  properties: {
    tenantId: subscription().tenantId
    enableRbacAuthorization: true
    enablePurgeProtection: true
    publicNetworkAccess: 'Enabled'
    sku: {
      family: 'A'
      name: 'standard'
    }
  }
}

resource postgres 'Microsoft.DBforPostgreSQL/flexibleServers@2024-08-01' = {
  name: postgresName
  location: location
  tags: tags
  sku: {
    name: 'Standard_B1ms'
    tier: 'Burstable'
  }
  properties: {
    administratorLogin: postgresAdministratorLogin
    administratorLoginPassword: postgresAdministratorPassword
    version: '16'
    storage: {
      storageSizeGB: 32
      autoGrow: 'Enabled'
      tier: 'P4'
    }
    backup: {
      backupRetentionDays: 7
      geoRedundantBackup: 'Disabled'
    }
    highAvailability: { mode: 'Disabled' }
    network: { publicNetworkAccess: 'Enabled' }
  }
}

resource database 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2024-08-01' = {
  parent: postgres
  name: databaseName
  properties: {}
}

// The first migration runs CREATE EXTENSION pg_trgm; Azure only allows extensions that are listed here.
resource postgresExtensions 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2024-08-01' = {
  parent: postgres
  name: 'azure.extensions'
  dependsOn: [database]
  properties: {
    value: 'PG_TRGM'
    source: 'user-override'
  }
}

resource api 'Microsoft.Web/sites@2024-04-01' = {
  name: apiName
  location: location
  kind: 'app,linux,container'
  tags: tags
  identity: { type: 'SystemAssigned' }
  properties: {
    serverFarmId: plan.id
    httpsOnly: true
    publicNetworkAccess: 'Enabled'
    siteConfig: {
      acrUseManagedIdentityCreds: true
      alwaysOn: true
      ftpsState: 'Disabled'
      healthCheckPath: '/health'
      minTlsVersion: '1.2'
    }
  }
}

resource web 'Microsoft.Web/sites@2024-04-01' = {
  name: webName
  location: location
  kind: 'app,linux,container'
  tags: tags
  identity: { type: 'SystemAssigned' }
  properties: {
    serverFarmId: plan.id
    httpsOnly: true
    publicNetworkAccess: 'Enabled'
    siteConfig: {
      acrUseManagedIdentityCreds: true
      alwaysOn: true
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
    }
  }
}

resource connectionSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: vault
  name: 'postgres-connection-string'
  properties: {
    value: 'Host=${postgres.properties.fullyQualifiedDomainName};Port=5432;Database=${databaseName};Username=${postgresAdministratorLogin};Password=${postgresAdministratorPassword};Ssl Mode=Require;Trust Server Certificate=false'
  }
}

resource matchingSaltSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: vault
  name: 'matching-client-key-salt'
  properties: { value: matchingClientKeySalt }
}

resource jwtSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: vault
  name: 'jwt-secret-key'
  properties: { value: jwtSecretKey }
}

resource apiSettings 'Microsoft.Web/sites/config@2024-04-01' = {
  parent: api
  name: 'appsettings'
  properties: {
    ASPNETCORE_ENVIRONMENT: 'Production'
    WEBSITES_PORT: '8080'
    // Pulling the image, loading the matching models and migrating can take longer than the default 230 seconds.
    WEBSITES_CONTAINER_START_TIME_LIMIT: '600'
    ConnectionStrings__HubMi: '@Microsoft.KeyVault(SecretUri=${connectionSecret.properties.secretUriWithVersion})'
    Matching__ClientKeySalt: '@Microsoft.KeyVault(SecretUri=${matchingSaltSecret.properties.secretUriWithVersion})'
    Persistence__MigrateOnStartup: 'true'
    Persistence__SeedSampleLibrary: 'true'
    Persistence__SeedIdentity: string(seedDemoAccounts)
    Auth__ExposeDemoAccounts: string(seedDemoAccounts)
    Auth__Jwt__SecretKey: '@Microsoft.KeyVault(SecretUri=${jwtSecret.properties.secretUriWithVersion})'
    Swagger__Enabled: 'false'
    // Behind the App Service front end every visitor looks like the same address, so these per-address limits are
    // really shared by everyone: keep them high enough for a room full of people trying the demo.
    RateLimiting__Match__PermitLimit: '300'
    RateLimiting__Login__PermitLimit: '60'
  }
}

resource webSettings 'Microsoft.Web/sites/config@2024-04-01' = {
  parent: web
  name: 'appsettings'
  properties: {
    WEBSITES_PORT: '3000'
    API_ORIGIN: 'https://${api.properties.defaultHostName}'
  }
}

resource apiAcrPull 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: registry
  name: guid(registry.id, api.id, acrPullRole)
  properties: {
    principalId: api.identity.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: acrPullRole
  }
}

resource webAcrPull 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: registry
  name: guid(registry.id, web.id, acrPullRole)
  properties: {
    principalId: web.identity.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: acrPullRole
  }
}

resource apiVaultAccess 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: vault
  name: guid(vault.id, api.id, vaultSecretsUserRole)
  properties: {
    principalId: api.identity.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: vaultSecretsUserRole
  }
}

output registryName string = registry.name
output apiName string = api.name
output webName string = web.name
output postgresName string = postgres.name
output apiUrl string = 'https://${api.properties.defaultHostName}'
output webUrl string = 'https://${web.properties.defaultHostName}'
