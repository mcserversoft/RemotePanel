export const messageFormats = [
    { value: 0, name: 'General' },
    { value: 1, name: 'Discord' }
];

export enum WebhookTrigger {
    None,
    All,
    ServerCreated,
    ServerEdited,
    ServerDeleted,
    ServerStatusChanged
}

export interface IWebhook {
    webhookId: string;
    name: string;
    url: string;
    enabled: boolean;
    messageFormat: number;
    webhookTriggers: string[];
    optionalHeaders: any[];
    createdAt: Date;
    lastModifiedAt: Date;
}

export interface INewWebhook {
    name: string;
    url: string;
    enabled: boolean;
    messageFormat: number;
    webhookTriggers: string[];
    optionalHeaders: { key: string; value: string }[];
}

export interface IEditWebhook extends INewWebhook { }

/* API */
export interface IRawGetWebhookResponse {
    webhookId: string;
    name: string;
    url: string;
    enabled: boolean;
    messageFormat: number;
    webhookTriggers: WebhookTrigger[];
    optionalHeaders: { key: string; value: string }[];
    createdAt: Date
    lastModifiedAt: Date
}

export interface IRawGetWebhookListResponse extends Array<IRawGetWebhookResponse> { }

export interface ICreateWebhookRequest {
    name: string;
    url: string;
    enabled: boolean;
    messageFormat: number;
    webhookTriggers: any;
    optionalHeaders: Record<string, Partial<any>>;
}


export interface IUpdateWebhookRequest extends ICreateWebhookRequest { }

export function convertWebhookHeaderArrayToObject(headers: any[]) {
    const headerObject: Record<string, Partial<any>> = {};
    headers.forEach((header) => {
        headerObject[header.key] = header.value;
    });
    return headerObject;
}

// get all string enum keys, minus the first two elements (none, all)
export function getCustomTriggers(): string[] {
    return Object.values(WebhookTrigger)
        .slice(2)
        .filter((element) => typeof element === 'string')
        .map((element) => element as string);
}

export function convertRawHeaderInput(rawHeaderInput: string): { key: string; value: string }[] {
    return rawHeaderInput.match(/[^\r\n]+/g)?.map((line: string) => {
        const [key, value] = line.split(':');
        return { key, value };
    }) ?? [];
}

export function convertToRawHeaderInput(headers: { key: string; value: string }[]): string {
    return Object.entries(headers)
        .map((header) => `${header[0]}:${header[1]}`)
        .join('\n') ?? '';
}


// Check if the raw header input is matched the "key:value" format, empty lines or lines with spaces are allowed
export function isRawHeaderInputValid(rawInput: string): boolean {
    const lines = rawInput.split('\n');
    const regex = /^.+:.+$/;
    return lines.every(line => {
        line = line.trim();
        return line === '' || regex.test(line);
    });
}