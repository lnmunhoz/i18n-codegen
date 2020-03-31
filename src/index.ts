#!/usr/bin/env node

import chokidar from 'chokidar';
import ora from 'ora';
import path from 'path';
import sade from 'sade';
import { runCodegen } from './core/codegen';
import { loadConfigFile, rootProjectDir } from './core/config';
const pkg = require('../package.json');

const cli = sade('i18n-codegen').version(pkg.version);

cli
  .command('generate')
  .describe('Generates types dictionary based on a translations file')
  .option('--watch', 'Generated when the translations file change')
  .action(async ({ watch }: { watch: boolean | undefined }) => {
    const spinner = ora('i18n codegen started...').start();
    const config = loadConfigFile();
    const isWatchMode = !!watch;
    const getTime = () => {
      const now = new Date();
      return `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    };

    const runSingleCodegen = async () => {
      spinner.text = `Generating types...`;
      await runCodegen(config);
      spinner.succeed(`Type generation completed - ${getTime()}`);
    };

    try {
      if (isWatchMode) {
        await runSingleCodegen();
        spinner.info(`Watching translations on ${config.translationsFilePath}`);
        const watcher = chokidar.watch(
          [path.join(rootProjectDir, config.translationsFilePath)],
          {
            interval: 1000,
          }
        );

        watcher.on('change', async () => {
          const changed = ora('File changed, generating types...').start();
          await runCodegen(config);
          changed.succeed(`Types generated sucessfully! - ${getTime()}`);
          spinner.info(
            `Watching translations on ${config.translationsFilePath}`
          );
        });
      } else {
        await runSingleCodegen();
      }
    } catch (err) {
      console.log(err);
    }
  });

cli.parse(process.argv);
