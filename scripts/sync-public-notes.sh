#!/bin/bash
# Sync public notes from the local iCloud Obsidian vault into the repo.
#
# Content lives in git (src/content/notes/ is committed); this script is the
# authoring step that pulls the latest public notes out of the vault. Run it,
# then commit and push — the stateless Cloudflare build serves the committed
# files (no build-time fetch).
#
# Paths come from .env (gitignored):
#   ICLOUD_PATH        source, e.g. .../Documents/jhkn/01_public/
#   REPO_CONTENT_PATH  dest, e.g. ./src/content
set -euo pipefail

ENV_FILE="./.env"
if [ ! -f "$ENV_FILE" ]; then
    echo "$ENV_FILE not found. Expected ICLOUD_PATH and REPO_CONTENT_PATH." >&2
    exit 1
fi
# shellcheck disable=SC1090
source "$ENV_FILE"

if [ -z "${ICLOUD_PATH:-}" ] || [ -z "${REPO_CONTENT_PATH:-}" ]; then
    echo "ICLOUD_PATH and REPO_CONTENT_PATH must both be set in $ENV_FILE." >&2
    exit 1
fi

# -a archive, -v verbose, --delete mirror (removals in the vault propagate),
# excluding the Astro collection config so the sync can't clobber it.
rsync -av --delete --exclude="config.ts" "$ICLOUD_PATH" "$REPO_CONTENT_PATH"
