import { loadConfigFile } from '../src/core/config';

describe('Config Tests', () => {
  it('should load config file', () => {
    const config = loadConfigFile();
    expect(config.translationsFilePath).toBe('./test/translations/en.json');
    expect(config.outputFilePath).toBe('./test/generated/i18n.types.ts');
  });
});
