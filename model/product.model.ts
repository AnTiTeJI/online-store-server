import { ImageModel, PreferenceModel, CategoryModel, CharacteristicModel, TemplateModel, ProductModel } from "./product.types";
import { DataTypes } from "sequelize";
import sequelize from "../database";

export const Product = sequelize.define<ProductModel>("Product", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    price: { type: DataTypes.DOUBLE, defaultValue: 0 },
    count: { type: DataTypes.INTEGER, defaultValue: 0 },
    discount: { type: DataTypes.INTEGER, defaultValue: 0, },
    description: { type: DataTypes.TEXT, allowNull: false }

});

export const Image = sequelize.define<ImageModel>("Image", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false }
});

export const Preference = sequelize.define<PreferenceModel>("Preference", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    rating: { type: DataTypes.INTEGER, defaultValue: 0 },
    popular: { type: DataTypes.INTEGER, defaultValue: 0 }
});

export const Category = sequelize.define<CategoryModel>("Category", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    ParentId: { type: DataTypes.INTEGER, defaultValue: null },
    name: { type: DataTypes.STRING, allowNull: false },
});

export const Characteristic = sequelize.define<CharacteristicModel>("Characteristic", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    value: { type: DataTypes.STRING, allowNull: false }
});


export const Template = sequelize.define<TemplateModel>("Template", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    characteristics: { type: DataTypes.TEXT, allowNull: false }
});

