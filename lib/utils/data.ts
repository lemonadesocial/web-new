import { Config } from './types';

export const DEFAULT_CONFIG: Config = {
  title: 'Lemonade',
  theme: {
    styles: {
      variables: {
        // TODO: need to test
        // '--color-primary-500': 'red',
        // '--color-background': 'white',
      },
      externals: [],
    },
  },
};
