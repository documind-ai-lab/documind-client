const DEFAULT_API_BASE_URL = "/api";
const DEFAULT_OWNER_ID = "7f0d8c54-7e3a-4a7f-b4b2-2c8f8c5a1d6e";

export const runtimeConfig = {
  apiBaseUrl: normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL),
  ownerId: import.meta.env.VITE_OWNER_ID ?? DEFAULT_OWNER_ID
};

function normalizeBaseUrl(value: string): string {
  return value.replace(/\/+$/, "");
}
