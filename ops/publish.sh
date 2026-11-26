#!/usr/bin/env bash
# Publish the blog: sync `publish: true` notes from the vault, build, commit, push to main.
# Cloudflare Workers Builds deploys every push to main. Runs nightly from blog-publish.timer, or
# on demand: `systemctl --user start blog-publish`. A run with no note changes makes no commit.
#
# Works in its own clone (PUBLISH_CLONE), never in a checkout someone is editing.
# Needs VAULT_PATH: the Obsidian vault on this machine (set in ~/.config/blog-publish.env).
set -euo pipefail

: "${VAULT_PATH:?VAULT_PATH is not set: the vault is not on this machine yet (see ~/.config/blog-publish.env)}"
CLONE="${PUBLISH_CLONE:-$HOME/.local/share/blog-publish/jhkn.dev}"
REMOTE="${PUBLISH_REMOTE:-https://github.com/junhyukhan/jhkn.dev.git}"

mkdir -p "$(dirname "$CLONE")"
exec 9>"$(dirname "$CLONE")/publish.lock"
flock 9  # an on-demand run waits for a running one instead of colliding

if [ ! -d "$CLONE/.git" ]; then
    git clone --quiet "$REMOTE" "$CLONE"
fi
cd "$CLONE"
git fetch --quiet origin main
git checkout --quiet -B main origin/main  # the job's own clone: always start from origin
git clean -fdq -- src/content/notes

# Install dependencies only when the lockfile changed since the last install.
stamp=".publish-npm-stamp"
want="$(sha256sum package-lock.json | cut -d' ' -f1)"
if [ ! -d node_modules ] || [ "$(cat "$stamp" 2>/dev/null)" != "$want" ]; then
    npm ci --silent --no-audit --no-fund
    echo "$want" > "$stamp"
fi

VAULT_PATH="$VAULT_PATH" REPO_CONTENT_PATH=./src/content ./scripts/sync-public-notes.sh > /dev/null

if [ -z "$(git status --porcelain -- src/content/notes)" ]; then
    echo "No note changes; nothing to publish."
    exit 0
fi
git status --short -- src/content/notes

npm run --silent build > /dev/null  # a note that breaks the build never reaches main

git add -A -- src/content/notes
git commit --quiet -m "content: publish notes ($(date +%F))"
if ! git push --quiet origin HEAD:main; then
    git pull --quiet --rebase origin main
    git push --quiet origin HEAD:main
fi
echo "Published $(git rev-parse --short HEAD)."
