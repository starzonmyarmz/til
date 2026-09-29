#!/usr/bin/env bash
# Builds, commits, pushes the article, and finds the deploy run for this SHA.
# Prints LIVE_URL and RUN_ID, then exits — does not wait for deploy to finish.
# Follow up with watch-deploy.sh in the background.
set -euo pipefail

: "${TIL_DIR:?set TIL_DIR to your til repo path}"
: "${TIL_URL:?set TIL_URL to the live site base URL}"

slug="${1:?usage: publish.sh <slug> <title>}"
title="${2:?usage: publish.sh <slug> <title>}"
workflow="${TIL_DEPLOY_WORKFLOW:-Deploy to GitHub Pages}"
branch="${TIL_BRANCH:-main}"

cd "$TIL_DIR"

echo "== build =="
npm run build

echo "== commit + push =="
git add "src/content/articles/$slug"
git commit -m "Add TIL: $title"
git push origin "$branch"

sha=$(git rev-parse HEAD)
echo "LIVE_URL=$TIL_URL/$slug/"

echo "== find deploy run =="
run_id=""
for _ in 1 2 3 4 5 6 7 8 9 10; do
  run_id=$(gh run list --workflow "$workflow" -c "$sha" --limit 1 --json databaseId -q '.[0].databaseId' || true)
  [ -n "$run_id" ] && break
  sleep 2
done

if [ -z "$run_id" ]; then
  echo "RUN_ID_NOT_FOUND" >&2
  exit 2
fi

echo "RUN_ID=$run_id"
