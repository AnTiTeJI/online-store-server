const { Router } = require('express')
const categoryController = require('../controller/category.controller')
const templateController = require('../controller/template.controller')
const CheckRole = require('../middleware/role.middleware')
const { Permissions } = require('../roles')

const { categoryRoutes } = require('./$routes')

const categoryRouter = new Router()


categoryRouter.post(categoryRoutes.createCategories,
    CheckRole(Permissions.createCategory),
    categoryController.createCategories)

categoryRouter.post(categoryRoutes.createChildCategories,
    CheckRole(Permissions.createCategory),
    categoryController.createChildCategories)


categoryRouter.get(categoryRoutes.getCategories,
    categoryController.getCategories)

categoryRouter.get(categoryRoutes.getChildCategories,
    categoryController.getChildCategories)

categoryRouter.get(categoryRoutes.getTemplate,
    CheckRole(Permissions.getTemplate),
    templateController.getProductTemplate)

categoryRouter.post(categoryRoutes.createTemplate,
    CheckRole(Permissions.createTemplate),
    templateController.createProductTemplate)

module.exports = categoryRouter