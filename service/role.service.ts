import ApiError from "../error/ApiError";
import { UserModel } from "../model/user.types";
import { RolePermissions } from "../roles";

class RoleService {
    async CheckRightOwner(owner: UserModel, user: UserModel, roles: string[] = []) {
        const ownerRoles = await this.GetUserRoles(owner);
        const userRoles = await this.GetUserRoles(user);

        let ownRating = 100, userRating = 100;
        for (let role of ownerRoles) {
            if (ownRating > RolePermissions[role].rating)
                ownRating = RolePermissions[role].rating;
        }
        for (let role of userRoles) {
            if (userRating > RolePermissions[role].rating)
                userRating = RolePermissions[role].rating;
        }

        if (ownRating >= userRating)
            return false;
        if (roles)
            for (let role in roles)
                if (ownRating >= RolePermissions[role].rating)
                    return false;
        return true;
    }
    async AddUserRole(user: UserModel, role: string) {
        let roles = JSON.parse(user.roles);
        roles.push(role);
        user.roles = JSON.stringify(roles);
        await user.save();
    }
    async SetUserRoles(user: UserModel, roles: any[]) {
        user.roles = JSON.stringify(roles);
        await user.save();
    }
    async ResetUserRoles(user: UserModel) {
        user.roles = "Buyer";
        await user.save();
    }
    async RemoveUserRole(user: UserModel, role: string) {
        let roles = JSON.parse(user.roles);
        if (!roles.includes(role))
            throw ApiError.badRequest("The user does`nt have a current role");
        user.roles = JSON.stringify(roles.filter((rl: string) => rl != role));
        await user.save();
    }
    GetUserRoles(user: UserModel) {
        return JSON.parse(user.roles);
    }

}

export = new RoleService()