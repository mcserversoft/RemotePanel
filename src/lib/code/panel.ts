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

/* Helper Methods */
export function getGreeting() {
    var currentHour = new Date().getHours();

    if (currentHour < 12) {
        return "morning";
    } else if (currentHour >= 5 && currentHour < 18) {
        return "afternoon";
    } else if (currentHour >= 18 && currentHour <= 22) {
        return "evening";
    } else {
        return "hi";
    }
}

export function getFriendlyStatusName(status: number = 0) {
    if (status === 0) {
        return "Offline";
    } else if (status === 1) {
        return "Online";
    } else if (status === 2) {
        return "Restarting";
    } else if (status === 3) {
        return "Starting";
    } else if (status === 4) {
        return "Stopping";
    } else {
        return "";
    }
}

export function getStatusBgColor(status: number = 0) {
    if (status === 0) {
        return "bg-red-500 ";
    } else if (status === 1) {
        return "bg-green-500";
    } else if (status === 2) {
        return "bg-orange-500";
    } else if (status === 3) {
        return "bg-green-500 ";
    } else if (status === 4) {
        return "bg-red-500";
    } else {
        return "bg-gray-500";
    }
}

export function getStatusTextColor(status: number = 0) {
    if (status === 0) {
        return "text-red-500";
    } else if (status === 1) {
        return "text-green-500";
    } else if (status === 2) {
        return "text-orange-500";
    } else if (status === 3) {
        return "text-green-500";
    } else if (status === 4) {
        return "text-red-500";
    } else {
        return "text-gray-500";
    }
}