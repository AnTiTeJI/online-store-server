import { Router } from "express";
import basketController from "../controller/basket.controller";
import roleController from "../controller/role.controller";
import userController from "../controller/user.controller";
import CheckRole from "../middleware/role.middleware";
import { CustomPermissions } from "../roles";
import {
  BasketParamValidator,
  RoleBodyValidator,
  UserDetailValidator,
  UserParamValidator,
  UserPasswordValidator,
  UserValidator,
} from "../validator";

import { userRoutes } from "./$routes";

const userRouter: Router = Router();

userRouter.get(userRoutes.refresh, userController.refresh);
userRouter.get(
  userRoutes.getUserDetails,
  CheckRole(),
  userController.getUserDetails
);
userRouter.get(
  userRoutes.basket,
  CheckRole(CustomPermissions.editBasket),
  basketController.getProductsFromBasket
);

userRouter.post(
  userRoutes.registration,
  UserValidator,
  userController.registration
);
userRouter.post(userRoutes.login, userController.login);
userRouter.post(
  userRoutes.addProductToBasket,
  CheckRole(CustomPermissions.editBasket),
  BasketParamValidator,
  basketController.addProductToBasket
);
userRouter.post(
  userRoutes.buyProductsFromBasket,
  CheckRole(CustomPermissions.editBasket),
  basketController.buyProductsFromBasket
);
userRouter.post(
  userRoutes.addRoles,
  CheckRole(CustomPermissions.editRole),
  UserParamValidator,
  RoleBodyValidator,
  roleController.AddRoles
);

userRouter.put(userRoutes.logout, CheckRole(), userController.logout);
userRouter.put(
  userRoutes.changeUserDetails,
  CheckRole(),
  UserDetailValidator,
  userController.changeUserDetails
);
userRouter.put(
  userRoutes.changeUserPassword,
  CheckRole(),
  UserPasswordValidator,
  userController.changeUserPassword
);
userRouter.put(
  userRoutes.resetOfRefleshRoles,
  CheckRole(CustomPermissions.editRole),
  UserParamValidator,
  roleController.ResetOfRefleshRoles
);

userRouter.delete(
  userRoutes.removeProductFromBasket,
  CheckRole(CustomPermissions.editBasket),
  BasketParamValidator,
  basketController.removeProductFromBasket
);

export default userRouter;
