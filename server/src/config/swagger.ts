import swaggerJsdoc from 'swagger-jsdoc';

/**
 * Swagger/OpenAPI specification configuration.
 */
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DearDays API',
      version: '1.0.0',
      description: 'API documentation for the DearDays digital journal builder',
    },
    servers: [
      {
        url: '/api/v1',
        description: 'API v1',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        UserCreate: {
          type: 'object',
          required: ['email', 'displayName', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'jane@example.com' },
            displayName: { type: 'string', minLength: 2, maxLength: 50, example: 'Jane Doe' },
            password: { type: 'string', minLength: 8, example: 'SecurePass1' },
          },
        },
        UserLogin: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'jane@example.com' },
            password: { type: 'string', example: 'SecurePass1' },
          },
        },
        UserProfile: {
          type: 'object',
          properties: {
            email: { type: 'string' },
            displayName: { type: 'string' },
            avatarUrl: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/UserProfile' },
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
          },
        },
        AuthApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { $ref: '#/components/schemas/AuthResponse' },
          },
        },
        UserProfileApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { $ref: '#/components/schemas/UserProfile' },
          },
        },
        ApiError: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' },
                  code: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
