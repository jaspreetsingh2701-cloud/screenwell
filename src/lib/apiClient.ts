export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })

  if (!response.ok) {
    let message = 'Something went wrong. Please try again.'
    try {
      const body = (await response.json()) as { message?: string }
      if (body.message) message = body.message
    } catch {
      // response had no JSON body, keep the default message
    }
    throw new ApiError(response.status, message)
  }

  return (await response.json()) as T
}
