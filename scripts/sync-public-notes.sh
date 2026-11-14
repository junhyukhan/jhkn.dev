#!/bin/bash
# Sync published notes from the local iCloud Obsidian vault into the repo.
#
# Content lives in git (src/content/notes/ is committed); this script is the
# authoring step that pulls the latest published notes out of the vault. Run
# it, then commit and push — the stateless Cloudflare build serves the
# committed files (no build-time fetch).
#
# A note is published when its frontmatter has `publish: true`. Every folder
# of the vault is scanned except hidden ones, `archive/` and `templates/`, and
# the folder a note sits in never decides its URL beyond this mapping:
#   a note under any folder named `leetcode`  -> notes/leetcode/<file>
#   a note under any folder named `quotes`    -> notes/quotes/<file>
#   anything else                             -> notes/general/<file>
# Two published notes with the same filename in one destination is an error.
# Only Markdown is copied: a published note that embeds a file gets a warning.
#
# Paths come from .env (gitignored; keys in .env.example):
#   VAULT_PATH         vault root, e.g. .../Documents/jhkn
#   REPO_CONTENT_PATH  dest, e.g. ./src/content
set -euo pipefail

ENV_FILE="./.env"
if [ ! -f "$ENV_FILE" ]; then
    echo "$ENV_FILE not found. Expected VAULT_PATH and REPO_CONTENT_PATH (see .env.example)." >&2
    exit 1
fi
# shellcheck disable=SC1090
source "$ENV_FILE"

if [ -z "${VAULT_PATH:-}" ] || [ -z "${REPO_CONTENT_PATH:-}" ]; then
    echo "VAULT_PATH and REPO_CONTENT_PATH must both be set in $ENV_FILE (see .env.example)." >&2
    exit 1
fi
VAULT_PATH="${VAULT_PATH%/}"
if [ ! -d "$VAULT_PATH/.obsidian" ]; then
    echo "$VAULT_PATH is not an Obsidian vault root (no .obsidian/)." >&2
    exit 1
fi

STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT
chmod 755 "$STAGE"
mkdir -p "$STAGE/general" "$STAGE/leetcode" "$STAGE/quotes"

# True when the file's leading frontmatter block holds `publish: true`.
# Tolerates CRLF, a BOM, any case, quotes and a trailing comment.
is_published() {
    # Byte-wise (LC_ALL=C) with octal escapes and a passed-in quote: BSD awk
    # has no \x in regexes and reads a BOM as one character under UTF-8.
    LC_ALL=C awk -v q="'" '
         BEGIN { pat = "^publish:[ \t]*[\"" q "]?true[\"" q "]?[ \t]*(#.*)?$" }
         { sub(/\r$/, "") }
         NR == 1 { sub(/^\357\273\277/, ""); if ($0 !~ /^---[ \t]*$/) exit 1; next }
         /^---[ \t]*$/ { exit 1 }
         tolower($0) ~ pat { found = 1; exit 0 }
         END { exit found ? 0 : 1 }' "$1"
}

# Listed to a file first so a failing `find` stops the script under `set -e`
# instead of silently leaving notes out of the mirror below.
LIST="$(mktemp)"
trap 'rm -rf "$STAGE" "$LIST"' EXIT
find "$VAULT_PATH" \
    \( -name '.*' -o -path "$VAULT_PATH/archive" -o -path "$VAULT_PATH/templates" \) -prune \
    -o -type f -name '*.md' -print0 > "$LIST"

count=0
while IFS= read -r -d '' file; do
    is_published "$file" || continue
    rel_dir="/$(dirname "${file#"$VAULT_PATH/"}" | tr '[:upper:]' '[:lower:]')/"
    case "$rel_dir" in
        */leetcode/*) dest="leetcode" ;;
        */quotes/*)   dest="quotes" ;;
        *)            dest="general" ;;
    esac
    target="$STAGE/$dest/$(basename "$file")"
    if [ -e "$target" ]; then
        echo "Two published notes would land at $dest/$(basename "$file"):" >&2
        echo "  $file" >&2
        exit 1
    fi
    if grep -q '!\[\[' "$file"; then
        echo "warning: $file embeds a file; only the Markdown is published." >&2
    fi
    cp -p "$file" "$target"
    count=$((count + 1))
done < "$LIST"

# An empty result is far more likely a wrong path or an unsynced vault than a
# wish to unpublish everything, and the mirror below would delete every note.
if [ "$count" -eq 0 ]; then
    echo "Found no published notes under $VAULT_PATH; not touching $REPO_CONTENT_PATH/notes." >&2
    exit 1
fi
echo "Found $count published notes."

# -a archive, -v verbose, --delete mirror (unpublishing propagates).
rsync -av --delete "$STAGE/" "$REPO_CONTENT_PATH/notes/"
