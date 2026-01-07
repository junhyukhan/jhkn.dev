#!/bin/bash
# 1. Define paths
# Define the path to your .env file
ENV_FILE="./.env"

# Check if the file exists
if [ -f "$ENV_FILE" ]; then
    # Source the .env file to load variables into the current shell session
    source "$ENV_FILE"
    echo "Environment variables loaded from $ENV_FILE"
else
    echo "$ENV_FILE not found. Exiting."
    exit 1
fi
# 2. Sync (The Magic Step)
# -a: archive (recursive)
# -v: verbose
# --delete: CRITICAL. If a file is deleted in iCloud, delete it in Git repo.
rsync -av --delete --exclude="config.ts" "$ICLOUD_PATH" "$REPO_CONTENT_PATH"