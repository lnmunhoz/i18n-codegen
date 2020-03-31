import fs from 'fs';
import fe from 'fs-extra';
import path from 'path';
import { flattenObject } from '../util/parse-translations';
import { I18nCodegenConfig, rootProjectDir } from './config';

interface TranslationsDict {
  [key: string]: string | object;
}

export type TranslationKeys = string[];

export const generateCode = (translations: TranslationsDict) => {
  const flat = flattenObject(translations);
  const keys = Object.keys(flat);

  return `// prettier-ignore
export const I18nKeys = [
  ${keys.map(key => `"${key}"`)}
] as const;

export type I18nKey = typeof I18nKeys[number];
`;
};

export const runCodegen = async (config: I18nCodegenConfig) => {
  const translationsFilePath = path.join(
    rootProjectDir,
    config.translationsFilePath
  );
  const outputCodePath = path.join(rootProjectDir, config.outputFilePath);
  const translations = require(translationsFilePath) as TranslationsDict;
  const code = generateCode(translations);

  return new Promise(async (resolve, reject) => {
    // Ensure file and folders exists
    await fe.ensureFile(outputCodePath);

    fs.writeFile(
      outputCodePath,
      code,
      {
        encoding: 'utf-8',
        flag: 'w',
      },
      err => {
        if (err) {
          console.log(err);
          return reject({
            error: 'i18n-code-generator: Error writing file',
            // @ts-ignore
            message: error.messsage,
          });
        }

        return resolve();
      }
    );
  });
};
