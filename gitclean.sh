#!/bin/bash
# find top 10 files
git rev-list --objects --all | grep -f <(git verify-pack -v .git/objects/pack/*.idx| sort -k 3 -n | cut -f 1 -d " " | tail -10)

git checkout --orphan latest_branch
git add -A
git commit -am "Delete all previous commit"
git branch -D main
git branch -m main

## see https://github.com/18F/C2/issues/439
rm -Rf .git/refs/original
rm -Rf .git/logs/

echo "Cleanup unnecessary files"
git gc --aggressive --prune=now

echo "Prune all unreachable objects"
git prune --expire now
git push -f origin main
