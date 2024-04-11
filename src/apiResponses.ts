import type { PanelTheme } from "$lib/code/panel";
import type { ICustomServerPermission } from "./types";

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
