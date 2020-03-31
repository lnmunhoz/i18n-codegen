import { flattenObject } from '../src/util/parse-translations';

describe('blah', () => {
  it('flattens object with dot separator', () => {
    const t = {
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

    const flat = flattenObject(t);

    expect(flat['home.title']).toBeDefined();
    expect(flat['home.subtitle']).toBeDefined();
    expect(flat['info.another.level']).toBeDefined();
    expect(Object.keys(flat).length).toBe(3);
  });
});
