import express from 'express'
import {decryptCookie, getATCookieName, getCookieSerializeOptions, getEncryptedCookie} from '../lib/index.js'
import {config} from '../config.js'
import {InvalidCookieException} from '../lib/exceptions/index.js'
import validateExpressRequest from '../validateExpressRequest.js'

class AccessTokenController {
    public router = express.Router()

    constructor() {
        this.router.post('/expire', this.ExpireAccessToken)
    }

    // To simulate expiry for test purposes
    ExpireAccessToken = async (req: express.Request, res: express.Response, next: express.NextFunction) => {

        validateExpressRequest(req);

        const atCookieName = getATCookieName(config.cookieNamePrefix)
        if (req.cookies && req.cookies[atCookieName]) {

            const accessToken = decryptCookie(config.encKey, req.cookies[atCookieName])
            const expiredAccessToken = `${accessToken}x`
            
            const atCookieOptions = getCookieSerializeOptions(config, 'AT')
            const cookies = [
                getEncryptedCookie(atCookieOptions, expiredAccessToken, getATCookieName(config.cookieNamePrefix), config.encKey)
            ]
            
            res.setHeader('Set-Cookie', cookies)
            res.status(204).send()

        } else {
            const error = new InvalidCookieException()
            error.logInfo = 'Valid cookies were not supplied in a call to expireToken'
            throw error
        }
    }
}

export default AccessTokenController
