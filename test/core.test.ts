import fs from 'fs';
import path from 'path';
import { generateCode, runCodegen } from '../src/core/codegen';
import { loadConfigFile, rootProjectDir } from '../src/core/config';

describe('Core Tests', () => {
  beforeAll(() => {
    fs.rmdirSync(path.join(rootProjectDir, 'test', 'generated'), {
      recursive: true,
    });
  });

  it('should generate code', () => {
    const translations = {
      home: {
        title: 'Title',
        subtitle: 'Subtitle',
      },
      info: {
        another: {
          level: 'Deep Level',
        },
      },
    };

    const code = generateCode(translations);
    const expected = fs.readFileSync(__dirname + '/expected/generated.ts', {
      encoding: 'utf-8',
    });
    expect(code).toBe(expected);
  });

  it('should output generated file based on config', async done => {
    const config = loadConfigFile();
    const checkFileExists = () => fs.existsSync(config.outputFilePath);

    expect(checkFileExists()).toBeFalsy();

    await runCodegen(config);

    expect(checkFileExists()).toBeTruthy();

    done();
  });
});
