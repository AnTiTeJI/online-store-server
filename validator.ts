import { NextFunction, Response, Request } from "express";

import { body, validationResult } from "express-validator";

function ValResult(req: Request, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (result.array.length)
        return res.status(400).json({
            errors: result.array
        });
    next();
}
export const UserValidator = [
    body("email").isEmail(),
    body("password").isLength({ min: 8, max: 16 }),
    ValResult
];

export const UserDetailValidator = [
    body("name").isLength({ min: 2, max: 20 }),
    body("lastname").isLength({ min: 2, max: 20 }),
    body("phoneNumber").isLength({ min: 9, max: 20 }),
    ValResult
];

export const ProductValidator = [
    body("name").isLength({ min: 4, max: 50 }),
    body("price").isNumeric({ no_symbols: true }),
    body("discount").isNumeric({ no_symbols: true }),
    body("count").isNumeric({ no_symbols: true }),
    body("description").isLength({ max: 300 }),
    body("categories").isArray({ min: 1 }),
    body("specifications").isArray({ min: 1 }),
    ValResult
];

