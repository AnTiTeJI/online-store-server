import { CategoryModel, TemplateModel } from "../model/product.types";
import ApiFunction from "../utils/ApiFunction";
import { ICharacteristic } from "./$types";
import categoryService from "./category.service";

class TemplateService {
    async createProductTemplate(category: CategoryModel, characteristics: ICharacteristic[]): Promise<void> {
        const dbTemplate: TemplateModel = await category.getTemplate();
        if (dbTemplate)
            dbTemplate.destroy();
        await category.createTemplate({ characteristics: JSON.stringify(characteristics) });
    }
    async getProductTemplateRecurs(category: CategoryModel): Promise<ICharacteristic[]> {
        let chs: ICharacteristic[] = [];
        const templateDb: TemplateModel = await category.getTemplate();
        if (category.ParentId) {
            const categoryDb: CategoryModel = await categoryService.findCategoryById(category.ParentId);
            const chsDb: ICharacteristic[] = await this.getProductTemplateRecurs(categoryDb);
            if (chsDb)
                chs = chs.concat(chsDb);
        }
        return chs.concat(JSON.parse(templateDb.characteristics));
    }
    async CheckTemplates(categories: CategoryModel[], characteristics: ICharacteristic[]): Promise<boolean | { msg: string, characteristics: string[] }> {
        let chNames: string[] = characteristics.map(obj => obj.name);
        let errors: string[] | undefined = ApiFunction.findDuplicateOnArray(chNames);

        if (errors && errors.length)
            return {
                msg: "Characteristics is duplicated",
                characteristics: errors
            };

        for (let category of categories) {
            const childCategoryDb: CategoryModel = await categoryService.findCategoryByName(category.name);
            const parentCategoriesDb: string[] = await categoryService.getAllParentCategories(childCategoryDb);

            for (let parent of parentCategoriesDb) {
                const categoryDb: CategoryModel = await categoryService.findCategoryByName(parent);
                const templateDb: TemplateModel = await categoryDb.getTemplate();
                if (templateDb) {
                    const characteristicsDb: string[] = JSON.parse(templateDb.characteristics);
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

export default new TemplateService();