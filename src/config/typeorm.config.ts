import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Load environment variables from your .env file
dotenv.config();

// Basic logging to replace the NestJS Logger since this runs outside NestJS
console.log(
  `[TypeORM CLI] Initializing DataSource for database: ${process.env.DB_NAME || 'auth_service'}`,
);

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'auth_service', // Uses DB_NAME from your .env

  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],

  // Converts the "true"/"false" string from .env into a real boolean
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
});
