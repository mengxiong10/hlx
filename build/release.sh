#!/bin/bash

# abort on errors
set -e

echo "Release ..."
# build
npm run build

scp -r dist/* root@47.99.206.14:/www/wwwroot/front/


# =8&Sp0I2Sk*J
