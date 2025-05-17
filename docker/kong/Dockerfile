FROM kong/kong:3.8-ubuntu

USER root

RUN apt-get update
RUN apt-get install -y git unzip

RUN git config --global url."https://".insteadOf git:// && \
    git config --global advice.detachedHead false && \
    luarocks install kong-phantom-token 2.0.0

COPY docker/kong/oauth-proxy /usr/local/share/lua/5.1/kong/plugins/oauth-proxy

USER kong
