import type { ICustomServerPermission } from "./types";

export interface ICreateUserRequest {
    username: string;
    password: string;
    passwordRepeat: string;
    enabled: boolean;
    isAdmin: boolean;
    customServerPermissions: Record<string, Partial<ICustomServerPermission>>;
}

export interface IUpdateUserRequest extends Omit<ICreateUserRequest, 'username' | 'password' | 'passwordRepeat'> {
    password?: string;
    passwordRepeat?: string;
};