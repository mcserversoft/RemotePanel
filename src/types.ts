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
    UsersEdit
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

/**** NEW START ****/
// start of the final approved/refactored code

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
                }
            })
        });
    }

    update(serverSelection: string[], permissionSelection: string[]) {
        // reset existing 
        this.serverPermissions = []

        serverSelection.forEach(serverId => {
            let permissions = permissionSelection.filter(s => s.includes(serverId))

            this.serverPermissions.push({
                serverId: serverId,
                permissions: {
                    viewStats: permissions.some(s => s.includes("viewStats")) ?? false,
                    viewConsole: permissions.some(s => s.includes("viewConsole")) ?? false,
                    useConsole: permissions.some(s => s.includes("useConsole")) ?? false,
                    useServerActions: permissions.some(s => s.includes("useServerActions")) ?? false,
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
}

export interface ICustomServerPermission {
    viewStats: boolean;
    viewConsole: boolean;
    useConsole: boolean;
    useServerActions: boolean;
}

// beyond this code block ends the final approved/refactored code
/**** END NEW ****/

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
