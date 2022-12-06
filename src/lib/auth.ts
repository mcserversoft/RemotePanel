import { writable } from 'svelte-local-storage-store'
import { get } from 'svelte/store';
import { selectedServerGuid } from './api';
import { settings } from './storage';

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
}

export const auth = writable('user', {
    apiKey: '',
    username: '',
    serverPermissions: new Array<ServerPermissionCatalog>,
})

export let username: string = get(auth).username;

export function login(apiKey: string, username: string, permissions: ServerPermissionCatalog[]) {

    auth.set({
        apiKey: apiKey,
        username: username,
        serverPermissions: permissions
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
