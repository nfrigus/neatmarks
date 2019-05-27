#!/usr/bin/env bash

set -e

[ -f .env ] && source .env

# todo: Use node based webstore-api
# https://www.npmjs.com/package/chrome-store-api
npx webstore upload --auto-publish \
  --source dist \
  --extension-id "$EXTENSION_ID" \
  --client-id "$CLIENT_ID" \
  --client-secret "$CLIENT_SECRET" \
  --refresh-token "$REFRESH_TOKEN"
