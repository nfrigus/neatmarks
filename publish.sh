#!/usr/bin/env bash

set -e

[ -f .env ] && source .env

echo Get AUTH_CODE:
echo "https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&response_type=code&scope=https://www.googleapis.com/auth/chromewebstore&redirect_uri=urn:ietf:wg:oauth:2.0:oob"
echo
echo Get REFRESH_TOKEN:
echo "curl \"https://accounts.google.com/o/oauth2/token\" \\"
echo "--data-urlencode 'client_id=${CLIENT_ID}' \\"
echo "--data-urlencode 'client_secret=${CLIENT_SECRET}' \\"
echo "--data-urlencode 'code=${AUTH_CODE}' \\"
echo "--data-urlencode 'grant_type=authorization_code' \\"
echo "--data-urlencode 'redirect_uri=urn:ietf:wg:oauth:2.0:oob'"
echo

# todo: Use node based webstore-api
# https://www.npmjs.com/package/chrome-store-api
npx webstore upload --auto-publish \
  --source dist \
  --extension-id "$EXTENSION_ID" \
  --client-id "$CLIENT_ID" \
  --client-secret "$CLIENT_SECRET" \
  --refresh-token "$REFRESH_TOKEN"
