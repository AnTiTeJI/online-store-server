class ProductDto {
    constructor(model) {
        this.id = model.id
        this.name = model.name
        this.price = model.price
        this.count = model.count
        this.discount = model.discount
        this.description = model.description
    }
}

module.exports = ProductDto