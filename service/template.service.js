const ApiError = require("../error/ApiError")
const ApiFunction = require("../utils/ApiFunction")
const categoryService = require("./category.service")

class TemplateService {
    async createProductTemplate(category, characteristics) {
        const dbTemplate = await category.getTemplate()
        if (dbTemplate)
            dbTemplate.destroy()
        await category.createTemplate({ characteristics: JSON.stringify(characteristics) })
    }
    async getProductTemplateRecurs(category) {
        let chs = []
        const templateDb = await category.getTemplate()
        if (category.ParentId) {
            const categoryDb = await categoryService.findCategoryById(category.ParentId)
            const chsDb = await this.getProductTemplateRecurs(categoryDb)
            if (chsDb)
                chs = chs.concat(chsDb)
        }
        return chs.concat(JSON.parse(templateDb.characteristics))
    }
    async CheckTemplates(categories, characteristics) {
        let errors = []
        let chNames = characteristics.map(obj => obj.name)
        errors = ApiFunction.findDuplicateOnArray(chNames)

        if (errors.length)
            return {
                msg: "Characteristics is duplicated",
                characterisctics: errors
            }

        for (let category of categories) {
            const childCategoryDb = await categoryService.findCategoryByName(category)
            const parentCategoriesDb = await categoryService.getAllParentCategories(childCategoryDb)

            for (let parent of parentCategoriesDb) {
                const categoryDb = await categoryService.findCategoryByName(parent)
                const templateDb = await categoryDb.getTemplate()
                if (templateDb) {
                    const characteristicsDb = JSON.parse(templateDb.characteristics)
                    for (let ch of characteristicsDb) {
                        if (!chNames.includes(ch)) {
                            errors.push(ch)
                        }
                    }
                }
            }
        }
        if (errors.length)
            return {
                msg: "Characteristics is missing",
                characteristics: errors
            }
        return false
    }
}

module.exports = new TemplateService()