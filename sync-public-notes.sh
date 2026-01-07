#!/bin/bash
# 1. Define paths
# In .env

# 2. Sync (The Magic Step)
# -a: archive (recursive)
# -v: verbose
# --delete: CRITICAL. If a file is deleted in iCloud, delete it in Git repo.
rsync -av --delete "$ICLOUD_PATH" "$REPO_CONTENT_PATH"

# 3. Git Push
git add .
git commit -m "Content Sync: $(date +'%Y-%m-%d %H:%M')"
# git push origin main