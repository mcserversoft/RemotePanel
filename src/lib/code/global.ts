import { persisted } from 'svelte-local-storage-store';
import { derived, get, writable } from 'svelte/store';
import type { IServer, Server } from '../../types';

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
        permissions: { viewStats: false, viewConsole: false, useConsole: false, useServerActions: false },
    };
}