import axiosClient from '$lib/code/axiosClient';
import {
    hasPermission,
    Permission
} from '$lib/code/permissions';
import { calculateUptime } from '$lib/code/shared';
import { settings } from '$lib/code/storage';
import { persisted } from 'svelte-local-storage-store';
import {
    derived,
    get,
    writable
} from 'svelte/store';

import type {
    Backup,
    IServer,
    Memory,
    PanelUser,
    Server,
    Stats,
    ServerAction,
    NewPanelUser,
    IServerSettings
} from '../../types';
import { Filter } from '../../types';

// global in-memory store
export const isOffline = writable(false);
export const isLoadingServers = writable(false);

// global persistent store

//FUTURE add global caching store to reduce requests
export const servers = persisted<Server[]>('servers', new Array<Server>());
export const selectedServerId = persisted('selectedServerId', '');

// this should maybe be moved, api should only have api stuff

// global translations
export const getSelectedServer = derived(servers, ($servers) => {
    if ($servers) {
        return $servers.find((s: IServer) => s.serverId == get(selectedServerId));
    }
    return {
        serverId: '',
        name: '',
        description: '',
        type: '',
        status: 0,
        permissions: { viewStats: false, viewConsole: false, useConsole: false, useServerActions: false },
    };
})

function isInDebuggingMode(): boolean {
    return get(settings)?.debugging ?? false;
}

/*
*  API Requests
*/
export function fetchServers(filter: Filter = Filter.None): void {
    isLoadingServers.set(true);

    axiosClient().get(`/api/v2/servers?filter=${filter}`)
        .then((response) => {
            if (response?.status !== 200) {
                return Promise.reject(response);
            }
            return response.data;
        })

        .then((json) => {
            servers.set(json);
        })
        .catch((error) => {
            isOffline.set(true)
            console.error(`Failed to fetch servers with filter: ${filter} Error: ${error}`)
        })

    isLoadingServers.set(false);
}

export function getServer(serverId: string, report: (wasSuccess: boolean, server: IServerSettings) => void) {
    axiosClient().get(`/api/v2/servers/${serverId}`)
        .then((response) => {
            if (response?.status !== 200) {
                return Promise.reject(response);
            }

            if (isInDebuggingMode()) {
                console.log("getServer:")
                console.log(response?.data)
            }

            report(true, response?.data ?? null);
        })

        .catch((error) => {
            console.error(`Failed to get server with id: ${serverId} Error: ${error}`)
            report(false, null);
        })
}

export function putServerSettings(serverId: string, settings: IServerSettings, report: (wasSuccess: boolean) => void) {
    axiosClient().put(`/api/v2/servers/${serverId}`, JSON.stringify(settings))
        .then((response) => {
            if (response?.status !== 200) {
                return Promise.reject(response);
            }

            if (isInDebuggingMode()) {
                console.log("putServerSettings:")
                console.log(response?.data)
            }

            report(true);
        })

        .catch((error) => {
            console.error(`Failed to save settings of server with id: ${serverId} Error: ${error}`)
            report(false);
        })
}

export async function sendServerAction(serverId: string, action: string) {
    if (!serverId || !hasPermission(Permission.useServerActions, serverId)) {
        console.log()
        return;
    }

    axiosClient().post(`/api/v2/servers/${serverId}/execute/action`, JSON.stringify({ action: action }))
        .then((response) => {
            if (response?.status !== 200) {
                return Promise.reject(response);
            }
            return response.data;
        })

        .catch((error) => {
            console.error(`Failed to execute action: ${action} on server: ${serverId} Error: ${error}`)
        })
}

export async function sendMassServerAction(serverIds: string[], action: ServerAction, completed: (wasSuccess: boolean) => void) {
    // we don't check perm here, the backend will do that
    if (!serverIds || serverIds.length <= 0) {
        return;
    }

    axiosClient().post(`/api/v2/servers/execute/action`, JSON.stringify({ action: action, serverIds: serverIds }))
        .then((response) => {
            if (response?.status !== 200) {
                return Promise.reject(response);
            }
            return response.data;
        })
        .then((data) => {
            completed(true);
        })
        .catch((error) => {
            console.error(`Failed to mass execute action: ${action} on servers: ${serverIds} Error: ${error}`)
            completed(false);
        })
}

export async function sendServerCommand(serverId: string, input: string) {
    if (!serverId || !input || !hasPermission(Permission.useConsole, serverId)) {
        return;
    }

    if (get(settings).chatModeConsole) {
        if (!input.startsWith("/say") && !input.startsWith("say ")) {
            input = "/say " + input;
        }
    }

    if (isInDebuggingMode()) {
        console.log(`[DEBUG] sendServerCommand: ${input}`)
    }

    axiosClient().post(`/api/v2/servers/${serverId}/execute/command`, JSON.stringify({ command: input }))
        .then((response) => {
            if (response?.status !== 200) {
                return Promise.reject(response);
            }
            return response.data;
        })

        .catch((error) => {
            console.error(`Failed to execute command: ${input} on server: ${serverId} Error: ${error}`)
        })
}

