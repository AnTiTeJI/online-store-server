const categoryService = require("../service/category.service")
const { CalculateOffset } = require("../utils/ApiFunction")

class CategoryController {
    async createCategories(req, res, next) {
        try {
            const { categories } = req.body
            for (let category of categories) {
                await categoryService.createCategory(category)
            }
            return res.status(201).json({ msg: "Success" })
        } catch (error) {
            next(error)
        }
    }
    async createChildCategories(req, res, next) {
        try {
            const parentName = req.params.name
            const { categories } = req.body
            for (let category of categories) {
                await categoryService.createCategory(category, parentName)
            }
            return res.status(201).json({ msg: "Success" })
        } catch (error) {
            next(error)
        }
    }
    async getCategories(req, res, next) {
        try {
            const { offset, limit } = CalculateOffset(req.query.page, req.query.limit)
            const categories = await categoryService.getCategories(offset, limit)

            return res.status(200).json({ categories })
        } catch (error) {
            next(error)
        }
    }
    async getChildCategories(req, res, next) {
        try {
            const parentName = req.params.name
            const { offset, limit } = CalculateOffset(req.query.page, req.query.limit)

            const categories = await categoryService.getCategories(offset, limit, parentName)

            return res.status(200).json({ categories })
        } catch (error) {
            next(error)
        }
    }
}
module.exports = new CategoryController()