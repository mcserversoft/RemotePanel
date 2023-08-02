import type { ICustomServerPermission, PanelTheme } from "./types";

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

export interface IEditPanelSettingsRequest {
    panelTheme: PanelTheme,
    serverRefreshRate: number,
    consoleRefreshRate: number,
    amountOfConsoleLines: number,
    enableAutomaticConsoleScrolling: boolean,
    enableConsoleChatMode: boolean,
    enableDebugging: boolean
}

export interface IUpdateUserAccountRequest {
    //todo avatar here? (base64)
    password: string,
    newPassword: string,
    newPasswordRepeat: string,
}

export interface IDeleteUserAccountRequest {
    password: string,
    delete: boolean,
}
