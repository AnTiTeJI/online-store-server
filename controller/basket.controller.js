const basketService = require("../service/basket.service")
const productService = require("../service/product.service")
const userService = require("../service/user.service")

class BasketController {
    async addProductToBasket(req, res, next) {
        try {
            const user = await userService.findUserByTokenId(req.headers.authorization)
            const product = await productService.findProductById(req.params.id)
            await basketService.addProductToBasket(await user.getBasket(), product)
            res.status(201).json('Success')
        } catch (error) {
            next(error)
        }
    }
    async removeProductFromBasket(req, res, next) {
        try {
            const user = await userService.findUserByTokenId(req.headers.authorization)
            const product = await productService.findProductById(req.params.id)
            await basketService.removeProductFromBasket(await user.getBasket(), product)
            res.status(200).json('Success')
        } catch (error) {
            next(error)
        }
    }
    async getProductsFromBasket(req, res, next) {
        try {
            const user = await userService.findUserByTokenId(req.headers.authorization)
            const products = await basketService.getProductFromBasket(await user.getBasket())
            res.status(200).json({ products })
        } catch (error) {
            next(error)
        }
    }
    async buyProductsFromBasket(req, res, next) {
        try {
            const user = await userService.findUserByTokenId(req.headers.authorization)
            const basket = await user.getBasket()
            await basketService.RemoveProductsFromStock(basket)
            res.status(200).json('Success')
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new BasketController()