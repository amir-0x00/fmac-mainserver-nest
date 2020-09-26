import { ConnectionManager } from 'typeorm';
import { createDatabase } from 'pg-god';
import * as ormconfig from '../../../config/orm.config';

const config: any = ormconfig;
// ---------------------------
export class pg_general {
  private static connectionManager = new ConnectionManager();
  private static connection: any;

  static async connect() {
    this.connection = this.connectionManager.create(<any>ormconfig);
    try {
      await this.connection.connect(); // performs connection
    } catch (err) {
      if (err.code === '3D000') {
        // Database doesn't exist.
        // PG error code ref: https://docstore.mik.ua/manuals/sql/postgresql-8.2.6/errcodes-appendix.html
        await createDatabase(
          { databaseName: config.database },
          {
            user: config.username,
            port: config.port,
            host: config.host,
            password: config.password,
          },
        );
        return await this.connect();
      }
      throw err;
    }
    // console.log('c', c);
  }
  static get getConnection() {
    return this.connection;
  }
}
// ---------------------------
