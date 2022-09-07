import { writable } from 'svelte-local-storage-store';

export enum Page {
    Dashboard,
    Servers,
}

// used for testing purposes
export const baseUrl = '';

export const selectedPage = writable('selectedPage', Page.Dashboard);

export function navigateToPage(pageName: Page) {
    selectedPage.set(pageName);
}
