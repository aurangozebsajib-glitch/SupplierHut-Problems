export const openApiSpecification = {
  openapi: '3.1.0',
  info: {
    title: 'SupplierHut Agent API',
    version: '1.0.0',
    description:
      'Read-only access to SupplierHut problem data with Evidence Supported and Validated statuses, plus aggregate metrics. No write or moderation operations are available.',
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
      AgentProblem: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          slug: { type: 'string' },
          title: { type: 'string' },
          summary: { type: 'string' },
          fullDescription: { type: ['string', 'null'] },
          sector: { type: 'string' },
          location: { type: 'string' },
          division: { type: ['string', 'null'] },
          affectedCustomerType: { type: ['string', 'null'] },
          validationStatus: { type: 'string', enum: ['Evidence Supported', 'Validated'] },
          confidenceScorePercent: { type: ['number', 'null'] },
          opportunityType: { type: ['string', 'null'] },
          difficulty: { type: ['string', 'null'] },
          estimatedStartupCostBDT: {
            type: 'object',
            properties: { min: { type: 'number' }, max: { type: 'number' } },
            required: ['min', 'max'],
          },
          timeToFirstTest: { type: ['string', 'null'] },
          featured: { type: 'boolean' },
          dateReported: { type: ['string', 'null'] },
          updatedAt: { type: ['string', 'null'] },
        },
        required: [
          'id',
          'slug',
          'title',
          'summary',
          'fullDescription',
          'sector',
          'location',
          'division',
          'affectedCustomerType',
          'validationStatus',
          'confidenceScorePercent',
          'opportunityType',
          'difficulty',
          'estimatedStartupCostBDT',
          'timeToFirstTest',
          'featured',
          'dateReported',
          'updatedAt',
        ],
      },
      ProblemList: {
        type: 'object',
        properties: {
          total: { type: 'integer', minimum: 0 },
          limit: { type: 'integer', minimum: 1, maximum: 100 },
          offset: { type: 'integer', minimum: 0, maximum: 100000 },
          problems: { type: 'array', items: { $ref: '#/components/schemas/AgentProblem' } },
          data_source: {
            type: 'string',
            enum: ['database', 'seed_data'],
            description: 'database means this response came from a Neon query and does not prove synchronization with all website data. seed_data means server-side seed fallback, not verified live or authoritative website data; list fallback occurs when the database is unconfigured or a query fails.',
          },
        },
        required: ['total', 'limit', 'offset', 'problems', 'data_source'],
      },
      ProblemDetail: {
        type: 'object',
        properties: {
          problem: { $ref: '#/components/schemas/AgentProblem' },
          data_source: {
            type: 'string',
            enum: ['database', 'seed_data'],
            description: 'database means this response came from a Neon query and does not prove synchronization with all website data. seed_data means server-side seed fallback, not verified live or authoritative website data; detail fallback occurs when the database is unconfigured, a query fails, or a successful lookup finds no matching database record and a matching seed record exists.',
          },
        },
        required: ['problem', 'data_source'],
      },
      Analytics: {
        type: 'object',
        properties: {
          total: { type: 'integer', minimum: 0 },
          by_validation_status: {
            type: 'object',
            properties: {
              'Evidence Supported': { type: 'integer', minimum: 0 },
              Validated: { type: 'integer', minimum: 0 },
            },
            required: ['Evidence Supported', 'Validated'],
            additionalProperties: false,
          },
          data_source: {
            type: 'string',
            enum: ['database', 'seed_data'],
            description: 'database means this response came from a Neon query and does not prove synchronization with all website data. seed_data means server-side seed fallback, not verified live or authoritative website data; analytics fallback occurs when the database is unconfigured or a query fails.',
          },
        },
        required: ['total', 'by_validation_status', 'data_source'],
      },
      Capabilities: {
        type: 'object',
        properties: {
          api_version: { type: 'string', const: 'v1' },
          access_mode: { type: 'string', const: 'read_only' },
          writes_enabled: { type: 'boolean', const: false },
          problem_statuses: {
            type: 'array',
            items: { type: 'string', enum: ['Evidence Supported', 'Validated'] },
          },
          operations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                method: { type: 'string', const: 'GET' },
                path: { type: 'string' },
                authentication: { type: 'string', enum: ['public', 'bearer_token'] },
                permission: { type: 'string' },
              },
              required: ['method', 'path', 'authentication', 'permission'],
            },
          },
          unsupported_operations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                resource: { type: 'string' },
                operations: { type: 'array', items: { type: 'string' } },
                reason: { type: 'string' },
              },
              required: ['resource', 'operations', 'reason'],
            },
          },
          known_data_limits: { type: 'array', items: { type: 'string' } },
        },
        required: [
          'api_version',
          'access_mode',
          'writes_enabled',
          'problem_statuses',
          'operations',
          'unsupported_operations',
          'known_data_limits',
        ],
      },
    },
  },
  paths: {
    '/health': {
      get: {
        summary: 'Public API health status',
        security: [],
        responses: {
          '200': {
            description: 'API is available',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', const: 'ok' },
                    api_version: { type: 'string', const: 'v1' },
                  },
                  required: ['status', 'api_version'],
                },
              },
            },
          },
        },
      },
    },
    '/capabilities': {
      get: {
        summary: 'List authenticated read-only operations',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'Supported read-only operations and known capability limitations',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Capabilities' },
              },
            },
          },
          '401': { description: 'Missing or invalid credentials' },
          '429': { description: 'Authenticated request rate limit exceeded' },
          '503': { description: 'API authentication is unavailable' },
        },
      },
    },
    '/problems': {
      get: {
        summary: 'List and filter problems',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'q', in: 'query', schema: { type: 'string', maxLength: 100 } },
          {
            name: 'sector',
            in: 'query',
            schema: {
              type: 'string',
              enum: [
                'Agriculture',
                'Education',
                'Healthcare',
                'Logistics',
                'Retail & SMEs',
                'Technology',
                'Environment',
                'Employment',
                'Finance',
                'Public Services',
                'Other',
              ],
            },
          },
          {
            name: 'status',
            in: 'query',
            schema: { type: 'string', enum: ['Evidence Supported', 'Validated'] },
          },
          {
            name: 'division',
            in: 'query',
            schema: {
              type: 'string',
              enum: [
                'Dhaka',
                'Chittagong',
                'Rajshahi',
                'Khulna',
                'Sylhet',
                'Barishal',
                'Rangpur',
                'Mymensingh',
                'National',
              ],
            },
          },
          {
            name: 'opportunityType',
            in: 'query',
            schema: {
              type: 'string',
              enum: [
                'Open Problem',
                'Paid Challenge',
                'Client Request',
                'Collaboration',
                'Marketplace',
              ],
            },
          },
          { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 } },
          { name: 'offset', in: 'query', schema: { type: 'integer', minimum: 0, maximum: 100000, default: 0 } },
        ],
        responses: {
          '200': {
            description: 'Paginated list of sanitized problem records',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ProblemList' } },
            },
          },
          '400': { description: 'Invalid query parameter' },
          '401': { description: 'Missing or invalid credentials' },
          '429': { description: 'Authenticated request rate limit exceeded' },
          '503': { description: 'API authentication is unavailable; request was not processed' },
        },
      },
    },
    '/problems/{id}': {
      get: {
        summary: 'Read one problem',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', pattern: '^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$' },
          },
        ],
        responses: {
          '200': {
            description: 'Problem record',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ProblemDetail',
                },
              },
            },
          },
          '400': { description: 'Invalid problem ID' },
          '401': { description: 'Missing or invalid credentials' },
          '429': { description: 'Authenticated request rate limit exceeded' },
          '503': { description: 'API authentication is unavailable; request was not processed' },
          '404': { description: 'Problem not found' },
        },
      },
    },
    '/analytics': {
      get: {
        summary: 'Read aggregate problem metrics',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'Problem count and validation-status counts',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Analytics' } },
            },
          },
          '401': { description: 'Missing or invalid credentials' },
          '429': { description: 'Authenticated request rate limit exceeded' },
          '503': { description: 'API authentication is unavailable; request was not processed' },
        },
      },
    },
    '/openapi.json': {
      get: {
        summary: 'Read the OpenAPI contract',
        security: [],
        responses: {
          '200': {
            description: 'Machine-readable OpenAPI 3.1 specification',
            content: {
              'application/json': {
                schema: { type: 'object' },
              },
            },
          },
        },
      },
    },
  },
};
