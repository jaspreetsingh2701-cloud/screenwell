# Architecture

## Application shape

The frontend is a React 19 + TypeScript single-page application built with Vite.

```text
src/
├── app/          # Providers, router and shared application layout
├── components/   # Shared UI and reusable components
├── features/     # Candidate, review, trial and drug capabilities
├── hooks/        # Shared React hooks
├── lib/          # API client and shared business utilities
├── mocks/        # MSW worker, handlers and synthetic data
├── styles/       # Global styles
└── types/        # Shared TypeScript domain types

tests/
├── integration/
└── unit/
```

## Data flow

1. A feature hook or API module requests data through the shared API client.
2. MSW intercepts the request and returns a deterministic synthetic response.
3. TanStack Query manages server-state caching, loading, errors and mutations.
4. Feature components render the data and capture coordinator actions.
5. Review mutations use optimistic updates; failed requests restore the previous state.

## State responsibilities

| State               | Owner                | Use                                               |
| ------------------- | -------------------- | ------------------------------------------------- |
| Remote/server state | TanStack Query       | Candidates, trial/drug data and review mutations |
| Temporary UI state  | React component state | Dialogs, tabs and transient interactions         |
| Shared client state | Zustand (where used) | Client-side state that needs to be shared        |
| Mock service state  | MSW handlers and mock data | Synthetic API behavior for the demo         |

Keep business rules in feature or shared logic rather than duplicating them across presentation components.
