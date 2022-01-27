import { NextFunction, Request, Response } from "express";

const categoryService = require("../service/category.service");

class CategoryController {
    async createCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const { categories } = req.body;
            for (let category of categories) {
                await categoryService.createCategory(category);
            }
            return res.status(201).json({ msg: "Success" });
        } catch (error) {
            next(error);
        }
    }
    async createChildCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const parentName = req.params.name;
            const { categories } = req.body;
            for (let category of categories) {
                await categoryService.createCategory(category, parentName);
            }
            return res.status(201).json({ msg: "Success" });
        } catch (error) {
            next(error);
        }
    }
    async getCategories(req: Request, res: Response, next: NextFunction) {
        try {
            let offset: number = 0;
            const { page, limit } = req.query;
            if (typeof page === "number" && typeof limit === "number")
                offset = (page * limit) - limit;
            const categories = await categoryService.getCategories(offset, limit);

            return res.status(200).json({ categories });
        } catch (error) {
            next(error);
        }
    }
    async getChildCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const parentName = req.params.name;
            let offset: number = 0;
            const { page, limit } = req.query;
            if (typeof page === "number" && typeof limit === "number")
                offset = (page * limit) - limit;
            const categories = await categoryService.getCategories(offset, limit, parentName);

            return res.status(200).json({ categories });
        } catch (error) {
            next(error);
        }
    }
}
export = new CategoryController();