import {CookieJar} from 'tough-cookie';
import {OAuthError} from './oauthError.js';

/*
 * A utility to make requests to token handler endpoints in a similar way to a browser client
 */
export class OAuthClient {

    private readonly oauthAgentBaseUrl: string;
    private readonly apiBaseUrl: string;
    private readonly cookieJar: CookieJar;

    public constructor(oauthAgentBaseUrl: string, apiBaseUrl: string) {
        this.oauthAgentBaseUrl = oauthAgentBaseUrl;
        this.apiBaseUrl = apiBaseUrl;
        this.cookieJar = new CookieJar();
    }

    /*
     * Start a login and return the authorization request URL
     */
    public async startLogin(): Promise<string> {

        const url = `${this.oauthAgentBaseUrl}/login/start`;
        const response = await this.callOAuthEndpoint('POST', url, null, true);
        return response.authorizationRequestUrl;
    }

    /*
     * End a login with the authorization response URL
     */
    public async endLogin(authorizationResponseUrl: string): Promise<any> {

        const url = `${this.oauthAgentBaseUrl}/login/end`;
        const body = {
            pageUrl: authorizationResponseUrl,
        };
        const response = await this.callOAuthEndpoint('POST', url, body, true);
        return response.claims;
    }

    /*
     * Get the session
     */
    public async session(): Promise<any> {
        const url = `${this.oauthAgentBaseUrl}/session`;
        return await this.callOAuthEndpoint('GET', url, null, true);
    }

    /*
     * Get OAuth user info or return null if the access token is expired
     */
    public async userInfo(): Promise<any> {

        try {

            const url = `${this.apiBaseUrl}/oauthuserinfo`;
            return await this.callOAuthEndpoint('GET', url, null, true);

        } catch (e: any) {

            if (e instanceof OAuthError && e.status === 401) {
                return null;
            }

            throw e;
        }
    }

    /*
     * Refresh tokens
     */
    public async refresh(): Promise<boolean> {

        try {

            const url = `${this.oauthAgentBaseUrl}/refresh`;
            await this.callOAuthEndpoint('POST', url, null, false);
            return true;

        } catch (e: any) {

            if (e instanceof OAuthError && e.status === 401) {
                return false;
            }

            throw e;
        }
    }

    /*
     * Get the end session request URL
     */
    public async logout(): Promise<string> {

        const url = `${this.oauthAgentBaseUrl}/logout`;
        const response = await this.callOAuthEndpoint('POST', url, null, true);
        return response.url;
    }

    /*
     * Make the access token act expired
     */
    public async expireAccessToken(): Promise<void> {

        const url = `${this.oauthAgentBaseUrl}/access/expire`;
        await this.callOAuthEndpoint('POST', url, null, false);
    }

    /*
     * Make the refresh token act expired
     */
    public async expireRefreshToken(): Promise<void> {

        const url = `${this.oauthAgentBaseUrl}/refresh/expire`;
        await this.callOAuthEndpoint('POST', url, null, false);
    }

    /*
     * Use fetch to call an OAuth endpoint
     */
    private async callOAuthEndpoint(
        method: string,
        url: string,
        dataToSend: any,
        readResponse: boolean): Promise<any> {

        // Get any existing cookie header
        const cookieHeader = await this.cookieJar.getCookieString(url);

        // Use the credentials option to send same-site cross-origin cookies to the token handler
        // Also add the token-handler-version custom header that the token handler requires
        const options: RequestInit = {
            method,
            credentials: 'include',
            headers: {
                'accept': 'application/json',
                'token-handler-version': '1',
                'correlation-id': crypto.randomUUID(),
            }
        };

        if (cookieHeader) {
            (options.headers as any)['cookie'] = cookieHeader;
        }

        // Send JSON data if required
        if (dataToSend) {
            (options.headers as any)['content-type'] = 'application/json';
            options.body = JSON.stringify(dataToSend);
        }

        // Try the request and handle connection errors
        let response: Response;
        try {
            response = await fetch(url, options);
        } catch (e: any) {
            throw new Error(`OAuth agent request error: ${e.message}`, e);
        }

        // Report response errors
        if (!response.ok) {

            const error = await response.json() as any;
            const code = error.code || 'general_error';
            const message = error.message || `Problem encountered calling ${url}`;
            throw new OAuthError(response.status, code, message);
        }

        // Set any updated cookie headers
        const setCookie = response.headers.getSetCookie();
        for (const cookie of setCookie) {
            await this.cookieJar.setCookie(cookie, url);
        }

        // Return response data if required
        if (readResponse) {
            return await response.json();
        }
    }
}
