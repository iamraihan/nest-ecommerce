import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DocumentBuilder,
  SwaggerModule,
  type SwaggerCustomOptions,
  type SwaggerDocumentOptions,
} from '@nestjs/swagger';
import { API_VERSIONED_SERVER_PATH, SWAGGER_DOCS_PATH } from './api.constants';

const setupSwagger = (app: INestApplication) => {
  const configService = app.get<ConfigService>(ConfigService);
  const nodeEnv = configService.get<string>('app.nodeEnv', 'development');
  const isProduction = nodeEnv === 'production';
  const isSwaggerEnabled = configService.get<boolean>(
    'app.swaggerEnabled',
    !isProduction,
  );

  if (!isSwaggerEnabled) {
    return;
  }

  const config = new DocumentBuilder()
    .setTitle('Nest Ecommerce API')
    .setDescription(
      'Production-oriented OpenAPI documentation for the Nest Ecommerce backend.',
    )
    .setVersion('1.0.0')
    .addServer(API_VERSIONED_SERVER_PATH, 'Version 1')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'Paste a valid access token to authorize secured endpoints.',
      },
      'bearer',
    )
    .build();

  const documentOptions: SwaggerDocumentOptions = {
    deepScanRoutes: true,
    operationIdFactory: (controllerKey, methodKey) =>
      `${controllerKey.replace(/Controller$/, '')}_${methodKey}`,
  };

  const document = SwaggerModule.createDocument(app, config, documentOptions);

  const customOptions: SwaggerCustomOptions = {
    customSiteTitle: 'Nest Ecommerce API Docs',
    swaggerOptions: {
      docExpansion: 'none',
      filter: true,
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      displayRequestDuration: !isProduction,
    },
  };

  SwaggerModule.setup(SWAGGER_DOCS_PATH, app, document, customOptions);
};

export default setupSwagger;
