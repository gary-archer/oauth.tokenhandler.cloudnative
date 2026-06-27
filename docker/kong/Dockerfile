FROM kong/kong-gateway:3.14-ubuntu

USER root
RUN apt-get update && apt-get install -y git

RUN luarocks install kong-phantom-token 2.0.0
COPY docker/kong/oauth-proxy /usr/local/share/lua/5.1/kong/plugins/oauth-proxy

USER kong
