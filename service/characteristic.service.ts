import { Characteristic } from "../model/product.model";
import { ProductModel } from "../model/product.types";

class CharacteristicService {
    async addCharacteristics(product: ProductModel, characteristics: any[]) {
        for (let ch of characteristics) {
            const chDb = await Characteristic.findOne({ where: { name: ch.name, value: ch.value } });
            if (chDb)
                await product.addCharacteristic(chDb);
            else
                await product.createCharacteristic({ name: ch.name, value: ch.value });
        }
    }
}

export = new CharacteristicService();