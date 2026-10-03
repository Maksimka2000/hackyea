# Configuration

Typed options and configuration validation for the API composition root. Keep secrets in environment configuration, not committed JSON.

| Setting | Where | Notes |
|---|---|---|
| `ConnectionStrings__HubMi` | environment | Required. Set by `docker-compose.hubmi.yml`. |
| `Persistence__MigrateOnStartup`, `Persistence__SeedSampleLibrary` | environment / appsettings | Apply migrations and load the sample library into an empty database. On in Development and in the compose file. |
| `Matching` section | `search-config.json` | Thresholds, stop words, synonyms, irregular forms. Tune without code changes. |
| `Swagger__Enabled` | appsettings / environment | Swagger UI at `/swagger`. On in Development and in the compose file (override with `HUBMI_SWAGGER_ENABLED=false`); keep it off in production. |
| `RateLimiting__Match__PermitLimit` / `WindowSeconds` | appsettings / environment | Per-client limit for `POST /api/match` (default 20 per 60 s). |

## Run everything in Docker

```
cd server
cp .env.example .env          # set HUBMI_DB_PASSWORD
docker compose -f docker-compose.hubmi.yml up --build
```

API on http://localhost:8081 (`/health`, `POST /api/match`), Postgres on 127.0.0.1:5433. `docker-compose.yml` belongs to the legacy shipping template and is not used.

## Migrations

```
dotnet ef migrations add <Name> -p HubMi.Infrastructure -s HubMi.Infrastructure -o Persistence/Migrations
```

The full-text column, index and `hubmi_fold` function are created by raw SQL inside `InitialCreate`; they are not in the EF model.
