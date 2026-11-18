# Screenwell by Tilda Research

Screenwell helps clinical trial coordinators review whether synthetic patient records may qualify for a clinical trial. It presents AI-suggested eligibility verdicts, confidence and chart evidence, while keeping the coordinator responsible for confirming or changing each decision.

> **Demo only:** All data is synthetic. The API and AI screening behavior are simulated using MSW. Do not use this application for real patient data or clinical decisions.

## Features

- Candidate queue with debounced search, status filters, sorting and pagination.
- Screening funnel: Screened → Eligible → Consented → Enrolled.
- Review screen focused on criteria that need attention.
- Clear AI suggestion versus human decision labels.
- Missing-data handling with manual verification.
- Optimistic decisions with a five-second undo window and rollback on failure.
- Trial details, progress, AI confidence and documents.
- Drug details and interim results.
- Loading, empty and error states; responsive and keyboard-accessible interactions.

## Technology stack

| Layer                  | Technology                              |
| ---------------------- | --------------------------------------- |
| UI                     | React 19, TypeScript                    |
| Build                  | Vite                                    |
| Styling and components | Tailwind CSS, Radix UI                  |
| Routing                | React Router                            |
| Server state           | TanStack Query                          |
| Client state           | Zustand (where used)                    |
| API simulation         | Mock Service Worker (MSW)               |
| Tests                  | Vitest, React Testing Library           |
| Monitoring             | Vercel Analytics, Vercel Speed Insights |

## Getting started

Requires Node.js 20 or later.

```bash
git clone https://github.com/jaspreetsingh2701-cloud/screenwell.git
cd screenwell
npm ci
cp .env.example .env
npm run dev
```

Open http://localhost:5173.

## Available scripts

| Command                | Description                                |
| ---------------------- | ------------------------------------------ |
| `npm run dev`          | Start the Vite development server          |
| `npm run build`        | Type-check and create the production build |
| `npm run preview`      | Preview the production build               |
| `npm run test`         | Run unit and integration tests             |
| `npm run test:watch`   | Run tests in watch mode                    |
| `npm run lint`         | Run ESLint                                 |
| `npm run typecheck`    | Run TypeScript checks                      |
| `npm run format`       | Format project files                       |
| `npm run format:check` | Check formatting                           |

## Mock API behavior

The MSW layer simulates backend responses. The example environment variables are:

| Variable            | Example | Effect                                          |
| ------------------- | ------- | ----------------------------------------------- |
| `VITE_API_LATENCY`  | `600`   | Adds simulated response latency in milliseconds |
| `VITE_FAILURE_RATE` | `0.3`   | Configures a 30% simulated request failure rate |

Use these settings to inspect loading, error and optimistic rollback behavior.

## Performance

Vercel Analytics and Speed Insights are mounted in the application. Once the project is deployed and has generated traffic, use the Vercel dashboard to review real-user performance and Core Web Vitals. See [Performance and testing](docs/performance-and-testing.md) for the metrics and recommended Lighthouse checks.

## Documentation

See the [docs index](docs/README.md) for the short product, architecture and performance notes.

## AI-assisted development

AI tools assisted with implementation and debugging, MSW handler scenarios, test-case ideation and test authoring, and documentation. Suggestions and generated code were reviewed and validated as part of the development workflow.
