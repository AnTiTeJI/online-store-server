import ApiError from "../error/ApiError";
import { UserModel } from "../model/user.types";
import { RolePermissions } from "../roles";

class RoleService {
    async CheckRightOwner(owner: UserModel, user: UserModel, roles: string[] = []): Promise<boolean> {
        const ownerRoles = this.GetUserRoles(owner);
        const userRoles = this.GetUserRoles(user);

        let ownRating = 100, userRating = 100;
        for (let role of RolePermissions) {
            if (ownerRoles.includes(role.role) && ownRating > role.rating)
                ownRating = role.rating;
        }
        for (let role of RolePermissions) {
            if (userRoles.includes(role.role) && userRating > role.rating)
                userRating = role.rating;
        }

        if (ownRating >= userRating)
            return false;
        if (roles)
            for (let role in roles)
                if (ownRating >= RolePermissions[role].rating)
                    return false;
        return true;
    }
    async AddUserRole(user: UserModel, role: string): Promise<void> {
        let roles = JSON.parse(user.roles);
        roles.push(role);
        user.roles = JSON.stringify(roles);
        await user.save();
    }
    async SetUserRoles(user: UserModel, roles: string[]): Promise<void> {
        user.roles = JSON.stringify(roles);
        await user.save();
    }
    async ResetUserRoles(user: UserModel): Promise<void> {
        user.roles = "Buyer";
        await user.save();
    }
    async RemoveUserRole(user: UserModel, role: string): Promise<void> {
        let roles = JSON.parse(user.roles);
        if (!roles.includes(role))
            throw ApiError.badRequest("The user does`nt have a current role");
        user.roles = JSON.stringify(roles.filter((rl: string) => rl != role));
        await user.save();
    }
    GetUserRoles(user: UserModel): string[] {
        return JSON.parse(user.roles);
    }

}

export default new RoleService();