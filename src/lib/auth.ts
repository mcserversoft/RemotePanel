import { writable } from 'svelte-local-storage-store'

export const auth = writable('user', {
    apiKey: '',
    username: ''
})

export function logout() {
    auth.set({
        apiKey: '',
        username: '',
    });
}