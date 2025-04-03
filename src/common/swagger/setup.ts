import { dependency } from '@/common/di';
import type { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger.config';

@dependency()
export class SwaggerSetup {
  setup(app: Application) {
    // Serve Swagger UI
    app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'My App API Documentation',
        customfavIcon: '/favicon.ico'
      })
    );

    // Serve Swagger JSON
    app.get('/swagger.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    });
  }
}
