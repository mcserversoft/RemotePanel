import { get } from 'svelte/store';
import { settings } from "./storage";

function isInDebuggingMode(): boolean {
    return get(settings)?.debugging ?? false;
}

export function log(log: any) {
    if (!log)
        return

    if (isInDebuggingMode()) {
        if (log instanceof String) {
            console.log(`[DEBUG] ${log}`);
        } else {
            console.log(log)
        }
    }
}
