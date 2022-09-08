import { writable as writableCache } from 'svelte-local-storage-store';
import { derived, get } from 'svelte/store';
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

//todo remove/rework this
let loadingMessage: string = '';
export let loadingServers: boolean;
//


export const servers = writableCache('servers', []);
export const selectedServerGuid = writableCache('selectedServerGuid', '');

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

            if (!data.any) {
                loadingMessage = 'No Servers found.';
            }
        })
        .catch((error) => {
            if (error.status === 401) {
                logout();
            } else if (!error.status) {
                //    $isOffline = true;
            }
            loadingMessage = 'Failed to fetch servers.';
        });
}