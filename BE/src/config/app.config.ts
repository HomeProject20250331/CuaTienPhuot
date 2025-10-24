import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3001,
  apiPrefix: process.env.API_PREFIX || 'api/v1',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  corsCredentials: process.env.CORS_CREDENTIALS === 'true',
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 12,
  sessionSecret: process.env.SESSION_SECRET || 'your-session-secret-here',
}));
