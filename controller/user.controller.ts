import { NextFunction, Request, Response } from "express";
import UserDetailDto from "../dto/user.dto";
import ApiError from "../error/ApiError";
import { UserModel } from "../model/user.types";
import { ITokens, UserDetails } from "../service/$types";
import tokenService from "../service/token.service";
import userService from "../service/user.service";
import { UserBody } from "./$types";

class UserController {
  async registration(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = req.body as UserBody;
      await userService.findUserByEmail(email).then((user) => {
        if (user) throw ApiError.badRequest("User is registrated");
      });
      const user: UserModel = await userService.registration(email, password);

      await user.createUserDetail();
      await user.createBasket();

      const tokens: ITokens = await tokenService.generateAndSaveToken(
        {
          id: user.id,
        },
        user
      );

      res
        .status(201)
        .cookie("token", tokens.refreshToken, {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 1000 * 14,
        })
        .json({
          access: tokens.accessToken,
        });
    } catch (error) {
      next(error);
    }
  }
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body as UserBody;
      const user: UserModel | null = await userService.findUserByEmail(email);

      if (!user) throw ApiError.badRequest("Invalid email or password");

      if (!(await userService.login(password, user.password)))
        throw ApiError.badRequest("Invalid email or password");

      const tokens: ITokens = await tokenService.generateAndSaveToken(
        {
          id: user.id,
        },
        user
      );

      res
        .status(200)
        .cookie("token", tokens.refreshToken, {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 1000 * 14,
        })
        .json({
          access: tokens.accessToken,
        });
    } catch (error) {
      next(error);
    }
  }
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).clearCookie("token").json({ msg: "Success" });
    } catch (error) {
      next(error);
    }
  }
  async refresh(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const token: string = req.cookies.token;
      if (!token) throw ApiError.unathorized();
      const user: UserModel = await userService.refresh(token);

      const tokens: ITokens = await tokenService.generateAndSaveToken(
        {
          id: user.id,
        },
        user
      );

      res
        .status(200)
        .cookie("token", tokens.refreshToken, {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 1000 * 14,
        })
        .json({
          access: tokens.accessToken,
        });
    } catch (error) {
      next(error);
    }
  }
  async getUserDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user: UserModel = await userService.findUserByTokenId(
        req.headers.authorization
      );
      res.status(200).json({
        email: user.email,
        roles: JSON.parse(user.roles),
        ...new UserDetailDto(await user.getUserDetail()),
      } as UserDetails);
    } catch (error) {
      next(error);
    }
  }
  async changeUserDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log("Change user details");
      const user: UserModel = await userService.findUserByTokenId(
        req.headers.authorization
      );
      const newUser: UserModel = await userService.changeUserDetails(
        user,
        req.body
      );
      res.status(200).json({
        email: newUser.email,
        ...new UserDetailDto(await newUser.getUserDetail()),
      } as UserDetails);
    } catch (error) {
      next(error);
    }
  }
  async changeUserPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user: UserModel = await userService.findUserByTokenId(
        req.headers.authorization
      );
      await userService.changeUserPassword(user, req.body);
      res.status(200).json({ msg: "Success" });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
