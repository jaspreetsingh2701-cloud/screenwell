import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { handlers } from '@/mocks/handlers'

const originalFetch = globalThis.fetch.bind(globalThis)
globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
  if (typeof input === 'string' && input.startsWith('/')) {
    return originalFetch(new URL(input, window.location.origin), init)
  }
  return originalFetch(input, init)
}) as typeof fetch

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => cleanup())
afterAll(() => server.close())
