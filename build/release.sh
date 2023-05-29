#!/bin/bash

# abort on errors
set -e

echo "Release ..."
# build
npm run build

scp -r dist/* root@47.99.206.14:/data/web/new


# 1QAZ@wsx3EDC
