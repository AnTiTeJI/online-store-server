const { DataTypes } = require('sequelize')
const sequelize = require('../database')

const Product = sequelize.define('Product', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    price: { type: DataTypes.DOUBLE, defaultValue: 0 },
    count: { type: DataTypes.INTEGER, defaultValue: 0 },
    discount: { type: DataTypes.INTEGER, defaultValue: 0, },
    description: { type: DataTypes.TEXT, allowNull: false }
})

const Image = sequelize.define('Image', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false }
})

const Preference = sequelize.define('Preference', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    rating: { type: DataTypes.INTEGER, defaultValue: 0 },
    popular: { type: DataTypes.INTEGER, defaultValue: 0 }
})

const Category = sequelize.define('Category', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false }
})

const Characteristic = sequelize.define('Characteristic', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    value: { type: DataTypes.STRING, allowNull: false }
})


const Template = sequelize.define('Template', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    characteristics: { type: DataTypes.TEXT, allow: false }
})

module.exports = {
    Product,
    Image,
    Preference,
    Category,
    Characteristic,
    Template
}