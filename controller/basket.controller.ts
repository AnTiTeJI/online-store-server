import { IProductFullBody } from "./../service/$types";
import { NextFunction, Request, Response } from "express";
import { ProductModel } from "../model/product.types";
import { BasketModel, UserModel } from "../model/user.types";

import basketService from "../service/basket.service";
import productService from "../service/product.service";
import userService from "../service/user.service";

class BasketController {
    async addProductToBasket(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user: UserModel = await userService.findUserByTokenId(req.headers.authorization);
            const product: ProductModel = await productService.findProductById(Number(req.params.id));
            await basketService.addProductToBasket(await user.getBasket(), product);
            res.status(201).json("Success");
        } catch (error) {
            next(error);
        }
    }
    async removeProductFromBasket(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user: UserModel = await userService.findUserByTokenId(req.headers.authorization);
            const product: ProductModel = await productService.findProductById(Number(req.params.id));
            await basketService.removeProductFromBasket(await user.getBasket(), product);
            res.status(200).json("Success");
        } catch (error) {
            next(error);
        }
    }
    async getProductsFromBasket(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user: UserModel = await userService.findUserByTokenId(req.headers.authorization);
            const products: IProductFullBody[] = await basketService.getProductFromBasket(await user.getBasket());
            res.status(200).json({ products });
        } catch (error) {
            next(error);
        }
    }
    async buyProductsFromBasket(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user: UserModel = await userService.findUserByTokenId(req.headers.authorization);
            const basket: BasketModel = await user.getBasket();
            await basketService.RemoveProductsFromStock(basket);
            res.status(200).json("Success");
        } catch (error) {
            next(error);
        }
    }
}

export default new BasketController();