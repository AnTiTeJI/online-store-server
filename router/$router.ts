import { Router } from "express";
import categoryRouter from "./category.router";
import productRouter from "./product.router";
import userRouter from "./user.router";

const router: Router = Router();

router.use("/", userRouter);
router.use("/product", productRouter);
router.use("/category", categoryRouter);
export default router;
