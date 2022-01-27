import { NextFunction, Request, Response } from "express";
import UserDetailDto from "../dto/user.dto";
import ApiError from "../error/ApiError";
import tokenService from "../service/token.service";
import userService from "../service/user.service";

class UserController {
    async registration(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            await userService.findUserByEmail(email)
                .then(user => {
                    if (user)
                        throw ApiError.badRequest("User is registrated");
                });
            const user = await userService.registration(email, password);

            await user.createUserDetails();
            await user.createBasket();

            const tokens = await tokenService.generateAndSaveToken({
                id: user.id
            }, user);


            return res
                .status(201)
                .cookie("token", tokens.refreshToken, {
                    httpOnly: true,
                    maxAge: 60 * 60 * 24 * 1000 * 14
                })
                .json({
                    access: tokens.accessToken
                });
        } catch (error) {
            next(error);
        }
    }
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("Console");
            const { email, password } = req.body;
            const user = await userService.findUserByEmail(email);

            if (!user)
                throw ApiError.badRequest("Invalid email or password");

            if (!await userService.login(password, user.password))
                throw ApiError.badRequest("Invalid email or password");

            const tokens = await tokenService.generateAndSaveToken({
                id: user.id
            }, user);

            return res.status(200)
                .cookie("token", tokens.refreshToken, {
                    httpOnly: true,
                    maxAge: 60 * 60 * 24 * 1000 * 14
                })
                .json({
                    access: tokens.accessToken
                });
        } catch (error) {
            next(error);
        }
    }
    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            return res.status(200)
                .clearCookie("token").json({ msg: "Success" });
        } catch (error) {
            next(error);
        }
    }
    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.cookies.token;
            if (!token)
                throw ApiError.unathorized();
            const user = await userService.refresh(token);

            const tokens = await tokenService.generateAndSaveToken({
                id: user.id
            }, user);

            return res.status(200)
                .cookie("token", tokens.refreshToken, {
                    httpOnly: true,
                    maxAge: 60 * 60 * 24 * 1000 * 14
                })
                .json({
                    access: tokens.accessToken
                });
        } catch (error) {
            next(error);
        }
    }
    async getUserDetails(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await userService.findUserByTokenId(req.headers.authorization);
            return res.status(200).json({
                email: user.email,
                roles: JSON.parse(user.roles),
                ...new UserDetailDto(await user.getUserDetails())
            });
        } catch (error) {
            next(error);
        }
    }
    async changeUserDetails(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("Change user details");
            const user = await userService.findUserByTokenId(req.headers.authorization);
            const newUser = await userService.changeUserDetails(user, req.body);
            return res.status(200).json({
                email: newUser.email,
                ...new UserDetailDto(await newUser.getUserDetails())
            });
        }
        catch (error) {
            next(error);
        }
    }
    async changeUserPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await userService.findUserByTokenId(req.headers.authorization);
            await userService.changeUserPassword(user, req.body);
            return res.status(200).json({ msg: "Success" });
        }
        catch (error) {
            next(error);
        }
    }
}

export = new UserController();