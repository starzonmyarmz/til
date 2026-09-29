#!/usr/bin/env bash
# Checks slug collision and creates the article dir. Prints the dir path on success.
set -euo pipefail

: "${TIL_DIR:?set TIL_DIR to your til repo path}"
slug="${1:?usage: check-slug.sh <slug>}"

test -d "$TIL_DIR/src/content/articles" || {
  echo "TIL_DIR ($TIL_DIR) does not look like the til repo" >&2
  exit 1
}

dir="$TIL_DIR/src/content/articles/$slug"

if [ -d "$dir" ]; then
  echo "EXISTS: $dir" >&2
  exit 2
fi

mkdir -p "$dir"
echo "$dir"
