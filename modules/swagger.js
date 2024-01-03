const swaggerUi = require('swagger-ui-express');
const swaggereJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    info: {
      title: '도서 정보 API 설계 및 구현',
      version: '1.0.0',
      description: 'Test API with express',
    },
    host: 'localhost:9999',
    basePath: '/',
  },
  apis: ['./routes/*.js', './swagger/*'],
};

const specs = swaggereJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
