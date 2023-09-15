import { ConfigOptions, v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY } from './constants';
// import { ConfigService } from '@nestjs/config/dist';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: (): ConfigOptions => {
    return cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUDNAME,
      api_key: process.env.CLOUDINARY_APIKEY,
      api_secret: process.env.CLOUDINARY_APISECRET,
    });
  },
};
