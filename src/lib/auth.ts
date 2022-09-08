import { writable } from 'svelte-local-storage-store'
import { get } from 'svelte/store';

export const auth = writable('user', {
    apiKey: '',
    username: ''
})

export let username: string = get(auth).username;

export function login(apiKey: string, username: string) {
    auth.set({
        apiKey: apiKey,
        username: username,
    });
}

export function logout() {
    auth.set({
        apiKey: '',
        username: '',
    });
}