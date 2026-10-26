export const openApiSpecification = {
  openapi: '3.1.0',
  info: {
    title: 'SupplierHut Agent API',
    version: '1.0.0',
    description:
      'Read-only access to SupplierHut problem data with Evidence Supported and Validated statuses, plus aggregate metrics.',
  },
  servers: [{ url: '/api/agent/v1' }],
  components: {
    securitySchemes: {
      BearerAuth: { type: 'http', scheme: 'bearer' },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: { error: { type: 'string' } },
        required: ['error'],
      },
    },
  },
  paths: {
    '/health': {
      get: {
        summary: 'Public API health status',
        security: [],
        responses: { '200': { description: 'API is available' } },
      },
    },
    '/capabilities': {
      get: {
        summary: 'List authenticated read-only operations',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': { description: 'Supported operations' },
          '401': { description: 'Missing or invalid credentials' },
        },
      },
    },
    '/problems': {
      get: {
        summary: 'List and filter problems',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'q', in: 'query', schema: { type: 'string', maxLength: 100 } },
          { name: 'sector', in: 'query', schema: { type: 'string' } },
          {
            name: 'status',
            in: 'query',
            schema: { type: 'string', enum: ['Evidence Supported', 'Validated'] },
          },
          { name: 'division', in: 'query', schema: { type: 'string' } },
          { name: 'opportunityType', in: 'query', schema: { type: 'string' } },
          { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 } },
          { name: 'offset', in: 'query', schema: { type: 'integer', minimum: 0, maximum: 100000, default: 0 } },
        ],
        responses: {
          '200': { description: 'Paginated list of sanitized problem records' },
          '400': { description: 'Invalid query parameter' },
          '401': { description: 'Missing or invalid credentials' },
          '503': { description: 'Problem data is unavailable' },
        },
      },
    },
    '/problems/{id}': {
      get: {
        summary: 'Read one problem',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', maxLength: 128 } }],
        responses: {
          '200': { description: 'Problem record' },
          '400': { description: 'Invalid problem ID' },
          '401': { description: 'Missing or invalid credentials' },
          '404': { description: 'Problem not found' },
          '503': { description: 'Problem data is unavailable' },
        },
      },
    },
    '/analytics': {
      get: {
        summary: 'Read aggregate problem metrics',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': { description: 'Problem count and validation-status counts' },
          '401': { description: 'Missing or invalid credentials' },
          '503': { description: 'Analytics are unavailable' },
        },
      },
    },
  },
};
