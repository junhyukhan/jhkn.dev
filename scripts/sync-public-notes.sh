#!/bin/bash

# Git Push
git add .
git commit -m "Content Sync: $(date +'%Y-%m-%d %H:%M')"
git push origin main