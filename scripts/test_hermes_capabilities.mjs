import assert from 'node:assert/strict';

const baseUrl = (
  process.env.SUPPLIERHUT_API_URL || 'http://localhost:3000/api/agent/v1'
).replace(/\/+$/, '');
const token = process.env.HERMES_API_TOKEN;

if (!token) {
  throw new Error('Set HERMES_API_TOKEN in this process before running the API tests.');
}

async function request(path, authorization) {
  return fetch(`${baseUrl}${path}`, {
    headers: authorization ? { Authorization: authorization } : {},
  });
}

const bearer = `Bearer ${token}`;
const unauthenticated = await request('/capabilities');
assert.equal(unauthenticated.status, 401);

const capabilitiesResponse = await request('/capabilities', bearer);
assert.equal(capabilitiesResponse.status, 200);
const capabilities = await capabilitiesResponse.json();
assert.equal(capabilities.api_version, 'v1');
assert.equal(capabilities.access_mode, 'read_only');
assert.equal(capabilities.writes_enabled, false);
assert.deepEqual(capabilities.problem_statuses, ['Evidence Supported', 'Validated']);
assert.ok(capabilities.operations.every(({ method }) => method === 'GET'));
assert.ok(capabilities.operations.some(({ path }) => path === '/openapi.json'));
assert.ok(capabilities.unsupported_operations.length > 0);
assert.ok(capabilities.known_data_limits.length > 0);
assert.ok(
  capabilities.known_data_limits.some((limit) =>
    limit.includes('successful database lookup finds no matching record')
  )
);
assert.ok(
  capabilities.known_data_limits.some((limit) =>
    limit.includes('not verified live or authoritative website data')
  )
);

const openApiResponse = await request('/openapi.json');
assert.equal(openApiResponse.status, 200);
const openApi = await openApiResponse.json();
assert.equal(openApi.openapi, '3.1.0');
assert.ok(openApi.paths['/capabilities'].get);
assert.ok(openApi.paths['/problems'].get);
assert.ok(openApi.paths['/problems/{id}'].get);
assert.ok(openApi.paths['/analytics'].get);
assert.ok(openApi.paths['/openapi.json'].get);
for (const operation of capabilities.operations) {
  assert.ok(openApi.paths[operation.path]?.[operation.method.toLowerCase()]);
}
assert.equal(openApi.paths['/problems'].post, undefined);
assert.equal(openApi.paths['/problems/{id}'].patch, undefined);
assert.equal(openApi.paths['/problems/{id}'].delete, undefined);
assert.ok(openApi.components.schemas.AgentProblem);
assert.ok(openApi.components.schemas.Capabilities);
assert.ok(openApi.components.schemas.ProblemDetail.properties.problem.$ref.endsWith('/AgentProblem'));
for (const schemaName of ['ProblemList', 'ProblemDetail', 'Analytics']) {
  const sourceDescription = openApi.components.schemas[schemaName].properties.data_source.description;
  assert.match(sourceDescription, /not verified live or authoritative website data/);
}
assert.match(
  openApi.components.schemas.ProblemDetail.properties.data_source.description,
  /successful lookup finds no matching database record and a matching seed record exists/
);
assert.ok(openApi.components.schemas.ProblemList.required.includes('data_source'));
assert.ok(openApi.components.schemas.Analytics.required.includes('data_source'));
assert.match(openApi.paths['/capabilities'].get.responses['503'].description, /authentication/i);
assert.doesNotMatch(openApi.paths['/capabilities'].get.responses['503'].description, /problem data/i);
for (const path of ['/capabilities', '/problems', '/problems/{id}', '/analytics']) {
  const unavailableDescription = openApi.paths[path].get.responses['503'].description;
  assert.match(unavailableDescription, /authentication is unavailable/i);
  assert.doesNotMatch(unavailableDescription, /seed fallback|data_source/i);
}
assert.deepEqual(
  openApi.paths['/problems'].get.parameters.find(({ name }) => name === 'status').schema.enum,
  ['Evidence Supported', 'Validated']
);

console.log('Hermes capabilities and OpenAPI contract tests passed.');
