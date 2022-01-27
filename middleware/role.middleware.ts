import { NextFunction, Response } from "express";
import { Request } from "express-validator/src/base";
import { decode, JwtPayload } from "jsonwebtoken";
import ApiError from "../error/ApiError";
import { RolePermissions } from "../roles";
import tokenService from "../service/token.service";
import userService from "../service/user.service";



function CheckRole(permissions: any = null) {
    return async function RoleMiddleware(req: Request, res: Response, next: NextFunction) {
        try {
            const auth = req.headers?.authorization;
            if (!auth)
                throw ApiError.forbidden();
            const token = auth.split(" ")[1];
            if (!tokenService.validateAccessToken(token))
                throw ApiError.unathorized();

            if (permissions) {
                const roles: string[] = await userService.findUserById((decode(token) as JwtPayload).id)
                    .then(user => JSON.parse(user.roles))
                    .catch(() => { throw ApiError.forbidden(); });

                let userPermission: string[] = [];
                for (let role in roles)
                    userPermission = userPermission.concat(RolePermissions[role].permissions);
                userPermission = Array.from(new Set(userPermission));

                if (userPermission.includes("all"))
                    return next();
                for (let pr of permissions)
                    if (!userPermission.includes(pr))
                        throw ApiError.forbidden("Not enough rights");
            }
            next();
        } catch (error) {
            next(error);
        }
    };
}
export = CheckRole;
