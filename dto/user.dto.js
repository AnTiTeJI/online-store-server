class UserDetailDto {
    constructor(model) {
        this.name = model.name,
            this.lastname = model.lastname,
            this.phoneNumber = model.phoneNumber,
            this.adress = model.adress
    }
}


module.exports = UserDetailDto