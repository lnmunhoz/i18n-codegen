import appRootPath from 'app-root-path';
import path from 'path';
export interface I18nCodegenConfig {
  translationsFilePath: string;
  outputFilePath: string;
}

/**
 * Package's root dir
 */
export const rootProjectDir = appRootPath.path;

export const getConfigFilePath = () => {
  return path.join(rootProjectDir, 'i18nrc.js');
};

export const loadConfigFile = (): I18nCodegenConfig => {
  const configPath = getConfigFilePath();

  try {
    delete require.cache[configPath];
    const config = require(configPath);

    if (!config) {
      throw new Error('i18n-code-generator: config file not found');
    }

    return config;
  } catch (err) {
    throw err;
  }
};
