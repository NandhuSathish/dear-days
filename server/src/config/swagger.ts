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

        /* ── Journal schemas ── */
        JournalCreate: {
          type: 'object',
          required: ['title'],
          properties: {
            title: { type: 'string', maxLength: 100, example: 'Summer 2025' },
            description: { type: 'string', maxLength: 500, example: 'Memories from summer vacation' },
            coverImageUrl: { type: 'string', format: 'uri' },
            tags: { type: 'array', items: { type: 'string' }, example: ['travel', 'summer'] },
            isPublic: { type: 'boolean', default: false },
          },
        },
        JournalUpdate: {
          type: 'object',
          properties: {
            title: { type: 'string', maxLength: 100 },
            description: { type: 'string', maxLength: 500 },
            coverImageUrl: { type: 'string', format: 'uri' },
            tags: { type: 'array', items: { type: 'string' } },
            isPublic: { type: 'boolean' },
          },
        },
        Journal: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            coverImageUrl: { type: 'string' },
            ownerId: { type: 'string' },
            pageIds: { type: 'array', items: { type: 'string' } },
            tags: { type: 'array', items: { type: 'string' } },
            isPublic: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        JournalApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { $ref: '#/components/schemas/Journal' },
          },
        },
        JournalListApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'array', items: { $ref: '#/components/schemas/Journal' } },
          },
        },

        /* ── Page schemas ── */
        PageCreate: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            sortOrder: { type: 'integer', minimum: 0 },
            width: { type: 'integer', minimum: 1, default: 800 },
            height: { type: 'integer', minimum: 1, default: 600 },
            backgroundColor: { type: 'string', default: '#ffffff' },
          },
        },
        PageUpdate: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            sortOrder: { type: 'integer', minimum: 0 },
            width: { type: 'integer', minimum: 1 },
            height: { type: 'integer', minimum: 1 },
            backgroundColor: { type: 'string' },
            elements: { type: 'array', items: { $ref: '#/components/schemas/Element' } },
          },
        },
        Element: {
          type: 'object',
          required: ['type', 'x', 'y', 'width', 'height'],
          properties: {
            id: { type: 'string' },
            type: { type: 'string', enum: ['text', 'image', 'shape', 'sticker', 'drawing'] },
            x: { type: 'number' },
            y: { type: 'number' },
            width: { type: 'number' },
            height: { type: 'number' },
            rotation: { type: 'number', default: 0 },
            scaleX: { type: 'number', default: 1 },
            scaleY: { type: 'number', default: 1 },
            opacity: { type: 'number', default: 1 },
            zIndex: { type: 'integer', default: 0 },
            draggable: { type: 'boolean', default: true },
            locked: { type: 'boolean', default: false },
          },
          description: 'Base element properties. Type-specific fields (text, src, fill, etc.) vary by element type.',
        },
        Page: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            journalId: { type: 'string' },
            title: { type: 'string' },
            sortOrder: { type: 'integer' },
            width: { type: 'integer' },
            height: { type: 'integer' },
            backgroundColor: { type: 'string' },
            elements: { type: 'array', items: { $ref: '#/components/schemas/Element' } },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        PageApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { $ref: '#/components/schemas/Page' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
