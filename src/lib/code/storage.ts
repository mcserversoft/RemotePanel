import { writable } from 'svelte-local-storage-store';

import { PanelTheme } from '../../types';

export const settings = writable('settings', {
    serversRefreshRate: 5,
    consoleRefreshRate: 5,
    autoScrollConsole: true,
    amountOfConsoleLines: 50,
    reverseConsoleLines: false,
    panelTheme: PanelTheme.Light,
    collapseSidebar: false,
    useSystemTheme: false,
})

