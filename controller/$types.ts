import { ICharacteristic } from "../service/$types";

export interface CategoryBody {
  categories: string[];
}
export interface CharacteristicBody {
  characteristics: ICharacteristic[];
}

export interface UserBody {
  email: string;
  password: string;
}
