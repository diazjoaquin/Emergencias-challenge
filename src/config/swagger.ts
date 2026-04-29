import type { OpenAPIV3 } from 'openapi-types'

const swaggerSpec: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'Emergencias Contact API',
    version: '1.0.0',
    description: 'RESTful API for managing contacts, phones, addresses and activities.',
  },
  servers: [{ url: 'http://localhost:3000', description: 'Development server' }],
  tags: [
    { name: 'Persons', description: 'Contact management' },
    { name: 'Activities', description: 'Contact activity management' },
  ],
  components: {
    schemas: {
      PhoneType: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          typeName: { type: 'string', example: 'mobile' },
        },
      },
      Phone: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          number: { type: 'string', example: '1123456789' },
          personId: { type: 'integer', example: 1 },
          phoneTypeId: { type: 'integer', example: 1 },
          phoneType: { $ref: '#/components/schemas/PhoneType' },
        },
      },
      Address: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          personId: { type: 'integer', example: 1 },
          locality: { type: 'string', example: 'Buenos Aires' },
          street: { type: 'string', example: 'Corrientes' },
          number: { type: 'integer', example: 1234 },
          notes: { type: 'string', nullable: true, example: 'Piso 3' },
        },
      },
      Person: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          firstName: { type: 'string', example: 'Juan' },
          lastName: { type: 'string', example: 'Pérez' },
          dateOfBirth: { type: 'string', format: 'date', example: '1990-01-15' },
          email: { type: 'string', format: 'email', example: 'juan@example.com' },
          phones: { type: 'array', items: { $ref: '#/components/schemas/Phone' } },
          addresses: { type: 'array', items: { $ref: '#/components/schemas/Address' } },
        },
      },
      PersonSummary: {
        type: 'object',
        properties: {
          firstName: { type: 'string', example: 'Juan' },
          lastName: { type: 'string', example: 'Pérez' },
          email: { type: 'string', format: 'email', example: 'juan@example.com' },
          dateOfBirth: { type: 'string', format: 'date', example: '1990-01-15' },
        },
      },
      ContactActivity: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          personId: { type: 'integer', example: 1 },
          activityType: { type: 'string', enum: ['call', 'meeting', 'email'], example: 'call' },
          activityDate: { type: 'string', example: '2024-01-15T10:30:00' },
          description: { type: 'string', nullable: true, example: 'Follow-up call' },
          person: { $ref: '#/components/schemas/PersonSummary' },
        },
      },
      CreatePersonInput: {
        type: 'object',
        required: ['firstName', 'lastName', 'dateOfBirth', 'email'],
        properties: {
          firstName: { type: 'string', minLength: 3, maxLength: 50, example: 'Juan' },
          lastName: { type: 'string', minLength: 3, maxLength: 50, example: 'Pérez' },
          dateOfBirth: { type: 'string', format: 'date', example: '1990-01-15' },
          email: { type: 'string', format: 'email', example: 'juan@example.com' },
          phones: {
            type: 'array',
            items: {
              type: 'object',
              required: ['number', 'phoneTypeId'],
              properties: {
                number: { type: 'string', minLength: 8, maxLength: 15, example: '1123456789' },
                phoneTypeId: { type: 'integer', example: 1 },
              },
            },
          },
          addresses: {
            type: 'array',
            items: {
              type: 'object',
              required: ['locality', 'street', 'number'],
              properties: {
                locality: { type: 'string', minLength: 2, maxLength: 100, example: 'Buenos Aires' },
                street: { type: 'string', minLength: 2, maxLength: 100, example: 'Corrientes' },
                number: { type: 'integer', minimum: 1, maximum: 99999, example: 1234 },
                notes: { type: 'string', maxLength: 500, example: 'Piso 3' },
              },
            },
          },
        },
      },
      UpdatePersonInput: {
        type: 'object',
        properties: {
          firstName: { type: 'string', minLength: 3, maxLength: 50, example: 'Juan' },
          lastName: { type: 'string', minLength: 3, maxLength: 50, example: 'Pérez' },
          dateOfBirth: { type: 'string', format: 'date', example: '1990-01-15' },
          email: { type: 'string', format: 'email', example: 'juan@example.com' },
        },
      },
      CreateActivityInput: {
        type: 'object',
        required: ['personId', 'activityType', 'activityDate'],
        properties: {
          personId: { type: 'integer', example: 1 },
          activityType: { type: 'string', enum: ['call', 'meeting', 'email'], example: 'call' },
          activityDate: { type: 'string', example: '2024-01-15T10:30:00' },
          description: { type: 'string', maxLength: 1000, example: 'Follow-up call' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Record not found' },
        },
      },
      ValidationErrorResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Validation error' },
          errors: { type: 'array', items: { type: 'object' } },
        },
      },
    },
  },
  paths: {
    '/persons': {
      post: {
        summary: 'Create a new contact',
        tags: ['Persons'],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreatePersonInput' } },
          },
        },
        responses: {
          201: {
            description: 'Contact created successfully',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Person' } } },
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
              },
            },
          },
          409: {
            description: 'Email already exists',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
        },
      },
      get: {
        summary: 'Search contacts',
        description:
          'Search by email (exact), personal data (partial), or phone number and type. ' +
          'If `email` is provided it takes priority. ' +
          'If `phoneNumber` or `phoneTypeId` are provided, phone search is used. ' +
          'Otherwise filters by personal data fields.',
        tags: ['Persons'],
        parameters: [
          {
            name: 'email',
            in: 'query',
            schema: { type: 'string', format: 'email' },
            description: 'Exact email match (takes priority over other filters)',
          },
          {
            name: 'firstName',
            in: 'query',
            schema: { type: 'string' },
            description: 'Partial, case-insensitive match',
          },
          {
            name: 'lastName',
            in: 'query',
            schema: { type: 'string' },
            description: 'Partial, case-insensitive match',
          },
          {
            name: 'dateOfBirth',
            in: 'query',
            schema: { type: 'string', format: 'date' },
            description: 'Exact match in YYYY-MM-DD format',
          },
          {
            name: 'phoneNumber',
            in: 'query',
            schema: { type: 'string' },
            description: 'Exact phone number match',
          },
          {
            name: 'phoneTypeId',
            in: 'query',
            schema: { type: 'integer' },
            description: 'Phone type ID (can be combined with phoneNumber)',
          },
        ],
        responses: {
          200: {
            description: 'List of matching contacts',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Person' } },
              },
            },
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/persons/{id}': {
      patch: {
        summary: 'Update personal data of a contact',
        tags: ['Persons'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, example: 1 },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/UpdatePersonInput' } },
          },
        },
        responses: {
          200: {
            description: 'Contact updated successfully',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Person' } } },
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
              },
            },
          },
          404: {
            description: 'Contact not found',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
          409: {
            description: 'Email already exists',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
        },
      },
      delete: {
        summary: 'Delete a contact',
        description: 'Deletes a contact and cascades to all phones, addresses and activities.',
        tags: ['Persons'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, example: 1 },
        ],
        responses: {
          204: { description: 'Contact deleted successfully' },
          404: {
            description: 'Contact not found',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
        },
      },
    },
    '/activities': {
      post: {
        summary: 'Create a new activity',
        tags: ['Activities'],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreateActivityInput' } },
          },
        },
        responses: {
          201: {
            description: 'Activity created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ContactActivity' },
              },
            },
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
              },
            },
          },
          404: {
            description: 'Person not found',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
        },
      },
      get: {
        summary: 'Search activities by contact and type',
        description: 'Returns activities with contact details (name, email, date of birth).',
        tags: ['Activities'],
        parameters: [
          {
            name: 'personId',
            in: 'query',
            schema: { type: 'integer' },
            description: 'Filter by person ID',
          },
          {
            name: 'activityType',
            in: 'query',
            schema: { type: 'string', enum: ['call', 'meeting', 'email'] },
            description: 'Filter by activity type',
          },
        ],
        responses: {
          200: {
            description: 'List of matching activities with contact details',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/ContactActivity' },
                },
              },
            },
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
              },
            },
          },
        },
      },
    },
  },
}

export default swaggerSpec
