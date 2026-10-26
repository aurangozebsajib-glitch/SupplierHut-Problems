export const openApiSpecification = {
  openapi: '3.1.0',
  info: {
    title: 'SupplierHut Problems - Hermes Agent Management API',
    version: '1.0.0',
    description:
      'Secure, versioned REST API enabling Hermes Agent v0.22.5 to inspect, curate, moderate, and administer problem listings, categories, proposals, reports, and analytics on SupplierHut Solutions Bangladesh.',
    contact: {
      name: 'SupplierHut Platform Administration',
      url: 'https://supplier-hut-problems.vercel.app',
    },
  },
  servers: [
    {
      url: 'https://supplier-hut-problems.vercel.app/api/agent/v1',
      description: 'Production Vercel Deployment',
    },
    {
      url: 'http://localhost:3000/api/agent/v1',
      description: 'Local Development Server',
    },
  ],
  security: [
    {
      BearerAuth: [],
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'Token',
        description:
          'Provide the server-only HERMES_API_TOKEN in the Authorization header as: Bearer <HERMES_API_TOKEN>.',
      },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          code: { type: 'string' },
          details: { type: 'string' },
        },
        required: ['error'],
      },
      Problem: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'prob-waste-sme-101' },
          slug: { type: 'string', example: 'food-waste-small-retailers' },
          title: { type: 'string', example: 'High Produce Spoilage in Urban Wet Markets' },
          summary: { type: 'string', example: '35% post-harvest spoilage due to lack of cold storage.' },
          fullDescription: { type: 'string' },
          sector: {
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
          location: { type: 'string', example: 'Kawran Bazar, Dhaka' },
          division: {
            type: 'string',
            enum: ['Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Sylhet', 'Barishal', 'Rangpur', 'Mymensingh', 'National'],
          },
          affectedCustomerType: { type: 'string' },
          validationStatus: {
            type: 'string',
            enum: ['Unverified', 'Researching', 'Evidence Supported', 'Validated', 'Archived'],
          },
          confidenceScorePercent: { type: 'integer', minimum: 0, maximum: 100 },
          opportunityType: {
            type: 'string',
            enum: ['Open Problem', 'Paid Challenge', 'Client Request', 'Collaboration', 'Marketplace'],
          },
          difficulty: {
            type: 'string',
            enum: ['Low-Cost / Fast Entry', 'Moderate', 'High Technical', 'Systemic / Capital Intensive'],
          },
          featured: { type: 'boolean' },
          dateReported: { type: 'string', format: 'date' },
          updatedAt: { type: 'string', format: 'date' },
        },
        required: ['id', 'slug', 'title', 'summary', 'sector', 'validationStatus'],
      },
      CreateProblemInput: {
        type: 'object',
        properties: {
          dry_run: {
            type: 'boolean',
            description: 'If true, validates schema and inputs without writing to the database.',
            default: false,
          },
          title: { type: 'string', minLength: 5, maxLength: 200 },
          summary: { type: 'string', minLength: 10, maxLength: 500 },
          fullDescription: { type: 'string' },
          sector: {
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
          location: { type: 'string', default: 'All Bangladesh' },
          division: {
            type: 'string',
            enum: ['Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Sylhet', 'Barishal', 'Rangpur', 'Mymensingh', 'National'],
            default: 'National',
          },
          affectedCustomerType: { type: 'string' },
          opportunityType: {
            type: 'string',
            enum: ['Open Problem', 'Paid Challenge', 'Client Request', 'Collaboration', 'Marketplace'],
            default: 'Open Problem',
          },
          difficulty: {
            type: 'string',
            enum: ['Low-Cost / Fast Entry', 'Moderate', 'High Technical', 'Systemic / Capital Intensive'],
            default: 'Moderate',
          },
          timeToFirstTest: { type: 'string', example: '14 to 30 days' },
          skillsRequired: {
            type: 'array',
            items: { type: 'string' },
          },
          estimatedStartupCostMinBDT: { type: 'number', minimum: 0 },
          estimatedStartupCostMaxBDT: { type: 'number', minimum: 0 },
          featured: { type: 'boolean', default: false },
        },
        required: ['title', 'summary', 'sector'],
      },
    },
  },
  paths: {
    '/health': {
      get: {
        summary: 'API Health and System Status',
        description: 'Returns health status, timestamp, connected database status, and active API version.',
        security: [],
        responses: {
          '200': {
            description: 'System healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    api_version: { type: 'string', example: 'v1' },
                    timestamp: { type: 'string', format: 'date-time' },
                    database: { type: 'string', example: 'connected' },
                    clerk: { type: 'string', example: 'configured' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/capabilities': {
      get: {
        summary: 'Introspect Agent Capabilities',
        description: 'Returns structured list of supported operations, unsupported operations, schemas, and guardrails.',
        responses: {
          '200': {
            description: 'Capabilities report',
          },
        },
      },
    },
    '/openapi.json': {
      get: {
        summary: 'OpenAPI 3.1.0 Specification',
        description: 'Returns the full JSON schema definition of the Hermes Agent API.',
        security: [],
        responses: {
          '200': {
            description: 'OpenAPI JSON document',
          },
        },
      },
    },
    '/problems': {
      get: {
        summary: 'Search and Filter Problems',
        description: 'Returns problem listings matching keyword, sector, status, division, or opportunity type.',
        parameters: [
          { name: 'q', in: 'query', schema: { type: 'string' }, description: 'Search title, summary, or tags' },
          { name: 'sector', in: 'query', schema: { type: 'string' }, description: 'Filter by sector' },
          { name: 'status', in: 'query', schema: { type: 'string' }, description: 'Filter by validationStatus' },
          { name: 'division', in: 'query', schema: { type: 'string' }, description: 'Filter by Bangladesh division' },
          { name: 'opportunityType', in: 'query', schema: { type: 'string' } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          { name: 'offset', in: 'query', schema: { type: 'integer', default: 0 } },
        ],
        responses: {
          '200': { description: 'List of matching problems' },
          '401': { description: 'Unauthorized' },
        },
      },
      post: {
        summary: 'Create Problem Listing or Draft',
        description: 'Creates a new problem entry. If dry_run=true, only validates inputs without saving.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateProblemInput' },
            },
          },
        },
        responses: {
          '201': { description: 'Problem created successfully' },
          '200': { description: 'Dry run succeeded with valid payload' },
          '400': { description: 'Invalid input or schema validation error' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/problems/{id}': {
      get: {
        summary: 'Get Problem Details',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Detailed problem record' },
          '404': { description: 'Problem not found' },
        },
      },
      patch: {
        summary: 'Edit Problem Listing',
        description: 'Updates mutable fields of a problem. Supports dry_run: true.',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Updated problem record' },
          '404': { description: 'Problem not found' },
        },
      },
      delete: {
        summary: 'Delete Problem (Requires Confirmation)',
        description: 'Permanently deletes a problem. Strictly requires confirm_destructive=true query param and X-Owner-Confirmation: confirmed header.',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'confirm_destructive', in: 'query', schema: { type: 'boolean' } },
        ],
        responses: {
          '200': { description: 'Deleted problem successfully' },
          '403': { description: 'Destructive operation denied without explicit confirmation' },
        },
      },
    },
    '/problems/{id}/publish': {
      post: {
        summary: 'Publish or Validate Problem',
        description: 'Marks problem as Validated or Evidence Supported for public discoverability.',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Problem published' },
        },
      },
    },
    '/problems/{id}/unpublish': {
      post: {
        summary: 'Unpublish Problem (Set to Unverified)',
        description: 'Reverts a problem to Unverified draft status.',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Problem unpublished' },
        },
      },
    },
    '/problems/{id}/archive': {
      post: {
        summary: 'Archive Problem',
        description: 'Safely archives a problem without deleting underlying database records.',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Problem archived' },
        },
      },
    },
    '/categories': {
      get: {
        summary: 'List Categories & Sectors',
        description: 'Returns all recognized sectors, divisions, statuses, and opportunity types.',
        responses: {
          '200': { description: 'Categories metadata' },
        },
      },
    },
    '/reports': {
      get: {
        summary: 'List Abuse & Moderation Reports',
        parameters: [{ name: 'status', in: 'query', schema: { type: 'string', enum: ['Open', 'Reviewed', 'Resolved', 'Dismissed'] } }],
        responses: {
          '200': { description: 'Moderation reports' },
        },
      },
    },
    '/reports/{id}': {
      patch: {
        summary: 'Update Report Status',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Report status updated' },
        },
      },
    },
    '/proposals': {
      get: {
        summary: 'List Solution Proposals',
        parameters: [
          { name: 'problemId', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'List of proposals' },
        },
      },
    },
    '/proposals/{id}': {
      patch: {
        summary: 'Update Proposal Review Status',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Proposal updated' },
        },
      },
    },
    '/analytics': {
      get: {
        summary: 'Platform Analytics & Aggregates',
        description: 'Returns real count metrics: total problems, by sector, by status, proposal statistics, and moderation queues.',
        responses: {
          '200': { description: 'Analytics summary' },
        },
      },
    },
    '/settings': {
      get: {
        summary: 'Platform Configuration & Settings',
        description: 'Returns active platform defaults (currency: BDT, timezone: Asia/Dhaka, supported sectors). Does not leak secrets.',
        responses: {
          '200': { description: 'Platform settings' },
        },
      },
    },
    '/users': {
      get: {
        summary: 'Permitted Sanitized User Directory',
        description: 'Returns non-sensitive public user profiles (id, name, role, skills, preferredSectors). Strictly excludes credentials, tokens, and private emails.',
        responses: {
          '200': { description: 'Sanitized users list' },
        },
      },
    },
    '/audit-logs': {
      get: {
        summary: 'Audit Trail Records',
        description: 'Inspect administrative audit log entries, including actions executed by Hermes Agent.',
        responses: {
          '200': { description: 'Audit trail records' },
        },
      },
    },
  },
};
