#!/usr/bin/env bash
# ==============================================================================
# SupplierHut Solutions - Hermes Agent API Smoke-Test Script
# Target: https://supplier-hut-problems.vercel.app/api/agent/v1/
# Default Local Target: http://localhost:3000/api/agent/v1/
# ==============================================================================
set -euo pipefail

BASE_URL="${SUPPLIERHUT_API_URL:-http://localhost:3000/api/agent/v1}"
TOKEN="${HERMES_API_TOKEN:-}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================================================${NC}"
echo -e "${BLUE} SupplierHut Solutions - Hermes Agent v0.22.5 API Smoke Test${NC}"
echo -e "${BLUE} Base URL: ${BASE_URL}${NC}"
echo -e "${BLUE}================================================================${NC}\n"

if [ -z "$TOKEN" ]; then
  echo -e "${YELLOW}[!] Note: HERMES_API_TOKEN environment variable is not set in this shell.${NC}"
  echo -e "${YELLOW}    Public endpoints (health, openapi) will be verified.${NC}"
  echo -e "${YELLOW}    To test private endpoints, export HERMES_API_TOKEN='your_token'${NC}\n"
fi

PASSED=0
FAILED=0

run_test() {
  local title="$1"
  local expected_status="$2"
  local curl_cmd="$3"

  echo -n "• Testing: ${title}... "
  
  response=$(eval "$curl_cmd -s -w '\n%{http_code}'")
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')

  if [ "$http_code" -eq "$expected_status" ]; then
    echo -e "${GREEN}PASSED${NC} (HTTP ${http_code})"
    PASSED=$((PASSED + 1))
    return 0
  else
    echo -e "${RED}FAILED${NC} (Expected ${expected_status}, got ${http_code})"
    echo "  Response snippet: $(echo "$body" | head -n 3)"
    FAILED=$((FAILED + 1))
    return 1
  fi
}

# 1. Health check (Public)
run_test "Health endpoint (Public)" 200 \
  "curl -X GET '${BASE_URL}/health'"

# 2. OpenAPI Specification (Public)
run_test "OpenAPI 3.1.0 JSON Spec (Public)" 200 \
  "curl -X GET '${BASE_URL}/openapi.json'"

# 3. Security: Unauthenticated request must return 401
run_test "Unauthenticated request rejection" 401 \
  "curl -X GET '${BASE_URL}/capabilities'"

# 4. Security: Invalid token must return 401
run_test "Invalid Bearer token rejection" 401 \
  "curl -X GET '${BASE_URL}/capabilities' -H 'Authorization: Bearer invalid-dummy-token-xyz'"

# If token is not provided, summarize public tests
if [ -z "$TOKEN" ]; then
  echo -e "\n${YELLOW}----------------------------------------------------------------${NC}"
  echo -e "${YELLOW}Summary: ${PASSED} passed, ${FAILED} failed.${NC}"
  echo -e "${YELLOW}Public endpoints and security rejection checks completed.${NC}"
  echo -e "${YELLOW}Set HERMES_API_TOKEN to run authenticated lifecycle tests.${NC}"
  echo -e "${YELLOW}----------------------------------------------------------------${NC}"
  exit 0
fi

# 5. Authenticated Capabilities
run_test "Authenticated Capabilities introspection" 200 \
  "curl -X GET '${BASE_URL}/capabilities' -H 'Authorization: Bearer ${TOKEN}'"

# 6. Read Categories
run_test "List categories and sectors" 200 \
  "curl -X GET '${BASE_URL}/categories' -H 'Authorization: Bearer ${TOKEN}'"

# 7. Read Problems
run_test "Search / read problem listings" 200 \
  "curl -X GET '${BASE_URL}/problems?limit=5' -H 'Authorization: Bearer ${TOKEN}'"

