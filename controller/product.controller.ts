import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import ProductDto from "../dto/product.dto";
import imageService from "../service/image.service";
import productService from "../service/product.service";
import templateService from "../service/template.service";
class ProductController {
    async createProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const { categories, characteristics } = req.body;
            const errors = await templateService.CheckTemplates(categories, characteristics);
            if (errors)
                return res.status(404).json({ errors });

            const product = await productService.createProduct(req.body);
            return res.status(200).json({
                msg: "Success",
                id: product.id
            });
        } catch (error) {
            next(error);
        }
    }
    async getProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const product = await productService.findProductById(Number(req.params.id));
            const characteristicsDb = await product.getCharacteristics();
            const categoriesDb = await product.getCategories();

            const productDto = new ProductDto(product);
            const characteristicsDto = characteristicsDb.map(ch => { return { name: ch.name, value: ch.value }; });
            const categoriesDto = categoriesDb.map(category => category.name);

            return res.status(200).json({
                product: productDto,
                characteristics: characteristicsDto,
                categories: categoriesDto
            });
        } catch (error) {
            next(error);
        }
    }
    async getProducts(req: Request, res: Response, next: NextFunction) {
        try {
            let offset: number = 0;
            const { page, limit } = req.query;
            if (typeof page === "number" && typeof limit === "number")
                offset = (page * limit) - limit;
            const products = await productService.getProducts(Number(limit), offset);

            return res.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }
    async addProductImages(req: Request, res: Response, next: NextFunction) {
        try {
            const images = req.files;
            const product = await productService.findProductById(Number(req.params.id));

            if (req.query.img == "main")
                for (let i in images) {
                    await imageService.addProductImage(product, images[i] as UploadedFile, true);
                    return res.status(200).json({ msg: "Success" });
                }
            else
                for (let i in images) {
                    await imageService.addProductImage(product, images[i] as UploadedFile);
                }
            return res.status(200).json({ msg: "Success" });
        } catch (error) {
            next(error);
        }
    }
    async getProductImages(req: Request, res: Response, next: NextFunction) {
        try {
            const product = await productService.findProductById(Number(req.params.id));
            if (req.query.main)
                return res.status(200).json({
                    images: await imageService.getProductImages(product, true)
                });
            return res.status(200).json({
                images: await imageService.getProductImages(product)
            });
        } catch (error) {
            next(error);
        }
    }
    async addProductRating(req: Request, res: Response, next: NextFunction) {
        try {
            const product = await productService.findProductById(Number(req.params.id));
            await productService.addProductRating(product, req.body.rating);
            return res.status(200).json({ msg: "Success" });
        } catch (error) {
            next(error);
        }
    }
    async addProductCount(req: Request, res: Response, next: NextFunction) {
        try {
            const product = await productService.findProductById(Number(req.params.id));
            await productService.addProductCount(product, req.body.count);
            return res.status(200).json({ msg: "Success" });
        } catch (error) {
            next(error);
        }
    }
}

export default new ProductController();