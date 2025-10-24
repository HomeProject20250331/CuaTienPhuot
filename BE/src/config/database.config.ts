import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  uri:
    process.env.MONGODB_URI ||
    'mongodb://admin:admin123@localhost:27020/cuatienphuot_dev?authSource=admin',
  testUri:
    process.env.MONGODB_TEST_URI ||
    'mongodb://admin:admin123@localhost:27020/cuatienphuot_test?authSource=admin',
}));
