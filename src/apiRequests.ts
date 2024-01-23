import type { BackupCompression, ICustomServerPermission, PanelTheme } from "./types";

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

export interface ICreateApiKeyRequest {
    name: string;
    isAdmin: boolean;
    hasAccessToAllServers: boolean;
    customServerPermissions: Record<string, Partial<ICustomServerPermission>>;
}

export interface IEditPanelSettingsRequest {
    panelTheme: PanelTheme,
    serverRefreshRate: number,
    consoleRefreshRate: number,
    amountOfConsoleLines: number,
    enableAutomaticConsoleScrolling: boolean,
    enableConsoleChatMode: boolean,
    enableDebugging: boolean
}

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

export interface ICreateBackupRequest {
    name: string;
    destination: string;
    suspend: boolean;
    deleteOldBackups: boolean;
    compression: BackupCompression;
    runBackupAfterCreation: boolean;
    fileBlacklist: any;
    folderBlacklist: any;
}

export interface ICreateSchedulerTaskRequest {
    name: string;
    enabled: boolean;
    playerRequirement: number
    timing: object
    job: object
}

export interface IUpdateSchedulerTaskRequest extends ICreateSchedulerTaskRequest { }
