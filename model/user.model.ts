import {
  BasketModel,
  TokenModel,
  UserDetailsModel,
  UserModel,
} from "./user.types";
import { DataTypes } from "sequelize";
import sequelize from "../database";

export const User = sequelize.define<UserModel>("User", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING, unique: true },
  roles: { type: DataTypes.TEXT },
  password: { type: DataTypes.STRING },
});

export const UserDetails = sequelize.define<UserDetailsModel>("UserDetail", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: true },
  lastname: { type: DataTypes.STRING, allowNull: true },
  adress: { type: DataTypes.STRING },
  phoneNumber: { type: DataTypes.STRING },
});

export const Token = sequelize.define<TokenModel>("Token", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  refresh: { type: DataTypes.TEXT, defaultValue: "" },
});

export const Basket = sequelize.define<BasketModel>("Basket", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
});
