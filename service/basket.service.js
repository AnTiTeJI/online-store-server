const ApiError = require("../error/ApiError")
const { Basket } = require("../model/user.model")
const productService = require("./product.service")

class BasketService {
    async findBasketById(id) {
        const basket = await Basket.findByPk(id)
        if (!basket)
            throw ApiError.notFound('Basket not found')
        return basket
    }
    async addProductToBasket(basket, product) {
        const productsDb = await basket.getProducts()
        for (let productDb of productsDb) {
            if (productDb.name === product.name)
                throw ApiError.badRequest('Product already added to the basket')
        }
        await basket.addProduct(product)
    }
    async removeProductFromBasket(basket, product) {
        const productsDb = await basket.getProducts()
        for (let productDb of productsDb) {
            if (productDb.name !== product.name)
                throw ApiError.badRequest('Product already added to the basket')
        }
        await basket.removeProduct(product)
    }
    async getProductFromBasket(basket) {
        let products = []
        const productsDb = await basket.getProducts()
        for (let productDb of productsDb)
            products.push(await productService.NormalizeProduct(productDb))
        return products
    }
    async RemoveProductsFromStock(basket) {
        const products = await basket.getProducts()
        for (let product of products) {
            if (product.count == 0)
                throw ApiError.forbidden('Not enough products')
            const preference = await product.getPreference()
            product.count -= 1
            preference.popular += 1

            product.save()
            preference.save()
            await basket.removeProduct(product)
        }
        basket.save()
    }
}
module.exports = new BasketService()