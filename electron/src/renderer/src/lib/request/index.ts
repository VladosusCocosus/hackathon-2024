
const baseURL = import.meta.env.RENDERER_VITE_BASE_URL

export async function request(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const token = window.store.get('accessToken')
  const refreshToken = window.store.get('refreshToken')

  const headers =  { 'Content-Type': 'application/json' }

  const response = await fetch((baseURL ?? '') + input, {...init, credentials: 'same-origin', headers: {...headers, ...init?.headers, 'Authorization': 'Bearer ' + token}})

  if (response.status === 401) {
    const response = await fetch((baseURL ?? '') + '/auth/refresh', {...init, method: 'POST', body: JSON.stringify({refresh: refreshToken}), credentials: 'same-origin', headers: {...headers, ...init?.headers, 'Authorization': 'Bearer ' + token}})
    if (response.ok) {
      const { accessToken } = await response.json()
      window.store.set('accessToken', accessToken)
      return  fetch((baseURL ?? '') + input, {...init, credentials: 'same-origin', headers: {...headers, ...init?.headers, 'Authorization': 'Bearer ' + accessToken}})
    }
  }

  return response
}
