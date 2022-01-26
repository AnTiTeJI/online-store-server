const { body, check, validationResult } = require("express-validator");
function ValResult(req, res, next) {
    const result = validationResult(req)
    if (result.errors.length)
        return res.status(400).json({
            errors: result.errors.map(err => err.param)
        })
    next()
}
const UserValidator = [
    body('email').isEmail(),
    body('password').isLength({ min: 8, max: 16 }),
    ValResult
]

const UserDetailValidator = [
    body('name').isLength({ min: 2, max: 20 }),
    body('lastname').isLength({ min: 2, max: 20 }),
    body('phoneNumber').isLength({ min: 9, max: 20 }),
    ValResult
]

const ProductValidator = [
    body('name').isLength({ min: 4, max: 50 }),
    body('price').isNumeric({ no_symbols: true }),
    body('discount').isNumeric({ no_symbols: true }),
    body('count').isNumeric({ no_symbols: true }),
    body('description').isLength({ max: 300 }),
    body('categories').isArray({ min: 1 }),
    body('specifications').isArray({ min: 1 }),
    ValResult
]

module.exports = {
    UserValidator,
    UserDetailValidator,
    ProductValidator
}