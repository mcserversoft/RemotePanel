import { persisted } from 'svelte-local-storage-store';

// used for testing purposes
// @ts-ignore
export const baseUrl = __DEBUG_URL__;

export enum Page {
    Empty,
    About,
    Account,
    Backups,
    BackupsCreate,
    BackupsEdit,
    BackupHistory,
    BackupSettings,
    Console,
    Dashboard,
    ServerEdit,
    Servers,
    Settings,
    Users,
    UsersCreate,
    UsersEdit,
    Scheduler,
    SchedulerTaskCreate,
    SchedulerTaskEdit,
    SchedulerHistory,
    ApiKeysOverview,
    ApiKeysCreate,
    ApiKeysCreated,
    Webhooks,
    WebhooksCreate,
    WebhooksEdit,
}

export const selectedPage = persisted('selectedPage', Page.Dashboard);
export const selectedPageProps = persisted('selectedPageProps', null);

export function navigateToPage(pageName: Page, props: any = null) {
    selectedPage.set(pageName);

    if (props) {
        selectedPageProps.set(props);
    }
}

export function openInNewTab(url: string) {
    window.open(url, "_blank", "noopener noreferrer")
}