import type { ICustomServerPermission, ServerAccessDetails } from "./permissions";

export interface IApiKey {
    apiKeyId: string;
    name: string;
    isAdmin: boolean;
    hasAccessToAllServers: boolean;
    createdAt: Date;
    serverAccessDetails: ServerAccessDetails;
}

export interface INewApiKey {
    name: string;
    isAdmin: boolean;
    hasAccessToAllServers: boolean;
    serverAccessDetails: ServerAccessDetails;
}

/* API */
export interface ICreateApiKeyRequest {
    name: string;
    isAdmin: boolean;
    hasAccessToAllServers: boolean;
    customServerPermissions: Record<string, Partial<ICustomServerPermission>>;
}

export interface IGetApiKeyResponse {
    apiKeyId: string;
    name: string;
    isAdmin: boolean;
    hasAccessToAllServers: boolean;
    createdAt: Date;
    customServerPermissions: Record<string, Partial<ICustomServerPermission>>;
}

export interface IGetApiKeyListResponse extends Array<IGetApiKeyResponse> { }

/* Helper Methods */