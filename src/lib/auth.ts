import { writable } from 'svelte-local-storage-store'
import { get } from 'svelte/store';
import { settings } from './storage';

export const auth = writable('user', {
    apiKey: '',
    username: '',
    serverPermissions: [],
})

export let username: string = get(auth).username;

export function login(apiKey: string, username: string, serverPermissions: []) {
    auth.set({
        apiKey: apiKey,
        username: username,
        serverPermissions: serverPermissions
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
        serverPermissions: [],
    });
}