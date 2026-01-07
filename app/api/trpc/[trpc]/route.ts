import { cookies } from 'next/headers';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import { appRouter } from '$lib/trpc';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: async () => {
      const cookieStore = await cookies();

      const authCookieName = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || '';
      const authCookie = cookieStore.get(authCookieName)?.value;

      return { authCookie };
    },
  });

export { handler as GET, handler as POST };
