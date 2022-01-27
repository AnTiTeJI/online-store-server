const jwt = require("jsonwebtoken")
const ApiError = require("../error/ApiError")
const { RolePermissions, Permissions } = require("../roles")
const tokenService = require("../service/token.service")
const userService = require("../service/user.service")



function CheckRole(permissions) {
    return async function RoleMiddleware(req, res, next) {
        try {
            const auth = req.headers.authorization
            if (!auth)
                throw ApiError.forbidden()
            const token = auth.split(' ')[1]
            if (!tokenService.validateAccessToken(token))
                throw ApiError.unathorized()

            if (permissions) {
                const roles = await userService.findUserById(jwt.decode(token).id)
                    .then(user => JSON.parse(user.roles))
                    .catch(() => { throw ApiError.forbidden() })

                let userPermission = []
                for (let role of roles)
                    userPermission = userPermission.concat(RolePermissions[role].permissions)
                userPermission = Array.from(new Set(userPermission))

                if (userPermission.includes('all'))
                    return next()
                for (pr of permissions)
                    if (!userPermission.includes(pr))
                        throw ApiError.forbidden('Not enough rights')
            }
            next()
        } catch (error) {
            next(error)
        }
    }
}
module.exports = CheckRole
