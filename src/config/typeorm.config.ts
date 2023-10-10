import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME, //database name replace with your database name but it should be 'root'
    autoLoadEntities: true,
    synchronize: true,
    // dropSchema: true,
    entities: ['dist/**/*.entity{.ts,.js}'],
  }),
);
