import { CategoryModel, ProductModel } from "./../model/product.types";
import ApiError from "../error/ApiError";
import { Category } from "../model/product.model";
import ApiFunction from "../utils/ApiFunction";

class CategoryService {
    async findCategoryByName(name: string) {
        const categoryDb = await Category.findOne({ where: { name } });
        if (!categoryDb)
            throw ApiError.notFound("Category not found");
        return categoryDb;
    }
    async findCategoryById(id: number) {
        const categoryDb = await Category.findByPk(id);
        if (!categoryDb)
            throw ApiError.notFound("Category not found");
        return categoryDb;
    }
    async addCategories(product: ProductModel, categories: any[]) {
        let errors = ApiFunction.findDuplicateOnArray(categories);
        if (errors && errors.length)
            return {
                msg: "Category is duplicated",
                categories: errors
            };

        let allChainCategories: any[] = [];
        for (let category of categories) {
            const childCategoryDb = await this.findCategoryByName(category);
            const chainCategoriesDb = await this.getAllParentCategories(childCategoryDb);
            allChainCategories = allChainCategories.concat(chainCategoriesDb);
        }

        allChainCategories = Array.from(new Set(allChainCategories));

        for (let category of allChainCategories) {
            const categoryDb = await this.findCategoryByName(category);
            await product.addCategory(categoryDb);
        }
    }
    async createCategory(category_name: string, parent_name: string = "") {
        if (parent_name) {
            const parentDb = await Category.findOne({
                where: {
                    name: parent_name.toLowerCase()
                }
            });
            if (!parentDb)
                throw ApiError.notFound("Category not found");

            return await parentDb.createChild({
                name: category_name
            });
        }
        await Category.create({
            name: category_name
        });
    }
    async getCategories(offset: number, limit: number, parent_name: string = "") {
        let categories = [];
        if (parent_name) {
            const parentDb = await Category.findOne({
                where: {
                    name: parent_name.toLowerCase()
                }
            });
            if (!parentDb)
                throw ApiError.notFound("Category not found");

            const categoriesDb = await parentDb.getChild();
            for (let category of categoriesDb) {
                categories.push(category.name);
            }
        }
        else {
            let categoriesDb = await Category.findAndCountAll({
                offset: offset,
                limit: limit,
                where: {
                    ParentId: null
                }
            });

            for (let category of categoriesDb.rows) {
                categories.push(category.name);
            }
        }
        return categories;
    }
    async getAllParentCategories(category: CategoryModel, categories: any[] = []) {
        if (category.ParentId) {
            const categoryDb = await this.findCategoryById(category.ParentId);
            await this.getAllParentCategories(categoryDb, categories);
        }
        categories.push(category.name);
        return categories;
    }
}

export = new CategoryService()