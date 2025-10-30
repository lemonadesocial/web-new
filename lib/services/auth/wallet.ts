import { request } from "../../utils/request";

export const getUserWalletRequest = async (wallet: string) => {
  const { message, token } = await request<{ message: string; token: string }>(
    `${process.env.NEXT_PUBLIC_IDENTITY_URL}/api/wallet?${new URLSearchParams({ wallet })}`,
  );

  return { message, token };
};
