const ApiError = require("../error/ApiError")
const { Product } = require("../model/product.model")
const characteristicService = require('./characteristic.service')
const categoryService = require('./category.service')
const ProductDto = require("../dto/product.dto")

class ProductService {
    async createProduct(body) {
        const { name, price, count, discount, description } = body.product

        if (await Product.findOne({ where: { name } }))
            throw ApiError.badRequest(`Product has already been created`)

        const product = await Product.create({ name, price, count, discount, description })
        await Product.createPreference()
        try {
            await characteristicService.addCharacteristics(product, body.characteristics)
            await categoryService.addCategories(product, body.categories)
        } catch (error) {
            product.destroy()
            throw error
        }
        return product
    }
    async findProductById(id) {
        const productDb = await Product.findByPk(id)
        if (!productDb)
            throw ApiError.notFound('Product not found')
        return productDb
    }
    async getProducts(limit, offset) {
        let products = []
        const productsDb = await Product.findAndCountAll({ limit, offset })
        for (let productDb of productsDb.rows) {
            products.push(await ProductService.NormalizeProduct(productDb))
        }
        return products
    }
    async NormalizeProduct(product) {
        const characteristics = await product.getCharacteristics()
        const categories = await product.getCategories()
        const preference = await product.getPreference()
        return {
            product: new ProductDto(product),
            characteristics: characteristics.map(ch => { return { name: ch.name, value: ch.value } }),
            categories: categories.map(category => category.name),
            preference: { popular: preference.popular, rating: preference.rating }
        }
    }
    async addProductRating(product, rate) {
        const preference = await product.getPreference()
        preference.rating = Math.round(preference.rating + rate / 5)
        preference.save()
    }
    async addProductCount(product, count) {
        product.count += count
        product.save()
    }
}

module.exports = new ProductService()