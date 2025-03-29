import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { getApiBaseUrl } from "./config";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Helper to handle date serialization properly
function dateReplacer(key: string, value: any): any {
  // Check if the value is a Date object
  if (value instanceof Date) {
    // Convert Date to ISO string for proper JSON serialization
    return value.toISOString();
  }
  return value;
}

/**
 * Makes an API request to the server.
 * The URL is automatically prefixed with the base API URL if it starts with '/api'.
 */
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // If the URL starts with '/api', prefix it with the base URL
  const fullUrl = url.startsWith('/api') 
    ? `${getApiBaseUrl()}${url}` 
    : url;
    
  const res = await fetch(fullUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    // Use the custom replacer function to properly handle Date objects
    body: data ? JSON.stringify(data, dateReplacer) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;
    // If the URL starts with '/api', prefix it with the base URL
    const fullUrl = url.startsWith('/api') 
      ? `${getApiBaseUrl()}${url}` 
      : url;

    const res = await fetch(fullUrl, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