# 8. Dry-run Creation (Safe validation without persistence)
run_test "Problem creation dry-run validation" 200 \
  "curl -X POST '${BASE_URL}/problems' \
    -H 'Authorization: Bearer ${TOKEN}' \
    -H 'Content-Type: application/json' \
    -d '{\"dry_run\": true, \"title\": \"Dry Run Bogura Cold Storage Validation\", \"summary\": \"Testing automated validation plan for potato harvest cold storage in Bogura district.\", \"sector\": \"Agriculture\"}'"

# 9. Create an unpublished harmless draft problem
echo -n "• Testing: Create unpublished draft problem... "
create_res=$(curl -s -w '\n%{http_code}' -X POST "${BASE_URL}/problems" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "dry_run": false,
    "title": "Hermes Test Harmless Unpublished Draft",
    "summary": "Automated verification draft for agricultural cold chain validation in Rajshahi.",
    "sector": "Agriculture",
    "location": "Rajshahi, Bangladesh",
    "division": "Rajshahi",
    "validationStatus": "Unverified"
  }')

create_code=$(echo "$create_res" | tail -n1)
create_body=$(echo "$create_res" | sed '$d')

if [ "$create_code" -eq 201 ]; then
  echo -e "${GREEN}PASSED${NC} (HTTP 201 Created)"
  PASSED=$((PASSED + 1))
  # Extract problem id using node or sed
  PROBLEM_ID=$(echo "$create_body" | grep -o '"id":"[^"]*' | head -n1 | cut -d'"' -f4)
  echo -e "  Created draft ID: ${BLUE}${PROBLEM_ID}${NC}"
else
  echo -e "${RED}FAILED${NC} (HTTP ${create_code})"
  echo "  Response: $create_body"
  FAILED=$((FAILED + 1))
  PROBLEM_ID=""
fi

if [ -n "$PROBLEM_ID" ]; then
  # 10. Read the created problem
  run_test "Read created draft details" 200 \
    "curl -X GET '${BASE_URL}/problems/${PROBLEM_ID}' -H 'Authorization: Bearer ${TOKEN}'"

  # 11. Edit the problem
  run_test "Update created draft" 200 \
    "curl -X PATCH '${BASE_URL}/problems/${PROBLEM_ID}' \
      -H 'Authorization: Bearer ${TOKEN}' \
      -H 'Content-Type: application/json' \
      -d '{\"summary\": \"Updated summary: Field interviews completed with 8 farmers in Rajshahi.\"}'"

  # 12. Safely archive the problem
  run_test "Archive test problem" 200 \
    "curl -X POST '${BASE_URL}/problems/${PROBLEM_ID}/archive' -H 'Authorization: Bearer ${TOKEN}'"

  # 13. Verify security guardrail: DELETE rejected without confirmation header
  run_test "Guardrail: Permanent deletion rejected without confirmation header" 403 \
    "curl -X DELETE '${BASE_URL}/problems/${PROBLEM_ID}?confirm_destructive=false' \
      -H 'Authorization: Bearer ${TOKEN}'"

  # 14. Permanent cleanup with confirmed header
  run_test "Permanent cleanup with explicit confirmation" 200 \
    "curl -X DELETE '${BASE_URL}/problems/${PROBLEM_ID}?confirm_destructive=true' \
      -H 'Authorization: Bearer ${TOKEN}' \
      -H 'X-Owner-Confirmation: confirmed'"
fi

# 15. Check Audit Logs
run_test "Inspect Hermes action audit logs" 200 \
  "curl -X GET '${BASE_URL}/audit-logs?limit=5' -H 'Authorization: Bearer ${TOKEN}'"

# 16. Platform Analytics
run_test "Retrieve platform analytics" 200 \
  "curl -X GET '${BASE_URL}/analytics' -H 'Authorization: Bearer ${TOKEN}'"

echo -e "\n${BLUE}================================================================${NC}"
echo -e "${GREEN}Smoke Test Completed!${NC}"
echo -e "Results: ${GREEN}${PASSED} passed${NC}, ${RED}${FAILED} failed${NC}."
echo -e "${BLUE}================================================================${NC}"
