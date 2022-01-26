const { Router } = require('express')
const productController = require('../controller/product.controller')
const templateController = require('../controller/template.controller')
const CheckRole = require('../middleware/role.middleware')
const { Permissions } = require('../roles')
const { ProductValidator } = require('../validator')
const { productRoutes } = require('./$routes')

const productRouter = new Router()


productRouter.get(productRoutes.getProducts,
    productController.getProducts)

productRouter.get(productRoutes.getProduct,
    productController.getProduct)


productRouter.post(productRoutes.createProduct,
    ProductValidator,
    CheckRole(Permissions.createProduct),
    productController.createProduct)

productRouter.get(productRoutes.getProductImages,
    productController.getProductImages)

productRouter.post(productRoutes.addProductImages,
    CheckRole(Permissions.addProductImages),
    productController.addProductImages)





module.exports = productRouter