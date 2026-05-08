import { getToken } from "@/services/auth";

async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = await getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export async function getFetcher<T = unknown>(
  path: string,
  params?: Record<string, string | number | undefined>,
): Promise<T> {
  const url = new URL(path, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  const headers = await getAuthHeaders();
  const res = await fetch(url.toString(), { method: "GET", headers });
  return res.json();
}

export async function postFetcher<T = unknown>(
  path: string,
  body?: unknown,
): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(path, {
    method: "POST",
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

export async function putFetcher<T = unknown>(
  path: string,
  body?: unknown,
): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(path, {
    method: "PUT",
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

export async function deleteFetcher<T = unknown>(
  path: string,
): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(path, { method: "DELETE", headers });
  return res.json();
}
