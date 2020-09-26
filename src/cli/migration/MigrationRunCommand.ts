import * as yargs from 'yargs';
import { execSync } from 'child_process';
import * as _ from 'lodash';
import { db } from 'src/utils/database/database';
/**
 * Runs migration command.
 */
export class MigrationRunCommand implements yargs.CommandModule {
  command = 'migration:run';
  describe = 'Runs all pending migrations.';
  aliases = 'migrations:run';

  builder(args: yargs.Argv) {
    return args
      .option('connection', {
        alias: 'c',
        default: 'default',
        describe: 'Name of the connection on which run a query.',
      })
      .option('transaction', {
        alias: 't',
        default: 'default',
        describe:
          'Indicates if transaction should be used or not for migration run. Enabled by default.',
      })
      .option('config', {
        alias: 'f',
        default: 'ormconfig',
        describe: 'Name of the file with connection configuration.',
      });
  }

  async handler() {
    const environment = _.clone(process.env);
    // environment.FMT_CLI = '0';

    await db.es_connect();
    execSync(`npm run typeorm:migration:run`, {
      env: environment,
      stdio: 'inherit',
    });

    // console.log('bat', bat.toString());
    // const stdoutMsg = shell.toString();
  }
}
