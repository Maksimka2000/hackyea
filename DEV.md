# HubMI – developer guide



## 1. What runs where

| Part | Technology | Local address |
| --- | --- | --- |
| Web app | Next.js 16 (`web/`) | http://localhost:3000 |
| API | ASP.NET Core 8 (`server/HubMi.Api`) | http://localhost:8081 (Docker), or http://localhost:5299 if you run it with `dotnet run` (section 3) |
| Database | PostgreSQL 16 (Docker) | `localhost:5433`, database and user `hubmi` |

The browser only talks to the web app. Next.js forwards `/api/*` to the API address in `API_ORIGIN`, so CORS never needs setting up.

## 2. Quick start (Docker backend + web dev server)

You need Docker, Node 24 and npm.

### 2.1 Backend: API and database

```bash
cd server
cp .env.example .env        # first time only; then edit the values (see below)
docker compose -f docker-compose.hubmi.yml up --build -d
curl http://localhost:8081/health   # → Healthy
```

`server/.env` (git-ignored) must contain:

| Variable | Required | Meaning |
| --- | --- | --- |
| `HUBMI_DB_PASSWORD` | yes | Postgres password |
| `HUBMI_JWT_SECRET` | yes | Signing key for access tokens, 32+ characters: `openssl rand -base64 48` |
| `HUBMI_CLIENT_KEY_SALT` | no | Salt for the hashed client addresses in the match log |
| `HUBMI_SEED_DEMO_ACCOUNTS` | no (default `true`) | Creates the demo accounts and lists them on the sign-in screen |

On start the API applies the migrations, loads the sample library (115 cards), the knowledge store (8 challenges, 3 materials) and the demo accounts. It only adds data that is missing, so restarting is safe.

Without `HUBMI_JWT_SECRET`, compose stops with `required variable HUBMI_JWT_SECRET is missing a value`.

### 2.2 Frontend

```bash
cd web
npm install
cp .env.example .env.local   # first time only
npm run dev                  # http://localhost:3000 (Polish only)
```

`web/.env.local`:

```dotenv
API_ORIGIN=http://localhost:8081      # use http://localhost:5299 for an API started with dotnet run
NEXT_PUBLIC_API_MODE=live             # "mock" serves fixtures for matching, innovation pages and lists
NEXT_PUBLIC_API_BASE_URL=/api
```

Signing in, submissions, notifications, canvases, the innovation tester and the ROPS panel always call the real API; they have no mock mode.

## 3. Running the API without Docker (for backend work)

The database still runs in Docker (`docker compose -f docker-compose.hubmi.yml up -d postgres`).

```bash
cd server
sh tools/fetch-model.sh                      # first time only: downloads the ONNX matching models into HubMi.Api/models
set -a; . ./.env; set +a
cd HubMi.Api
ConnectionStrings__HubMi="Host=localhost;Port=5433;Database=hubmi;Username=hubmi;Password=$HUBMI_DB_PASSWORD" \
ASPNETCORE_ENVIRONMENT=Development \
ASPNETCORE_URLS=http://localhost:5299 \
dotnet run --no-launch-profile
```

The Development settings (`appsettings.Development.json`) turn on Swagger, migrations, all seeding and the demo-account list, and provide a placeholder JWT key.
If the Docker API is also running, both use the same database.

## 4. Accounts

There is no registration: every account is seeded from `server/HubMi.Infrastructure/Imports/SampleData/demo-accounts.json`. The people and organisations are fictional.

