import { auth } from "$lib/store.js";

export function logout() {
    auth.set({
        apiKey: '',
        username: '',
    });
}
