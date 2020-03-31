import { flattenObject } from '../util/parse-translations';

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

export const runCodegen = (translations: TranslationsDict) => {
  const code = generateCode(translations);
  return code;
};
