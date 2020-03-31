#!/usr/bin/env node

import sade from 'sade';
import { loadConfigFile } from './core/config';
import ora from 'ora';
import { runCodegen } from './core/codegen';
const pkg = require('../package.json');

const cli = sade('i18n-codegen').version(pkg.version);

cli
  .command('codegen')
  .describe('Generated types dictionary based on a translations file')
  .action(async () => {
    const spinner = ora('i18n codegen started...').start();
    const config = loadConfigFile();

    spinner.text = 'Generating file...';
    await runCodegen(config);

    spinner.succeed('i18n-codegen: Done');
  });

cli.parse(process.argv);
