import { NextFunction, Request, Response } from "express";
import ApiError from "../error/ApiError";
import roleService from "../service/role.service";
import userService from "../service/user.service";

class RoleController {
    async ResetOfRefleshRoles(req: Request, res: Response, next: NextFunction) {
        try {
            const owner = await userService.findUserByTokenId(req.headers.authorization);

            const user = await userService.findUserById(Number(req.params.id));

            if (await roleService.CheckRightOwner(owner, user, req.body.roles)) {
                if (req.body.roles) {
                    await roleService.SetUserRoles(user, req.body.roles);
                }
                else await roleService.ResetUserRoles(user);
            }
            return res.status(200).json({ msg: "Success" });
        } catch (error) {
            next(error);
        }
    }
    async AddRoles(req: Request, res: Response, next: NextFunction) {
        try {
            const owner = await userService.findUserByTokenId(req.headers.authorization);
            const user = await userService.findUserById(Number(req.params.id));

            if (await roleService.CheckRightOwner(owner, user, req.body.roles))
                await roleService.SetUserRoles(user, req.body.roles);
            else throw ApiError.forbidden();

            return res.status(200).json({ msg: "Success" });
        } catch (error) {
            next(error);
        }
    }
}

export = new RoleController();