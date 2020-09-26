import { DBStorage } from './../../shared/decorators/database/DBStorage';
import * as ormconfig from '../../config/orm.config';
import * as yargs from 'yargs';
import * as chalk from 'chalk';
import { camelCase } from 'lodash';
import { execSync } from 'child_process';
import { sleep } from 'src/utils/utils';
import glob from 'src/utils/glob';
import * as _ from 'lodash';

/**
 * Generates a new migration file with sql needs to be executed to update schema.
 */
export class MigrationGenerateCommand implements yargs.CommandModule {
  command = 'migration:generate';
  describe = 'Generates a new migration file with sql needs to be executed to update schema.';
  aliases = 'migrations:generate';

  builder(args: yargs.Argv) {
    return args
      .option('c', {
        alias: 'connection',
        default: 'default',
        describe: 'Name of the connection on which run a query.',
      })
      .option('n', {
        alias: 'name',
        describe: 'Name of the migration class.',
        demand: true,
      })
      .option('d', {
        alias: 'dir',
        describe: 'Directory where migration should be created.',
      })
      .option('f', {
        alias: 'config',
        default: 'ormconfig',
        describe: 'Name of the file with connection configuration.',
      });
  }

  // async execAsync(command: string, options?: ExecOptions) {
  //   return new Promise((ok) => {

  //     const shell = exec(command, options, );
  //   });
  // }

  async handler(args: yargs.Arguments) {
    if (args._[0] === 'migrations:generate') {
      console.log("'migrations:generate' is deprecated, please use 'migration:generate' instead");
    }

    if (args.name === true || !args.name) {
      console.log(chalk.yellow('Please specify migration name'));
      return;
    }

    const environment = _.clone(process.env);
    environment.FMT_CLI = '0';

    const shell = execSync(`npm run typeorm:migration:generate ${<string>args.name}`, { env: environment });

    console.log('bat');
    const stdoutMsg = shell.toString();
    // console.log('bat', stdoutMsg);
    if (stdoutMsg.indexOf('No changes in database schema were found') >= 0) {
      console.log(
        chalk.yellow(
          `No changes in database schema were found - cannot generate a migration. To create a new empty migration use "typeorm migration:create" command`,
        ),
      );
      return;
    }

    const migrationLine = stdoutMsg.split('\n').find((r) => r.endsWith('has been generated successfully.'));

    if (!migrationLine) console.log('output', stdoutMsg);

    const filePath = migrationLine.replace('Migration ', '').replace('has been generated successfully.', '').trim();

    const oconfig = <any>ormconfig;
    const entities = await glob(oconfig.entities[0]);
    // console.log('c', c);
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      await import(entity);
      // console.log(await import(entity));
    }
    await DBStorage.es_wait();
    await sleep(1000);
    DBStorage.appendToFile(filePath);
    // console.log('ormconfig', oconfig.entities);
    // console.log('process.env', process.env);
    console.log('>-------------------------<');
    console.log('>--------> End <----------<');
    console.log('>-------------------------<');
    console.log(chalk.green(`Migration ${chalk.blue(filePath)} has been generated successfully.`));
  }

  // -------------------------------------------------------------------------
  // Protected Static Methods
  // -------------------------------------------------------------------------

  /**
   * Formats query parameters for migration queries if parameters actually exist
   */
  protected static queryParams(parameters: any[] | undefined): string {
    if (!parameters || !parameters.length) {
      return '';
    }

    return `, ${JSON.stringify(parameters)}`;
  }

  /**
   * Gets contents of the migration file.
   */
  protected static getTemplate(name: string, timestamp: number, upSqls: string[], downSqls: string[]): string {
    const migrationName = `${camelCase(name)}${timestamp}`;

    return `import {MigrationInterface, QueryRunner} from "typeorm";

export class ${migrationName} implements MigrationInterface {
    name = '${migrationName}'

    public async up(queryRunner: QueryRunner): Promise<void> {
${upSqls.join(`
`)}
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
${downSqls.join(`
`)}
    }

}
`;
  }
}
