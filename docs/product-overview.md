# Product overview

## Purpose

Screenwell is a demonstration application for clinical trial coordinators to review whether synthetic patient records appear to meet a trial's eligibility criteria.

The application presents AI-suggested verdicts, confidence and chart evidence. A coordinator reviews the evidence and confirms, changes or flags criteria before finalizing a screening.

## Main capabilities

- Candidate queue with search, filters, sorting and pagination.
- Screening funnel: Screened → Eligible → Consented → Enrolled.
- Review experience focused on criteria requiring attention.
- Clear distinction between AI suggestions and coordinator decisions.
- Missing or unclear information requires manual verification.
- Optimistic decision updates with a five-second undo window and rollback on request failure.
- Trial details, progress, confidence and supporting documents.
- Drug details and interim results.

## Demo boundary

All data is synthetic. The API and screening behavior are simulated with Mock Service Worker (MSW). This project does not make clinical determinations and is not intended for real patient data or clinical use.
