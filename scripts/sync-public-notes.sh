#!/bin/bash
# Sync published notes from the local iCloud Obsidian vault into the repo.
#
# Content lives in git (src/content/notes/ is committed); this script is the
# authoring step that pulls the latest published notes out of the vault. Run
# it, then commit and push — the stateless Cloudflare build serves the
# committed files (no build-time fetch).
#
# A note is published when its frontmatter has `publish: true`. Where it sits
# in the vault does not matter, so the vault can be reorganised without moving
# blog URLs:
#   <vault>/notes/leetcode/**  -> notes/leetcode/<file>
#   <vault>/notes/quotes/**    -> notes/quotes/<file>
#   anything else              -> notes/general/<file>
# Two published notes with the same filename in one destination is an error.
#
# Paths come from .env (gitignored):
#   VAULT_PATH         source vault root, e.g. .../Documents/jhkn
#   REPO_CONTENT_PATH  dest, e.g. ./src/content
set -euo pipefail

ENV_FILE="./.env"
if [ ! -f "$ENV_FILE" ]; then
    echo "$ENV_FILE not found. Expected VAULT_PATH and REPO_CONTENT_PATH." >&2
    exit 1
fi
# shellcheck disable=SC1090
source "$ENV_FILE"

if [ -z "${VAULT_PATH:-}" ] || [ -z "${REPO_CONTENT_PATH:-}" ]; then
    echo "VAULT_PATH and REPO_CONTENT_PATH must both be set in $ENV_FILE." >&2
    exit 1
fi
if [ ! -d "$VAULT_PATH/notes" ]; then
    echo "$VAULT_PATH/notes not found." >&2
    exit 1
fi

STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT
mkdir -p "$STAGE/general" "$STAGE/leetcode" "$STAGE/quotes"

# True when the file's leading frontmatter block holds `publish: true`.
is_published() {
    awk 'NR == 1 { if ($0 != "---") exit 1; next }
         /^---[[:space:]]*$/ { exit 1 }
         /^publish:[[:space:]]*true[[:space:]]*$/ { found = 1; exit 0 }
         END { exit found ? 0 : 1 }' "$1"
}

count=0
while IFS= read -r -d '' file; do
    is_published "$file" || continue
    rel="${file#"$VAULT_PATH/notes/"}"
    case "$rel" in
        leetcode/*) dest="leetcode" ;;
        quotes/*)   dest="quotes" ;;
        *)          dest="general" ;;
    esac
    target="$STAGE/$dest/$(basename "$file")"
    if [ -e "$target" ]; then
        echo "Two published notes would land at $dest/$(basename "$file"):" >&2
        echo "  $file" >&2
        exit 1
    fi
    cp -p "$file" "$target"
    count=$((count + 1))
done < <(find "$VAULT_PATH/notes" -name '*.md' -type f -print0)

echo "Found $count published notes."

# -a archive, -v verbose, --delete mirror (unpublishing propagates).
rsync -av --delete "$STAGE/" "$REPO_CONTENT_PATH/notes/"
