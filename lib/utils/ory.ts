import { Configuration, FrontendApi, IdentityApi } from '@ory/client';
import { IDENTITY_URL, KRATOS_PUBLIC_URL } from './constants';

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

export const handleSignIn = async () => {
  window.location.href = `${IDENTITY_URL}/login?return_to=${window.location.href}`
};