export function fetchServerStatus(serverId: string, report: (latestStats: Stats) => void, completed: (wasSuccess: boolean) => void): void {
    if (!serverId || !hasPermission(Permission.viewStats, serverId)) {
        return;
    }

    axiosClient().get(`/api/v2/servers/${serverId}/stats`)
        .then((response) => {
            if (response?.status !== 200) {
                return Promise.reject(response);
            }
            return response?.data?.latest;
        })
        .then((data) => {
            const memory: Memory = {
                current: data.memoryUsed ?? 0,
                max: data.memoryLimit ?? 0,
                free: (data.max - data.current),
                percentageFree: 0
            }
            memory.percentageFree = Math.round((memory.current / memory.max) * 100);

            const stats: Stats = {
                cpu: data.cpu ?? 0,
                memory: memory,
                playersOnline: data.playersOnline ?? 0,
                playerLimit: data.playerLimit ?? 0,

                uptime: calculateUptime(data.startDate),
                startDateUnix: data.startDate,
                startDate: new Date(data.startDate * 1000).toLocaleString(window.navigator.language, {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            }

            if (isInDebuggingMode()) {
                console.log(`[DEBUG] fetchServerStatus: ${data}`)
            }

            report(stats ?? false);
            completed(true);
        })

        .catch((error) => {
            console.error(`Failed to check if console is outdated on server: ${serverId} Error: ${error}`)
            completed(false);
        })
}

export function fetchServerConsole(serverId: string, report: (consoleLines: string[]) => void, completed: (wasSuccess: boolean) => void): void {
    if (!serverId || !hasPermission(Permission.viewConsole, serverId)) {
        return;
    }

    const amountOfConsoleLines = get(settings)?.amountOfConsoleLines ?? 50;
    const reverseConsoleLines = get(settings)?.reverseConsoleLines ?? false;

    axiosClient().get(`/api/v2/servers/${serverId}/console?amountOfLines=${amountOfConsoleLines}&reversed=${reverseConsoleLines}`)
        .then((response) => {
            if (response?.status !== 200) {
                return Promise.reject(response);
            }

            if (isInDebuggingMode()) {
                console.log(`[DEBUG] fetchServerConsole, amount of lines: ${response?.data?.length}`)
            }

            report(response?.data?.join('\r\n') ?? []);
            completed(true);
        })

        .catch((error) => {
            console.error(`Failed to fetch console on server: ${serverId} Error: ${error}`)
            completed(false);
        })
}

export function isServerConsoleOutdated(serverId: string, secondLastLine: string, lastLine: string, report: (isOutdated: boolean) => void, completed: (wasSuccess: boolean) => void): void {
    if (!serverId || !hasPermission(Permission.viewConsole, serverId)) {
        return;
    }

    axiosClient().get(`/api/v2/servers/${serverId}/console/outdated?secondLastLine=${secondLastLine}&lastLine=${lastLine}`)
        .then((response) => {
            if (response?.status !== 200) {
                return Promise.reject(response);
            }

            if (isInDebuggingMode()) {
                console.log(`[DEBUG] isServerConsoleOutdated: ${response?.data}`)
            }

            report(response?.data?.isOutdated ?? false);
            completed(true);
        })

        .catch((error) => {
            console.error(`Failed to check if console is outdated on server: ${serverId} Error: ${error}`)
            completed(false);
        })
}

export function fetchPanelUsers(report: (users: PanelUser[]) => void, completed: (wasSuccess: boolean) => void): void {
    axiosClient().get(`/api/v2/users`)
        .then((response) => {
            if (response?.status !== 200) {
                return Promise.reject(response);
            }

            if (isInDebuggingMode()) {
                console.log("fetchPanelUsers:")
                console.log(response?.data)
            }

            report(response?.data ?? []);
            completed(true);
        })

        .catch((error) => {
            console.error(`Failed to fetch panel users with Error: ${error}`)
            completed(false);
        })
}

export function createPanelUser(newUser: NewPanelUser, completed: (wasSuccess: boolean) => void) {
    axiosClient().post(`/api/v2/users`, JSON.stringify(newUser))
        .then((response) => {
            if (response?.status !== 201) {
                return Promise.reject(response);
            }

            if (isInDebuggingMode()) {
                console.log("createPanelUser:")
                console.log(response?.data)
            }

            completed(true);
        })

        .catch((error) => {
            console.error(`Failed to create panel user: ${newUser.username} Error: ${error}`)
            completed(false);
        })
}

export function deletePanelUser(userId: string, completed: (wasSuccess: boolean) => void): void {
    axiosClient().delete(`/api/v2/users/${userId}`)
        .then((response) => {
            if (response?.status !== 200) {
                return Promise.reject(response);
            }

            if (isInDebuggingMode()) {
                console.log(`[DEBUG] deletePanelUser: ${response?.data}`)
            }

            completed(true);
        })

        .catch((error) => {
            console.error(`Failed to delete panel user with id ${userId} Error: ${error}`)
            completed(false);
        })
}

export function fetchBackups(serverId: string, report: (users: Backup[]) => void, completed: (wasSuccess: boolean) => void): void {
    axiosClient().get(`/api/v2/${serverId}/backups`)
        .then((response) => {
            if (response?.status !== 200) {
                return Promise.reject(response);
            }

            if (isInDebuggingMode()) {
                console.log("fetchBackups:")
                console.log(response?.data)
            }

            report(response?.data ?? []);
            completed(true);
        })

        .catch((error) => {
            console.error(`Failed to fetch panel users with Error: ${error}`)
            completed(false);
        })
}