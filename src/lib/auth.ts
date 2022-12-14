import { writable } from 'svelte-local-storage-store'
import { get } from 'svelte/store';
import { baseUrl } from '$lib/routing';
import { selectedServerGuid } from './api';
import { settings } from './storage';
import axios from 'axios'

export interface ServerPermissionCatalog {
    guid: string;
    permissions: ServerPermission;
}

export interface ServerPermission {
    viewStats: boolean;
    viewConsole: boolean;
    useConsole: boolean;
    useServerActions: boolean;
}

export enum Permissions {
    viewStats,
    viewConsole,
    useConsole,
    useServerActions,
export enum LoginFailureReason {
    Unauthorized,
    Network,
    Unknown
}

export const auth = writable('user', {
    apiKey: '',
    username: '',
    serverPermissions: new Array<ServerPermissionCatalog>,
})

export let username: string = get(auth).username;

export function login(username: string, password: string, report: (failureReason: LoginFailureReason) => void): void {
    const request = new Request(`${baseUrl}/auth`, {
        method: `POST`,
        body: JSON.stringify({ username: username, password: password })
    });

    fetch(request)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(response);
            }

            return response.json();
        })
        .then((data) => {
            axios.defaults.baseURL = baseUrl;
            axios.defaults.headers.common['apiKey'] = data.apiKey;

            axios.interceptors.response.use(
                (response) => {
                    return response;
                },
                (error) => {
                    if (error.response.status == 401) {
                        logout();
                    } else {
                        return Promise.reject(error);
                    }
                });

            auth.set({
                apiKey: data.apiKey,
                username: data.username,
            });

            // set default settings
            if (get(settings) == null) {
                settings.set({
                    serversRefreshRate: 5,
                    consoleRefreshRate: 5,
                    autoScrollConsole: true,
                    amountOfConsoleLines: 50,
                    reverseConsoleLines: false,
                })
            }
        })
        .catch((error) => {
            if (error.status === 401) {
                report(LoginFailureReason.Unauthorized);
            } else if (error.status === 500) {
                report(LoginFailureReason.Unknown);
            } else {
                report(LoginFailureReason.Network);
            }
        });
}

export function logout() {
    auth.set({
        apiKey: '',
        username: '',
        serverPermissions: new Array<ServerPermissionCatalog>,
    });
}

    }
}
