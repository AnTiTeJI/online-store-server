const ProductDto = require("../dto/product.dto")
const imageService = require("../service/image.service")
const productService = require("../service/product.service")
const templateService = require("../service/template.service")
const { CalculateOffset } = require("../utils/ApiFunction")

class ProductController {
    async createProduct(req, res, next) {
        try {
            const { categories, characteristics } = req.body
            const errors = await templateService.CheckTemplates(categories, characteristics)
            if (errors)
                return res.status(404).json({ errors })

            const product = await productService.createProduct(req.body)
            return res.status(200).json({
                msg: "Success",
                id: product.id
            })
        } catch (error) {
            next(error)
        }
    }
    async getProduct(req, res, next) {
        try {
            const product = await productService.findProductById(req.params.id)
            const characteristicsDb = await product.getCharacteristics()
            const categoriesDb = await product.getCategories()

            const productDto = new ProductDto(product)
            const characteristicsDto = characteristicsDb.map(ch => { return { name: ch.name, value: ch.value } })
            const categoriesDto = categoriesDb.map(category => category.name)

            return res.status(200).json({
                product: productDto,
                characteristics: characteristicsDto,
                categories: categoriesDto
            })
        } catch (error) {
            next(error)
        }
    }
    async getProducts(req, res, next) {
        try {
            CalculateOffset(req.query.page, req.query.limit)
            const products = await productService.getProducts(limit, offset)

            return res.status(200).json(products)
        } catch (error) {
            next(error)
        }
    }
    async addProductImages(req, res, next) {
        try {
            const images = req.files
            const product = await productService.findProductById(req.params.id)

            if (req.query.img == 'main')
                for (let i in images) {
                    await product.createImage({ name: await imageService.addProductImage(product, images[i], true) })
                    return res.status(200).json({ msg: 'Success' })
                }
            else
                for (let i in images) {
                    await product.createImage({ name: await imageService.addProductImage(product, images[i]) })
                }
            return res.status(200).json({ msg: 'Success' })
        } catch (error) {
            next(error)
        }
    }
    async getProductImages(req, res, next) {
        try {
            const product = await productService.findProductById(req.params.id)
            if (req.query.main)
                return res.status(200).json({
                    images: await imageService.getProductImages(product, true)
                })
            return res.status(200).json({
                images: await imageService.getProductImages(product)
            })
        } catch (error) {
            next(error)
        }
    }
    async addProductRating(req, res, next) {
        try {
            await productService.addProductRating(req.body.rating)
            return res.status(200).json({ msg: 'Success' })
        } catch (error) {
            next(error)
        }
    }
    async addProductCount(req, res, next) {
        try {
            await productService.addProductCount(req.body.count)
            return res.status(200).json({ msg: 'Success' })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new ProductController()