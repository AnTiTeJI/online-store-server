import jwt, { JwtPayload } from "jsonwebtoken";
import { TokenModel, UserModel } from "../model/user.types";
import { ITokens } from "./$types";
require("dotenv").config();
class TokenService {
  validateRefreshToken(refreshToken: string): boolean | string | JwtPayload {
    try {
      return jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY || "");
    } catch (error) {
      return false;
    }
  }
  validateAccessToken(accessToken: string): boolean | string | JwtPayload {
    try {
      return jwt.verify(accessToken, process.env.ACCESS_SECRET_KEY || "");
    } catch (error) {
      return false;
    }
  }
  async generateAndSaveToken(
    payload: object,
    user: UserModel
  ): Promise<ITokens> {
    const tokens: ITokens = {
      refreshToken: jwt.sign(payload, process.env.REFRESH_SECRET_KEY || "", {
        expiresIn: "14d",
      }),
      accessToken: jwt.sign(payload, process.env.ACCESS_SECRET_KEY || "", {
        expiresIn: "10s",
      }),
    };
    const tokenDb: TokenModel = await user.getToken();
    if (tokenDb) {
      tokenDb.refresh = tokens.refreshToken;
      tokenDb.save();
    } else {
      await user.createToken({ refresh: tokens.refreshToken });
    }
    return tokens;
  }
}

export default new TokenService();
