import { NextFunction, Request, Response } from "express";
import { CategoryModel } from "../model/product.types";
import { ICharacteristic } from "../service/$types";
import categoryService from "../service/category.service";
import templateService from "../service/template.service";
import { CharacteristicBody } from "./$types";

class TemplateController {
    async createProductTemplate(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { characteristics } = req.body as CharacteristicBody;
            const categoryDb: CategoryModel = await categoryService.findCategoryByName(req.params.name);
            await templateService.createProductTemplate(categoryDb, characteristics);
            res.status(201).json({ msg: "Success" });
        } catch (error) {
            next(error);
        }
    }
    async getProductTemplate(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const categoryDb: CategoryModel = await categoryService.findCategoryByName(req.params.name);
            const templates: ICharacteristic[] = await templateService.getProductTemplateRecurs(categoryDb);
            res.status(200).json({ templates });
        } catch (error) {
            next(error);
        }
    }
}

export default new TemplateController();