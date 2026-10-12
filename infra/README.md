# HubMi Azure demo deployment

The Bicep deployment creates HubMi resources inside a resource group of its own (`rg-hubmi-demo`), so nothing else in the subscription is touched and everything can be removed with one command. It provisions one Linux App Service plan (B3 by default: the API's local matching models need 2-3 GB of memory and the web container shares the plan; B2 is the cheaper option) with two container apps, Basic Container Registry, PostgreSQL Flexible Server, and Key Vault. The app images are deployed separately by `.github/workflows/deploy.yml` whenever `main` receives a push.

## One-time preparation

1. Select **Azure subscription 1** and create the dedicated resource group (the region matches the template's default):

   ```powershell
   az account list --query '[].{name:name,id:id}' --output table
   az account set --subscription '<subscription ID for Azure subscription 1>'
   $env:AZURE_RESOURCE_GROUP = 'rg-hubmi-demo'
   az group create --name $env:AZURE_RESOURCE_GROUP --location polandcentral
   ```

2. Use the `spn-hubmi-github-demo` app registration for GitHub Actions. Its federated credential trusts the `Maksimka2000/hackyea` repository's `production` environment with subject `repo:Maksimka2000@77247341/hackyea@1402975940:environment:production`. The service principal has `Contributor` on `rg-hubmi-demo` and `AcrPush` on the HubMi registry. The identity running the initial Bicep deployment also needs permission to create role assignments.
3. In this GitHub repository, set Actions secrets `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`, and `AZURE_RESOURCE_GROUP` (`rg-hubmi-demo`). Remove any required reviewer protection from the `production` environment if every push to `main` should deploy immediately. The workflow reads resource names from the `hubmi-demo` deployment outputs.
4. Generate distinct random values for the HubMi PostgreSQL administrator password, the matching client-key salt and the access-token signing key (`openssl rand -base64 48`). Pass them as secure Bicep parameters. Never commit them or place them in `.bicepparam`.

## Provision once

Run from the repository root after setting `AZURE_RESOURCE_GROUP`. The three secure values below are placeholders for shell variables populated without committing their values:

```powershell
az deployment group create `
  --resource-group $env:AZURE_RESOURCE_GROUP `
  --name hubmi-demo `
  --template-file infra/main.bicep `
  --parameters postgresAdministratorPassword=$env:HUBMI_DB_PASSWORD matchingClientKeySalt=$env:HUBMI_CLIENT_KEY_SALT jwtSecretKey=$env:HUBMI_JWT_SECRET

$outputs = az deployment group show --resource-group $env:AZURE_RESOURCE_GROUP --name hubmi-demo --query properties.outputs | ConvertFrom-Json
./infra/Update-PostgresFirewall.ps1 `
  -ResourceGroup $env:AZURE_RESOURCE_GROUP `
  -PostgresServerName $outputs.postgresName.value `
  -ApiWebAppName $outputs.apiName.value
```

The Bicep file also allows the `pg_trgm` extension on the server (the first migration creates it, and Azure refuses extensions that are not listed). The firewall script allows the API App Service's possible outbound addresses on the dedicated PostgreSQL server. Re-run it if Azure changes those addresses. The frontend does not connect to PostgreSQL.

## Deploy

Push to `main` or run **Deploy HubMi demo** with `workflow_dispatch`. The workflow builds immutable images tagged with the commit SHA, pushes them to ACR, updates the API first, checks `/api/categories`, then builds and deploys the web image. `API_ORIGIN` is supplied both at frontend build time and as a web App Service setting. The web image uses the live API for every feature (signing in, submissions and the staff panel have no mock mode). By default the API creates the demo accounts and lists them on the sign-in screen; pass `seedDemoAccounts=false` to turn that off.

Find the default app URLs in the deployment outputs:

```powershell
az deployment group show --resource-group $env:AZURE_RESOURCE_GROUP --name hubmi-demo --query 'properties.outputs.{api:apiUrl.value,web:webUrl.value}' --output json
```

The API migrates the schema at startup and imports the bundled sample library when the innovations table is empty. An older image does not reverse a database migration. Keep the PostgreSQL backup available when changing the schema. `GET /health` checks the process; the workflow also requests `/api/categories` to verify database-backed startup.

The App Service plan, PostgreSQL server, registry, and Key Vault incur charges while provisioned. After the demo, remove everything with `az group delete --name rg-hubmi-demo --yes`. The Key Vault has purge protection, so it stays in a soft-deleted state for the retention period; that costs nothing and does not block creating a new group.
