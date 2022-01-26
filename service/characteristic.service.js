const { Characteristic } = require("../model/product.model")

class CharacteristicService {
    async addCharacteristics(product, characteristics) {
        for (let ch of characteristics) {
            const chDb = await Characteristic.findOne({ where: { name: ch.name, value: ch.value } })
            if (chDb)
                await product.addCharacteristic(chDb)
            else
                await product.createCharacteristic({ name: ch.name, value: ch.value })
        }
    }
}

module.exports = new CharacteristicService()