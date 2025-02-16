import { expect, it, describe } from 'vitest';
import { DEFAULT_CONFIG } from '$lib/data';

const value = {
  title: 'Lemonade',
  theme: {
    styles: { variables: {}, externals: [] },
  },
};

function getMockedSiteData(_domain: string) {
  return [DEFAULT_CONFIG];
}

describe('Data Config', () => {
  it('should received config site', () => {
    const [data] = getMockedSiteData('example');
    expect(data).toStrictEqual(value);
  });
});
