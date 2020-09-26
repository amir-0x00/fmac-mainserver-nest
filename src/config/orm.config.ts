import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';

const isDev = process.env.NODE_DEV || false;

export const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: '127.0.0.1',
  port: 5432,
  username: 'postgres',
  password: '123',
  database: 'fmt_accounting',
  // synchronize: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
  // We are using migrations, synchronize should be set to false.
  synchronize: false,

  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: !isDev,
  logging: ['query'],
  // logger: 'file',

  // Allow both start:prod and start:dev to use migrations
  // __dirname is either dist or src folder, meaning either
  // the compiled js in prod or the ts in dev.
  migrations: [path.join(__dirname, '../', 'migrations/**/*{.ts,.js}')],
  cli: {
    // Location of migration should be inside src folder
    // to be compiled into dist/ folder.
    migrationsDir: 'src/migrations',
  },
};

module.exports = config;
// export default config;
