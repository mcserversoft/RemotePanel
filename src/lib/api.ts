import { writable as writableStorage } from 'svelte-local-storage-store';
import { writable, derived, get } from 'svelte/store';
import { auth, logout } from './auth';
import { baseUrl } from './routing';

export interface IServer {
    guid: string;
    name: string;
    description: string;
    status: number;
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
    API Requests
*/
export async function fetchServers(filter: Filter = Filter.None) {
    isLoadingServers.set(true);

    const request = new Request(`${baseUrl}/api/v1/servers?filter=${filter}`, {
        method: `GET`,
        headers: {
            apiKey: get(auth).apiKey
        }
    });

    await fetch(request)
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            }
            return Promise.reject(response);
        })
        .then((data) => {
            servers.set(data);
        })
        .catch((error) => {
            if (error.status === 401) {
                logout();
            } else if (!error.status) {
                isOffline.set(true);
            }
        });
        
    isLoadingServers.set(false);
}

export async function sendServerAction(action: string) {
    const guid = get(selectedServerGuid);

    if (!guid) {
        return;
    }

    const request = new Request(`${baseUrl}/api/v1/servers/${guid}/execute/action`, {
        method: `POST`,
        headers: {
            apiKey: get(auth).apiKey
        },
        body: JSON.stringify({ action: action })
    });

    await fetch(request)
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            }
            return Promise.reject(response);
        })
        .catch((error) => {
            if (error.status === 401) {
                logout();
            }
        });
}

export async function sendServerCommand(input: string) {
    const guid = get(selectedServerGuid);

    if (!guid || !input) {
        return;
    }

    const request = new Request(`${baseUrl}/api/v1/servers/${guid}/execute/command`, {
        method: `POST`,
        headers: {
            apiKey: get(auth).apiKey
        },
        body: JSON.stringify({ command: input })
    });

    await fetch(request)
        .then((response) => {
            if (response.status == 200) {
                //   consoleInput = '';
            }
            return Promise.reject(response);
        })
        .catch((error) => {
            if (error.status === 403) {
                logout();
            }
        });
}