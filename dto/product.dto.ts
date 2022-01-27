import { ProductModel } from "../model/product.types";

class ProductDto {
    id: number
    name: string
    price: number
    count: number
    discount: number
    description: string
    constructor(model: ProductModel) {
        this.id = model.id;
        this.name = model.name;
        this.price = model.price;
        this.count = model.count;
        this.discount = model.discount;
        this.description = model.description;
    }
}

export default ProductDto;