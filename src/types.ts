import type { Permission } from '$lib/code/permissions';

export class Server implements IServer {
    serverId = "";
    name = "";
    description = "";
    type = "";
    status = 0;
    creationDate = new Date();
    serverPermissions = new Array<Permission>();
}



export interface IServer {
    serverId: string;
    name: string;
    description: string;
    type: string;
    status: number;
    serverPermissions: Permission[];
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

/**** NEW START ****/
// start of the final approved/refactored code

export enum McssSettingsSection {
    InvalidOrEmpty,
    All,
    Backups,
}

/* Panel */
export enum Page {
    Empty,
    About,
    Account,
    Backups,
    BackupsCreate,
    BackupsEdit,
    BackupHistory,
    BackupSettings,
    Console,
    Dashboard,
    ServerEdit,
    Servers,
    Settings,
    Users,
    UsersCreate,
    UsersEdit,
    Scheduler,
    SchedulerTaskCreate,
    SchedulerTaskEdit,
    SchedulerHistory,
    ApiKeysOverview,
    ApiKeysCreate
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
    Info
}

/* User */
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

export interface IEditPanelSettings extends Omit<IPanelSettings, 'lastModifiedAt'> { }

/* API Key */
export interface IApiKey {
    apiKeyId: string;
    name: string;
    isAdmin: boolean;
    hasAccessToAllServers: boolean;
    createdAt: Date;
    serverAccessDetails: ServerAccessDetails;
}

export interface INewApiKey {
    name: string;
    isAdmin: boolean;
    hasAccessToAllServers: boolean;
    serverAccessDetails: ServerAccessDetails;
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

/* User Permissions */
export class ServerAccessDetails {
    hasAccessToAllServers = false;
    serverPermissions = new Array<ServerPermissions>();

    init(hasAccessToAllServers: boolean, customServerPermissions: Record<string, Partial<ICustomServerPermission>>) {
        this.hasAccessToAllServers = hasAccessToAllServers;

        Object.entries(customServerPermissions).forEach((perm) => {
            this.serverPermissions.push({
                serverId: perm[0],
                permissions: {
                    viewStats: perm[1]?.viewStats ?? false,
                    viewConsole: perm[1]?.viewConsole ?? false,
                    useConsole: perm[1]?.useConsole ?? false,
                    useServerActions: perm[1]?.useServerActions ?? false,
                    editServer: perm[1]?.editServer ?? false,
                    viewBackups: perm[1]?.viewBackups ?? false,
                    createBackup: perm[1]?.createBackup ?? false,
                    editBackup: perm[1]?.editBackup ?? false,
                    deleteBackups: perm[1]?.deleteBackups ?? false,
                    triggerBackup: perm[1]?.triggerBackup ?? false,
                }
            })
        });
    }

    update(serverSelection: string[], permissionSelection: string[], hasAccessToAllServers: boolean) {
        // reset existing 
        this.serverPermissions = []
        hasAccessToAllServers = hasAccessToAllServers;

        serverSelection.forEach(serverId => {
            let permissions = permissionSelection.filter(s => s.includes(serverId))

            this.serverPermissions.push({
                serverId: serverId,
                permissions: {
                    viewStats: permissions.some(s => s.includes("viewStats")) ?? false,
                    viewConsole: permissions.some(s => s.includes("viewConsole")) ?? false,
                    useConsole: permissions.some(s => s.includes("useConsole")) ?? false,
                    useServerActions: permissions.some(s => s.includes("useServerActions")) ?? false,
                    editServer: permissions.some(s => s.includes("editServer")) ?? false,
                    viewBackups: permissions.some(s => s.includes("viewBackups")) ?? false,
                    createBackup: permissions.some(s => s.includes("createBackup")) ?? false,
                    editBackup: permissions.some(s => s.includes("editBackup")) ?? false,
                    deleteBackups: permissions.some(s => s.includes("deleteBackups")) ?? false,
                    triggerBackup: permissions.some(s => s.includes("triggerBackup")) ?? false,
                }
            })
        });
    }

    getCustomServerCount() {
        return this.serverPermissions?.length;
    }

    getServerIds() {
        return this.serverPermissions.map(perm => perm.serverId);
    }

    getServerPermissionIds() {
        const truePermissions = [];

        for (const permission of this.serverPermissions) {
            const { serverId, permissions }: any = permission;
            const trueKeys = Object.keys(permissions).filter(key => permissions[key] == true);

            const formattedPermissions = trueKeys.map(key => `${serverId}-${key}`);
            truePermissions.push(...formattedPermissions);
        }

        return truePermissions;
    }
}

export class ServerPermissions {
    serverId = "";
    permissions = new Permissions;
}

export class Permissions {
    viewStats = false;
    viewConsole = false;
    useConsole = false;
    useServerActions = false;
    editServer = false;
    viewBackups = false;
    createBackup = false;
    editBackup = false;
    deleteBackups = false;
    triggerBackup = false;
}

export interface ICustomServerPermission {
    viewStats: boolean;
    viewConsole: boolean;
    useConsole: boolean;
    useServerActions: boolean;
    editServer: boolean;
    viewBackups: boolean;
    createBackup: boolean;
    editBackup: boolean;
    deleteBackups: boolean;
    triggerBackup: boolean;
}

/* Backups */
export interface Backup {
    backupId: string;
    name: string;
    destination: string;
    suspend: boolean;
    deleteOldBackups: boolean;
    compression: BackupCompression;
    lastStatus: BackupStatus;
    fileBlacklist: string[];
    folderBlacklist: string[];
    completedAt: Date;
}

export interface IBackupStats {
    scheduled: number;
    completed: number;
    canceled: number;
    failed: number;
}

export interface IBackupDetails {
    backupId: string;
    name: string;
    destination: string;
    suspend: boolean;
    deleteOldBackups: boolean;
    compression: BackupCompression;
    lastStatus: BackupStatus;
    completedAt: Date;
    fileBlacklist: string[];
    folderBlacklist: string[];
}

export interface INewBackup {
    name: string;
    destination: string;
    suspend: boolean;
    deleteOldBackups: boolean;
    compression: BackupCompression;
    runBackupAfterCreation: boolean;
    fileBlacklist: string[];
    folderBlacklist: string[];
}

export interface IEditBackup extends Omit<INewBackup, 'runBackupAfterCreation'> { }

export interface BackupHistory {
    destination: string;
    lastRun: Date;
    logMessage: string;
    name: string;
    status: BackupStatus;
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

export class BackupFilterListDetails {
    fileBlacklist: string[] = [];
    folderBlacklist: string[] = [];

    init(fileBlacklist: string[], folderBlacklist: string[]) {
        this.fileBlacklist = fileBlacklist;
        this.folderBlacklist = folderBlacklist;
    }

    update(fileBlacklist: string[], folderBlacklist: string[]) {
        this.fileBlacklist = fileBlacklist
        this.folderBlacklist = folderBlacklist
    }

    getCount() {
        let count = this.fileBlacklist?.length + this.folderBlacklist?.length;
        if (!count) {
            return 0;
        }

        return count;
    }
}
