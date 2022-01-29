import ApiError from "../error/ApiError";
import { PreferenceModel, ProductModel } from "../model/product.types";
import { Basket } from "../model/user.model";
import { BasketModel } from "../model/user.types";
import { IProductFullBody } from "./$types";
import productService from "./product.service";

class BasketService {
  async findBasketById(id: number): Promise<BasketModel> {
    const basket: BasketModel | null = await Basket.findByPk(id);
    if (!basket) throw ApiError.notFound("Basket not found");
    return basket;
  }
  async addProductToBasket(
    basket: BasketModel,
    product: ProductModel
  ): Promise<void> {
    const productsDb: ProductModel[] = await basket.getProducts();
    for (let productDb of productsDb) {
      if (productDb.name === product.name)
        throw ApiError.badRequest("Product already added to the basket");
    }
    await basket.addProduct(product);
  }
  async removeProductFromBasket(
    basket: BasketModel,
    product: ProductModel
  ): Promise<void> {
    const productsDb: ProductModel[] = await basket.getProducts();
    for (let productDb of productsDb) {
      if (productDb.name !== product.name)
        throw ApiError.badRequest("Product already added to the basket");
    }
    await basket.removeProduct(product);
  }
  async getProductFromBasket(basket: BasketModel): Promise<IProductFullBody[]> {
    let products: IProductFullBody[] = [];
    const productsDb: ProductModel[] = await basket.getProducts();
    for (let productDb of productsDb)
      products.push(await productService.NormalizeProduct(productDb));
    return products;
  }
  async RemoveProductsFromStock(basket: BasketModel): Promise<void> {
    const products: ProductModel[] = await basket.getProducts();
    for (let product of products) {
      if (product.count == 0) throw ApiError.forbidden("Not enough products");
      const preference: PreferenceModel = await product.getPreference();
      product.count -= 1;
      preference.popular += 1;

      product.save();
      preference.save();
      await basket.removeProduct(product);
    }
    basket.save();
  }
}
export default new BasketService();
