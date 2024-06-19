
const baseURL = import.meta.env.RENDERER_VITE_BASE_URL

export function request(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  return fetch(baseURL ?? '' + input, init)
}
