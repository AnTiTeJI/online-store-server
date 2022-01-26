const uuid = require('uuid')
const fs = require('fs')
const path = require('path')
class ImageService {
    async addProductImage(product, image, main = false) {
        const productPath = path.join('./static/images', product.name)
        if (!fs.existsSync(productPath)) {
            fs.mkdir(productPath, err => console.log(`mkdir error\n${err}`))
        }

        if (main) {
            image.name = `main.jpg`
            const imagesDb = await product.getImages()
            fs.readdir(productPath, (err, files) => {
                for (let file of files) {
                    if (file.split('.')[0] == 'main')
                        fs.unlink(path.join(productPath, file), (err) => {
                            if (err)
                                return console.log(err)
                            image.mv(path.join(productPath, image.name))
                        })
                }
                for (let img of imagesDb)
                    if (img.name.split('.')[0] == 'main')
                        img.destroy()
            })
        } else {
            image.name = `${uuid.v4()}.jpg`
            image.mv(path.join(productPath, image.name))
        }
    }
    async getProductImages(product, main = false) {
        const imagesDb = await product.getImages()
        const images = []
        if (main)
            for (let image of imagesDb) {
                if (image.name.split('.')[0] == 'main')
                    return path.join('images', image.name)
            }
        else
            for (let image of imagesDb) {
                images.push(path.join('images', image.name))
            }
        return images
    }
    async addCategoryImage(category, image) {
        const categoryPath = path.join('./static/categories/')

        if (!fs.existsSync(categoryPath)) {
            fs.mkdir(categoryPath, err => console.log(`mkdir error\n${err}`))
        }
        image.name = `${uuid.v4()}.jpg`
        image.mv(categoryPath)

        await category.createImage({ name: image.name })
    }
    async getCategoryImage(category) {
        const categoryPath = path.join('./static/categories/')
        const image = await category.getImage()
        return path.join('categories', image.name)
    }
}

module.exports = new ImageService()