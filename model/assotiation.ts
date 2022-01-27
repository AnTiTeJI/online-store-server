import { Product, Preference, Category, Characteristic, Template, Image } from "./product.model";
import { User, UserDetails, Token, Basket } from "./user.model";

User.hasOne(UserDetails);
UserDetails.belongsTo(User);

User.hasOne(Token);
Token.belongsTo(User);

User.hasOne(Basket);
Basket.belongsTo(User);


Basket.belongsToMany(Product, { through: "BasketProduct" });
Product.belongsToMany(Basket, { through: "BasketProduct" });

Product.belongsToMany(Image, { through: "ProductImage" });
Image.belongsToMany(Product, { through: "ProductImage" });

Product.hasOne(Preference);
Preference.belongsTo(Product);

Product.belongsToMany(Category, { through: "ProductCategory" });
Category.belongsToMany(Product, { through: "ProductCategory" });

Category.hasMany(Category, { foreignKey: "ParentId", as: "Child", onDelete: "CASCADE" });

Category.belongsToMany(Image, { through: "CategoryImage" });
Image.belongsToMany(Category, { through: "CategoryImage" });

Product.belongsToMany(Characteristic, { through: "ProductCharacteristic" });
Characteristic.belongsToMany(Product, { through: "ProductCharacteristic" });


Category.hasOne(Template);
Template.belongsTo(Category);
