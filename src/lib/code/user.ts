import type { PanelTheme } from "./panel";
import type { ICustomServerPermission, ServerAccessDetails } from "./permissions";

//TODO merge panelUser and user

export interface IPanelUser {
    userId: string;
    username: string;
    enabled: boolean;
    isAdmin: boolean;
    createdAt: Date;
    lastModifiedAt: Date;
    serverAccessDetails: ServerAccessDetails;
}

export interface INewPanelUser {
    username: string;
    password: string;
    passwordRepeat: string;
    enabled: boolean;
    isAdmin: boolean;
    serverAccessDetails: ServerAccessDetails;
}

export interface IEditPanelUser extends Omit<INewPanelUser, 'username'> {
    userId: string;
}

/* User Account */
export interface IEditUserAccount {
    password: string;
    newPassword: string;
    newPasswordRepeat: string;
}

export interface IDeleteUserAccount {
    password: string;
    confirm: boolean
}


/* API */
export interface ICreateUserRequest {
    username: string;
    password: string;
    passwordRepeat: string;
    enabled: boolean;
    isAdmin: boolean;
    hasAccessToAllServers: boolean;
    customServerPermissions: Record<string, Partial<ICustomServerPermission>>;
}

export interface IUpdateUserRequest extends Omit<ICreateUserRequest, 'username' | 'password' | 'passwordRepeat'> {
    password?: string;
    passwordRepeat?: string;
};


export interface IUserAvatarRequest {
    image: string,
}

export interface IUpdateUserAccountRequest {
    password: string,
    newPassword: string,
    newPasswordRepeat: string,
}

export interface IDeleteUserAccountRequest {
    password: string,
    delete: boolean,
}

export interface IGetUserDetailsResponse {
    userId: string;
    username: string;
    enabled: boolean;
    isAdmin: boolean;
    hasAccessToAllServers: boolean;
    createdAt: Date;
    lastModifiedAt: Date;
    customServerPermissions: Record<string, Partial<ICustomServerPermission>>;
}

export interface IGetUsersListResponse extends Array<IGetUserDetailsResponse> { }

export interface IGetPanelUserSettingsResponse {
    panelTheme: PanelTheme,
    serverRefreshRate: number,
    consoleRefreshRate: number,
    amountOfConsoleLines: number,
    enableAutomaticConsoleScrolling: boolean,
    enableConsoleChatMode: boolean,
    enableDebugging: boolean
    lastModifiedAt: Date
}
