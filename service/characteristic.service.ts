import { Characteristic } from "../model/product.model";
import { CharacteristicModel, ProductModel } from "../model/product.types";
import { ICharacteristic } from "./$types";

class CharacteristicService {
    async addCharacteristics(product: ProductModel, characteristics: ICharacteristic[]): Promise<void> {
        for (let ch of characteristics) {
            const chDb: CharacteristicModel | null = await Characteristic.findOne({ where: { name: ch.name, value: ch.value } });
            if (chDb)
                await product.addCharacteristic(chDb);
            else
                await product.createCharacteristic({ name: ch.name, value: ch.value });
        }
    }
}
export default new CharacteristicService();