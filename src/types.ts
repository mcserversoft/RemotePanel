import type { Permission } from "$lib/code/permissions";

export class Server implements IServer {
    serverId = "";
    name = "";
    description = "";
    type = "";
    status = 0;
    creationDate = new Date();
    serverPermissions = new Array<Permission>();
}

export class ServerPermission implements IServerPermission {
    viewStats = false;
    viewConsole = false;
    useConsole = false;
    useServerActions = false;
}

export interface IServer {
    serverId: string;
    name: string;
    description: string;
    type: string;
    status: number;
    serverPermissions: Permission[];
}

export interface IServerPermission {
    viewStats: boolean;
    viewConsole: boolean;
    useConsole: boolean;
    useServerActions: boolean;
}


export interface IServerSettings {
    name: string;
    description: string;
    isSetToAutoStart: boolean;
    forceSaveOnStop: boolean;
    javaAllocatedMemory: number;
    keepOnline: KeepOnline;
}


export interface Stats {
    cpu: number;
    memory: Memory;
    playersOnline: number;
    playerLimit: number;
    startDateUnix: number;
    startDate: string;
    uptime: string;
}

export interface Memory {
    current: number;
    max: number;
    free: number;
    percentageFree: number;
}

export enum Filter {
    None,
    Minimal,
    Status
}
export enum KeepOnline {
    None,
    Elevated,
    Aggressive
}

export enum ServerAction {
    Start = 2,
    Stop = 1,
    Restart = 4,
    Kill = 3
}

export enum PanelTheme {
    Light,
    Dark
}

export enum Page {
    Empty,
    About,
    Backups,
    BackupsCreate,
    Console,
    Dashboard,
    Donate,
    Servers,
    ServerEdit,
    Settings,
    Users,
    UsersCreate,
}

export interface PageReference {
    name: string;
    page: Page;
    isActive: boolean;
}

export interface BreadcrumbItem {
    name: string;
    page: Page;
    isClickable: boolean;
}

export interface PanelUser {
    userId: string;
    username: string;
    enabled: boolean;
    isAdmin: boolean;
    hasAccessToAllServers: boolean;
    customServerPermissions: Record<string, Partial<ICustomServerPermission>>;
    createdAt: Date;
    lastModifiedAt: Date;
}

export interface NewPanelUser {
    username: string;
    password: string;
    passwordRepeat: string;
    enabled: boolean;
    isAdmin: boolean;
    hasAccessToAllServers: boolean;
    customServerPermissions: Record<string, Partial<ICustomServerPermission>>;
}

export interface ICustomServerPermission {
    viewStats: boolean;
    viewConsole: boolean;
    useConsole: boolean;
    useServerActions: boolean;
}

export interface Backup {
    backupId: string;
    name: string;
    destination: string;
    suspend: boolean;
    deleteOldBackups: boolean;
    compression: BackupCompression;
    lastStatus: BackupStatus;
    fileBlacklist: any;
    folderBlacklist: any;
    completedAt: Date;
}

export enum BackupCompression {
    High,
    Low,
    None
}

export enum BackupStatus {
    NeverRun,
    InProgress,
    Completed,
    Failed,
    Canceled
}
