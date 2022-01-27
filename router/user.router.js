const { Router } = require('express')
const basketController = require('../controller/basket.controller')
const roleController = require('../controller/role.controller')
const userController = require('../controller/user.controller')
const CheckRole = require('../middleware/role.middleware')
const { Permissions } = require('../roles')
const { UserValidator } = require('../validator')
const { userRoutes } = require('./$routes')

const userRouter = new Router()

userRouter.post(userRoutes.registration, UserValidator, userController.registration)
userRouter.post(userRoutes.login, userController.login)
userRouter.post(userRoutes.logout,
    CheckRole(),
    userController.logout)

userRouter.post(userRoutes.addProductToBasket,
    CheckRole(Permissions.editBasket),
    basketController.addProductToBasket)

userRouter.post(userRoutes.buyProductsFromBasket,
    CheckRole(Permissions.editBasket),
    basketController.buyProductsFromBasket)

userRouter.post(userRoutes.addRoles,
    CheckRole(Permissions.editRole),
    roleController.AddRoles)

userRouter.put(userRoutes.changeUserDetails,
    CheckRole(),
    userController.changeUserDetails)

userRouter.put(userRoutes.changeUserPassword,
    CheckRole(),
    userController.changeUserPassword)

userRouter.put(userRoutes.resetOfRefleshRoles,
    CheckRole(Permissions.editRole),
    roleController.ResetOfRefleshRoles)


userRouter.get(userRoutes.refresh,
    userController.refresh)

userRouter.get(userRoutes.getUserDetails,
    CheckRole(),
    userController.getUserDetails)

userRouter.get(userRoutes.basket,
    CheckRole(Permissions.editBasket),
    basketController.getProductsFromBasket)

userRouter.delete(userRoutes.removeProductFromBasket,
    CheckRole(Permissions.editBasket),
    basketController.removeProductFromBasket)



module.exports = userRouter