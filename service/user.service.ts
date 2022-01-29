import bcrypt from "bcrypt";
import { decode, JwtPayload } from "jsonwebtoken";
import ApiError from "../error/ApiError";
import { User } from "../model/user.model";
import { UserModel } from "../model/user.types";
import { UserChangePassword, UserDetails } from "./$types";
import tokenService from "./token.service";

class UserService {
  async findUserById(id: number): Promise<UserModel> {
    const user = await User.findByPk(id);
    if (!user) throw ApiError.badRequest("User not found");
    return user;
  }
  async findUserByEmail(email: string): Promise<UserModel | null> {
    return await User.findOne({ where: { email } });
  }
  async findUserByTokenId(auth: string | undefined): Promise<UserModel> {
    if (typeof auth === "undefined") throw ApiError.forbidden();
    const token = auth.split(" ")[1];
    if (!token) throw ApiError.unathorized();

    return await this.findUserById((decode(token) as JwtPayload).id);
  }
  async registration(email: string, password: string): Promise<UserModel> {
    const hash = await bcrypt.hash(password, 7);
    // eslint-disable-next-line quotes
    return await User.create({ email, password: hash, roles: `["Buyer"]` });
  }
  async login(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
  async refresh(token: string): Promise<UserModel> {
    const user = await this.findUserByTokenId(token);

    if (!user) throw ApiError.unathorized();
    if (!tokenService.validateRefreshToken(token)) throw ApiError.unathorized();
    return user;
  }
  async changeUserDetails(
    user: UserModel,
    body: UserDetails
  ): Promise<UserModel> {
    const userDetails = await user.getUserDetail();

    if (body.email && user.email != body.email) {
      user.email = body.email;
    }

    if (body.name && userDetails.name != body.name) {
      userDetails.name = body.name;
    }

    if (body.lastname && userDetails.lastname != body.lastname)
      userDetails.lastname = body.lastname;

    if (body.phoneNumber && userDetails.phoneNumber != body.phoneNumber)
      userDetails.phoneNumber = body.phoneNumber;

    if (body.adress && userDetails.adress != body.adress)
      userDetails.adress = body.adress;

    await userDetails.save();
    return await user.save();
  }
  async changeUserPassword(
    user: UserModel,
    body: UserChangePassword
  ): Promise<void> {
    console.log(body);
    if (body.newPassword && body.currentPassword) {
      if (await bcrypt.compare(body.currentPassword, user.password)) {
        const hash = await bcrypt.hash(body.newPassword, 8);
        user.password = hash;
        user.save();
      }
    } else throw ApiError.forbidden();
  }
}

export default new UserService();
