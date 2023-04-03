import { persisted } from 'svelte-local-storage-store';

export enum Page {
    About,
    Dashboard,
    Servers,
    Settings,
}

// used for testing purposes
//export const baseUrl = '';
export const baseUrl = 'http://127.0.0.1:2096';

export const selectedPage = persisted('selectedPage', Page.Dashboard);

export function navigateToPage(pageName: Page) {
    selectedPage.set(pageName);
}
