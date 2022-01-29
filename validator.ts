import { ICharacteristic, IProduct } from "./service/$types";
import { NextFunction, Response, Request } from "express";

import { body, check, param, query, validationResult } from "express-validator";

function ValResult(req: Request, res: Response, next: NextFunction) {
  const result = validationResult(req);
  console.log(result.array());
  if (!result.isEmpty())
    return res.status(400).json({ errors: result.array() });
  next();
}

export const UserValidator = [
  body("email").isEmail(),
  body("password").isLength({ min: 8, max: 16 }),
  ValResult,
];
export const UserDetailValidator = [
  body("email").isLength({ min: 2, max: 20 }),
  body("name").isLength({ min: 2, max: 20 }),
  body("lastname").isLength({ min: 2, max: 20 }),
  body("phoneNumber").isLength({ min: 9, max: 20 }),
  body("adress").isLength({ min: 9, max: 20 }),
  ValResult,
];
export const UserPasswordValidator = [
  body("currentPassword").isLength({ min: 8, max: 16 }),
  body("newPassword").isLength({ min: 8, max: 16 }),
  ValResult,
];
export const UserParamValidator = [
  param("id").isNumeric({ no_symbols: true }).notEmpty(),
  ValResult,
];
export const RoleBodyValidator = [body("roles").isArray({ min: 1 }), ValResult];

export const QueryFindCountAllValidator = [
  query("page").isNumeric({ no_symbols: true }),
  query("limit").isNumeric({ no_symbols: true }),
  ValResult,
];

export const BasketParamValidator = [
  param("id").isNumeric({ no_symbols: true }).notEmpty(),
  ValResult,
];

export const CategoryBodyValidator = [
  body("categories").isArray({ min: 1 }),
  ValResult,
];
export const CategoryParamValidator = [param("name").notEmpty(), ValResult];

export const ProductValidator = [
  body("product").custom((product: IProduct) => {
    check(product.name).isLength({ min: 4, max: 30 }).notEmpty();
    check(product.price.toString()).isNumeric({ no_symbols: true }).notEmpty();
    check(product.count.toString()).isNumeric({ no_symbols: true });
    check(product.discount.toString()).isNumeric({ no_symbols: true });
    check(product.description).isLength({ max: 300 });
  }),
  body("categories").isArray({ min: 1 }),
  body("characterstics").custom((charactestics: ICharacteristic[]) => {
    for (let ch of charactestics) {
      check(ch.name).isLength({ min: 4, max: 20 }).notEmpty();
      check(ch.value).isLength({ min: 4, max: 20 }).notEmpty();
    }
  }),
  ValResult,
];
