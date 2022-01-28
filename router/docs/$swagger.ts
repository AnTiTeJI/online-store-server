import jsdoc from "swagger-jsdoc";
export const swaggerDocument = jsdoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API online store",
            version: "1.0.0",
            description: "API online store",
            contact: {
                name: "David",
                email: "dev.kris.g@gmail.com"
            }
        },
    },
    apis: [
        __dirname + "*.router.yaml",
        __dirname + "/user/*.router.yaml"]
});