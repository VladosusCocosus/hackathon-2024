
const baseURL = import.meta.env.RENDERER_VITE_BASE_URL

export function request(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const token = window.store.get('accessToken')

  const headers =  { 'Content-Type': 'application/json' }

  return fetch((baseURL ?? '') + input, {...init, credentials: 'same-origin', headers: {...headers, ...init?.headers, 'Authorization': 'Bearer ' + token}})
}
