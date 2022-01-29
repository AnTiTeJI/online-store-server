import {
  HasOneGetAssociationMixin,
  BelongsToManyCreateAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasOneCreateAssociationMixin,
  Model,
  Optional,
  BelongsToManyAddAssociationMixin,
} from "sequelize/dist";
interface ProductAttributes {
  id: number;
  name: string;
  price: number;
  count: number;
  discount: number;
  description: string;
}
interface ProductCreationAttibutes extends Optional<ProductAttributes, "id"> {}
export interface ProductModel
  extends Model<ProductAttributes, ProductCreationAttibutes>,
    ProductAttributes {
  getCharacteristics: BelongsToManyGetAssociationsMixin<CharacteristicModel>;
  createCharacteristic: BelongsToManyCreateAssociationMixin<CharacteristicModel>;
  addCharacteristic: BelongsToManyAddAssociationMixin<
    CharacteristicModel,
    CharacteristicModel
  >;
  getCategories: BelongsToManyGetAssociationsMixin<CategoryModel>;
  addCategory: BelongsToManyAddAssociationMixin<CategoryModel, CategoryModel>;
  getImages: BelongsToManyGetAssociationsMixin<ImageModel>;
  createImage: BelongsToManyCreateAssociationMixin<ImageModel>;
  createPreference: HasOneCreateAssociationMixin<PreferenceModel>;
  getPreference: HasOneGetAssociationMixin<PreferenceModel>;
}

interface ImageAttributes {
  id: number;
  name: string;
}
interface ImageCreationAttributes extends Optional<ImageAttributes, "id"> {}
export interface ImageModel
  extends Model<ImageAttributes, ImageCreationAttributes>,
    ImageAttributes {}

interface PreferenceAttributes {
  id: number;
  rating: number;
  popular: number;
}
interface PreferenceCreationAttributes
  extends Optional<PreferenceAttributes, "id"> {}
export interface PreferenceModel
  extends Model<PreferenceAttributes, PreferenceCreationAttributes>,
    PreferenceAttributes {}

interface CategoryAttributes {
  id: number;
  ParentId: number;
  name: string;
}
interface CategoryCreationAttributes
  extends Optional<CategoryAttributes, "id" | "ParentId"> {}
export interface CategoryModel
  extends Model<CategoryAttributes, CategoryCreationAttributes>,
    CategoryAttributes {
  getChild: HasManyGetAssociationsMixin<CategoryModel>;
  createChild: HasManyCreateAssociationMixin<
    CategoryModel,
    keyof CategoryCreationAttributes
  >;
  getTemplate: HasOneGetAssociationMixin<TemplateModel>;
  createTemplate: HasOneCreateAssociationMixin<TemplateModel>;
  getImage: HasOneGetAssociationMixin<ImageModel>;
  createImage: HasOneCreateAssociationMixin<ImageModel>;
}

interface CharacteristicAttributes {
  id: number;
  name: string;
  value: string;
}
interface CharacteristicCreationAttributes
  extends Optional<CharacteristicAttributes, "id"> {}
export interface CharacteristicModel
  extends Model<CharacteristicAttributes, CharacteristicCreationAttributes>,
    CharacteristicAttributes {}

interface TemplateAttributes {
  id: number;
  characteristics: string;
}
interface TemplateCreationAttibutes
  extends Optional<TemplateAttributes, "id"> {}
export interface TemplateModel
  extends Model<TemplateAttributes, TemplateCreationAttibutes>,
    TemplateAttributes {}
