import { env } from '../config/env';
import { tokenStore } from './token-store';
import { businessStore } from './business-store';

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
  signal?: AbortSignal | undefined;
  /** Internal: skip the refresh-retry (used by the refresh call itself). */
  skipAuthRetry?: boolean;
}

/**
 * Centralized API client. Every request sends cookies (HttpOnly refresh) and
 * the in-memory access token as a Bearer header — never reads tokens from
 * localStorage. Components/pages must NOT call fetch directly; they go through
 * typed resource modules that use this client.
 */
async function rawRequest<T>(path: string, opts: RequestOptions): Promise<T> {
  const init: RequestInit = {
    method: opts.method ?? 'GET',
    credentials: 'include',
  };
  const headers: Record<string, string> = {};
  const token = tokenStore.get();
  if (token) headers.authorization = `Bearer ${token}`;
  const businessId = businessStore.get();
  if (businessId) headers['x-business-id'] = businessId;
  if (opts.body !== undefined) {
    headers['content-type'] = 'application/json';
    init.body = JSON.stringify(opts.body);
  }
  init.headers = headers;
  if (opts.signal) init.signal = opts.signal;

  const res = await fetch(`${env.apiBaseUrl}${path}`, init);

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

/* ---- Single-flight transparent refresh on 401 ---- */

let refreshing: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  try {
    const data = await rawRequest<{ accessToken?: string }>('/auth/refresh', {
      method: 'POST',
      skipAuthRetry: true,
    });
    const next = data?.accessToken ?? null;
    tokenStore.set(next);
    return next;
  } catch {
    tokenStore.clear();
    return null;
  }
}

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  try {
    return await rawRequest<T>(path, opts);
  } catch (err) {
    const is401 = err instanceof ApiRequestError && err.status === 401;
    if (!is401 || opts.skipAuthRetry) throw err;

    // Coalesce concurrent 401s into one refresh round-trip.
    refreshing ??= refreshAccessToken();
    const token = await refreshing;
    refreshing = null;
    if (!token) throw err;

    return rawRequest<T>(path, { ...opts, skipAuthRetry: true });
  }
}

export const apiClient = {
  get: <T>(path: string, signal?: AbortSignal) => request<T>(path, { signal }),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
