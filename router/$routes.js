const userRoutes = {
    login: '/login',
    logout: '/logout',
    refresh: '/refresh',
    registration: '/registration',

    getUserDetails: '/user',
    changeUserDetails: '/user/change',
    changeUserPassword: '/user/password',

    addRoles: '/id:id/roles/add',
    removeRoles: '/id:id/roles/remove',
    resetOfRefleshRoles: '/id:id/roles/reflesh',

    basket: '/basket',
    buyProductsFromBasket: '/basket/buy',
    addProductToBasket: '/basket/pr:id/add',
    removeProductFromBasket: '/basket/pr:id/remove'

}
const productRoutes = {
    getProducts: '/all',
    getProduct: '/pr:id',
    createProduct: '/create',
    getProductImages: '/pr:id/images',
    addProductImages: '/pr:id/images/add',

}
const categoryRoutes = {
    getCategories: "/all",
    getChildCategories: "/:name",

    createCategories: "/create",
    createChildCategories: "/:name/create",

    getTemplate: '/:name/template',
    createTemplate: '/:name/template/create'

}
module.exports = {
    userRoutes,
    productRoutes,
    categoryRoutes
}