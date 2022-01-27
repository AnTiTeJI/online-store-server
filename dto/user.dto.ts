import { UserDetailsModel } from "../model/user.types";

class UserDetailDto {
    name: string
    lastname: string
    phoneNumber: string
    adress: string
    constructor(model: UserDetailsModel) {
        this.name = model.name,
            this.lastname = model.lastname,
            this.phoneNumber = model.phoneNumber,
            this.adress = model.adress;
    }
}


export default UserDetailDto;