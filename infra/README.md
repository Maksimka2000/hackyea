# HubMi Azure demo deployment

The Bicep deployment creates HubMi resources inside an **existing** resource group. It does not modify Fitspire resources in that group. It provisions one B1 Linux App Service plan with two container apps, Basic Container Registry, PostgreSQL Flexible Server, and Key Vault. The app images are deployed separately by `.github/workflows/deploy.yml` whenever `main` receives a push.

## One-time preparation

1. Identify the resource group containing Fitspire, then select **Azure subscription 1**:

   ```powershell
   az account list --query '[].{name:name,id:id}' --output table
   az account set --subscription '<subscription ID for Azure subscription 1>'
   az group list --query '[].{name:name,location:location}' --output table
   ```

2. Create a distinct Azure identity or reuse an identity with permissions to deploy this template, push images to the HubMi registry, and update both HubMi App Services. Its federated credential must trust the `Maksimka2000/hackyea` repository's `production` environment on GitHub (`repo:Maksimka2000/hackyea:environment:production`). Fitspire's repository-specific federated credential alone does not authorize this repository. The GitHub identity needs `AcrPush` on the HubMi registry and permission to update the two HubMi App Services. The identity running the initial Bicep deployment also needs permission to create role assignments.
3. In this GitHub repository's `production` environment, set secrets `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`, and variable `AZURE_RESOURCE_GROUP` (the exact existing group name). Remove any required reviewer protection if every push to `main` should deploy immediately. The workflow reads resource names from the `hubmi-demo` deployment outputs.
4. Generate distinct random values for the HubMi PostgreSQL administrator password and matching client-key salt. Pass them as secure Bicep parameters. Never commit them or place them in `.bicepparam`.

## Provision once

Run from the repository root after setting `AZURE_RESOURCE_GROUP`. The two secure values below are placeholders for shell variables populated without committing their values:

```powershell
az deployment group create `
  --resource-group $env:AZURE_RESOURCE_GROUP `
  --name hubmi-demo `
  --template-file infra/main.bicep `
  --parameters postgresAdministratorPassword=$env:HUBMI_DB_PASSWORD matchingClientKeySalt=$env:HUBMI_CLIENT_KEY_SALT

$outputs = az deployment group show --resource-group $env:AZURE_RESOURCE_GROUP --name hubmi-demo --query properties.outputs | ConvertFrom-Json
./infra/Update-PostgresFirewall.ps1 `
  -ResourceGroup $env:AZURE_RESOURCE_GROUP `
  -PostgresServerName $outputs.postgresName.value `
  -ApiWebAppName $outputs.apiName.value
```

The firewall script allows the API App Service's possible outbound addresses on the dedicated PostgreSQL server. Re-run it if Azure changes those addresses. The frontend does not connect to PostgreSQL.

## Deploy

Push to `main` or run **Deploy HubMi demo** with `workflow_dispatch`. The workflow builds immutable images tagged with the commit SHA, pushes them to ACR, updates the API first, checks `/api/categories`, then builds and deploys the web image. `API_ORIGIN` is supplied both at frontend build time and as a web App Service setting. The web image uses live matching and innovation endpoints; submissions remain mocked until the backend implements them.

Find the default app URLs in the deployment outputs:

```powershell
az deployment group show --resource-group $env:AZURE_RESOURCE_GROUP --name hubmi-demo --query 'properties.outputs.{api:apiUrl.value,web:webUrl.value}' --output json
```

The API migrates the schema at startup and imports the bundled sample library when the innovations table is empty. An older image does not reverse a database migration. Keep the PostgreSQL backup available when changing the schema. `GET /health` checks the process; the workflow also requests `/api/categories` to verify database-backed startup.

The B1 plan, PostgreSQL server, registry, and Key Vault incur charges while provisioned. Remove the HubMi resources after the demo when no longer needed; keep the shared Fitspire resource group.
