const UserDetailDto = require('../dto/user.dto')
const UserDto = require('../dto/user.dto')
const ApiError = require("../error/ApiError")
const roleService = require('../service/role.service')
const tokenService = require('../service/token.service')
const userService = require("../service/user.service")

class UserController {
    async registration(req, res, next) {
        try {
            const { email, password } = req.body
            const { name, lastname, adress, phoneNumber } = req.body
            await userService.findUserByEmail(email)
                .then(user => {
                    if (user)
                        throw ApiError.badRequest('User is registrated')
                })
            const user = await userService.registration(email, password)

            await user.createUserDetail()
            await user.createBasket()

            const tokens = await tokenService.generateAndSaveToken({
                id: user.id
            }, user)


            return res
                .status(201)
                .cookie('token', tokens.refreshToken, {
                    httpOnly: true,
                    maxAge: 60 * 60 * 24 * 1000 * 14
                })
                .json({
                    access: tokens.accessToken
                })
        } catch (error) {
            next(error)
        }
    }
    async login(req, res, next) {
        try {
            const { email, password } = req.body
            const user = await userService.findUserByEmail(email)

            if (!user)
                throw ApiError.badRequest('Invalid email or password')

            if (!userService.login(user.password, password))
                throw ApiError.badRequest('Invalid email or password')

            const tokens = await tokenService.generateAndSaveToken({
                id: user.id
            }, user)

            return res.status(200)
                .cookie('token', tokens.refreshToken, {
                    httpOnly: true,
                    maxAge: 60 * 60 * 24 * 1000 * 14
                })
                .json({
                    access: tokens.accessToken
                })
        } catch (error) {
            next(error)
        }
    }
    async logout(req, res, next) {
        try {
            return res.status(200)
                .clearCookie('token').json({ msg: 'Success' })
        } catch (error) {
            next(error)
        }
    }
    async refresh(req, res, next) {
        try {
            const token = req.cookies.token
            if (!token)
                throw ApiError.unathorized()
            const user = await userService.refresh(token)

            const tokens = await tokenService.generateAndSaveToken({
                id: user.id
            }, user)

            return res.status(200)
                .cookie('token', tokens.refreshToken, {
                    httpOnly: true,
                    maxAge: 60 * 60 * 24 * 1000 * 14
                })
                .json({
                    access: tokens.accessToken
                })
        } catch (error) {
            next(error)
        }
    }
    async getUserDetails(req, res, next) {
        try {
            const user = await userService.findUserByTokenId(req.headers.authorization)
            return res.status(200).json({
                email: user.email,
                roles: JSON.parse(await user.roles),
                ...new UserDetailDto(await user.getUserDetail())
            })
        } catch (error) {
            next(error)
        }
    }
    async changeUserDetails(req, res, next) {
        try {
            const user = await userService.findUserByTokenId(req.headers.authorization)
            const newUser = await userService.changeUserDetails(user, req.body)
            return res.status(200).json({
                email: newUser.email,
                ...new UserDetailDto(await newUser.getUserDetail())
            })
        }
        catch (error) {
            next(error)
        }
    }
    async changeUserPassword(req, res, next) {
        try {
            const user = await userService.findUserByTokenId(req.headers.authorization)
            await userService.changeUserPassword(req.body)
            return res.status(200).json({ msg: 'Success' })
        }
        catch (error) {
            next(error)
        }
    }
    async ResetOfRefleshRoles(req, res, next) {
        try {
            const owner = await userService.findUserByTokenId(req.headers.authorization)
            const user = await userService.findUserById(req.params.id)

            if (await roleService.CheckRightOwner(owner, user, req.body.roles)) {
                if (req.body.roles) {
                    await roleService.SetUserRoles(user, roles)
                }
                else await roleService.ResetUserRoles(user)
            }
            return res.status(200).json({ msg: 'Success' })
        } catch (error) {
            next(error)
        }
    }
    async AddRoles(req, res, next) {
        try {
            const owner = await userService.findUserByTokenId(req.headers.authorization)
            const user = await userService.findUserById(req.params.id)

            if (await roleService.CheckRightOwner(owner, user, req.body.roles))
                await roleService.SetUserRoles(user, req.body.roles)
            else throw ApiError.forbidden()

            return res.status(200).json({ msg: 'Success' })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new UserController()