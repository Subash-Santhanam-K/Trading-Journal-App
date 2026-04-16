const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Trading Journal API',
      description: 'Secure REST API with JWT Auth, RBAC, and Trade Analytics',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Development Server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['user', 'admin'] }
          }
        },
        Trade: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: 'string' },
            profitLoss: { type: 'number' },
            tradeType: { type: 'string', enum: ['buy', 'sell'] },
            tradeDate: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Login successful' },
            data: {
              type: 'object',
              properties: {
                user: { $ref: '#/components/schemas/User' },
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' }
              }
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Validation error' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  code: { type: 'string' },
                  message: { type: 'string' },
                  path: { type: 'array', items: { type: 'string' } }
                }
              }
            }
          }
        }
      }
    },
    tags: [
      { name: 'Auth', description: 'Authentication Endpoints' },
      { name: 'Trades', description: 'Trade Management & Analytics' }
    ],
    paths: {
      '/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', example: 'trader@example.com' },
                    password: { type: 'string', example: 'securePass123' },
                    role: { type: 'string', enum: ['user', 'admin'], example: 'user' }
                  }
                }
              }
            }
          },
          responses: {
            201: {
              description: 'User registered successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'User registered successfully' },
                      data: { $ref: '#/components/schemas/User' }
                    }
                  }
                }
              }
            },
            400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
          }
        }
      },
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login to get tokens',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', example: 'trader@example.com' },
                    password: { type: 'string', example: 'securePass123' }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Login successful',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } }
            },
            401: { description: 'Invalid login', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
          }
        }
      },
      '/auth/refresh': {
        post: {
          tags: ['Auth'],
          summary: 'Refresh access token',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { refreshToken: { type: 'string' } }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Token refreshed',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      message: { type: 'string' },
                      data: { type: 'object', properties: { accessToken: { type: 'string' } } }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/auth/logout': {
        post: {
          tags: ['Auth'],
          summary: 'Logout user',
          security: [{ BearerAuth: [] }],
          responses: {
            200: {
              description: 'Logged out successfully',
              content: { 'application/json': { schema: { type: 'object', properties: { success: {type: 'boolean'}, message: {type:'string'} } } } }
            }
          }
        }
      },
      '/trades': {
        get: {
          tags: ['Trades'],
          summary: 'Get all trades (Paginated & Filtered)',
          security: [{ BearerAuth: [] }],
          parameters: [
            { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
            { in: 'query', name: 'limit', schema: { type: 'integer', default: 10, maximum: 50 } },
            { in: 'query', name: 'type', schema: { type: 'string', enum: ['buy', 'sell'] } },
            { in: 'query', name: 'minProfit', schema: { type: 'number' } },
            { in: 'query', name: 'maxProfit', schema: { type: 'number' } },
            { in: 'query', name: 'sortBy', schema: { type: 'string', enum: ['tradeDate', 'profitLoss', 'createdAt'], default: 'createdAt' } },
            { in: 'query', name: 'order', schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' } }
          ],
          responses: {
            200: {
              description: 'Trades fetched successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      message: { type: 'string' },
                      data: { type: 'array', items: { $ref: '#/components/schemas/Trade' } },
                      pagination: {
                        type: 'object',
                        properties: {
                          total: { type: 'integer' }, page: { type: 'integer' }, limit: { type: 'integer' }, totalPages: { type: 'integer' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ['Trades'],
          summary: 'Create a new trade',
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string', example: 'Long BTC/USDT' },
                    description: { type: 'string', example: 'RSI divergence playbook' },
                    profitLoss: { type: 'number', example: 1500.5 },
                    tradeType: { type: 'string', enum: ['buy', 'sell'], example: 'buy' },
                    tradeDate: { type: 'string', format: 'date-time', example: '2023-11-20T10:30:00.000Z' }
                  }
                }
              }
            }
          },
          responses: {
            201: {
              description: 'Trade logged successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: { success: { type: 'boolean' }, message: { type: 'string' }, data: { $ref: '#/components/schemas/Trade' } }
                  }
                }
              }
            }
          }
        }
      },
      '/trades/stats': {
        get: {
          tags: ['Trades'],
          summary: 'Get trade statistics',
          security: [{ BearerAuth: [] }],
          responses: {
            200: {
              description: 'Stats retrieved',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      message: { type: 'string' },
                      data: {
                        type: 'object',
                        properties: {
                          totalTrades: { type: 'integer' },
                          totalProfit: { type: 'number' },
                          totalLoss: { type: 'number' },
                          netProfit: { type: 'number' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/trades/{id}': {
        get: {
          tags: ['Trades'],
          summary: 'Get trade by ID',
          security: [{ BearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'Trade retrieved successfully', content: { 'application/json': { schema: { type: 'object', properties: { success: {type: 'boolean'}, message: {type: 'string'}, data: { $ref: '#/components/schemas/Trade' } } } } } },
            404: { description: 'Trade not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
          }
        },
        put: {
          tags: ['Trades'],
          summary: 'Update trade by ID',
          security: [{ BearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    profitLoss: { type: 'number' },
                    tradeType: { type: 'string', enum: ['buy', 'sell'] }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Trade updated successfully', content: { 'application/json': { schema: { type: 'object', properties: { success: {type: 'boolean'}, message: {type: 'string'}, data: { $ref: '#/components/schemas/Trade' } } } } } }
          }
        },
        delete: {
          tags: ['Trades'],
          summary: 'Delete trade by ID',
          security: [{ BearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'Trade deleted successfully', content: { 'application/json': { schema: { type: 'object', properties: { success: {type: 'boolean'}, message: {type: 'string'} } } } } }
          }
        }
      }
    }
  },
  apis: [] // Embedded definition
};

const swaggerSpec = swaggerJsDoc(options);
module.exports = swaggerSpec;
