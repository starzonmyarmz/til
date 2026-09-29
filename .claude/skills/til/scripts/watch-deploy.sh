#!/usr/bin/env bash
# Watches a GitHub Actions run to completion, then opens the live article on
# success or dumps failed logs on failure. Meant to run in the background
# (run_in_background: true) — publish.sh already reported the live URL.
set -euo pipefail

: "${TIL_DIR:?set TIL_DIR to your til repo path}"
: "${TIL_URL:?set TIL_URL to the live site base URL}"

run_id="${1:?usage: watch-deploy.sh <run_id> <slug>}"
slug="${2:?usage: watch-deploy.sh <run_id> <slug>}"

cd "$TIL_DIR"

if gh run watch "$run_id" --exit-status; then
  echo "DEPLOY_OK"
  open "$TIL_URL/$slug/"
else
  echo "DEPLOY_FAILED" >&2
  gh run view "$run_id" --log-failed | tail -50
  exit 1
fi
