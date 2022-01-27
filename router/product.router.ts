import { Router } from "express";
import productController from "../controller/product.controller";
import CheckRole from "../middleware/role.middleware";
import { CustomPermissions } from "../roles";
import { ProductValidator } from "../validator";
import { productRoutes } from "./$routes";

const productRouter: Router = Router();


productRouter.get(productRoutes.getProducts,
    productController.getProducts);

productRouter.get(productRoutes.getProduct,
    productController.getProduct);


productRouter.post(productRoutes.createProduct,
    ProductValidator,
    CheckRole(CustomPermissions.createProduct),
    productController.createProduct);

productRouter.get(productRoutes.getProductImages,
    productController.getProductImages);

productRouter.post(productRoutes.addProductImages,
    CheckRole([CustomPermissions.createProduct,
    CustomPermissions.deleteProduct]),
    productController.addProductImages);





export = productRouter;