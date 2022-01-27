import { Router } from "express";
import basketController from "../controller/basket.controller";
import roleController from "../controller/role.controller";
import userController from "../controller/user.controller";
import CheckRole from "../middleware/role.middleware";
import { CustomPermissions } from "../roles";
import { UserValidator } from "../validator";

import { userRoutes } from "./$routes";

const userRouter: Router = Router();

userRouter.post(userRoutes.registration, UserValidator, userController.registration);
userRouter.post(userRoutes.login, userController.login);
userRouter.post(userRoutes.logout,
    CheckRole(),
    userController.logout);

userRouter.post(userRoutes.addProductToBasket,
    CheckRole(CustomPermissions.editBasket),
    basketController.addProductToBasket);

userRouter.post(userRoutes.buyProductsFromBasket,
    CheckRole(CustomPermissions.editBasket),
    basketController.buyProductsFromBasket);

userRouter.post(userRoutes.addRoles,
    CheckRole(CustomPermissions.editRole),
    roleController.AddRoles);

userRouter.put(userRoutes.changeUserDetails,
    CheckRole(),
    userController.changeUserDetails);

userRouter.put(userRoutes.changeUserPassword,
    CheckRole(),
    userController.changeUserPassword);

userRouter.put(userRoutes.resetOfRefleshRoles,
    CheckRole(CustomPermissions.editRole),
    roleController.ResetOfRefleshRoles);


userRouter.get(userRoutes.refresh,
    userController.refresh);

userRouter.get(userRoutes.getUserDetails,
    CheckRole(),
    userController.getUserDetails);

userRouter.get(userRoutes.basket,
    CheckRole(CustomPermissions.editBasket),
    basketController.getProductsFromBasket);

userRouter.delete(userRoutes.removeProductFromBasket,
    CheckRole(CustomPermissions.editBasket),
    basketController.removeProductFromBasket);



export = userRouter;