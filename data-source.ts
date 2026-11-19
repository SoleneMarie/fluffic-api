import 'reflect-metadata'; // CLI Type ORM indépendant de Nest JS, donc import explicite
import 'dotenv/config';

import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,

  entities: [__dirname + '/**/*.entity.ts'],

  migrations: [__dirname + '/src/database/migrations/**/*{.ts,.js}'],

  synchronize: false,
});
