import { persisted } from 'svelte-local-storage-store';
import { derived, get, writable } from 'svelte/store';
import type { IServer, Server } from './server';

// global in-memory store
export const isOffline = writable(false);
export const isLoadingServers = writable(false);

// global persistent store
export const servers = persisted<Server[]>('servers', new Array<Server>());
export const selectedServerId = persisted('selectedServerId', '');

// global functions
export function getServer(serverId: any) {
    if (get(servers)) {
        return get(servers).find((s: IServer) => s.serverId == serverId);
    }
    return {
        serverId: '',
        name: '',
        description: '',
        type: '',
        status: 0,
        permissions: {
            viewStats: false, viewConsole: false, useConsole: false, editServer: false, useServerActions: false, viewSchedulerTasks: false, createSchedulerTasks: false, editSchedulerTask: false, deleteSchedulerTasks: false, triggerSchedulerTask: false
        },
    };
}

export const selectedServer = derived([servers, selectedServerId], ([$servers, $selectedServerId]) => {
    if ($servers) {
        return $servers.find((s: IServer) => s.serverId == $selectedServerId);
    }
    return {
        serverId: '',
        name: '',
        description: '',
        status: 0,
        permissions: { viewStats: false, viewConsole: false, useConsole: false, editServer: false, useServerActions: false, viewSchedulerTasks: false, createSchedulerTasks: false, editSchedulerTask: false, deleteSchedulerTasks: false, triggerSchedulerTask: false },
    };
})