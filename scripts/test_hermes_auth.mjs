import assert from 'node:assert/strict';

const baseUrl = (process.env.SUPPLIERHUT_API_URL || 'http://localhost:3000/api/agent/v1').replace(/\/+$/, '');
const token = process.env.HERMES_API_TOKEN;

if (!token) {
  throw new Error('Set HERMES_API_TOKEN in this process before running the API tests.');
}

async function request(path, authorization, method = 'GET') {
  return fetch(`${baseUrl}${path}`, {
    method,
    headers: authorization ? { Authorization: authorization } : {},
  });
}

async function expectStatus(path, authorization, expectedStatus, method = 'GET') {
  const response = await request(path, authorization, method);
  assert.equal(response.status, expectedStatus, `Expected ${method} ${path} to return HTTP ${expectedStatus}`);
  return response;
}

const bearer = `Bearer ${token}`;

const healthResponse = await expectStatus('/health', undefined, 200);
const health = await healthResponse.json();
assert.deepEqual(Object.keys(health).sort(), ['api_version', 'status']);
assert.equal(health.status, 'ok');

await expectStatus('/capabilities', undefined, 401);
await expectStatus('/problems', undefined, 401);
await expectStatus('/problems/agent-api-test-record', undefined, 401);
await expectStatus('/analytics', undefined, 401);
await expectStatus('/capabilities', `Bearer ${token}x`, 401);

const capabilitiesResponse = await expectStatus('/capabilities', bearer, 200);
const capabilities = await capabilitiesResponse.json();
assert.equal(capabilities.writes_enabled, false);
assert.deepEqual(capabilities.problem_statuses, ['Evidence Supported', 'Validated']);
assert.deepEqual(
  capabilities.operations.map(({ method, path }) => `${method} ${path}`).sort(),
  [
    'GET /analytics',
    'GET /capabilities',
    'GET /health',
    'GET /problems',
    'GET /problems/{id}',
  ].sort()
);

await expectStatus('/problems?limit=0', bearer, 400);
await expectStatus('/problems?limit=101', bearer, 400);
await expectStatus('/problems?offset=-1', bearer, 400);
await expectStatus('/problems?sector=not-a-sector', bearer, 400);
await expectStatus('/problems?status=Unverified', bearer, 400);
await expectStatus('/problems?status=Archived', bearer, 400);
await expectStatus('/problems?limit=5&limit=10', bearer, 400);
await expectStatus('/problems?unsupported=value', bearer, 400);
await expectStatus(`/problems?q=${'a'.repeat(101)}`, bearer, 400);
await expectStatus(`/problems/${encodeURIComponent('invalid.id')}`, bearer, 400);

const listResponse = await expectStatus('/problems?limit=5&offset=0', bearer, 200);
const listing = await listResponse.json();
assert.equal(typeof listing.total, 'number');
assert.equal(listing.limit, 5);
assert.equal(listing.offset, 0);
assert.ok(Array.isArray(listing.problems));
assert.ok(listing.problems.length <= 5);
for (const problem of listing.problems) {
  assert.equal(typeof problem.id, 'string');
  assert.equal(typeof problem.title, 'string');
  assert.ok(['Evidence Supported', 'Validated'].includes(problem.validationStatus));
  assert.equal(Object.hasOwn(problem, 'reportedBy'), false);
  assert.equal(Object.hasOwn(problem, 'reported_by_name'), false);
  assert.equal(Object.hasOwn(problem, 'reported_by_role'), false);
}

const detailId = listing.problems[0]?.id || 'agent-api-test-record-does-not-exist';
const detailExpectedStatus = listing.problems.length > 0 ? 200 : 404;
const detailResponse = await expectStatus(`/problems/${encodeURIComponent(detailId)}`, bearer, detailExpectedStatus);
if (detailExpectedStatus === 200) {
  const detail = await detailResponse.json();
  assert.equal(detail.problem.id, detailId);
  assert.ok(['Evidence Supported', 'Validated'].includes(detail.problem.validationStatus));
  assert.equal(Object.hasOwn(detail.problem, 'reportedBy'), false);
}

const analyticsResponse = await expectStatus('/analytics', bearer, 200);
const analytics = await analyticsResponse.json();
assert.equal(typeof analytics.total, 'number');
assert.equal(typeof analytics.by_validation_status, 'object');
assert.deepEqual(Object.keys(analytics.by_validation_status).sort(), [
  'Evidence Supported',
  'Validated',
].sort());
assert.equal(Object.hasOwn(analytics, 'proposals'), false);
assert.equal(Object.hasOwn(analytics, 'reports'), false);

await expectStatus('/problems', bearer, 405, 'POST');
await expectStatus('/problems/agent-api-test-record', bearer, 405, 'PATCH');
await expectStatus('/problems/agent-api-test-record', bearer, 405, 'DELETE');

const openApiResponse = await expectStatus('/openapi.json', undefined, 200);
const openApi = await openApiResponse.json();
assert.ok(openApi.paths['/problems']);
assert.ok(openApi.paths['/analytics']);

console.log('Hermes API authorization, validation, read-only, and response-shape tests passed.');
