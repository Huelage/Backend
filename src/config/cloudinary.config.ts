import { registerAs } from '@nestjs/config';
import { env } from './env.config';

export default registerAs('cloudinary', () => ({
  cloud_name: env.cloudinary_cloudname,
  api_key: env.cloudinary_apikey,
  api_secret: env.cloudinary_apisecret,
}));
