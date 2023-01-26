import type { Permission } from "$lib/code/permissions";

export class Server implements IServer {
    guid = "";
    name = "";
    description = "";
    status = 0;
    serverPermissions = new Array<Permission>();
}

export class ServerPermission implements IServerPermission {
    viewStats = false;
    viewConsole = false;
    useConsole = false;
    useServerActions = false;
}

export interface IServer {
    guid: string;
    name: string;
    description: string;
    status: number;
    serverPermissions: Permission[];
}

export interface IServerPermission {
    viewStats: boolean;
    viewConsole: boolean;
    useConsole: boolean;
    useServerActions: boolean;
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