import { Configuration, FrontendApi, IdentityApi } from '@ory/client';
import { KRATOS_PUBLIC_URL } from './constants';

export const ory =
  typeof window !== 'undefined'
    ? new FrontendApi(
        new Configuration({
          basePath: KRATOS_PUBLIC_URL,
          baseOptions: {
            withCredentials: true,
          },
        }),
      )
    : undefined;

export const identity = new IdentityApi(
  new Configuration({
    basePath: KRATOS_PUBLIC_URL,
    baseOptions: {
      withCredentials: true,
    },
  }),
);

export const getServerSideOry = (cookie?: string) => {
  return new FrontendApi(
    new Configuration({
      basePath: KRATOS_PUBLIC_URL,
      baseOptions: {
        withCredentials: true,
        headers: cookie ? { cookie } : undefined,
      },
    }),
  );
};
