const { Router } = require('express')
const categoryRouter = require('./category.router')
const productRouter = require('./product.router')
const userRouter = require('./user.router')

const router = new Router()


router.use('/', userRouter)
router.use('/product', productRouter)
router.use('/category', categoryRouter)

module.exports = router