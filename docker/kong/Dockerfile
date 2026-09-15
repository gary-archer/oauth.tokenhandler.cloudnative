FROM kong/kong:3.9-ubuntu

USER root
COPY certs/authsamples-dev.ca.crt /usr/local/share/ca-certificates/authsamples-dev.ca.crt

RUN apt-get update && apt-get install -y git unzip wget ca-certificates && update-ca-certificates

RUN luarocks install kong-phantom-token 2.0.0
COPY docker/kong/oauth-proxy /usr/local/share/lua/5.1/kong/plugins/oauth-proxy

USER kong
