import { get } from 'svelte/store';
import { servers } from '$lib/code/global';

/* TODO merge user permissions with permissions */
export enum Permission {
    viewStats = "VIEW_STATS",
    viewConsole = "VIEW_CONSOLE",
    useConsole = "USE_CONSOLE",
    useServerActions = "USE_SERVER_ACTIONS",
    editServer = "EDIT_SERVER",
    viewBackups = "VIEW_BACKUPS",
    createBackup = "CREATE_BACKUP",
    editBackup = "EDIT_BACKUP",
    deleteBackups = "DELETE_BACKUPS",
    triggerBackup = "TRIGGER_BACKUP",
    viewSchedulerTasks = "VIEW_SCHEDULER_TASKS",
    createSchedulerTask = "CREATE_SCHEDULER_TASK",
    editSchedulerTask = "EDIT_SCHEDULER_TASK",
    deleteSchedulerTasks = "DELETE_SCHEDULER_TASKS",
    triggerSchedulerTask = "TRIGGER_SCHEDULER_TASK",
}

export function hasPermission(perm: Permission, serverId?: string): boolean {
    if (serverId == undefined) {
        return false;
    }

    const server = get(servers).find((s) => s.serverId == serverId);
    if (!server) {
        return false;
    }

    return server?.serverPermissions?.includes(perm) ?? false;
}

/* user permissions*/
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
                    viewSchedulerTasks: perm[1]?.viewSchedulerTasks ?? false,
                    createSchedulerTasks: perm[1]?.createSchedulerTasks ?? false,
                    editSchedulerTask: perm[1]?.editSchedulerTask ?? false,
                    deleteSchedulerTasks: perm[1]?.deleteSchedulerTasks ?? false,
                    triggerSchedulerTask: perm[1]?.triggerSchedulerTask ?? false,
                }
            })
        });
    }

    update(serverSelection: string[], permissionSelection: string[], hasAccessToAllServers: boolean) {
        // reset existing 
        this.serverPermissions = []
        this.hasAccessToAllServers = hasAccessToAllServers;

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
                    viewSchedulerTasks: permissions.some(s => s.includes("viewSchedulerTasks")) ?? false,
                    createSchedulerTasks: permissions.some(s => s.includes("createSchedulerTasks")) ?? false,
                    editSchedulerTask: permissions.some(s => s.includes("editSchedulerTask")) ?? false,
                    deleteSchedulerTasks: permissions.some(s => s.includes("deleteSchedulerTasks")) ?? false,
                    triggerSchedulerTask: permissions.some(s => s.includes("triggerSchedulerTask")) ?? false,
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

    static UpdatePermissionTargetObject(serverAccessDetails: ServerAccessDetails, targetObject: any) {
        Object.entries(serverAccessDetails.serverPermissions).forEach((perms) => {
            targetObject.customServerPermissions[perms[1].serverId] = {
                viewStats: perms[1]?.permissions.viewStats ?? false,
                viewConsole: perms[1]?.permissions.viewConsole ?? false,
                useConsole: perms[1]?.permissions.useConsole ?? false,
                editServer: perms[1]?.permissions.editServer ?? false,
                viewBackups: perms[1]?.permissions.viewBackups ?? false,
                createBackup: perms[1]?.permissions.createBackup ?? false,
                editBackup: perms[1]?.permissions.editBackup ?? false,
                deleteBackups: perms[1]?.permissions.deleteBackups ?? false,
                triggerBackup: perms[1]?.permissions.triggerBackup ?? false,
                viewSchedulerTasks: perms[1]?.permissions.viewSchedulerTasks ?? false,
                createSchedulerTasks: perms[1]?.permissions.createSchedulerTasks ?? false,
                editSchedulerTask: perms[1]?.permissions.editSchedulerTask ?? false,
                deleteSchedulerTasks: perms[1]?.permissions.deleteSchedulerTasks ?? false,
                triggerSchedulerTask: perms[1]?.permissions.triggerSchedulerTask ?? false,
            };
        });
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
    viewSchedulerTasks = false;
    createSchedulerTasks = false;
    editSchedulerTask = false;
    deleteSchedulerTasks = false;
    triggerSchedulerTask = false;
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
    viewSchedulerTasks: boolean;
    createSchedulerTasks: boolean;
    editSchedulerTask: boolean;
    deleteSchedulerTasks: boolean;
    triggerSchedulerTask: boolean;
}

