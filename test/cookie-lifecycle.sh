#!/bin/bash

######################################################################
# A script to initiate testing of OAuth Agent and OAuth Proxy requests
######################################################################

cd "$(dirname "${BASH_SOURCE[0]}")"

#
# Trust the development root CA
#
export NODE_EXTRA_CA_CERTS='../certs/authsamples-dev.ca.crt'

#
# Run the tests to trigger remote requests
#
tsx src/index.ts
