const { DataTypes } = require('sequelize')
const sequelize = require('../database')


const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING, unique: true },
    roles: { type: DataTypes.TEXT },
    password: { type: DataTypes.STRING }
})

const UserDetail = sequelize.define('UserDetail', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: true },
    lastname: { type: DataTypes.STRING, allowNull: true },
    adress: { type: DataTypes.STRING },
    phoneNumber: { type: DataTypes.STRING }
})

const Token = sequelize.define('Token', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    refresh: { type: DataTypes.TEXT, defaultValue: '' }
})

const Basket = sequelize.define('Basket', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
})

module.exports = {
    User,
    UserDetail,
    Token,
    Basket
}