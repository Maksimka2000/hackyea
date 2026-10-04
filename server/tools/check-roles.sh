#!/usr/bin/env bash
# Checks the role matrix against a running API: every capability is called as visitor (no token), resident, NGO, JST and admin,
# and the HTTP status is compared with what the matrix allows. Needs curl and jq and the demo accounts (Persistence:SeedIdentity).
#   server/tools/check-roles.sh [base-url]        default http://localhost:8081
# Allowed means a 2xx or 400/404/409 (the handler ran, e.g. unknown id or invalid body); denied means 401 (no token) or 403 (wrong role).
# Writes use a random id or an empty body, so the checks never change data - except the one resident flow that is created and read back.
set -uo pipefail

BASE="${1:-http://localhost:8081}"
JSON='Content-Type: application/json'
ID0="00000000-0000-0000-0000-000000000001"
fails=0

login() { # path login password -> token
  curl -fsS -X POST "$BASE/api/auth/$1" -H "$JSON" -d "$(jq -cn --arg l "$2" --arg p "$3" '{login:$l,password:$p}')" | jq -r .accessToken
}

RES=$(login login jan.kowalski@demo.pl 'Demo2026!') || { echo "cannot sign in as resident - are the demo accounts seeded?"; exit 2; }
NGO=$(login login fundacja.razem@demo.pl 'Demo2026!')
JST=$(login login gmina.zielonadolina@demo.pl 'Demo2026!')
ADM=$(login admin/login admin@rops.demo 'Admin2026!')
CARD=$(curl -fsS "$BASE/api/innovations/featured" | jq -r '.[0].id')

status() { # method path token body
  local args=(-s -o /dev/null -w '%{http_code}' -X "$1" "$BASE$2")
  [[ -n "$3" ]] && args+=(-H "Authorization: Bearer $3")
  [[ -n "${4:-}" ]] && args+=(-H "$JSON" -d "$4")
  curl "${args[@]}"
}

allowed() { [[ "$1" =~ ^(2..|400|404|409)$ ]]; }

printf '%-62s %-8s %-8s %-8s %-8s\n' "capability" "visitor" "resident" "jst" "admin"
# check "label" METHOD path body  expected(visitor,resident,jst,admin as Y/N)
check() {
  local label="$1" method="$2" path="$3" body="$4" expect="$5" out="" i=0
  local tokens=("" "$RES" "$JST" "$ADM")
  for token in "${tokens[@]}"; do
    local code want mark
    code=$(status "$method" "$path" "$token" "$body")
    want="${expect:$i:1}"
    if { [[ "$want" == Y ]] && allowed "$code"; } || { [[ "$want" == N ]] && [[ "$code" =~ ^(401|403)$ ]]; }; then mark="ok"; else mark="FAIL"; fails=$((fails+1)); fi
    out+=$(printf '%-8s ' "$code:$mark")
    i=$((i+1))
  done
  printf '%-62s %s\n' "$label" "$out"
}

