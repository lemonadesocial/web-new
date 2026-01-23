import { authenticate } from "@lemonadesocial/lemonade-shared";
import { IncomingMessage } from "http";
import { NextRequest } from "next/server";

export const auth = async (req: NextRequest) => {
  const result = await authenticate({
    headers: Object.fromEntries(req.headers.entries()),
  } as IncomingMessage);
  
  return result?.kratos?.identity?.id;
};
