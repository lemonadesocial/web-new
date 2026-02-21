import { SiwePayload } from "../../components/features/unicorn/client";

const request = async <T>(uri: string, method: "GET" | "POST" = "GET", body?: unknown): Promise<T> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_IDENTITY_URL}${uri}`, {
    method,
    ...(body && {
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    }),
  });

  return (await response.json()) as T;
};

export const getUnicornCanLink = (cookie: string) =>
  request<{ identityId?: string; canLink: boolean; wallet?: string; email?: string }>(
    `/api/unicorn/canlink?auth_cookie=${cookie}`,
  );

export const linkUnicornWallet = (identifier: string, cookie: string, siwe: SiwePayload) =>
  request(`/api/unicorn/link`, "POST", { identifier, auth_cookie: cookie, siwe });
