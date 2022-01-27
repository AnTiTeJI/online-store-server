import { Router } from "express";
import categoryController from "../controller/category.controller";
import templateController from "../controller/template.controller";
import CheckRole from "../middleware/role.middleware";
import { CustomPermissions } from "../roles";

import { categoryRoutes } from "./$routes";

const categoryRouter: Router = Router();


categoryRouter.post(categoryRoutes.createCategories,
    CheckRole(CustomPermissions.createCategory),
    categoryController.createCategories);

categoryRouter.post(categoryRoutes.createChildCategories,
    CheckRole(CustomPermissions.createCategory),
    categoryController.createChildCategories);


categoryRouter.get(categoryRoutes.getCategories,
    categoryController.getCategories);

categoryRouter.get(categoryRoutes.getChildCategories,
    categoryController.getChildCategories);

categoryRouter.get(categoryRoutes.getTemplate,
    CheckRole(CustomPermissions.getTemplate),
    templateController.getProductTemplate);

categoryRouter.post(categoryRoutes.createTemplate,
    CheckRole(CustomPermissions.createTemplate),
    templateController.createProductTemplate);

export = categoryRouter;