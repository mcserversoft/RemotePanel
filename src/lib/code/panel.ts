import type { Page } from "./routing";


export interface PageReference {
    name: string;
    page: Page;
    isActive: boolean;
    hasPermission: boolean;
}

export interface BreadcrumbItem {
    name: string;
    page: Page;
    isClickable: boolean;
}

export enum PanelTheme {
    Dark,
    Light,
    System
}

export interface IPanelSettings {
    panelTheme: PanelTheme,
    serverRefreshRate: number,
    consoleRefreshRate: number,
    amountOfConsoleLines: number,
    enableAutomaticConsoleScrolling: boolean,
    enableConsoleChatMode: boolean,
    enableDebugging: boolean
    lastModifiedAt: Date
}

export enum WarningType {
    Error,
    Warning,
    Permission,
    Info,
    Success
}

export interface IEditPanelSettings extends Omit<IPanelSettings, 'lastModifiedAt'> { }

/* API */
export interface IEditPanelSettingsRequest {
    panelTheme: PanelTheme,
    serverRefreshRate: number,
    consoleRefreshRate: number,
    amountOfConsoleLines: number,
    enableAutomaticConsoleScrolling: boolean,
    enableConsoleChatMode: boolean,
    enableDebugging: boolean
}