| Login | Password | Role | Signs in at | Can do |
| --- | --- | --- | --- | --- |
| `admin@rops.demo` | `Admin2026!` | Admin (ROPS staff) | `/admin/login` | The whole ROPS panel |
| `jan.kowalski@demo.pl` | `Demo2026!` | Resident | `/login` | Send needs, ideas and good practices; follow and answer them; canvases; rate innovations |
| `ewa.zielinska@demo.pl` | `Demo2026!` | Resident | `/login` | Same as above (handy for checking that users cannot see each other's submissions) |
| `fundacja.razem@demo.pl` | `Demo2026!` | NGO (Fundacja Razem dla Seniora) | `/login` | Same as a resident |
| `gmina.zielonadolina@demo.pl` | `Demo2026!` | JST (Urząd Gminy Zielona Dolina) | `/login` | Same as a resident, plus the "Wyzwanie lokalne" (local challenge) submission type |

- **Public site, `/login`:** shows a simulated "Profil Zaufany" screen. Click **Zaloguj się przez Profil Zaufany**, pick an account (it fills in the login) and type `Demo2026!`.
- **Staff panel, `/admin/login`:** the two portals refuse each other's accounts. A resident gets 403 at `/admin/login`, and the admin gets 403 at `/login`.
- **Session length:** the session lasts 8 hours and belongs to one browser tab (sessionStorage). There is no refresh token: when it expires, you sign in again.
- **Testing both sides at once:** use one normal window and one private window, one for a resident and one for the admin.

To add or change accounts, edit `demo-accounts.json` and restart the API. Existing logins are left as they are; delete the user in the database to recreate it.

## 5. Pages

The site is Polish only. Paths carry the `/pl` prefix, e.g. http://localhost:3000/pl/admin (`/admin` redirects there).

### Public (no account)

| Page | Path |
| --- | --- |
| Home, problem search | `/` |
| Search results (matching) | `/search` (opened from the home form) |
| Innovation library | `/library` |
| Innovation card + Innovation Tester (ratings visible to all) | `/library/{id}` |
| Knowledge store (challenges, materials, canvas link) | `/knowledge` |
| Sign in (residents, NGOs, JST) | `/login` |
| Staff sign in | `/admin/login` |

### Signed in as a resident, NGO or JST

| Page | Path |
| --- | --- |
| Send a submission | `/submit?type=need` · `idea` · `goodPractice` · `localChallenge` (JST only) |
| My submissions (list with status) | `/my-submissions` |
| One submission: timeline, conversation with ROPS, linked innovations | `/my-submissions/{id}` |
| My canvases / canvas editor | `/canvas` · `/canvas/{id}` |
| Rate, give feedback, propose an improvement | the "Tester innowacji" box on `/library/{id}` |
| My opinions and the ROPS decision (accepted / rejected, with note) | `/my-feedback` |
| Notifications | the bell in the header (refreshes every 30 s) |

### ROPS panel (signed in as admin)

| Page | Path |
| --- | --- |
| Overview: new and unopened submissions, waiting for a reply, response time, new feedback | `/admin` |
| Submissions inbox (filters, search, "NOWE" marker) | `/admin/inbox` |
| One submission: reply, status, moderation/rejection, linked innovations, "create draft card" | `/admin/submissions/{id}` |
| Knowledge: innovations, challenges, materials (draft → verified → published) | `/admin/knowledge?tab=innovations` · `challenges` · `materials` |
| Edit or create an innovation card | `/admin/knowledge/innovations/{id}` · `/admin/knowledge/innovations/new` |
| Tester results: ratings per card + opinions to accept/reject (the author is notified) | `/admin/feedback` |
| Needs trends (by category, week, submitter; unmatched searches) | `/admin/trends` |

## 6. API tools

| What | Address |
| --- | --- |
| Swagger UI | http://localhost:8081/swagger (`/swagger` on port 5299 for `dotnet run`) |
| OpenAPI JSON | http://localhost:8081/swagger/v1/swagger.json |
| Health check | http://localhost:8081/health |

To call protected endpoints in Swagger:
1. Call `POST /api/auth/login` (public accounts) or `POST /api/auth/admin/login` (admin) with `{ "login": "...", "password": "..." }`.
2. Copy `accessToken` from the response.
3. Click **Authorize** and paste the token.

The same steps from the terminal:

```bash
TOKEN=$(curl -s -X POST http://localhost:8081/api/auth/admin/login -H 'Content-Type: application/json' \
  -d '{"login":"admin@rops.demo","password":"Admin2026!"}' | jq -r .accessToken)
curl -s http://localhost:8081/api/admin/overview -H "Authorization: Bearer $TOKEN"
```

Endpoint groups:
- **Auth:** `api/auth`
- **Submissions:** `api/submissions` (submitters) and `api/admin/submissions` (staff)
- **Notifications:** `api/notifications`
- **Knowledge:**
  - `api/admin/innovations`, `api/admin/challenges` and `api/admin/materials` (staff)
  - `api/challenges` and `api/materials` (public)
- **Innovation Tester:** `api/innovations/{id}/rating-summary|rating|feedback`, `api/me/feedback`, `api/admin/feedback` and `api/admin/feedback/ratings`
- **Canvases:** `api/canvas-templates` and `api/canvases`
- **Admin overview and trends:** `api/admin/overview` and `api/admin/trends`
- **Public catalogue:** `api/match`, `api/innovations` and `api/categories`

## 7. Database

Connect with any Postgres client: host `localhost`, port `5433`, database and user `hubmi`, with the password from `server/.env`.

```bash
docker exec -it hubmi-postgres psql -U hubmi -d hubmi
```

**Start from an empty database.** This deletes all data. The next start re-seeds the library, knowledge and accounts.

```bash
cd server
docker compose -f docker-compose.hubmi.yml down -v
docker compose -f docker-compose.hubmi.yml up --build -d
```

**New EF migration.** Only create one when the model changed, and agree on snapshot edits with the team.

```bash
cd server
dotnet ef migrations add <Name> -p HubMi.Infrastructure -s HubMi.Infrastructure -o Persistence/Migrations
```

## 8. Role check

`sh server/tools/check-roles.sh [base-url]` (needs curl and jq) signs in as a resident, an NGO, a JST and the admin and calls every capability of the role matrix as visitor, resident, JST and admin. It prints the HTTP status per role and fails if anything differs from the matrix. It also verifies that residents cannot read each other's submissions, that closed submissions accept no resident messages, and that the two sign-in portals refuse the other kind of account.

The API denies by default: an endpoint without `[Authorize]` or `[AllowAnonymous]` needs a signed-in user, and the public controllers are marked `[AllowAnonymous]` explicitly.

## 9. Checks before committing

```bash
cd server && dotnet build HubMi.sln
cd web && npm run typecheck && npm run lint
sh server/tools/eval-matching.sh http://localhost:8081   # matching quality report (needs jq)
```

There are no automated test projects (by team decision). Check flows by hand with the accounts above.

## 10. Troubleshooting

| Symptom | Cause / fix |
| --- | --- |
| `required variable HUBMI_JWT_SECRET is missing a value` | Add `HUBMI_JWT_SECRET` (32+ characters) to `server/.env` |
| API exits with `Auth:Jwt:SecretKey must be at least 32 bytes` | The key is too short or missing (for `dotnet run` outside Development, set `Auth__Jwt__SecretKey`) |
| `/login` shows no test accounts | `HUBMI_SEED_DEMO_ACCOUNTS=false`, or the API is unreachable. Check `API_ORIGIN` in `web/.env.local` |
| Signed out after an API restart | The signing key changed, so old tokens are invalid. Sign in again |
| 403 when signing in | Wrong portal: staff use `/admin/login`, everyone else `/login` |
| 429 on login or search | Rate limit (10 logins or 20 searches per minute per address). Wait a minute |
| Web pages show old data or errors after backend changes | Rebuild the API container (`up --build -d`) and restart `npm run dev` |
