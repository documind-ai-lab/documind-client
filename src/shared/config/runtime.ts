const DEFAULT_API_BASE_URL = "/api";

export const runtimeConfig = {
  apiBaseUrl: normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL)
};

function normalizeBaseUrl(value: string): string {
  return value.replace(/\/+$/, "");
}
