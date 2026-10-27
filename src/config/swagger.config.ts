import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

export function setupSwagger(app: INestApplication) {
  const theme = new SwaggerTheme();

  const config = new DocumentBuilder()
    .setTitle('VolTrack API')
    .setDescription('VolTrack Backend API Documentation')
    .setVersion('2.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT-auth',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });

  // Define public endpoints that should not require authentication
  const publicEndpoints = [
    '/api/auth/login',
    '/api/auth/refresh',
    '/api/clients/signup',
    '/api/agents/login',
  ];

  // Add global security to all endpoints except public ones
  Object.keys(document.paths).forEach((path) => {
    const pathItem = document.paths[path];
    if (pathItem) {
      Object.keys(pathItem).forEach((method) => {
        const operation = (pathItem as any)[method];

        // Skip if already has security defined or if it's a public endpoint
        if (
          operation &&
          operation.security === undefined &&
          !publicEndpoints.includes(path)
        ) {
          operation.security = [{ 'JWT-auth': [] }];
        }
      });
    }
  });

  SwaggerModule.setup('api/docs', app, document, {
    explorer: true,
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DRACULA),
    swaggerOptions: {
      persistAuthorization: true,
    },
    customJsStr: `
      // Auto-capture and apply access token from login responses
      (function() {
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
          return originalFetch.apply(this, args).then(async function(response) {
            const url = response.url || '';
            if (url.includes('/auth/login') || url.includes('/agents/login') || url.includes('/auth/refresh')) {
              const clonedResponse = response.clone();
              try {
                const data = await clonedResponse.json();
                if (data && data.accessToken) {
                  // Store token and auto-authorize
                  setTimeout(() => {
                    const ui = window.ui;
                    if (ui && ui.authActions) {
                      ui.authActions.authorize({
                        'JWT-auth': {
                          name: 'JWT-auth',
                          schema: { type: 'http', scheme: 'bearer' },
                          value: data.accessToken
                        }
                      });
                      console.log('✅ Token automatically applied to authorization');
                    }
                  }, 100);
                }
              } catch (e) {
                console.error('Failed to auto-capture token:', e);
              }
            }
            return response;
          });
        };
      })();
    `,
  });
}
