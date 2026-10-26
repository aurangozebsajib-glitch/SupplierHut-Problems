# Hermes capability inventory

This inventory describes what the repository currently implements. It is not a claim that the API is deployed or that database records match the website.

## Current API surface

| Operation | Authentication | Current behavior |
|---|---|---|
| `GET /api/agent/v1/health` | Public | Returns API status only. |
| `GET /api/agent/v1/capabilities` | `HERMES_API_TOKEN` bearer token | Returns supported operations, read-only status policy, unsupported capabilities, and known data limitations. |
| `GET /api/agent/v1/problems` | `HERMES_API_TOKEN` bearer token | Read-only paginated problem query. The intended query statuses are `Evidence Supported` and `Validated`. `data_source: database` means the response came from a Neon query and does not prove synchronization with all website data; `data_source: seed_data` means server fallback, not verified live or authoritative website data. List fallback may occur when the database is unconfigured or a query fails. |
| `GET /api/agent/v1/problems/{id}` | `HERMES_API_TOKEN` bearer token | Read-only detail for an allowed status; response has the record directly under `problem`, plus `data_source`. It may use a matching seed record if the database is unconfigured, the query fails, or a successful lookup finds no matching database record. |
| `GET /api/agent/v1/analytics` | `HERMES_API_TOKEN` bearer token | Read-only aggregate status counts. `data_source: database` means the response came from a Neon query and does not prove synchronization with all website data; `data_source: seed_data` means server fallback, not verified live or authoritative website data. Analytics fallback may occur when the database is unconfigured or a query fails. |
| `GET /api/agent/v1/openapi.json` | Public | OpenAPI contract for currently supported operations. |

`HERMES_API_TOKEN` is a read API credential, not an admin credential. No Hermes write API is currently supported. The website's separate Clerk admin flows do not make this bearer token an authorized Clerk admin session.

## Website features that do not have a supported Hermes API

The application has client data-store functions for problem submissions, status changes, deletion, proposal submissions and review, discussion comments, reports and report review, user profile state, and audit entries. The admin interface also presents database table setup and audit logging. These are not currently exposed as Hermes resource APIs. The generic `/api/admin/actions` handler is not a safe content-management API and must not be used by Hermes as one.

There is no category/tag management API or category/tag table in the inspected database schema. Do not treat these as existing server-managed capabilities.

## Why writes are not enabled

The website's `getStoredProblems()` uses browser `localStorage` (`supplierhut_problems_v1`) in the browser and process memory initialized from seed data on the server. Website submissions and admin changes use that store. When database credentials exist, Hermes reads Neon `platform_problems` instead. Those stores are not synchronized.

The `platform_problems` schema contains a subset of the full TypeScript `Problem` model. It has `validation_status`, but no separate draft/publication state or optimistic concurrency/version column. The website currently renders its stored problem collection without a database-backed publication check. Adding Neon write endpoints before aligning persistence would therefore not make Hermes manage the same posts the website displays and could cause lost updates or unintended publication.

No schema migration, data import, backup, reconciliation, or cutover has been performed. Before enabling writes, each existing source must be backed up separately (browser export, seed snapshot, and Neon backup), duplicate/conflicting records reviewed, and the migration/cutover explicitly approved. Do not automatically overwrite or delete records.

## Minimum prerequisites for a write API

1. Establish one authoritative persistence layer used by website reads, submissions, admin actions, and Hermes. Add a reviewed compatibility plan for existing browser, seed, and Neon data before cutover.
2. Define explicit draft/publication fields and allowed transitions separately from evidence validation status. Preserve current website display behavior except where draft hiding is explicitly approved.
3. Use a distinct server-only Hermes admin credential/scope, never the existing read token or any Clerk/FreeLLMAPI credential. Keep Clerk session authorization for website admin actions. Treat the machine credential as separate service authorization, bind its actor identity, and audit every mutation.
4. Add allowlisted create/edit/status/transition APIs with validation, parameterized database writes, idempotency where appropriate, optimistic concurrency, and read-back verification.
5. Require a human-approved, record-specific confirmation/approval flow for publish and delete. A model-provided `confirm: true` alone is not proof of human approval.
6. Add isolated tests against a test database/fixtures for authorization, forbidden fields, validation, conflicts, audit entries, lifecycle transitions, confirmation, and read-back. Do not run mutation tests against production.

## Hermes integration instructions after a future API contract is approved

Do not update the local Hermes skill/client to call write routes that are not present in the deployed API. Once an implementation is separately approved and deployed:

1. Fetch `/api/agent/v1/capabilities` using the assigned credential and confirm the exact operations and permissions.
2. Fetch `/api/agent/v1/openapi.json` and update the existing local skill/client to match its versioned paths, schemas, statuses, error codes, confirmation flow, idempotency, and conflict handling.
3. Keep all credentials in Hermes's private secret storage and send them only in the `Authorization` header. Never put secrets into prompts, source code, URLs, logs, or model-visible output.
4. Test reads and writes only against an explicitly designated non-production environment until production access and migration are separately approved.

This repository change does not edit `~/.hermes`, deploy the website, alter production data, or configure a new machine credential.
