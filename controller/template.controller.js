const categoryService = require("../service/category.service")
const templateService = require("../service/template.service")

class TemplateController {
    async createProductTemplate(req, res, next) {
        try {
            const { characteristics } = req.body
            const categoryDb = await categoryService.findCategoryByName(req.params.name)
            await templateService.createProductTemplate(categoryDb, characteristics)
            return res.status(201).json({ msg: "Success" })
        } catch (error) {
            next(error)
        }
    }
    async getProductTemplate(req, res, next) {
        try {
            const categoryDb = await categoryService.findCategoryByName(req.params.name)
            const templates = await templateService.getProductTemplateRecurs(categoryDb)
            return res.status(200).json(templates)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new TemplateController()