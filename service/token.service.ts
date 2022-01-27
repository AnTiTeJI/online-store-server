import jwt from "jsonwebtoken";
import { UserModel } from "../model/user.types";
require("dotenv").config();
class TokenService {
    validateRefreshToken(refreshToken: string) {
        try {
            return jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY || "");
        }
        catch (error) { return false; }
    }
    validateAccessToken(accessToken: string) {
        try {
            return jwt.verify(accessToken, process.env.ACCESS_SECRET_KEY || "");
        }
        catch (error) { return false; }

    }
    async generateAndSaveToken(payload: object, user: UserModel) {
        const tokens = {
            refreshToken: jwt.sign(payload, process.env.REFRESH_SECRET_KEY || "", {
                expiresIn: "14d"
            }),
            accessToken: jwt.sign(payload, process.env.ACCESS_SECRET_KEY || "", {
                expiresIn: "10s"
            })
        };
        const tokenDb = await user.getToken();
        if (tokenDb) {
            tokenDb.refresh = tokens.refreshToken;
            tokenDb.save();
        } else {
            await user.createToken({ refresh: tokens.refreshToken });
        }
        return tokens;
    }
}

export = new TokenService()