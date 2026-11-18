# Performance and testing

## Real-user performance monitoring

The app already mounts Vercel Analytics and Vercel Speed Insights in `src/App.tsx`.

- **Vercel Analytics** provides usage analytics.
- **Vercel Speed Insights** collects real-user performance measurements when enabled for the deployed Vercel project and when visits generate data.
- No numeric performance score is recorded in this document because live measurements must come from the deployed project.

Open the Vercel project dashboard and select **Speed Insights** to review field data. Check mobile and desktop separately and inspect the available route-level data.

## Core Web Vitals

Use these targets when reviewing field performance:

| Metric | What it indicates                       | Good target |
| ------ | --------------------------------------- | ----------- |
| LCP    | Loading performance of the main content | ≤ 2.5 s     |
| INP    | Responsiveness to user interactions     | ≤ 200 ms    |
| CLS    | Unexpected visual movement              | ≤ 0.1       |

Vercel Speed Insights can also expose supporting metrics such as FCP and TTFB. These are performance indicators, not substitutes for the Core Web Vitals.

## Lab checks

Use Lighthouse or PageSpeed Insights against the deployed URL to get reproducible lab diagnostics. Run at least:

- Mobile Lighthouse
- Desktop Lighthouse

Record the URL, date, device profile, Lighthouse Performance score, LCP, INP/TBT, CLS and any major opportunities. Lab results are a controlled snapshot; real-user field data should be reviewed separately.

## Current instrumentation status

| Item                            | Status                                                                     |
| ------------------------------- | -------------------------------------------------------------------------- |
| Vercel Analytics component      | Integrated in the app                                                      |
| Vercel Speed Insights component | Integrated in the app                                                      |
| Live Web Vitals values          | Not verified here; check the Vercel dashboard after deployment and traffic |
| Lighthouse baseline             | Not captured yet                                                           |

## Automated tests

The project uses Vitest, React Testing Library and MSW.

Run the available commands from the repository root:

```bash
npm run test
npm run test:watch
npm run lint
npm run typecheck
npm run build
```

Playwright end-to-end testing is a future improvement. There is currently no `test:e2e` script in `package.json`.
