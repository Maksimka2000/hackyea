# HubMI backend foundation

This solution has four projects and one deployable API. It currently contains no HubMI business behavior.

Open `HubMi.sln` for new work. The existing `ShippingService.*` projects, shipping solution, and shipping Docker Compose file are legacy template material. They are deliberately excluded from `HubMi.sln` and remain untouched for now because the working tree contains an edit to a shipping source file.

| Project | Responsibility |
| --- | --- |
| `HubMi.Api` | Process startup, configuration, middleware, authentication policy, and controller discovery. |
| `HubMi.Features` | User capabilities grouped by feature: controllers, request and response contracts, validation, application services, orchestration, and ports for external dependencies. |
| `HubMi.Domain` | Domain entities, value objects, and invariant-preserving behavior. It has no HTTP, database, or OpenAI dependency. |
| `HubMi.Infrastructure` | Implementations of feature ports: EF Core persistence, admin identity, OpenAI calls, and data import adapters. |

Dependency direction: `Api -> Features + Infrastructure`, `Infrastructure -> Features + Domain`, `Features -> Domain`.

## Placement rule

Put a rule inside a domain object when it must hold regardless of which workflow changes that object. Put workflow coordination and application decisions in a feature service. Put database and external API code in Infrastructure. Keep controllers thin.

Public search and catalogue browsing will not require an account. Admin write operations will require an admin account. The challenge brief does not prescribe an authentication scheme, so that choice remains for implementation.

The ROPS source format is unknown. Import code should convert whatever source is provided into the same internal innovation model. OpenAI credentials must stay in server configuration, never in the frontend or committed files.

Each capability has folders for controllers, contracts, validators, services, and ports. `HubMi.Api` has smaller folders for configuration, dependency registration, middleware, authorization, and health. `HubMi.Infrastructure` has subfolders for persistence, identity, OpenAI, and imports. These are tracked with README or `.gitkeep` files; they contain no feature implementation yet.

`AGENTS.md` is the canonical backend rule set for both Codex and Claude. The repository-root `CLAUDE.md` points to it.

`Program.cs` follows the ScribeRocket-style composition flow: register API services, register feature services, build the app, then apply one pipeline method. Infrastructure registration and startup tasks will be added when there are real services and database migrations to run.

## Accounts and demo sign-in

Accounts live in ASP.NET Core Identity tables in the HubMI database; there is no registration. With `Persistence:SeedIdentity`
(on in Development and in `docker-compose.hubmi.yml`) the roles and the demo accounts from
`HubMi.Infrastructure/Imports/SampleData/demo-accounts.json` are created. All of them are fictional.

| Login | Password | Role |
| --- | --- | --- |
| `admin@rops.demo` | `Admin2026!` | Admin (ROPS staff panel, `POST /api/auth/admin/login`) |
| `jan.kowalski@demo.pl`, `ewa.zielinska@demo.pl` | `Demo2026!` | Resident |
| `fundacja.razem@demo.pl` | `Demo2026!` | Ngo |
| `gmina.zielonadolina@demo.pl` | `Demo2026!` | Jst (can report local challenges) |

Public accounts sign in with `POST /api/auth/login` (behind the simulated Profil Zaufany screen). Paste the returned
`accessToken` into Swagger's "Authorize". The signing key is `Auth:Jwt:SecretKey` (32+ bytes): a dev placeholder is in
`appsettings.Development.json`; Docker needs `HUBMI_JWT_SECRET` in `server/.env`.

## Engagement capabilities

- **Submissions** (`api/submissions`, `api/admin/submissions`): needs, ideas, good practices and local challenges with a status
  timeline, a conversation with staff, linked innovations (matched automatically on create) and response-time statistics.
- **Notifications** (`api/notifications`): in-app notices polled by the web app (new submission → staff; reply or status change → submitter).
- **Knowledge** (`api/admin/innovations|challenges|materials`, public `api/challenges`, `api/materials`): draft → verified → published.
- **Innovation Tester** (`api/innovations/{id}/rating|feedback`, `api/me/feedback`, `api/admin/feedback`, `api/admin/feedback/ratings`). Reviewing an opinion notifies its author.
- **Social Innovation Canvas** (`api/canvas-templates`, `api/canvases`): boards from the ROPS call form; a canvas can be sent as an idea.
  Templates carry `callId` / availability fields as the extension point for a future call-specific application generator.
- **Trends** (`api/admin/trends`, `api/admin/overview`): submissions by category (all categories, including empty ones), week and role, plus unmatched searches.
