#!/usr/bin/env bash
# Picks TIL scope (uncommitted > branch-vs-main/master > last 3 commits) and
# prints only that diff. Run from the project just worked in, not $TIL_DIR.
set -euo pipefail

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || {
  echo "NOT_A_GIT_REPO" >&2
  exit 1
}

if [ -n "$(git status --porcelain)" ]; then
  echo "## scope: uncommitted changes"
  git status --porcelain
  echo
  git diff HEAD
  exit 0
fi

for base in main master; do
  if git rev-parse --verify "$base" >/dev/null 2>&1 && [ -n "$(git log --oneline "$base"..HEAD)" ]; then
    echo "## scope: branch commits vs $base"
    git log --oneline "$base"..HEAD
    echo
    git diff "$base"...HEAD
    exit 0
  fi
done

echo "## scope: last 3 commits"
git log -3 -p
