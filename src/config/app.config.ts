import { API_PREFIX, API_VERSION, SWAGGER_DOCS_PATH } from './api.constants';
import { registerAs } from '@nestjs/config';

const nodeEnv = process.env.NODE_ENV || 'development';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT ?? '8000', 10) || 8000,
  nodeEnv,
  swaggerEnabled:
    (process.env.SWAGGER_ENABLED ??
      (nodeEnv === 'production' ? 'false' : 'true')) === 'true',
  apiPrefix: API_PREFIX,
  apiVersion: API_VERSION,
  swaggerDocsPath: SWAGGER_DOCS_PATH,
}));
