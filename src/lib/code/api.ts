import axiosClient from '$lib/code/axiosClient';
import {
    hasPermission,
    Permission
} from '$lib/code/permissions';
import { calculateUptime } from '$lib/code/shared';
import { settings } from '$lib/code/storage';
import { persisted } from 'svelte-local-storage-store';
import axios from 'axios';
import {
    derived,
    get,
    writable
} from 'svelte/store';

import type {
    IServer,
    Memory,
    Server,
    Stats
} from '../../types';
import { Filter } from '../../types';
import { auth } from './auth';

// global in-memory store
export const isOffline = writable(false);
export const isLoadingServers = writable(false);

// global persistent store
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
        status: 0,
        permissions: { viewStats: false, viewConsole: false, useConsole: false, useServerActions: false },
    };
})


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

export async function sendServerCommand(serverId: string, input: string) {
    if (!serverId || !input || !hasPermission(Permission.useConsole, serverId)) {
        return;
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

            report(response?.data?.isOutdated ?? false);
            completed(true);
        })

        .catch((error) => {
            console.error(`Failed to check if console is outdated on server: ${serverId} Error: ${error}`)
            completed(false);
        })
}

export function streamConsole(serverId: string, report: (obj: any) => void, completed: (wasSuccess: boolean) => void): void {
    if (!serverId || !hasPermission(Permission.viewConsole, serverId)) {
        return;
    }

    // const url = `http://127.0.0.1:2096/api/v2/servers/${serverId}/console/stream`;
    // const eventSource = new EventSource(url, {
    //     withCredentials: true,
    // });

    // eventSource.onmessage = (event) => {
    //     console.log(event.data);
    // };

    // eventSource.onerror = (error) => {
    //     console.error(error);
    // };

    // axiosClient().get(url).then((response) => {
    //     console.log(response.data);
    // }).catch((error) => {
    //     console.error(error);
    //     completed(false);
    // });


    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://127.0.0.1:2096/api/v2/servers/${serverId}/console/stream`,
        headers: { apiKey: get(auth)?.apiKey ?? '' }
    };

    axios.request(config)
        .then((response: any) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error: any) => {
            console.log(error);
        });

}