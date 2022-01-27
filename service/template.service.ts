import { CategoryModel } from "../model/product.types";
import ApiFunction from "../utils/ApiFunction";
import categoryService from "./category.service";

class TemplateService {
    async createProductTemplate(category: CategoryModel, characteristics: any[]) {
        const dbTemplate = await category.getTemplate();
        if (dbTemplate)
            dbTemplate.destroy();
        await category.createTemplate({ characteristics: JSON.stringify(characteristics) });
    }
    async getProductTemplateRecurs(category: CategoryModel) {
        let chs: any[] = [];
        const templateDb = await category.getTemplate();
        if (category.ParentId) {
            const categoryDb = await categoryService.findCategoryById(category.ParentId);
            const chsDb = await this.getProductTemplateRecurs(categoryDb);
            if (chsDb)
                chs = chs.concat(chsDb);
        }
        return chs.concat(JSON.parse(templateDb.characteristics));
    }
    async CheckTemplates(categories: CategoryModel[], characteristics: any[]) {
        let chNames = characteristics.map(obj => obj.name);
        let errors: any[] | undefined = ApiFunction.findDuplicateOnArray(chNames);

        if (errors && errors.length)
            return {
                msg: "Characteristics is duplicated",
                characterisctics: errors
            };

        for (let category of categories) {
            const childCategoryDb = await categoryService.findCategoryByName(category.name);
            const parentCategoriesDb = await categoryService.getAllParentCategories(childCategoryDb);

            for (let parent of parentCategoriesDb) {
                const categoryDb = await categoryService.findCategoryByName(parent);
                const templateDb = await categoryDb.getTemplate();
                if (templateDb) {
                    const characteristicsDb = JSON.parse(templateDb.characteristics);
                    for (let ch of characteristicsDb) {
                        if (!chNames.includes(ch)) {
                            errors && errors.push(ch);
                        }
                    }
                }
            }
        }
        if (errors && errors.length)
            return {
                msg: "Characteristics is missing",
                characteristics: errors
            };
        return false;
    }
}

export = new TemplateService()