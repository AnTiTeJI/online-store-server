const ApiError = require("../error/ApiError")
const { Category } = require("../model/product.model")
const ApiFunction = require("../utils/ApiFunction")

class CategoryService {
    async findCategoryByName(name) {
        const categoryDb = await Category.findOne({ where: { name } })
        if (!categoryDb)
            throw ApiError.notFound('Category not found')
        return categoryDb
    }
    async findCategoryById(id) {
        const categoryDb = await Category.findByPk(id)
        if (!categoryDb)
            throw ApiError.notFound('Category not found')
        return categoryDb
    }
    async addCategories(product, categories) {
        let errors = ApiFunction.findDuplicateOnArray(categories)
        if (errors.length)
            return {
                msg: "Category is duplicated",
                categories: errors
            }

        let allChainCategories = []
        for (let category of categories) {
            const childCategoryDb = await this.findCategoryByName(category)
            const chainCategoriesDb = await this.getAllParentCategories(childCategoryDb)
            allChainCategories = allChainCategories.concat(chainCategoriesDb)
        }

        allChainCategories = Array.from(new Set(allChainCategories))

        for (let category of allChainCategories) {
            const categoryDb = await this.findCategoryByName(category)
            product.addCategory(categoryDb)
        }
    }
    async createCategory(category_name, parent_name = null) {
        if (parent_name) {
            const parentDb = await Category.findOne({
                where: {
                    name: parent_name.toLowerCase()
                }
            })
            if (!parentDb)
                throw ApiError.notFound('Category not found')

            return await parentDb.createChild({
                name: category_name.toLowerCase()
            })
        }
        await Category.create({
            name: category_name.toLowerCase()
        })
    }
    async getCategories(offset, limit, parent_name = null) {
        let categories = []
        if (parent_name) {
            const parentDb = await Category.findOne({
                where: {
                    name: parent_name.toLowerCase()
                }
            })
            if (!parentDb)
                throw ApiError.notFound('Category not found')

            const categoriesDb = await parentDb.getChild()
            for (let category of categoriesDb) {
                categories.push(category.name)
            }
        }
        else {
            let categoriesDb = await Category.findAndCountAll({
                offset: offset,
                limit: limit,
                where: { ParentId: null, }
            })

            for (let category of categoriesDb.rows) {
                categories.push(category.name)
            }
        }
        return categories
    }
    async getAllParentCategories(category, categories = []) {
        if (category.ParentId) {
            const categoryDb = await this.findCategoryById(category.ParentId)
            await this.getAllParentCategories(categoryDb, categories)
        }
        categories.push(category.name)
        return categories
    }
}

module.exports = new CategoryService()