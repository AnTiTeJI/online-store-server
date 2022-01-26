const jwt = require("jsonwebtoken")
require('dotenv').config()
class TokenService {
    validateRefreshToken(refreshToken) {
        try {
            return jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY)
        }
        catch (error) { return false }
    }
    validateAccessToken(accessToken) {
        try {
            return jwt.verify(accessToken, process.env.ACCESS_SECRET_KEY)
        }
        catch (error) { return false }

    }
    async generateAndSaveToken(payload, user) {
        const tokens = {
            refreshToken: jwt.sign(payload, process.env.REFRESH_SECRET_KEY, {
                expiresIn: '14d'
            }),
            accessToken: jwt.sign(payload, process.env.ACCESS_SECRET_KEY, {
                expiresIn: '10s'
            })
        }
        const tokenDb = await user.getToken()
        if (tokenDb) {
            tokenDb.refresh = tokens.refreshToken
            tokenDb.save()
        } else {
            await user.createToken({ refresh: tokens.refreshToken })
        }
        return tokens
    }
}

module.exports = new TokenService()