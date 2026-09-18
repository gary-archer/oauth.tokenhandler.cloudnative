# Cloud Native Token Handler

The token handler provides cookie-secured API entry points for an SPA that run on a BFF domain.  

## Architecture

The token handler runs in cloud native deployments.  
It consists of a utility OAuth Agent API and an OAuth Proxy that runs as an API gateway plugin:

![SPA Architecture](./images/spa-architecture.png)

## Configure DNS and SSL

Configure custom development domains by adding this DNS entry to your hosts file:

```bash
127.0.0.1 localhost bfflocal.authsamples-dev.com
```

Install OpenSSL 3+ if required, create a secrets folder, then create development certificates:

```bash
export SECRETS_FOLDER="$HOME/secrets"
mkdir -p "$SECRETS_FOLDER"
./certs/create.sh
```

Finally, configure [Browser SSL Trust](https://github.com/gary-archer/oauth.blog/tree/master/public/posts/developer-ssl-setup.mdx#trust-a-root-certificate-in-browsers) for the SSL root certificate at this location:

```text
./certs/authsamples-dev.ca.crt
```

## Run the Token Handler

Run the OAuth Agent utility API, with an API gateway that runs the OAuth Proxy plugin:

```bash
npm start
```

## Test the Token Handler

Install a UI test framework that can do browser logins:

```bash
npx playwright install-deps
npx playwright install
```

Then run the following command to call endpoints and test the cookie lifecycle:

```bash
npm test
```

Then run `docker compose down` to free resources.

## Deploy the Token Handler

Deploy the token handler to Docker with the following commands:

```bash
./docker/build.sh
./docker/deploy.sh
./docker/teardown.sh
```

## API Performance

The token handler has minimal impact on the performance of API requests:

- The SPA makes OAuth requests to the OAuth Agent via the API gateway.
- The SPA makes API requests via the API gateway, which runs the OAuth Proxy plugin.
