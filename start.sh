#!/bin/bash

cd "$(dirname "${BASH_SOURCE[0]}")"

#
# Generate a cookie encryption key
#
export COOKIE_ENCRYPTION_KEY=$(openssl rand 32 | xxd -p -c 64)

#
# Set other environment variables
#
export PORT=446
export TRUSTED_WEB_ORIGIN='https://www.authsamples-dev.com'
export ISSUER='https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_CuhLeqiE9'
export AUTHORIZE_ENDPOINT='https://login.authsamples.com/oauth2/authorize'
export TOKEN_ENDPOINT='https://login.authsamples.com/oauth2/token'
export LOGOUT_ENDPOINT='https://login.authsamples.com/logout'
export JWKS_ENDPOINT='https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_CuhLeqiE9/.well-known/jwks.json'
export ID_TOKEN_ALGORITHM='RS256'
export CLIENT_ID='7q5pope8rki7okarj2u8l4in7o'
export CLIENT_SECRET='1d18g4v05sesjkv161borl012j009l7ooktnfs10ph9p6nkbbfl9'
export REDIRECT_URI='https://www.authsamples-dev.com/spa/callback'
export POST_LOGOUT_REDIRECT_URI='https://www.authsamples-dev.com/spa/loggedout'
export SCOPE='openid profile https://api.authsamples.com/investments'
export COOKIE_NAME_PREFIX='authsamples'
export SERVER_CERT_P12_PATH='./certs/authsamples-dev.ssl.p12'
export SERVER_CERT_P12_PASSWORD='Password1'
export API_COOKIE_BASE_PATH='/'

#
# Install dependencies
#
npm install
if [ $? -ne 0 ]; then
  echo 'Problem encountered installing dependencies'
  exit 1
fi

#
# Create OpenSSL certificates for development if required
#
./certs/create.sh
if [ $? -ne 0 ]; then
  echo 'Problem encountered creating SSL certificates'
  exit 1
fi

#
# Build the docker image for the Kong API Gateway
#
docker pull kong/kong:3.9-ubuntu
docker build -f docker/kong/Dockerfile -t apigateway:latest .
if [ $? -ne 0 ]; then
  echo 'Problem encountered building the API Gateway docker image'
  exit 1
fi

#
# Replace plugin variables
#
envsubst < kong-template.yml > kong.yml
if [ $? -ne 0 ]; then
  echo 'Problem encountered running envsubst to set environment variables'
  exit 1
fi

#
# Run the API gateway with the OAuth Proxy plugin on port 446
#
docker compose up --force-recreate --detach
if [ $? -ne 0 ]; then
  echo 'Problem encountered running the API Gateway in docker'
  exit 1
fi

#
# Then run the OAuth agent on port 444
#
npx tsx src/server.ts
