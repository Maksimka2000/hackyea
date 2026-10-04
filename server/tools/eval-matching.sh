#!/usr/bin/env bash
# Runs the Polish evaluation queries against a running API and prints hit rates.
#   server/tools/eval-matching.sh [base-url] [eval-file]      (needs curl and jq)
# Queries tagged "none" must return no card (a wrong card is worse than none); the others are checked for the expected category
# and card. Raise RateLimiting__Match__PermitLimit on the API before running. To tune the thresholds, restart the API with
# Matching__RerankThreshold / Matching__RetrievalFloor changed and compare the false-positive and miss counts below.
set -euo pipefail

BASE="${1:-http://localhost:8081}"
FILE="${2:-$(dirname "$0")/../../.doc/data/matching-eval.json}"
total=0 top1=0 top3=0 card3=0 empty=0 none=0 none_ok=0 detected=0 none_cat=0

while IFS='|' read -r query category cards tag; do
  response=$(curl -fsS -X POST "$BASE/api/match" -H 'Content-Type: application/json' \
    -d "$(jq -cn --arg t "$query" '{text:$t}')")
  count=$(jq -r '.results | length' <<<"$response")
  conf=$(jq -r '.confidence' <<<"$response")

  if [[ "$tag" == "none" ]]; then
    none=$((none+1))
    [[ "$(jq -r '.category // "-"' <<<"$response")" != "-" ]] && none_cat=$((none_cat+1))
    if [[ "$count" == "0" ]]; then none_ok=$((none_ok+1)); mark="OK "; got="-"; else mark="!! "; got=$(jq -r '.results[0].title[:40]' <<<"$response"); fi
    printf '%s %-13s %-62s -> %-12s conf=%s\n' "$mark" "$tag" "${query:0:62}" "${got:0:40}" "$conf"
    continue
  fi

  # category of each returned card is in .results[].category.id; the card slug is the text after the last comma of sourceUrl
  got1=$(jq -r '.results[0].category.id // "-"' <<<"$response")
  got3=$(jq -r '[.results[:3][].category.id] | join(" ")' <<<"$response")
  slugs=$(jq -r '[.results[:3][].sourceUrl | split(",") | last] | join(" ")' <<<"$response")
  total=$((total+1))
  [[ "$count" == "0" ]] && empty=$((empty+1))
  [[ "$(jq -r '.category.id // "-"' <<<"$response")" == "$category" ]] && detected=$((detected+1))
  [[ "$got1" == "$category" ]] && top1=$((top1+1)) && mark="OK " || mark="-- "
  [[ " $got3 " == *" $category "* ]] && top3=$((top3+1))
  for slug in $slugs; do [[ ",$cards," == *",$slug,"* ]] && { card3=$((card3+1)); break; }; done
  printf '%s %-13s %-62s -> %-12s conf=%s\n' "$mark" "$tag" "${query:0:62}" "${got1:0:12}" "$conf"
done < <(jq -r '.queries[] | [.query, (.category // ""), (.acceptableCards | join(",")), .tag] | join("|")' "$FILE")

echo
echo "queries with an answer: $total   top-1 category: $top1   top-3 category: $top3   acceptable card in top 3: $card3   returned nothing: $empty"
echo "detected category (response-level) correct: $detected of $total"
echo "no-match queries: $none   correctly empty: $none_ok   wrong cards shown: $((none-none_ok))   with a category although empty or wrong: $none_cat"
