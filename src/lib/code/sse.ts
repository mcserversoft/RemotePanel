import { get } from 'svelte/store';
import { SSE } from 'sse.js';
import { baseUrl } from './routing';
import { auth } from './auth';

/*
*  Events
*/

export function GetMcssEvents(): SSE {
    return new SSE(`${baseUrl}/events`, {
        headers: { apiKey: get(auth)?.apiKey },
        autoReconnect: true,
        reconnectDelay: 5000,
        maxRetries: 10,
    });
}
