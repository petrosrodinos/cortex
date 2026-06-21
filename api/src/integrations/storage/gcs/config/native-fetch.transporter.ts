import { Readable } from 'node:stream';
import { GaxiosError } from 'gaxios';

type RequestOptions = {
    url?: string;
    uri?: string;
    method?: string;
    headers?: Record<string, string | number | boolean | undefined>;
    params?: Record<string, string | number | boolean | undefined | null>;
    data?: unknown;
    body?: unknown;
    responseType?: string;
    signal?: unknown;
    validateStatus?: (status: number) => boolean;
    timeout?: number;
};

type TransporterResponse<T = unknown> = {
    config: RequestOptions;
    data: T;
    status: number;
    statusText: string;
    headers: Record<string, string>;
};

function isNodeReadable(value: unknown): value is Readable {
    return (
        typeof value === 'object' &&
        value !== null &&
        typeof (value as Readable).pipe === 'function'
    );
}

function toHeaderRecord(headers: Headers): Record<string, string> {
    const record: Record<string, string> = {};
    headers.forEach((value, key) => {
        record[key.toLowerCase()] = value;
    });
    return record;
}

function toRequestHeaders(
    headers: Record<string, string | number | boolean | undefined> | undefined,
): Headers {
    const record: Record<string, string> = {};

    for (const [key, value] of Object.entries(headers ?? {})) {
        if (value !== undefined && value !== null) {
            record[key] = String(value);
        }
    }

    return new Headers(record);
}

function toNativeAbortSignal(signal: unknown): AbortSignal | undefined {
    if (!signal) {
        return undefined;
    }

    if (signal instanceof AbortSignal) {
        return signal;
    }

    const foreignSignal = signal as {
        aborted?: boolean;
        addEventListener?: (
            type: string,
            listener: () => void,
            options?: { once?: boolean },
        ) => void;
    };

    if (typeof foreignSignal.aborted !== 'boolean') {
        return undefined;
    }

    const controller = new AbortController();

    if (foreignSignal.aborted) {
        controller.abort();
        return controller.signal;
    }

    foreignSignal.addEventListener?.('abort', () => controller.abort(), {
        once: true,
    });

    return controller.signal;
}

function buildRequestBody(
    opts: RequestOptions,
    headers: Headers,
): BodyInit | undefined {
    const payload = opts.body ?? opts.data;

    if (payload === undefined || payload === null) {
        return undefined;
    }

    if (
        typeof payload === 'string' ||
        payload instanceof Blob ||
        payload instanceof ArrayBuffer ||
        payload instanceof URLSearchParams ||
        ArrayBuffer.isView(payload)
    ) {
        return payload as BodyInit;
    }

    if (isNodeReadable(payload)) {
        return Readable.toWeb(payload) as BodyInit;
    }

    if (headers.get('content-type')?.includes('application/x-www-form-urlencoded')) {
        return new URLSearchParams(payload as Record<string, string>);
    }

    if (!headers.has('content-type')) {
        headers.set('content-type', 'application/json');
    }

    return JSON.stringify(payload);
}

async function readResponseData(
    response: Response,
    responseType?: string,
): Promise<unknown> {
    if (response.status === 204) {
        return '';
    }

    switch (responseType) {
        case 'stream':
            return response.body;
        case 'arraybuffer':
            return response.arrayBuffer();
        case 'blob':
            return response.blob();
        case 'text':
            return response.text();
        case 'json':
        default: {
            const text = await response.text();
            if (!text) {
                return '';
            }

            try {
                return JSON.parse(text);
            } catch {
                return text;
            }
        }
    }
}

export class NativeFetchTransporter {
    defaults: Partial<RequestOptions> = {};

    configure(opts: RequestOptions = {}): RequestOptions {
        opts.headers = opts.headers || {};
        return opts;
    }

    async request<T = unknown>(options: RequestOptions): Promise<TransporterResponse<T>> {
        const opts = this.configure({ ...this.defaults, ...options });
        const urlValue = opts.url ?? opts.uri;

        if (!urlValue) {
            throw new Error('URL is required.');
        }

        const url = new URL(String(urlValue));

        if (opts.params) {
            for (const [key, value] of Object.entries(opts.params)) {
                if (value !== undefined && value !== null) {
                    url.searchParams.append(key, String(value));
                }
            }
        }

        const headers = toRequestHeaders(opts.headers);
        const body = buildRequestBody(opts, headers);
        const method = (opts.method ?? 'GET').toUpperCase();
        const requestInit: RequestInit & { duplex?: 'half' } = {
            method,
            headers,
        };

        const signal = toNativeAbortSignal(opts.signal);
        if (signal) {
            requestInit.signal = signal;
        }

        if (body !== undefined && method !== 'GET' && method !== 'HEAD') {
            requestInit.body = body;
            if (isNodeReadable(opts.body ?? opts.data)) {
                requestInit.duplex = 'half';
            }
        }

        const response = await fetch(url, requestInit);
        const data = await readResponseData(response, opts.responseType);
        const gaxiosResponse: TransporterResponse<T> = {
            config: opts,
            data: data as T,
            status: response.status,
            statusText: response.statusText,
            headers: toHeaderRecord(response.headers),
        };

        const validateStatus =
            opts.validateStatus ??
            ((status: number) => status >= 200 && status < 300);

        if (!validateStatus(response.status)) {
            throw new GaxiosError(
                `Request failed with status code ${response.status}`,
                opts as never,
                gaxiosResponse as never,
            );
        }

        return gaxiosResponse;
    }
}
