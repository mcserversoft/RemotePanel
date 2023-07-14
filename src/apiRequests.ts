import type { ICustomServerPermission } from "./types";

export interface ICreateUserRequest {
    username: string;
    password: string;
    passwordRepeat: string;
    enabled: boolean;
    isAdmin: boolean;

    customServerPermissions: Record<string, Partial<ICustomServerPermission>>;
}
