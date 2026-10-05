import { env } from '../config/env';

export interface ApiError {
  code: string;
  message: string;
}

export class ApiRequestError extends Error {
  constructor(
    readonly status: number,
    readonly body: ApiError,
  ) {
    super(body.message);
    this.name = 'ApiRequestError';
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
}

/**
 * Centralized API client. Every request sends cookies (HttpOnly refresh/session)
 * and never reads tokens from localStorage. Components/pages must NOT call fetch
 * directly — they go through typed resource modules that use this client.
 */
async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const res = await fetch(`${env.apiBaseUrl}${path}`, {
    method: opts.method ?? 'GET',
    headers: opts.body ? { 'content-type': 'application/json' } : undefined,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    credentials: 'include',
    signal: opts.signal,
  });

  if (!res.ok) {
    let body: ApiError = { code: 'UNKNOWN', message: res.statusText };
    try {
      const parsed = (await res.json()) as { error?: ApiError };
      if (parsed.error) body = parsed.error;
    } catch {
      // non-JSON error response; keep the default body
    }
    throw new ApiRequestError(res.status, body);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const apiClient = {
  get: <T>(path: string, signal?: AbortSignal) => request<T>(path, { signal }),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
