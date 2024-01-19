import swaggerUi from 'swagger-ui-express';
import swaggereJsdoc from 'swagger-jsdoc';

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

export { swaggerUi, specs };
