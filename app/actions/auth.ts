'use server';

import { getServerSideOry } from '$lib/utils/ory';
import { cookies } from 'next/headers';

export async function logout() {
  try {
    const cookieStore = await cookies();
    const cookieString = Array.from(cookieStore.getAll())
      .map((cookie) => `${cookie.name}=${cookie.value}; expires=${new Date(0).toUTCString()}; path=/;`)
      .join(' ');

    const ory = getServerSideOry(cookieString);
    const res = await ory?.createBrowserLogoutFlow();
    await ory?.updateLogoutFlow({ token: res.data.logout_token });
    cookieStore.getAll().map((c) => cookieStore.delete(c.name));
  } catch (err) {
    console.error(err);
  }
}
