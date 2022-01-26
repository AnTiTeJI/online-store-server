const Permissions = {
    createProduct: 'createProduct',
    deleteProduct: 'deleteProduct',
    countProductEdit: 'countProductEdit',

    createCategory: 'createCategory',
    deleteCategory: 'deleteCategory',

    createTemplate: 'createTemplate',
    deleteTemplate: 'deleteTemplate',
    getTemplate: 'getTemplate',

    editRole: 'editRole',

    editBasket: 'editBasket'
}
const RolePermissions = {
    Owner: {
        role: 'Owner',
        rating: 1,
        permissions: ['all']
    },
    Admin: {
        role: 'Admin',
        rating: 2,
        permissions: ['all']
    },
    Manager: {
        role: 'Manager',
        rating: 3,
        permissions: [
            Permissions.createCategory,
            Permissions.deleteCategory,
            Permissions.createTemplate,
            Permissions.deleteTemplate,
            Permissions.getTemplate,
            Permissions.editRole
        ]
    },
    Suplier: {
        role: 'Suplier',
        rating: 4,
        permissions: [
            Permissions.countProductEdit
        ]
    },
    Seller: {
        role: 'Seller',
        rating: 4,
        permissions: [
            Permissions.createProduct,
            Permissions.deleteProduct
        ]
    },
    Buyer: {
        role: 'Buyer',
        rating: 5,
        permissions: [
            Permissions.editBasket
        ]
    }
}

module.exports = {
    Permissions,
    RolePermissions
}