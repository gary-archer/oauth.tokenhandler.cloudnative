#!/bin/bash

##############################################################
# A script to test Docker deployment on a development computer
##############################################################

cd "$(dirname "${BASH_SOURCE[0]}")"
cd ..

#
# Install OAuth agent dependencies
#
npm install
if [ $? -ne 0 ]; then
  echo "Problem encountered installing dependencies"
  exit 1
fi

#
# Build OAuth agent JavaScript code to the dist folder
#
npm run buildRelease
if [ $? -ne 0 ]; then
  echo 'Problem encountered building Node.js code'
  exit 1
fi

#
# Build the docker image for the Kong API Gateway
#
docker build -f docker/kong/Dockerfile -t apigateway:latest .
if [ $? -ne 0 ]; then
  echo 'Problem encountered building the API Gateway docker image'
  exit 1
fi

#
# Build the docker image for the OAuth Agent
#
docker build -f docker/oauthagent/Dockerfile -t oauthagent:latest .
if [ $? -ne 0 ]; then
  echo 'Problem encountered building the OAuth Agent docker image'
  exit 1
fi
