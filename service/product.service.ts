import ApiError from "../error/ApiError";
import { Product } from "../model/product.model";
import characteristicService from "./characteristic.service";
import categoryService from "./category.service";
import ProductDto from "../dto/product.dto";
import { ProductModel } from "../model/product.types";

class ProductService {
    async createProduct(body: any) {
        const { name, price, count, discount, description } = body.product;

        if (await Product.findOne({ where: { name } }))
            throw ApiError.badRequest("Product has already been created");

        const product = await Product.create({ name, price, count, discount, description });
        await product.createPreference();
        try {
            await characteristicService.addCharacteristics(product, body.characteristics);
            await categoryService.addCategories(product, body.categories);
        } catch (error) {
            product.destroy();
            throw error;
        }
        return product;
    }
    async findProductById(id: number) {
        const productDb = await Product.findByPk(id);
        if (!productDb)
            throw ApiError.notFound("Product not found");
        return productDb;
    }
    async getProducts(limit: number, offset: number) {
        let products = [];
        const productsDb = await Product.findAndCountAll({ limit, offset });
        for (let productDb of productsDb.rows) {
            products.push(await this.NormalizeProduct(productDb));
        }
        return products;
    }
    async NormalizeProduct(product: ProductModel) {
        const characteristics = await product.getCharacteristics();
        const categories = await product.getCategories();
        const preference = await product.getPreference();
        return {
            product: new ProductDto(product),
            characteristics: characteristics.map(ch => { return { name: ch.name, value: ch.value }; }),
            categories: categories.map(category => category.name),
            preference: { popular: preference.popular, rating: preference.rating }
        };
    }
    async addProductRating(product: ProductModel, rate: number) {
        const preference = await product.getPreference();
        preference.rating = Math.round(preference.rating + rate / 5);
        preference.save();
    }
    async addProductCount(product: ProductModel, count: number) {
        product.count += count;
        product.save();
    }
}

export = new ProductService();