const ApiError = require("../error/ApiError")
const { RolePermissions } = require("../roles")

class RoleService {
    async CheckRightOwner(owner, user, roles = null) {
        const ownerRoles = await this.GetUserRoles(owner)
        const userRoles = await this.GetUserRoles(user)

        let ownRating = 100, userRating = 100
        for (let role of ownerRoles) {
            if (ownRating > RolePermissions[role].rating)
                ownRating = RolePermissions[role].rating
        }
        for (let role of userRoles) {
            if (userRating > RolePermissions[role].rating)
                userRating = RolePermissions[role].rating
        }

        if (ownRating >= userRating)
            return false
        if (roles)
            for (let role of roles)
                if (ownRating >= RolePermissions[role].rating)
                    return false
        return true
    }
    async AddUserRole(user, role) {
        let roles = JSON.parse(user.roles)
        roles.push(role)
        user.roles = JSON.stringify(roles)
        await user.save()
    }
    async SetUserRoles(user, roles) {
        user.roles = JSON.stringify(roles)
        await user.save()
    }
    async ResetUserRoles(user) {
        user.roles = JSON.stringify([RolePermissions.Buyer.role])
        await user.save()
    }
    async RemoveUserRole(user, role) {
        let roles = JSON.parse(user.roles)
        if (!roles.includes(role))
            throw ApiError.badRequest('The user does`nt have a current role')
        user.roles = JSON.stringify(roles.filter(rl => rl != role))
        await user.save()
    }
    GetUserRoles(user) {
        return JSON.parse(user.roles)
    }

}

module.exports = new RoleService()