export type StylesConfig = {
  variables: { [key: string]: string };
  externals: string[];
};

export type Config = {
  theme: {
    styles: StylesConfig;
  };
};
