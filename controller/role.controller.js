class RoleController {
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

module.exports = new RoleController()