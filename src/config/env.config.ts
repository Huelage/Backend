import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';
import { config } from 'dotenv';
import { validate } from '../common/utils/env.util';

export class Environment {
  @IsInt()
  port: number;

  @IsNotEmpty()
  db_host: string;

  @IsNotEmpty()
  db_pass: string;

  @IsNotEmpty()
  db_user: string;

  @IsNotEmpty()
  db_name: string;

  @IsNotEmpty()
  twilio_phone_number: string;

  @IsNotEmpty()
  twilio_account_sid: string;

  @IsNotEmpty()
  twilio_auth_token: string;

  @IsNotEmpty()
  jwt_access_secret: string;

  @IsNotEmpty()
  jwt_refresh_secret: string;

  @IsNotEmpty()
  cloudinary_cloudname: string;

  @IsNumber()
  cloudinary_apikey: number;

  @IsNotEmpty()
  cloudinary_apisecret: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  email_password: string;
}

config();
export const env = validate<Environment>(Environment, process.env);
