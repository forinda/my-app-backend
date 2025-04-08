import swaggerJsdoc from 'swagger-jsdoc';
import { di } from '../di';
import { Config } from '../config';

const config = di.resolve(Config);
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My App API Documentation',
      version: '1.0.0',
      description: 'API documentation for My App'
    },
    servers: [
      {
        url: 'http://localhost:5050/api/v1',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        // BearerAuth: {
        //   type: 'http',
        //   scheme: 'bearer',
        //   bearerFormat: 'JWT',
        //   description: 'Enter JWT Bearer token **_only_**'
        // },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: config.conf.SESSION_COOKIE_NAME,
          description: 'Authentication token stored in cookies'
        }
      },
      schemas: {
        Department: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'The department ID' },
            uuid: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the department'
            },
            organization_id: {
              type: 'integer',
              description: 'ID of the organization this department belongs to'
            },
            name: { type: 'string', description: 'Name of the department' },
            description: {
              type: 'string',
              description: 'Description of the department'
            },
            head_id: {
              type: 'integer',
              description: 'ID of the department head'
            },
            created_by: {
              type: 'integer',
              description: 'ID of the user who created the department'
            },
            updated_by: {
              type: 'integer',
              description: 'ID of the user who last updated the department'
            },
            deleted_by: {
              type: 'integer',
              description: 'ID of the user who deleted the department'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the department was created'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the department was last updated'
            },
            deleted_at: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the department was deleted'
            }
          },
          required: [
            'organization_id',
            'name',
            'description',
            'created_by',
            'updated_by'
          ]
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', description: 'Error message' },
            statusCode: {
              type: 'integer',
              description: 'HTTP status code'
            }
          }
        }
      }
    },
    security: [
      {
        BearerAuth: [] // Apply to all routes
      }
    ]
  },
  apis: ['./src/api/**/*.ts']
};

export const swaggerSpec = swaggerJsdoc(options);
