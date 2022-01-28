import { HasOneCreateAssociationMixin, BelongsToManyAddAssociationMixin, BelongsToManyGetAssociationsMixin, HasOneGetAssociationMixin, Model, Optional } from "sequelize/dist";
import { ProductModel } from "./product.types";

interface UserArttributes {
    id: number,
    email: string,
    roles: string,
    password: string
}
interface UserCreationAttributes extends Optional<UserArttributes, "id"> {
}
export interface UserModel extends Model<UserArttributes, UserCreationAttributes>, UserArttributes {
    getUserDetail: HasOneGetAssociationMixin<UserDetailsModel>,
    createUserDetail: HasOneCreateAssociationMixin<UserDetailsModel>,
    getBasket: HasOneGetAssociationMixin<BasketModel>,
    createBasket: HasOneCreateAssociationMixin<BasketModel>,
    getToken: HasOneGetAssociationMixin<TokenModel>,
    createToken: HasOneCreateAssociationMixin<TokenModel>
}


interface UserDetailsAttributes {
    id: number,
    name: string,
    lastname: string,
    adress: string,
    phoneNumber: string
}
interface UserDetailsCreationAttributes extends Optional<UserDetailsAttributes, "id"> { }
export interface UserDetailsModel extends Model<UserDetailsAttributes, UserDetailsCreationAttributes>, UserDetailsAttributes { }

interface TokenAttributes {
    id: number,
    refresh: string
}
interface TokenCreationAttributes extends Optional<TokenAttributes, "id"> { }
export interface TokenModel extends Model<TokenAttributes, TokenCreationAttributes>, TokenAttributes { }

interface BasketAttributes {
    id: number
}
interface BasketCreationAttributes extends Optional<BasketAttributes, "id"> { }
export interface BasketModel extends Model<BasketAttributes, BasketCreationAttributes>, BasketAttributes {
    getProducts: BelongsToManyGetAssociationsMixin<ProductModel>,
    addProduct: BelongsToManyAddAssociationMixin<ProductModel, ProductModel>,
    removeProduct: BelongsToManyAddAssociationMixin<ProductModel, ProductModel>
}