# expect letters in order: visitor resident jst admin
check "search / matching"                         POST   /api/match                          '{"text":"samotny senior"}'        YYYY
check "library list, details, categories"         GET    "/api/innovations/$CARD"            ""                                 YYYY
check "read challenges"                           GET    /api/challenges                     ""                                 YYYY
check "read materials"                            GET    /api/materials                      ""                                 YYYY
check "see rating summary"                        GET    "/api/innovations/$CARD/rating-summary" ""                             YYYY
check "browse canvas templates"                   GET    /api/canvas-templates               ""                                 YYYY
check "submit (empty body is refused after auth)" POST   /api/submissions                    '{}'                               NYYN
check "view own submissions"                      GET    /api/submissions/mine               ""                                 NYYN
check "view one submission (not found)"           GET    "/api/submissions/$ID0"             ""                                 NYYN
check "write to ROPS on a submission"             POST   "/api/submissions/$ID0/messages"    '{"body":"x"}'                     NYYN
check "list canvases"                             GET    /api/canvases                       ""                                 NYYN
check "create canvas (bad template)"              POST   /api/canvases                       '{"templateKey":"none"}'           NYYN
check "edit canvas"                               PUT    "/api/canvases/$ID0"                '{}'                               NYYN
check "delete canvas"                             DELETE "/api/canvases/$ID0"                ""                                 NYYN
check "submit canvas"                             POST   "/api/canvases/$ID0/submit"         ""                                 NYYN
check "rate an innovation (bad stars)"            PUT    "/api/innovations/$CARD/rating"     '{"stars":0}'                      NYYN
check "send feedback (too short)"                 POST   "/api/innovations/$CARD/feedback"   '{"kind":"feedback","body":"x"}'   NYYN
check "see own feedback"                          GET    /api/me/feedback                    ""                                 NYYN
check "read notifications"                        GET    /api/notifications                  ""                                 NYYY
check "mark notification read"                    POST   "/api/notifications/$ID0/read"      ""                                 NYYY
check "edit innovations (create, empty body)"     POST   /api/admin/innovations              '{}'                               NNNY
check "verify / publish / unpublish an innovation" POST  "/api/admin/innovations/$ID0/verify" ""                                 NNNY
check "delete library content"                    DELETE "/api/admin/innovations/$ID0"       ""                                 NNNY
check "edit challenges"                           POST   /api/admin/challenges               '{}'                               NNNY
check "edit materials"                            POST   /api/admin/materials                '{}'                               NNNY
check "view the inbox"                            GET    /api/admin/submissions              ""                                 NNNY
check "reply to a submission"                     POST   "/api/admin/submissions/$ID0/messages" '{"body":"x"}'                  NNNY
check "set status of a submission"                PUT    "/api/admin/submissions/$ID0/status" '{"status":"closed"}'             NNNY
check "moderate a submission"                     PUT    "/api/admin/submissions/$ID0/moderation" '{}'                          NNNY
check "link innovations to a submission"          PUT    "/api/admin/submissions/$ID0/links" '{}'                               NNNY
check "publish a submission as an innovation"     POST   "/api/admin/submissions/$ID0/publish-as-innovation" ""                 NNNY
check "view trends"                               GET    /api/admin/trends                   ""                                 NNNY
check "view overview and response times"          GET    /api/admin/overview                 ""                                 NNNY
check "response times"                            GET    /api/admin/submissions/response-time ""                                NNNY
check "read innovation feedback"                  GET    /api/admin/feedback                 ""                                 NNNY
check "ratings overview"                          GET    /api/admin/feedback/ratings         ""                                 NNNY
check "respond to innovation feedback"            PUT    "/api/admin/feedback/$ID0"          '{"status":"accepted"}'            NNNY

# Not covered by the table above: the NGO account behaves like the resident (same role group); one spot check.
ngo_code=$(status GET /api/submissions/mine "$NGO")
[[ "$ngo_code" == 200 ]] || { echo "NGO cannot read own submissions ($ngo_code)"; fails=$((fails+1)); }

# Cross-user isolation: a resident must not read another resident's submission or canvas.
SUB=$(curl -fsS -X POST "$BASE/api/submissions" -H "Authorization: Bearer $RES" -H "$JSON" \
  -d '{"type":"need","description":"Kontrola uprawnień: zgłoszenie testowe, które może zostać usunięte."}' | jq -r .id)
other=$(curl -fsS -X POST "$BASE/api/auth/login" -H "$JSON" -d '{"login":"ewa.zielinska@demo.pl","password":"Demo2026!"}' | jq -r .accessToken)
code=$(status GET "/api/submissions/$SUB" "$other")
[[ "$code" == 404 ]] && echo "other resident cannot read it: 404 ok" || { echo "FAIL other resident got $code"; fails=$((fails+1)); }
code=$(status GET "/api/submissions/$SUB" "$RES")
[[ "$code" == 200 ]] && echo "owner can read it: 200 ok" || { echo "FAIL owner got $code"; fails=$((fails+1)); }
code=$(status GET "/api/admin/submissions/$SUB" "$ADM")
[[ "$code" == 200 ]] && echo "admin can open it: 200 ok" || { echo "FAIL admin got $code"; fails=$((fails+1)); }

# Closed submissions accept staff messages only.
curl -fsS -X PUT "$BASE/api/admin/submissions/$SUB/status" -H "Authorization: Bearer $ADM" -H "$JSON" -d '{"status":"closed"}' >/dev/null
code=$(status POST "/api/submissions/$SUB/messages" "$RES" '{"body":"jeszcze jedno"}')
[[ "$code" == 400 ]] && echo "resident cannot write to a closed submission: 400 ok" || { echo "FAIL closed submission accepted a message ($code)"; fails=$((fails+1)); }

# A resident cannot sign in on the staff portal and vice versa.
code=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BASE/api/auth/admin/login" -H "$JSON" -d '{"login":"jan.kowalski@demo.pl","password":"Demo2026!"}')
[[ "$code" == 403 ]] && echo "resident on staff portal: 403 ok" || { echo "FAIL resident on staff portal got $code"; fails=$((fails+1)); }
code=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BASE/api/auth/login" -H "$JSON" -d '{"login":"admin@rops.demo","password":"Admin2026!"}')
[[ "$code" == 403 ]] && echo "admin on public portal: 403 ok" || { echo "FAIL admin on public portal got $code"; fails=$((fails+1)); }

echo
if [[ "$fails" -eq 0 ]]; then echo "all role checks passed"; else echo "$fails role check(s) FAILED"; exit 1; fi
