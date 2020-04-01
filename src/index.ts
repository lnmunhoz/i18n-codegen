#!/usr/bin/env node

import chokidar from 'chokidar';
import ora from 'ora';
import path from 'path';
import sade from 'sade';
import { runCodegen } from './core/codegen';
import { loadConfigFile, rootProjectDir } from './core/config';
const pkg = require('../package.json');

const ErrorCode = {
  ModuleNotFound: 'MODULE_NOT_FOUND',
};

const cli = sade('i18n-codegen').version(pkg.version);

const getTime = () => {
  const now = new Date();
  return `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
};

cli
  .command('generate')
  .describe('Generates types dictionary based on a translations file')
  .option('--watch', 'Generated when the translations file change')
  .action(async ({ watch }: { watch: boolean | undefined }) => {
    const spinner = ora('i18n-codegen started...').start();
    const isWatchMode = !!watch;

    function handleError(err: any) {
      if (err.code === ErrorCode.ModuleNotFound) {
        spinner.warn(
          `Could not find translations file, please check if the path ${
            loadConfigFile().translationsFilePath
          } is correct`
        );
      } else {
        spinner.warn(
          'Unexpected error, please create an issue! -> https://github.com/lnmunhoz/i18n-codegen/issues '
        );
        console.error(err.code, err.message);
      }

      if (isWatchMode) {
        spinner.info('Waiting for config file changes...');
      }
    }

    function handleGenerated() {
      spinner.succeed(`Types generated sucessfully! - ${getTime()}`);
    }

    async function watchTrigger() {
      spinner.start('File changed, generating types...');
      const config = loadConfigFile();
      await runCodegen(config)
        .then(() => {
          handleGenerated();
          spinner.info(
            `Watching translations on ${
              config.translationsFilePath
            } - ${getTime()}`
          );
        })
        .catch(handleError);
    }

    try {
      const config = loadConfigFile();

      const runSingleCodegen = async () => {
        spinner.text = `Generating types...`;
        await runCodegen(config);
        handleGenerated();
      };

      if (!isWatchMode) {
        await runSingleCodegen();
        return;
      }

      // Watch mode
      spinner.info(
        `Watching translations on ${config.translationsFilePath} - ${getTime()}`
      );
      const watcher = chokidar.watch(
        [
          path.join(rootProjectDir, config.translationsFilePath),
          path.join(rootProjectDir, 'i18nrc.js'),
        ],
        {
          interval: 1000,
        }
      );

      watcher.on('change', watchTrigger);

      await runSingleCodegen();
    } catch (err) {
      handleError(err);
    }
  });

cli.parse(process.argv);
