import axiosClient from '$lib/code/axiosClient';
import { hasPermission, Permission } from '$lib/code/permissions';
import { calculateUptime } from '$lib/code/shared';
import { settings } from '$lib/code/storage';
import { get } from 'svelte/store';

import {
    type Backup,
    type Memory,
    type IPanelUser,
    type Stats,
    type ServerAction,
    type INewPanelUser,
    type IServerSettings,
    ServerAccessDetails,
    type IEditPanelUser,
    type IEditPanelSettings,
    type IDeleteUserAccount,
    type IEditUserAccount,
    type IPanelSettings,
} from '../../types';
import { Filter } from '../../types';
import type { IGetPanelUserSettingsResponse as IGetPanelSettingsResponse, IGetUserDetailsResponse, IGetUsersListResponse } from '../../apiResponses';
import type { ICreateUserRequest, IDeleteUserAccountRequest, IEditPanelSettingsRequest, IUpdateUserAccountRequest, IUpdateUserRequest, IUserAvatarRequest } from '../../apiRequests';
import { log } from '$lib/code/logger';
import { isLoadingServers, isOffline, selectedServerId, servers } from '$lib/code/global';

/*
*  API Requests
*/
export function getServers(filter: Filter = Filter.None): void {
    isLoadingServers.set(true);

    // no logging here on purpose, too many requests
    axiosClient().get(`/api/v2/servers?filter=${filter}`)
        .then((response) => {
            if (response?.status !== 200) {
                return Promise.reject(response);
            }
            return response.data;
        })
        .then((serverDetails) => {
            servers.set(serverDetails);

            // incase there is no selectedServer
            // in an ideal world this code belongs in  +page.svelte
            // or even better in a caching layer
            if (!get(selectedServerId)) {
                let firstServerId = get(servers)[0]?.serverId ?? null;
                if (firstServerId != null) {
                    selectedServerId.set(firstServerId);
                }
            }
        })
        .catch((error) => {
            isOffline.set(true)
            console.error(`Failed to fetch servers with filter: ${filter} Error: ${error}`)
        })

    isLoadingServers.set(false);
}

export function getServer(serverId: string, report: (wasSuccess: boolean, server: IServerSettings) => void) {
    log("API Request: getServer");
    axiosClient().get(`/api/v2/servers/${serverId}`)
        .then((response) => {
            if (response?.status !== 200) {
                return Promise.reject(response);
            }

            log(response?.status);
            log(response?.data);
            return response?.data ?? [];
        })
        .then((serverDetails) => {
            report(true, serverDetails);
        })

        .catch((error) => {
            console.error(`Failed to get server with id: ${serverId} Error: ${error}`)
            //@ts-ignore 
            report(false, null);
        })
}

export function editServer(serverId: string, settings: IServerSettings, report: (wasSuccess: boolean) => void) {
    log("API Request: editServer");
    axiosClient().put(`/api/v2/servers/${serverId}`, JSON.stringify(settings))
        .then((response) => {
            if (response?.status !== 200) {
                return Promise.reject(response);
            }

            log(response?.status);
            log(response?.data);
            report(true);
        })

        .catch((error) => {
            console.error(`Failed to save settings of server with id: ${serverId} Error: ${error}`)
            report(false);
        })
}

export async function postServerAction(serverId: string, action: string) {
    if (!serverId || !hasPermission(Permission.useServerActions, serverId)) {
        console.log()
        return;
    }

    log("API Request: postServerAction");
    axiosClient().post(`/api/v2/servers/${serverId}/execute/action`, JSON.stringify({ action: action }))
        .then((response) => {
            if (response?.status !== 200) {
                return Promise.reject(response);
            }

            log(response?.status);
            log(response?.data);
            return response.data;
        })

        .catch((error) => {
            console.error(`Failed to execute action: ${action} on server: ${serverId} Error: ${error}`)
        })
}

