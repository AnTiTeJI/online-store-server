import { NextFunction, Request, Response } from "express";
import categoryService from "../service/category.service";
import templateService from "../service/template.service";

class TemplateController {
    async createProductTemplate(req: Request, res: Response, next: NextFunction) {
        try {
            const { characteristics } = req.body;
            const categoryDb = await categoryService.findCategoryByName(req.params.name);
            await templateService.createProductTemplate(categoryDb, characteristics);
            return res.status(201).json({ msg: "Success" });
        } catch (error) {
            next(error);
        }
    }
    async getProductTemplate(req: Request, res: Response, next: NextFunction) {
        try {
            const categoryDb = await categoryService.findCategoryByName(req.params.name);
            const templates = await templateService.getProductTemplateRecurs(categoryDb);
            return res.status(200).json(templates);
        } catch (error) {
            next(error);
        }
    }
}

export = new TemplateController();