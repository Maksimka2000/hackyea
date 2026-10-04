# HubMI backend rules

Scope: `server/HubMi.Api`, `server/HubMi.Features`, `server/HubMi.Domain`, `server/HubMi.Infrastructure`, and `server/HubMi.sln`. The `ShippingService.*` projects and old shipping solution are legacy template material: do not extend or refactor them for HubMI work.

## Project boundaries

- `HubMi.Api` is the composition root. Keep startup, configuration binding, middleware, security policy registration, health endpoints, and controller discovery here. Do not put business workflows here.
- Keep `Program.cs` a short composition sequence. Put service registration in focused extension methods and HTTP middleware/endpoint ordering in `UseApiPipeline`. Add infrastructure registration and startup tasks only when they have real work to perform; do not create empty setup hooks.
- `HubMi.Features` owns application workflows grouped by capability (`Innovations`, `Matching`, `Submissions`, `Notifications`, `Knowledge`, `Testing`, `Canvases`, `Accounts`, `Admin`). Each capability may contain `Controllers`, `Contracts`, `Validators`, `Services`, and `Ports`. Keep code local to the capability until another capability genuinely needs it.
- `HubMi.Domain` owns entities, value objects, and invariant-preserving behavior. Model meaningful state changes as methods on domain objects; avoid public setters that let workflows bypass rules. It must not depend on HTTP, EF Core, identity providers, or OpenAI.
- `HubMi.Infrastructure` implements ports required by Features. Keep EF Core in `Persistence`, admin account storage in `Identity`, OpenAI calls in `OpenAI`, and external/sample data readers in `Imports`.
- Project references must point inward: `Features -> Domain`, `Infrastructure -> Features + Domain`, and `Api -> Features + Infrastructure`. Never make Domain depend on another HubMI project.

## How to add a capability

1. Add its controller and HTTP contracts under the capability in Features. Controllers should validate input, call a feature service, and translate results to HTTP; they should not contain business orchestration, EF queries, or OpenAI calls.
2. Put use-case decisions, transactions, and coordination between ports in a feature service. Put rules that must hold for every state change on the domain entity or value object. This separates application business logic from domain invariants.
3. Define small, specific ports in the owning feature. Split read and write needs when their contracts differ. Avoid a generic repository abstraction for all entities.
4. Implement those ports in Infrastructure and register them through small, topic-specific registration methods. Do not grow one central dependency-registration file for every feature.
5. Create a migration only when the model actually changes. Keep EF configurations and migrations in Infrastructure/Persistence; coordinate migration and model-snapshot edits with the teammate working on the same database.

## Product and integration boundaries

- Public catalogue, matching and knowledge-read endpoints work without a user account.
- Sending a submission, following its status, rating innovations and canvases require a signed-in resident, NGO or JST (`AccountRoles.Submitters`); staff endpoints under `api/admin` require `AccountRoles.Admin`. Accounts are seeded (`Imports/SampleData/demo-accounts.json`); do not add public registration, refresh tokens or a permission cache unless the team changes this decision.
- Authorization is role-only (`[Authorize(Roles = ...)]`); the JWT carries `sub`, `email`, `jti` and `role`. Read the caller with `User.GetCurrentUser()`.
- Notifications are in-app and fetched by polling; there is no e-mail, WebSocket or webhook delivery.
- Feature services commit through `IUnitOfWork` once per workflow; business-rule refusals throw `DomainException`, which the API returns as 400.
- Keep the OpenAI API key on the server, supplied through environment configuration or secret storage. Never commit it or send it to the browser. Features depend on a port, not the OpenAI SDK.
- Keep matching tied to stored innovation records and return source links. Do not present generated text as an invented ROPS innovation.
- The ROPS data format and access method are undecided. Import adapters convert available sample or approved source data to the internal model; core workflows must not depend on a specific ROPS API, scraper, or file format.
- Keep public AI-backed endpoints bounded by input limits and rate limiting when implemented.

## Team and repository hygiene

- Work in `HubMi.sln`. Do not change the legacy shipping template as part of a HubMI feature.
- Keep changes focused on the capability being built. Preserve a teammate's uncommitted work and coordinate shared files such as `Program.cs`, DI registration, project files, and the EF model snapshot.
- Do not commit `bin/`, `obj/`, local `.env` files, credentials, or database volumes.
- Do not create a test project or placeholder C# classes just to fill the skeleton. Add code when a workflow is implemented; the folder placeholders only document intended placement.