export async function postMassServerAction(serverIds: string[], action: ServerAction, completed: (wasSuccess: boolean) => void) {
    // we don't check perm here, the backend will do that
    if (!serverIds || serverIds.length <= 0) {
        return;
    }

    log("API Request: postMassServerAction");
    axiosClient().post(`/api/v2/servers/execute/action`, JSON.stringify({ action: action, serverIds: serverIds }))
        .then((response) => {
            if (response?.status !== 200) {
                return Promise.reject(response);
            }

            log(response?.status);
            log(response?.data);
            completed(true);
        })
        .catch((error) => {
            console.error(`Failed to mass execute action: ${action} on servers: ${serverIds} Error: ${error}`)
            completed(false);
        })
}

export async function postServerCommand(serverId: string, input: string) {
    if (!serverId || !input || !hasPermission(Permission.useConsole, serverId)) {
        return;
    }

    if (get(settings).chatModeConsole) {
        if (!input.startsWith("/say") && !input.startsWith("say ")) {
            input = "/say " + input;
        }
    }

    log("API Request: postServerCommand");
    axiosClient().post(`/api/v2/servers/${serverId}/execute/command`, JSON.stringify({ command: input }))
        .then((response) => {
            if (response?.status !== 200) {
                return Promise.reject(response);
            }

            log(response?.status);
            log(response?.data);
            return response.data;
        })
        .catch((error) => {
            console.error(`Failed to execute command: ${input} on server: ${serverId} Error: ${error}`)
        })
}

