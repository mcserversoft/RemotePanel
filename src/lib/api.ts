import { writable as writableStorage } from 'svelte-local-storage-store';
import { writable, derived, get } from 'svelte/store';
import { auth, logout } from './auth';
import { baseUrl } from './routing';

//TODO add these to app.d.ts at some point
// see https://kit.svelte.dev/docs/types#app
export interface IServer {
    guid: string;
    name: string;
    description: string;
    status: number;
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

// global in-memory store
export const isOffline = writable(false);
export const isLoadingServers = writable(false);

// global persistent store
export const servers = writableStorage('servers', []);
export const selectedServerGuid = writableStorage('selectedServerGuid', '');

// global translations
export const getSelectedServer = derived(servers, ($servers) => {
    if ($servers) {
        return $servers.find((s: IServer) => s.guid == get(selectedServerGuid));
    }
    return {
        guid: '',
        name: '',
        description: '',
        status: 0,
    };
})

/*
*  API Requests
*/
export function fetchServers(filter: Filter = Filter.None): void {
    isLoadingServers.set(true);

    axios.get(`/api/v1/servers?filter=${filter}`)
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
            console.error(`Failed to fetch servers with filter: ${filter} Error: ${error}`)
        })

    isLoadingServers.set(false);
}

export async function sendServerAction(action: string) {
    const guid = get(selectedServerGuid);

    if (!guid) {
        return;
    }

    axios.post(`/api/v1/servers/${guid}/execute/action`, JSON.stringify({ action: action }))
        .then((response) => {
            if (response?.status !== 200) {
                return Promise.reject(response);
            }
            return response.data;
        })

        .catch((error) => {
            console.error(`Failed to execute action: ${action} on server: ${guid} Error: ${error}`)
        })
}

export async function sendServerCommand(input: string) {
    const guid = get(selectedServerGuid);

    if (!guid || !input) {
        return;
    }

    axios.post(`/api/v1/servers/${guid}/execute/command`, JSON.stringify({ command: input }))
        .then((response) => {
            if (response?.status !== 200) {
                return Promise.reject(response);
            }
            return response.data;
        })

        .catch((error) => {
            console.error(`Failed to execute command: ${input} on server: ${guid} Error: ${error}`)
        })
}
