import { NextFunction, Request, Response } from "express";
import categoryService from "../service/category.service";
import { CategoryBody } from "./$types";

class CategoryController {
  async createCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { categories } = req.body as CategoryBody;
      for (let category of categories) {
        await categoryService.createCategory(category);
      }
      res.status(201).json({ msg: "Success" });
    } catch (error) {
      next(error);
    }
  }
  async createChildCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const parentName = req.params.name;
      const { categories } = req.body as CategoryBody;
      for (let category of categories) {
        await categoryService.createCategory(category, parentName);
      }
      res.status(201).json({ msg: "Success" });
    } catch (error) {
      next(error);
    }
  }
  async getCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      let offset: number = 0;
      let page: number = 1;
      let limit: number = 12;
      if (req.query.limit) limit = Number(req.query.limit);
      if (req.query.page) limit = Number(req.query.page);
      if (typeof page === "number" && typeof limit === "number")
        offset = page * limit - limit;
      console.log("LIMIT: ", page);
      const categories = await categoryService.getCategories(
        offset,
        Number(limit)
      );

      res.status(200).json({ categories });
    } catch (error) {
      next(error);
    }
  }
  async getChildCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const parentName = req.params.name;
      let offset: number = 0;
      const { page, limit } = req.query;
      if (typeof page === "number" && typeof limit === "number")
        offset = page * limit - limit;
      const categories = await categoryService.getCategories(
        offset,
        Number(limit),
        parentName
      );

      res.status(200).json({ categories });
    } catch (error) {
      next(error);
    }
  }
}
export default new CategoryController();
