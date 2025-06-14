
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de ChefDesk',
    version: '1.0.0',
    description: 'Documentación de la API de ChefDesk',
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/api/*.js'], 
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUi, swaggerSpec };