import fs from 'fs';
import { generateCode } from '../src/core/codegen';

describe('Core Tests', () => {
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
});
