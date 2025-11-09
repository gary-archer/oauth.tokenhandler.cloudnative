/*
 *  Copyright 2024 Curity AB
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import {OAuthAgentConfiguration} from './lib/index.js'

export const config: OAuthAgentConfiguration = {
    
    // Host settings
    port: process.env.PORT || '',
    endpointsPrefix: '/oauth-agent',
    serverCertPath: process.env.SERVER_CERT_P12_PATH || '',
    serverCertPassword: process.env.SERVER_CERT_P12_PASSWORD || '',

    // Client settings
    clientID: process.env.CLIENT_ID || '',
    clientSecret: process.env.CLIENT_SECRET || '',
    redirectUri: process.env.REDIRECT_URI || '',
    postLogoutRedirectURI: process.env.POST_LOGOUT_REDIRECT_URI || '',
    scope: process.env.SCOPE || '',

    // Cookie related settings
    cookieNamePrefix: process.env.COOKIE_NAME_PREFIX || '',
    encKey: process.env.COOKIE_ENCRYPTION_KEY || '',
    trustedWebOrigin: process.env.TRUSTED_WEB_ORIGIN || '',
    apiCookieBasePath: process.env.API_COOKIE_BASE_PATH || '',

    // Authorization Server settings
    issuer: process.env.ISSUER || '',
    authorizeEndpoint: process.env.AUTHORIZE_ENDPOINT || '',
    logoutEndpoint: process.env.LOGOUT_ENDPOINT || '',
    tokenEndpoint: process.env.TOKEN_ENDPOINT || '',
    userInfoEndpoint: process.env.USERINFO_ENDPOINT || '',
    jwksEndpoint: process.env.JWKS_ENDPOINT || '',
    idTokenAlgorithm: process.env.ID_TOKEN_ALGORITHM || '',
}
