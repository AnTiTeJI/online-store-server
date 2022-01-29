import { NextFunction, Request, Response } from "express";
import ApiError from "../error/ApiError";
import { UserModel } from "../model/user.types";
import roleService from "../service/role.service";
import userService from "../service/user.service";

class RoleController {
  async ResetOfRefleshRoles(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const owner: UserModel = await userService.findUserByTokenId(
        req.headers.authorization
      );
      const user: UserModel = await userService.findUserById(
        Number(req.params.id)
      );
      const roles: string[] = req.body.roles;

      if (await roleService.CheckRightOwner(owner, user, roles)) {
        if (req.body.roles) {
          await roleService.SetUserRoles(user, roles);
        } else await roleService.ResetUserRoles(user);
      }
      res.status(200).json({ msg: "Success" });
    } catch (error) {
      next(error);
    }
  }
  async AddRoles(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const owner: UserModel = await userService.findUserByTokenId(
        req.headers.authorization
      );
      const user: UserModel = await userService.findUserById(
        Number(req.params.id)
      );

      const roles: string[] = req.body.roles;

      if (await roleService.CheckRightOwner(owner, user, roles))
        await roleService.SetUserRoles(user, roles);
      else throw ApiError.forbidden();

      res.status(200).json({ msg: "Success" });
    } catch (error) {
      next(error);
    }
  }
}

export default new RoleController();
