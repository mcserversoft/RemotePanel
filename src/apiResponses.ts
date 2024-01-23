import type { ICustomServerPermission, PanelTheme } from "./types";

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

export interface IGetApiKeyResponse {
    apiKeyId: string;
    name: string;
    isAdmin: boolean;
    hasAccessToAllServers: boolean;
    createdAt: Date;
    customServerPermissions: Record<string, Partial<ICustomServerPermission>>;
}

export interface IGetApiKeyListResponse extends Array<IGetApiKeyResponse> { }