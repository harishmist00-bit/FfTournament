import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

/**
 * Centralised Axios instance. Every network call in the app goes through this.
 * The mock services in this folder do not call it yet; when you wire Django,
 * swap each mock body for the `api.get/post/put/delete` call shown in its comment.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

export const TOKEN_KEYS = { access: 'ffba_access', refresh: 'ffba_refresh' } as const;

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(TOKEN_KEYS.access);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing: Promise<string> | null = null;
api.interceptors.response.use(
  r => r,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    const refresh = localStorage.getItem(TOKEN_KEYS.refresh);
    if (error.response?.status === 401 && original && !original._retry && refresh) {
      original._retry = true;
      refreshing ??= axios
        .post<{ access: string }>(`${api.defaults.baseURL}/auth/refresh/`, { refresh })
        .then(r => r.data.access)
        .finally(() => { refreshing = null; });
      try {
        const access = await refreshing;
        localStorage.setItem(TOKEN_KEYS.access, access);
        original.headers.Authorization = `Bearer ${access}`;
        return api(original);
      } catch {
        localStorage.removeItem(TOKEN_KEYS.access);
        localStorage.removeItem(TOKEN_KEYS.refresh);
      }
    }
    return Promise.reject(error);
  },
);

/** Simulates network latency for mock services. Remove when the real API is connected. */
export const mock = <T>(fn: () => T, ms = 450): Promise<T> =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      try { resolve(structuredClone(fn())); } catch (e) { reject(e); }
    }, ms);
  });
