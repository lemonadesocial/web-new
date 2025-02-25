export type StylesConfig = {
  variables: { [key: string]: string };
  externals: string[];
};

export type Config = {
  title: string;
  theme: {
    styles: StylesConfig;
  };
};
