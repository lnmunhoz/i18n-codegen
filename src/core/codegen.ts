import fs from 'fs-extra';
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

  const code = `
  export const I18nKeys = [
    ${keys.map(key => `"${key}"`)}
  ] as const;
  
  export type I18nKey = typeof I18nKeys[number];
  `;

  return code.replace('.defaultMessage', '');
};

export const runCodegen = async (config: I18nCodegenConfig) => {
  // Get absolute paths
  const translationsFilePath = path.join(
    rootProjectDir,
    config.translationsFilePath
  );
  const outputCodePath = path.join(rootProjectDir, config.outputFilePath);

  // Ensure file and folders exists
  await fs.ensureFile(outputCodePath);

  // Clean cache
  delete require.cache[translationsFilePath]; // Deleting loaded module

  // Codegen
  const translations = require(translationsFilePath) as TranslationsDict;
  const code = generateCode(translations);

  await fs.writeFile(outputCodePath, code, {
    encoding: 'utf-8',
    flag: 'w',
  });
};
