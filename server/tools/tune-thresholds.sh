#!/usr/bin/env bash
# Tests every combination of reranker threshold T and retrieval floor F and prints one comparison table.
#   server/tools/tune-thresholds.sh [-T "0.005 0.003"] [-F "0.30 0.25"] [-f eval-file]      (needs docker, curl and jq)
# Defaults: T in {0.005 0.003 0.002 0.001 0.0005 0.0002} with F = 0.30. The floor F did not stop a single question in the first
# runs (BGE-M3 similarity is high even for unrelated text), so the reranker threshold T is the one that matters.
# Runs that already have a result file are reused (resume); use -r to run everything again.
# Each run recreates the API container (this also empties the answer cache), waits until both models are loaded and the
# vectors are stored, runs eval-matching.sh and counts in the log how many questions stopped at the floor F.
# Full outputs go to tools/tune-results/. Afterwards the API is restarted with the default values.
# Choose the row with the highest "card in top 4" among the rows with "wrong" at 2 or less (a wrong card is worse than none).
set -euo pipefail

cd "$(dirname "$0")/.."
T_VALUES="0.005 0.003 0.002 0.001 0.0005 0.0002"
F_VALUES="0.30"
RERUN=0
FILE="../.doc/data/matching-eval.json"
while getopts "T:F:f:r" opt; do
  case "$opt" in
    T) T_VALUES="$OPTARG" ;;
    F) F_VALUES="$OPTARG" ;;
    f) FILE="$OPTARG" ;;
    r) RERUN=1 ;;
    *) echo "usage: $0 [-T \"0.005 0.003\"] [-F \"0.30 0.25\"] [-f eval-file] [-r]" >&2; exit 2 ;;
  esac
done

OUT="tools/tune-results"
COMPOSE=(docker compose -f docker-compose.hubmi.yml)
mkdir -p "$OUT"
SUMMARY="$OUT/summary.txt"

for tool in docker curl jq; do
  command -v "$tool" >/dev/null || { echo "$tool is required" >&2; exit 1; }
done

diagnose() {
  echo "--- container state:" >&2
  docker inspect -f 'status={{.State.Status}} exit={{.State.ExitCode}} OOMKilled={{.State.OOMKilled}}' hubmi-api >&2 2>&1 || true
  echo "--- last log lines:" >&2
  docker logs --tail 25 hubmi-api >&2 2>&1 || true
}

start_api() { # T F
  HUBMI_RERANK_T="$1" HUBMI_FLOOR_F="$2" HUBMI_MATCH_RATE_LIMIT=10000 "${COMPOSE[@]}" up -d --force-recreate api >/dev/null 2>&1
  for _ in $(seq 1 150); do
    state=$(docker inspect -f '{{.State.Status}}' hubmi-api 2>/dev/null || echo missing)
    if [ "$state" = "exited" ] || [ "$state" = "dead" ] || [ "$state" = "missing" ]; then
      echo "The API container stopped (state: $state). If OOMKilled=true, give Docker Desktop 6 GB or more of memory." >&2
      diagnose
      exit 1
    fi
    # grep -c reads the whole log; grep -q would stop early, and under pipefail the SIGPIPE to docker logs fails the test.
    loaded=$(docker logs hubmi-api 2>&1 | grep -c "Reranker loaded" || true)
    line=$(docker logs hubmi-api 2>&1 | grep "Matching thresholds" | tail -n 1 || true)
    if [ "${loaded:-0}" -gt 0 ] && [ -n "$line" ]; then
      got_f=$(sed -n 's/.*F=\([0-9.eE+-]*\) T=.*/\1/p' <<<"$line")
      got_t=$(sed -n 's/.*T=\([0-9.eE+-]*\) retrieval=.*/\1/p' <<<"$line")
      if ! awk -v a="$got_f" -v b="$2" -v c="$got_t" -v d="$1" 'BEGIN { exit !(a + 0 == b + 0 && c + 0 == d + 0) }'; then
        echo "The API ignores the requested thresholds (asked T=$1 F=$2, running T=$got_t F=$got_f)." >&2
        echo "Rebuild the image first: docker compose -f docker-compose.hubmi.yml up --build -d" >&2
        exit 1
      fi
    fi
    if [ "${loaded:-0}" -gt 0 ] && curl -fsS http://localhost:8081/health >/dev/null 2>&1; then
      # The cards are embedded in the background after a start; without vectors the API answers with keyword search.
      rows=$(docker exec hubmi-postgres psql -U hubmi -d hubmi -tAc "SELECT count(*) FROM innovation_embedding" 2>/dev/null || echo 0)
      [ "${rows:-0}" -gt 0 ] && return 0
    fi
    sleep 2
  done
  echo "The API was not ready within 5 minutes (models or vectors)." >&2
  diagnose
  exit 1
}

number() { # label file: the first number after "label:"
  grep -o "$1: [0-9]*" "$2" | head -n1 | grep -o "[0-9]*$" || echo "?"
}

printf '%-7s %-6s | %-12s %-9s %-9s | %-7s %-12s %-13s\n' T F "card_top4" top1_cat nothing wrong none_ok "floor/reranker" | tee "$SUMMARY"
printf '%s\n' "-------------------------------------------------------------------------------------" | tee -a "$SUMMARY"

for f in $F_VALUES; do
  for t in $T_VALUES; do
    file="$OUT/T${t}_F${f}.txt"
    if [ "$RERUN" = 0 ] && grep -q '^tune: ' "$file" 2>/dev/null; then
      echo ">> reusing the result of T=$t F=$f" >&2
    else
      echo ">> running T=$t F=$f" >&2
      start_api "$t" "$f"
      tools/eval-matching.sh http://localhost:8081 "$FILE" >"$file"
      floor=$(docker logs hubmi-api 2>&1 | grep -c "is below the floor" || true)
      reranked=$(docker logs hubmi-api 2>&1 | grep -c "Match scores (rerank)" || true)
      echo "tune: floor=$floor reranked=$reranked" >>"$file"
    fi
    stops=$(sed -n 's/^tune: floor=\([0-9]*\) reranked=\([0-9]*\)$/\1\/\2/p' "$file")
    answerable=$(number "queries with an answer" "$file")
    printf '%-7s %-6s | %-12s %-9s %-9s | %-7s %-12s %-13s\n' "$t" "$f" \
      "$(number "acceptable card in top 4" "$file")/$answerable" \
      "$(number "top-1 category" "$file")" \
      "$(number "returned nothing" "$file")" \
      "$(number "wrong cards shown" "$file")" \
      "$(number "correctly empty" "$file")" \
      "$stops" | tee -a "$SUMMARY"
  done
done

echo
echo "Columns: card_top4 = an acceptable card is in the top 4 (higher is better); nothing = answerable queries with no result"
echo "(lower is better); wrong = off-topic queries that still got a card (keep at 2 or less); floor/reranker = questions stopped at F /"
echo "questions that reached the reranker. Table saved in $SUMMARY, full outputs in $OUT/."

echo "== restoring the default values" >&2
"${COMPOSE[@]}" up -d --force-recreate api >/dev/null 2>&1
