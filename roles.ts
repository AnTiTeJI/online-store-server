export const CustomPermissions = {
    createProduct: "createProduct",
    deleteProduct: "deleteProduct",
    countProductEdit: "countProductEdit",

    createCategory: "createCategory",
    deleteCategory: "deleteCategory",

    createTemplate: "createTemplate",
    deleteTemplate: "deleteTemplate",
    getTemplate: "getTemplate",

    editRole: "editRole",

    editBasket: "editBasket"
};
interface Role {
    role: string,
    rating: number,
    permissions: string[]
}
export const RolePermissions: Role[] = [
    {
        role: "Owner",
        rating: 1,
        permissions: ["all"]
    },
    {
        role: "Admin",
        rating: 2,
        permissions: ["all"]
    },
    {
        role: "Manager",
        rating: 3,
        permissions: [
            CustomPermissions.createCategory,
            CustomPermissions.deleteCategory,
            CustomPermissions.createTemplate,
            CustomPermissions.deleteTemplate,
            CustomPermissions.getTemplate,
            CustomPermissions.editRole
        ]
    },
    {
        role: "Suplier",
        rating: 4,
        permissions: [
            CustomPermissions.countProductEdit
        ]
    },
    {
        role: "Seller",
        rating: 4,
        permissions: [
            CustomPermissions.createProduct,
            CustomPermissions.deleteProduct
        ]
    },
    {
        role: "Buyer",
        rating: 5,
        permissions: [
            CustomPermissions.editBasket
        ]
    }
];
