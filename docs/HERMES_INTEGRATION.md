# SupplierHut Problems — Hermes Agent v0.22.5 Integration Guide

This guide documents the secure, versioned REST API (`/api/agent/v1/`) built to enable **Hermes Agent v0.22.5** (running on your Linux workstation) to inspect, curate, moderate, and administer platform functionality on [SupplierHut Solutions Bangladesh](https://supplier-hut-problems.vercel.app/).

---

## 1. Architecture & Preserved Components

```
┌────────────────────────────────────────────────────────┐
│                   Linux Workstation                    │
│                                                        │
│  Hermes Agent v0.22.5 (~/.hermes/)                     │
│    ├── Model Provider: FreeLLMAPI (localhost:3001/v1)  │ [PRESERVED]
│    ├── Environment: ~/.hermes/supplierhut.env (chmod 600)
│    └── Instructions: ~/.hermes/instructions/           │
└───────────────────────────┬────────────────────────────┘
                            │ HTTPS / Bearer Token
                            ▼
┌────────────────────────────────────────────────────────┐
│                Vercel Serverless (Next.js)             │
│                                                        │
│  /api/agent/v1/                                        │
│    ├── Constant-Time Token Auth (HERMES_API_TOKEN)     │
│    ├── In-Memory Sliding Rate Limiter (60 req/min)     │
│    ├── OpenAPI 3.1.0 Spec (/openapi.json)              │
│    └── Audit Logging (hermes-agent actor)              │
│                                                        │
│  External Integrations:                                │
│    ├── Neon PostgreSQL (@neondatabase/serverless)      │ [PRESERVED]
│    └── Clerk Authentication (@clerk/nextjs)            │ [PRESERVED]
└────────────────────────────────────────────────────────┘
```

* **Framework**: Next.js 16.4.2 App Router with Turbopack & React 19.
* **Authentication**: Clerk authentication is fully preserved for users and administrators. The Hermes API uses a dedicated server-only token (`HERMES_API_TOKEN`).
* **Database**: Neon PostgreSQL connection pooling via `DATABASE_URL` (with fallback to unpooled `DATABASE_URL_UNPOOLED` and local data-store) is preserved without any data loss or table truncation.
* **Local LLM**: FreeLLMAPI running at `http://localhost:3001/v1` is untouched.

---

## 2. Security Guardrails

1. **Dedicated Token (`HERMES_API_TOKEN`)**:
   * Evaluated via constant-time comparison (`crypto.timingSafeEqual`) to prevent timing side-channel attacks.
   * Never exposed to frontend bundles, logs, or response payloads.
2. **Rate Limiting**:
   * Enforces a sliding window of **60 requests per minute** per client IP / identifier. Returns HTTP `429 Too Many Requests` with `Retry-After` header when exceeded.
3. **Audit Trail**:
   * All write, update, and lifecycle mutations performed by Hermes Agent are automatically logged into the immutable `audit_logs` table with actor `hermes-agent@supplierhut.internal`.
4. **Destructive Action Confirmation Gate**:
   * Permanent problem deletion (`DELETE /api/agent/v1/problems/[id]`) is blocked by default (HTTP 403) unless **both** `confirm_destructive=true` query parameter AND `X-Owner-Confirmation: confirmed` header are provided.
   * The platform strongly recommends archiving via `POST /api/agent/v1/problems/[id]/archive` instead of permanent deletion.
5. **Privacy Protection**:
   * User lookup (`/api/agent/v1/users`) returns sanitized public profile information. Passwords, hashed credentials, Clerk session tokens, and private keys are never exposed.

---

## 3. OpenAPI 3.1.0 Specification

The complete interactive schema is served directly by the platform at:
* **Production**: `https://supplier-hut-problems.vercel.app/api/agent/v1/openapi.json`
* **Local Development**: `http://localhost:3000/api/agent/v1/openapi.json`

---

## 4. Supported Endpoints Catalog

### 4.1 System & Capabilities

#### Check Health & Connectivity
```bash
curl -X GET "https://supplier-hut-problems.vercel.app/api/agent/v1/health"
```
**Response (200 OK)**:
```json
{
  "status": "ok",
  "api_version": "v1",
  "agent_operator": "Hermes Agent v0.22.5",
  "timestamp": "2026-10-26T12:00:00.000Z",
  "services": {
    "neon_database": "connected",
    "clerk_authentication": "configured",
    "hermes_token": "configured"
  },
  "documentation_url": "/api/agent/v1/openapi.json"
}
```

#### Introspect Agent Capabilities
```bash
curl -X GET "https://supplier-hut-problems.vercel.app/api/agent/v1/capabilities" \
  -H "Authorization: Bearer $HERMES_API_TOKEN"
```

#### List Categories & Sectors
```bash
curl -X GET "https://supplier-hut-problems.vercel.app/api/agent/v1/categories" \
  -H "Authorization: Bearer $HERMES_API_TOKEN"
```

#### Read Platform Configuration Settings
```bash
curl -X GET "https://supplier-hut-problems.vercel.app/api/agent/v1/settings" \
  -H "Authorization: Bearer $HERMES_API_TOKEN"
```

---

### 4.2 Problem Listings Management

#### Search and Filter Problems
```bash
curl -X GET "https://supplier-hut-problems.vercel.app/api/agent/v1/problems?sector=Agriculture&status=Validated&limit=10" \
  -H "Authorization: Bearer $HERMES_API_TOKEN"
```

#### Dry-Run Problem Creation (Validation without persistence)
```bash
curl -X POST "https://supplier-hut-problems.vercel.app/api/agent/v1/problems" \
  -H "Authorization: Bearer $HERMES_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dry_run": true,
    "title": "Solar Powered Cold Storage for Bogura Potato Farmers",
    "summary": "Post-harvest potato losses reach 28% in northern Bangladesh due to grid outages.",
    "sector": "Agriculture",
    "location": "Bogura, Rajshahi Division",
    "division": "Rajshahi"
  }'
```
**Response (200 OK)**:
```json
{
  "dry_run": true,
  "valid": true,
  "message": "Payload is valid and conforms to platform schema. No changes were written.",
  "preview": { ... }
}
```

#### Create an Unpublished Draft Problem
```bash
curl -X POST "https://supplier-hut-problems.vercel.app/api/agent/v1/problems" \
  -H "Authorization: Bearer $HERMES_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dry_run": false,
    "title": "Solar Powered Cold Storage for Bogura Potato Farmers",
    "summary": "Post-harvest potato losses reach 28% in northern Bangladesh due to grid outages.",
    "sector": "Agriculture",
    "location": "Bogura, Rajshahi Division",
    "division": "Rajshahi",
    "validationStatus": "Unverified",
    "opportunityType": "Open Problem",
    "difficulty": "Moderate",
    "estimatedStartupCostMinBDT": 35000,
    "estimatedStartupCostMaxBDT": 90000
  }'
```

#### Retrieve Single Problem Details
```bash
curl -X GET "https://supplier-hut-problems.vercel.app/api/agent/v1/problems/prob-1718000000" \
  -H "Authorization: Bearer $HERMES_API_TOKEN"
```

#### Update Problem Fields
```bash
curl -X PATCH "https://supplier-hut-problems.vercel.app/api/agent/v1/problems/prob-1718000000" \
  -H "Authorization: Bearer $HERMES_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "summary": "Updated field survey: 14 farmer interviews completed in Shibganj upazila.",
    "confidenceScorePercent": 75
  }'
```

#### Publish / Validate Problem
```bash
curl -X POST "https://supplier-hut-problems.vercel.app/api/agent/v1/problems/prob-1718000000/publish" \
  -H "Authorization: Bearer $HERMES_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "status": "Validated" }'
```

#### Unpublish Problem (Revert to Draft)
```bash
curl -X POST "https://supplier-hut-problems.vercel.app/api/agent/v1/problems/prob-1718000000/unpublish" \
  -H "Authorization: Bearer $HERMES_API_TOKEN"
```

#### Safely Archive Problem
```bash
curl -X POST "https://supplier-hut-problems.vercel.app/api/agent/v1/problems/prob-1718000000/archive" \
  -H "Authorization: Bearer $HERMES_API_TOKEN"
```

#### Guarded Permanent Deletion (Requires Confirmation)
```bash
# Blocked without confirmation (Returns 403 Forbidden):
curl -X DELETE "https://supplier-hut-problems.vercel.app/api/agent/v1/problems/prob-1718000000" \
  -H "Authorization: Bearer $HERMES_API_TOKEN"

# Permitted with explicit confirmation:
curl -X DELETE "https://supplier-hut-problems.vercel.app/api/agent/v1/problems/prob-1718000000?confirm_destructive=true" \
  -H "Authorization: Bearer $HERMES_API_TOKEN" \
  -H "X-Owner-Confirmation: confirmed"
```

---

### 4.3 Moderation & Abuse Reports

#### List Reports
```bash
curl -X GET "https://supplier-hut-problems.vercel.app/api/agent/v1/reports?status=Open" \
  -H "Authorization: Bearer $HERMES_API_TOKEN"
```

#### Resolve or Dismiss a Report
```bash
curl -X PATCH "https://supplier-hut-problems.vercel.app/api/agent/v1/reports/rep-1718000000" \
  -H "Authorization: Bearer $HERMES_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "status": "Resolved", "notes": "Listing verified against authentic field interview citations." }'
```

---

### 4.4 Proposals Review & Evaluation

#### List Proposals
```bash
curl -X GET "https://supplier-hut-problems.vercel.app/api/agent/v1/proposals?status=Submitted" \
  -H "Authorization: Bearer $HERMES_API_TOKEN"
```

#### Update Proposal Status
```bash
curl -X PATCH "https://supplier-hut-problems.vercel.app/api/agent/v1/proposals/prop-1718000000" \
  -H "Authorization: Bearer $HERMES_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "status": "Shortlisted", "reviewerNotes": "Technical architecture verified for mobile IoT sensors." }'
```

---

### 4.5 Analytics, Sanitized Users, and Audit Trail

#### Platform Analytics & Metrics
```bash
curl -X GET "https://supplier-hut-problems.vercel.app/api/agent/v1/analytics" \
  -H "Authorization: Bearer $HERMES_API_TOKEN"
```

#### Sanitized User Directory
```bash
curl -X GET "https://supplier-hut-problems.vercel.app/api/agent/v1/users" \
  -H "Authorization: Bearer $HERMES_API_TOKEN"
```

#### Audit Trail
```bash
curl -X GET "https://supplier-hut-problems.vercel.app/api/agent/v1/audit-logs?limit=25" \
  -H "Authorization: Bearer $HERMES_API_TOKEN"
```

---

## 5. Unsupported Capabilities List

The following capabilities are deliberately **not exposed via the API** by design:

| Unsupported Operation | Rationale |
| :--- | :--- |
| **Direct Escrow Payouts / Disbursement** | Payment gateways (bKash/Nagad/SSLCommerz) require formal banking reconciliation. No money is disbursed automatically. |
| **User Account Deletion / Password Changes** | User identities and security credentials must be managed via Clerk Dashboard to prevent accidental lockout. |
| **Database DROP / TRUNCATE Tables** | Schema integrity is immutable. Only safe `SELECT`, `INSERT`, `UPDATE`, and itemized `DELETE` are permitted. |
| **Bulk Unconditional Deletion** | Prevents automated agents from purging multiple records without itemized audit records. |

---

## 6. Exact Vercel Environment Configuration

1. Generate a secure, 64-character hexadecimal token on your Linux terminal:
   ```bash
   openssl rand -hex 32
   ```
2. Open your Vercel Project Dashboard:
   * **Project** → **Settings** → **Environment Variables**
3. Add the following variable:
   * **Key**: `HERMES_API_TOKEN`
   * **Value**: `<paste generated 64-character token>`
   * **Environments**: Check **Production**, **Preview**, and **Development**
4. Redeploy the latest commit on Vercel to activate the variable.

---

## 7. Exact Linux Workstation Setup for Hermes Agent v0.22.5

Hermes Agent runs under `~/.hermes/` and uses FreeLLMAPI at `http://localhost:3001/v1`. The existing FreeLLMAPI Docker container and provider settings must remain untouched.

### Step 1: Create Secure Local Configuration File
Run these commands on your Linux terminal:
```bash
mkdir -p ~/.hermes/instructions

cat << 'EOF' > ~/.hermes/supplierhut.env
# SupplierHut Solutions - Hermes Agent v0.22.5 Environment
SUPPLIERHUT_BASE_URL="https://supplier-hut-problems.vercel.app/api/agent/v1"
HERMES_API_TOKEN="PASTE_YOUR_GENERATED_TOKEN_HERE"
EOF

# Enforce strict user-only read/write permissions
chmod 600 ~/.hermes/supplierhut.env
```

### Step 2: Add SupplierHut Agent Instructions
Create the Hermes agent instruction file:
```bash
cat << 'EOF' > ~/.hermes/instructions/supplierhut_admin.md
# SupplierHut Solutions - Platform Administration Protocol

You are an authorized administrator assistant for SupplierHut Solutions (https://supplier-hut-problems.vercel.app/).
Your operations run against the versioned REST API at:
$SUPPLIERHUT_BASE_URL (Default: https://supplier-hut-problems.vercel.app/api/agent/v1)

AUTHENTICATION:
All private endpoints require:
Authorization: Bearer $HERMES_API_TOKEN

OPERATIONAL RULES:
1. NEVER fabricate data, market sizes, or customer claims. Label hypotheses clearly.
2. When creating or editing problem listings, use dry_run: true first to validate schema.
3. New problems must be created in "Unverified" status unless supported by verified field research.
4. For destructive operations, recommend archiving via POST /problems/{id}/archive.
5. Permanent deletion requires explicit owner confirmation (confirm_destructive=true & X-Owner-Confirmation: confirmed).
6. Respect the 60 requests/minute rate limit.
EOF
```

---

## 8. Safe Smoke-Test & Verification Procedure

Run the automated smoke test script provided in the repository:
```bash
# Export your local or production credentials
source ~/.hermes/supplierhut.env

# Execute the test suite
./scripts/smoke_test_hermes_api.sh
```

### Manual Verification Flow:
1. **Verify Health**:
   ```bash
   curl -s "https://supplier-hut-problems.vercel.app/api/agent/v1/health" | jq .
   ```
2. **Verify Auth Rejection**:
   ```bash
   curl -s -o /dev/null -w "%{http_code}\n" "https://supplier-hut-problems.vercel.app/api/agent/v1/capabilities"
   # Must return: 401
   ```
3. **Validate Draft via Dry-Run**:
   ```bash
   curl -s -X POST "https://supplier-hut-problems.vercel.app/api/agent/v1/problems" \
     -H "Authorization: Bearer $HERMES_API_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"dry_run": true, "title": "Field Test Verification", "summary": "Harmless validation dry-run.", "sector": "Technology"}' | jq .
   ```
4. **Create Harmless Draft**:
   ```bash
   DRAFT=$(curl -s -X POST "https://supplier-hut-problems.vercel.app/api/agent/v1/problems" \
     -H "Authorization: Bearer $HERMES_API_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"dry_run": false, "title": "Hermes Verification Draft", "summary": "Temporary verification problem for agent audit.", "sector": "Technology", "validationStatus": "Unverified"}')
   PROB_ID=$(echo $DRAFT | jq -r .problem.id)
   echo "Created: $PROB_ID"
   ```
5. **Archive Draft**:
   ```bash
   curl -s -X POST "https://supplier-hut-problems.vercel.app/api/agent/v1/problems/$PROB_ID/archive" \
     -H "Authorization: Bearer $HERMES_API_TOKEN" | jq .
   ```

---

## 9. Token Revocation & Rotation

If the token is ever compromised or rotated:
1. Generate a replacement: `openssl rand -hex 32`.
2. Update `HERMES_API_TOKEN` in the **Vercel Project Dashboard** and redeploy. All previous tokens will immediately receive `401 Unauthorized`.
3. Update `HERMES_API_TOKEN` in `~/.hermes/supplierhut.env` on your Linux machine.
