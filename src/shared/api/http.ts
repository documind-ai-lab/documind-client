import { runtimeConfig } from "@/shared/config/runtime";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${runtimeConfig.apiBaseUrl}${path}`, {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new ApiError("API 요청에 실패했습니다.", response.status);
  }

  return (await response.json()) as T;
}

export async function apiGetWithOwner<T>(path: string): Promise<T> {
  const response = await fetch(`${runtimeConfig.apiBaseUrl}${path}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "X-Owner-Id": runtimeConfig.ownerId
    }
  });

  if (!response.ok) {
    throw new ApiError("API 요청에 실패했습니다.", response.status);
  }

  return (await response.json()) as T;
}

export async function apiPost<TResponse, TBody extends Record<string, unknown>>(
  path: string,
  body: TBody
): Promise<TResponse> {
  const response = await fetch(`${runtimeConfig.apiBaseUrl}${path}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new ApiError("API 요청에 실패했습니다.", response.status);
  }

  return (await response.json()) as TResponse;
}
