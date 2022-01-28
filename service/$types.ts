import { CategoryModel, ProductModel } from "../model/product.types";

export interface IProduct {
    name: string,
    price: number,
    count: number,
    discount: number,
    description: string
}

export interface ICharacteristic {
    name: string,
    value: string
}

export interface IPreference {
    popular: number,
    rating: number
}

export interface ITokens {
    refreshToken: string,
    accessToken: string
}
export interface IProductFullBody {
    product: IProduct,
    categories: string[],
    characteristics: ICharacteristic[],
    preference: IPreference
}

export interface UserDetails {
    email: string,
    name: string,
    lastname: string,
    phoneNumber: string,
    adress: string
}

export interface UserChangePassword {
    currentPassword: string,
    newPassword: string
}

export interface CategoryModelRows {
    rows: CategoryModel[],
    count: number
}

export interface ProductModelRows {
    rows: ProductModel[],
    count: number
}