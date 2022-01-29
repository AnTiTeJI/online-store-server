import { UploadedFile } from "express-fileupload";
import uuid from "uuid";
import fs from "fs";
import path from "path";
import {
  CategoryModel,
  ImageModel,
  ProductModel,
} from "../model/product.types";
class ImageService {
  async addProductImage(
    product: ProductModel,
    image: UploadedFile,
    main: boolean = false
  ): Promise<string> {
    const productPath: string = path.join("./static/images", product.name);
    if (!fs.existsSync(productPath)) {
      fs.mkdir(productPath, (err) => console.log(`mkdir error\n${err}`));
    }

    if (main) {
      image.name = "main.jpg";
      const imagesDb: ImageModel[] = await product.getImages();
      fs.readdir(productPath, (err, files) => {
        for (const file of files) {
          if (file.split(".")[0] == "main") {
            fs.unlink(path.join(productPath, file), (err) => {
              if (err) {
                return console.log(err);
              }
              image.mv(path.join(productPath, image.name));
            });
          }
        }
        for (const img of imagesDb) {
          if (img.name.split(".")[0] == "main") {
            img.destroy();
          }
        }
      });
    } else {
      image.name = `${uuid.v4()}.jpg`;
      image.mv(path.join(productPath, image.name));
    }
    return image.name;
  }

  async getProductImages(
    product: ProductModel,
    main: boolean = false
  ): Promise<string | string[]> {
    const imagesDb: ImageModel[] = await product.getImages();
    const images: string[] = [];
    if (main) {
      for (const image of imagesDb) {
        if (image.name.split(".")[0] == "main") {
          return path.join("images", image.name);
        }
      }
    } else {
      for (const image of imagesDb) {
        images.push(path.join("images", image.name));
      }
    }
    return images;
  }

  async addCategoryImage(
    category: CategoryModel,
    image: UploadedFile
  ): Promise<void> {
    const categoryPath: string = path.join("./static/categories/");

    if (!fs.existsSync(categoryPath)) {
      fs.mkdir(categoryPath, (err) => console.log(`mkdir error\n${err}`));
    }
    image.name = `${uuid.v4()}.jpg`;
    image.mv(categoryPath);

    await category.createImage({ name: image.name });
  }

  async getCategoryImage(category: CategoryModel): Promise<string> {
    const image: ImageModel = await category.getImage();
    return path.join("categories", image.name);
  }
}

export default new ImageService();
