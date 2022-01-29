import { Router } from "express";
import categoryController from "../controller/category.controller";
import templateController from "../controller/template.controller";
import CheckRole from "../middleware/role.middleware";
import { CustomPermissions } from "../roles";
import {
  CategoryBodyValidator,
  CategoryParamValidator,
  QueryFindCountAllValidator,
} from "../validator";
import { categoryRoutes } from "./$routes";

const categoryRouter: Router = Router();

categoryRouter.get(
  categoryRoutes.getCategories,
  QueryFindCountAllValidator,
  categoryController.getCategories
);
categoryRouter.get(
  categoryRoutes.getChildCategories,
  CategoryParamValidator,
  QueryFindCountAllValidator,
  categoryController.getChildCategories
);
categoryRouter.get(
  categoryRoutes.getTemplate,
  CheckRole(CustomPermissions.getTemplate),
  templateController.getProductTemplate
);

categoryRouter.post(
  categoryRoutes.createCategories,
  CheckRole(CustomPermissions.createCategory),
  CategoryBodyValidator,
  categoryController.createCategories
);
categoryRouter.post(
  categoryRoutes.createChildCategories,
  CheckRole(CustomPermissions.createCategory),
  CategoryParamValidator,
  CategoryBodyValidator,
  categoryController.createChildCategories
);
categoryRouter.post(
  categoryRoutes.createTemplate,
  CheckRole(CustomPermissions.createTemplate),
  templateController.createProductTemplate
);

export default categoryRouter;
