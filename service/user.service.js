const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const ApiError = require("../error/ApiError");
const { User } = require("../model/user.model");
const { RolePermissions } = require('../roles');
const tokenService = require('./token.service');

class UserService {
    async findUserById(id) {
        const user = await User.findByPk(id)
        if (!user)
            throw ApiError.badRequest('User not found')
        return user
    }
    async findUserByEmail(email) {
        return await User.findOne({ where: { email } })
    }
    async findUserByTokenId(auth) {
        const token = auth.split(' ')[1]
        if (!token)
            throw ApiError.unathorized()

        return await this.findUserById(jwt.decode(token).id)
    }
    async registration(email, password) {
        const hash = await bcrypt.hash(password, 7)
        return await User.create({ email, password: hash, roles: `["${RolePermissions.Buyer.role}"]` })
    }
    async login(password, hash) {
        return await bcrypt.compare(password, hash)
    }
    async refresh(token) {
        const user = await this.findUserById(jwt.decode(token).id)
        if (!user)
            throw ApiError.unathorized()
        if (!tokenService.validateRefreshToken(token))
            throw ApiError.unathorized()
        return user
    }
    async changeUserDetails(user, body) {
        const userDetail = await user.getUserDetail()

        if (body.email && user.email != body.email) {
            user.email = body.email
        }

        if (body.name && userDetail.name != body.name) {
            userDetail.name = body.name

        }


        if (body.lastname && userDetail.lastname != body.lastname)
            userDetail.lastname = body.lastname

        if (body.phoneNumber && userDetail.phoneNumber != body.phoneNumber)
            userDetail.phoneNumber = body.phoneNumber

        if (body.adress && userDetail.adress != body.adress)
            userDetail.adress = body.adress

        await userDetail.save()
        return await user.save()
    }
    async changeUserPassword(user, body) {
        console.log(body)
        if (body.newPassword && body.currentPassword) {
            if (await bcrypt.compare(body.currentPassword, user.password)) {
                const hash = await bcrypt.hash(body.newPassword, 8)
                user.password = hash
                user.save()
            }
        } else throw ApiError.forbidden()
    }
}

module.exports = new UserService()