export function getServerStatus(serverId: string, report: (latestStats: Stats) => void, completed: (wasSuccess: boolean) => void): void {
    if (!serverId || !hasPermission(Permission.viewStats, serverId)) {
        return;
    }

    log("API Request: getServerStatus");
    axiosClient().get(`/api/v2/servers/${serverId}/stats`)
        .then((response) => {
            if (response?.status !== 200) {
                return Promise.reject(response);
            }

            log(response?.status);
            log(response?.data);
            return response?.data?.latest ?? {};
        })
        .then((latestStats) => {
            const memory: Memory = {
                current: latestStats.memoryUsed ?? 0,
                max: latestStats.memoryLimit ?? 0,
                free: (latestStats.max - latestStats.current),
                percentageFree: 0
            }

            let calculatedFreePercentage = Math.round((memory.current / memory.max)) * 100;
            memory.percentageFree = isNaN(calculatedFreePercentage) ? 0 : calculatedFreePercentage;

            const stats: Stats = {
                cpu: latestStats.cpu ?? 0,
                memory: memory,
                playersOnline: latestStats.playersOnline ?? 0,
                playerLimit: latestStats.playerLimit ?? 0,

                uptime: calculateUptime(latestStats.startDate),
                startDateUnix: latestStats.startDate,
                startDate: new Date(latestStats.startDate * 1000).toLocaleString(window.navigator.language, {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            }

            report(stats);
            completed(true);
        })
        .catch((error) => {
            console.error(`Failed to check if console is outdated on server: ${serverId} Error: ${error}`)
            completed(false);
        })
}

export function getServerConsole(serverId: string, report: (consoleLines: string[]) => void, completed: (wasSuccess: boolean) => void): void {
    if (!serverId || !hasPermission(Permission.viewConsole, serverId)) {
        return;
    }

    const amountOfConsoleLines = get(settings)?.amountOfConsoleLines ?? 50;
    const reverseConsoleLines = get(settings)?.reverseConsoleLines ?? false;

    log("API Request: getServerConsole");
    axiosClient().get(`/api/v2/servers/${serverId}/console?amountOfLines=${amountOfConsoleLines}&reversed=${reverseConsoleLines}`)
        .then((response) => {
            if (response?.status !== 200) {
                return Promise.reject(response);
            }

            log(response?.status);
            log(`amount of lines: ${response?.data?.length}`);
            return response?.data?.join('\r\n') ?? [];
        })
        .then((consoleLines) => {
            report(consoleLines);
            completed(true);
        })
        .catch((error) => {
            console.error(`Failed to fetch console on server: ${serverId} Error: ${error}`)
            completed(false);
        })
}

export function getIsServerConsoleOutdated(serverId: string, secondLastLine: string, lastLine: string, report: (isOutdated: boolean) => void, completed: (wasSuccess: boolean) => void): void {
    if (!serverId || !hasPermission(Permission.viewConsole, serverId)) {
        return;
    }

    log("API Request: getIsServerConsoleOutdated");
    axiosClient().get(`/api/v2/servers/${serverId}/console/outdated?secondLastLine=${secondLastLine}&lastLine=${lastLine}`)
        .then((response) => {
            if (response?.status !== 200) {
                return Promise.reject(response);
            }

            log(response?.status);
            log(response?.data);
            return response?.data?.isOutdated ?? false;
        })
        .then((isConsoleOutdated) => {
            report(isConsoleOutdated);
            completed(true);
        })
        .catch((error) => {
            console.error(`Failed to check if console is outdated on server: ${serverId} Error: ${error}`)
            completed(false);
        })
}

export function getPanelUsers(report: (users: IPanelUser[]) => void, completed: (wasSuccess: boolean) => void): void {
    log("API Request: getPanelUsers");
    axiosClient().get(`/api/v2/users`)
        .then((response) => {
            if (response?.status !== 200) {
                return Promise.reject(response);
            }

            log(response?.status);
            log(response?.data);
            return response?.data ?? [];
        })
        .then((rawResponse) => {
            return rawResponse as IGetUsersListResponse;
        })
        .then((data) => {
            let users: IPanelUser[] = [];
            data.forEach((data: any) => {
                let user: IPanelUser = {
                    userId: data.userId,
                    username: data.username,
                    enabled: data.enabled,
                    isAdmin: data.isAdmin,
                    serverAccessDetails: new ServerAccessDetails(),
                    createdAt: data.createdAt,
                    lastModifiedAt: data.lastModifiedAt
                }
                user.serverAccessDetails.init(data.hasAccessToAllServers, data.customServerPermissions);
                users.push(user);
            });

            report(users);
            completed(true);
        })

        .catch((error) => {
            console.error(`Failed to fetch panel users with error: ${error}`)
            completed(false);
        })
}

export function getPanelUser(userId: string, report: (wasSuccess: boolean, user: IPanelUser) => void) {
    log("API Request: getPanelUser");
    axiosClient().get(`/api/v2/users/${userId}`)
        .then((response) => {
            if (response?.status !== 200) {
                return Promise.reject(response);
            }

            log(response?.status);
            log(response?.data);
            return response?.data ?? [];
        })
        .then((rawResponse) => {
            return rawResponse as IGetUserDetailsResponse;
        })
        .then((data) => {
            let user: IPanelUser = {
                userId: data.userId,
                username: data.username,
                enabled: data.enabled,
                isAdmin: data.isAdmin,
                serverAccessDetails: new ServerAccessDetails(),
                createdAt: data.createdAt,
                lastModifiedAt: data.lastModifiedAt
            }
            user.serverAccessDetails.init(data.hasAccessToAllServers, data.customServerPermissions);

            report(true, user);
        })

        .catch((error) => {
            console.error(`Failed to get panel user with id: ${userId} Error: ${error}`)
            //@ts-ignore 
            report(false, null);
        })
}

export function createPanelUser(newUser: INewPanelUser, completed: (wasSuccess: boolean) => void) {
    //formulate proper request
    var requestBody: ICreateUserRequest = {
        username: newUser.username,
        password: newUser.password,
        passwordRepeat: newUser.passwordRepeat,
        enabled: newUser.enabled,
        isAdmin: newUser.isAdmin,
        customServerPermissions: {}
    }

    Object.entries(newUser.serverAccessDetails.serverPermissions).forEach((perms) => {
        requestBody.customServerPermissions[perms[1].serverId] = {
            viewStats: perms[1]?.permissions.viewStats ?? false,
            viewConsole: perms[1]?.permissions.viewConsole ?? false,
            useConsole: perms[1]?.permissions.useConsole ?? false,
            useServerActions: perms[1]?.permissions.useServerActions ?? false,
        }
    });

    log("API Request: createPanelUser");
    axiosClient().post(`/api/v2/users`, JSON.stringify(requestBody))
        .then((response) => {
            if (response?.status !== 201) {
                return Promise.reject(response);
            }

            log(response?.status);
            log(response?.data);
            completed(true);
        })

        .catch((error) => {
            console.error(`Failed to create panel user: ${newUser.username} Error: ${error}`)
            completed(false);
        })
}

export function editPanelUser(updatedUser: IEditPanelUser, completed: (wasSuccess: boolean) => void) {
    //formulate proper request
    var requestBody: IUpdateUserRequest = {
        password: updatedUser.password,
        passwordRepeat: updatedUser.passwordRepeat,
        enabled: updatedUser.enabled,
        isAdmin: updatedUser.isAdmin,
        customServerPermissions: {}
    }

    Object.entries(updatedUser.serverAccessDetails.serverPermissions).forEach((perms) => {
        requestBody.customServerPermissions[perms[1].serverId] = {
            viewStats: perms[1]?.permissions.viewStats ?? false,
            viewConsole: perms[1]?.permissions.viewConsole ?? false,
            useConsole: perms[1]?.permissions.useConsole ?? false,
            useServerActions: perms[1]?.permissions.useServerActions ?? false,
        }
    });

    log("API Request: editPanelUser");
    axiosClient().put(`/api/v2/users/${updatedUser.userId}`, JSON.stringify(requestBody))
        .then((response) => {
            if (response?.status !== 200) {
                return Promise.reject(response);
            }

            log(response?.status);
            log(response?.data);
            completed(true);
        })

        .catch((error) => {
            console.error(`Failed to edit panel user with id: ${updatedUser.userId} Error: ${error}`)
            completed(false);
        })
}

export function deletePanelUser(userId: string, completed: (wasSuccess: boolean) => void): void {
    log("API Request: deletePanelUser");
    axiosClient().delete(`/api/v2/users/${userId}`)
        .then((response) => {
            if (response?.status !== 200) {
                return Promise.reject(response);
            }

            log(response?.status);
            log(response?.data);
            completed(true);
        })

        .catch((error) => {
            console.error(`Failed to delete panel user with id ${userId} Error: ${error}`)
            completed(false);
        })
}

export function editUserAccount(updatedUserAccount: IEditUserAccount, completed: (wasSuccess: boolean) => void) {
    //formulate proper request
    var requestBody: IUpdateUserAccountRequest = {
        password: updatedUserAccount.password,
        newPassword: updatedUserAccount.newPassword,
        newPasswordRepeat: updatedUserAccount.newPasswordRepeat,
    }

    log("API Request: editUserAccount");
    axiosClient().put(`/api/v2/users/current/account`, JSON.stringify(requestBody))
        .then((response) => {
            if (response?.status !== 200) {
                return Promise.reject(response);
            }

            log(response?.status);
            log(response?.data);
            completed(true);
        })

        .catch((error) => {
            console.error(`Failed to edit user account Error: ${error}`)
            completed(false);
        })
}

export function deleteUserAccount(deleteUserAccount: IDeleteUserAccount, completed: (wasSuccess: boolean) => void) {
    //formulate proper request
    var requestBody: IDeleteUserAccountRequest = {
        password: deleteUserAccount.password,
        delete: deleteUserAccount.confirm,
    }

    log("API Request: deleteUserAccount");
    axiosClient().post(`/api/v2/users/current/account`, JSON.stringify(requestBody))
        .then((response) => {
            if (response?.status !== 200) {
                return Promise.reject(response);
            }

            log(response?.status);
            log(response?.data);
            completed(true);
        })

        .catch((error) => {
            console.error(`Failed to delete user account Error: ${error}`)
            completed(false);
        })
}

export function getPanelUserSettings(report: (wasSuccess: boolean, panelUserSettings: IPanelSettings) => void) {
    log("API Request: getPanelUserSettings");
    axiosClient().get(`/api/v2/users/current/settings`)
        .then((response) => {
            if (response?.status !== 200) {
                return Promise.reject(response);
            }

            log(response?.status);
            log(response?.data);
            return response?.data ?? [];
        })
        .then((rawResponse) => {
            return rawResponse as IGetPanelSettingsResponse;
        })
        .then((data) => {

            let userSettings: IPanelSettings = {
                amountOfConsoleLines: data.amountOfConsoleLines,
                consoleRefreshRate: data.consoleRefreshRate,
                panelTheme: data.panelTheme,
                serverRefreshRate: data.serverRefreshRate,
                enableAutomaticConsoleScrolling: data.enableAutomaticConsoleScrolling,
                enableConsoleChatMode: data.enableConsoleChatMode,
                enableDebugging: data.enableDebugging,
            }

            report(true, userSettings);
        })

        .catch((error) => {
            console.error(`Failed to get panel user settings. Error: ${error}`)
            //@ts-ignore 
            report(false, null);
        })
}

export function editPanelSettings(updatedSettings: IEditPanelSettings, completed: (wasSuccess: boolean) => void) {
    //formulate proper request
    var requestBody: IEditPanelSettingsRequest = {
        amountOfConsoleLines: updatedSettings.amountOfConsoleLines,
        consoleRefreshRate: updatedSettings.consoleRefreshRate,
        panelTheme: updatedSettings.panelTheme,
        serverRefreshRate: updatedSettings.serverRefreshRate,
        enableAutomaticConsoleScrolling: updatedSettings.enableAutomaticConsoleScrolling,
        enableConsoleChatMode: updatedSettings.enableConsoleChatMode,
        enableDebugging: updatedSettings.enableDebugging
    }

    log("API Request: editPanelSettings");
    axiosClient().put(`/api/v2/users/current/settings`, JSON.stringify(requestBody))
        .then((response) => {
            if (response?.status !== 200) {
                return Promise.reject(response);
            }

            log(response?.status);
            log(response?.data);
            completed(true);
        })

        .catch((error) => {
            console.error(`Failed to edit panel user settings. Error: ${error}`)
            completed(false);
        })
}

export function uploadUserAvatar(base64: string, completed: (wasSuccess: boolean) => void) {
    //formulate proper request
    var requestBody: IUserAvatarRequest = {
        image: base64
    }

    log("API Request: uploadUserAvatar");
    axiosClient().post(`/api/v2/users/current/avatar`, JSON.stringify(requestBody))
        .then((response) => {
            if (response?.status !== 200) {
                return Promise.reject(response);
            }

            log(response?.status);
            log(response?.data);
            completed(true);
        })
        .catch((error) => {
            console.error(`Failed to upload user avatar Error: ${error}`)
            completed(false);
        })
}

export function getBackups(serverId: string, report: (backups: Backup[]) => void, completed: (wasSuccess: boolean) => void): void {
    log("API Request: getBackups");
    axiosClient().get(`/api/v2/servers/${serverId}/backups`)
        .then((response) => {
            if (response?.status !== 200) {
                return Promise.reject(response);
            }

            log(response?.status);
            log(response?.data);
            return response?.data ?? [];
        })
        .then((backups) => {
            report(backups ?? []);
            completed(true);
        })
        .catch((error) => {
            console.error(`Failed to fetch backups with error: ${error}`)
            completed(false);
        })
}