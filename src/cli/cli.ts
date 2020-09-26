import * as yargs from 'yargs';

import { MigrationRunCommand } from './migration/MigrationRunCommand';
import { MigrationGenerateCommand } from './migration/MigrationGenerateCommand';

process.env.FMT_CLI = '1';

yargs
  .usage('Usage: $0 <command> [options]')
  .command(new MigrationGenerateCommand())
  .command(new MigrationRunCommand())
  .recommendCommands()
  .demandCommand(1)
  .strict()
  .alias('v', 'version')
  .help('h')
  .alias('h', 'help').argv;

require('yargonaut')
  .style('blue')
  .style('yellow', 'required')
  .helpStyle('green')
  .errorsStyle('red');
