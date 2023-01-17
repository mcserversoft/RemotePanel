import { baseUrl } from '$lib/code/routing';
import { settings } from '$lib/code/storage';
import { writable } from 'svelte-local-storage-store';
import { get } from 'svelte/store';

import { PanelTheme } from '../../types';

export enum LoginFailureReason {
    Unauthorized,
    Network,
    Unknown
}

export const auth = writable('user', {
    apiKey: '',
    username: '',
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
                    panelTheme: PanelTheme.Light,
                    UseSystemTheme: false
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
    });
}
