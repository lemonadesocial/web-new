import jwt from "jsonwebtoken";

export interface AuthCookie {
  storedToken: {
    jwtToken: string;
    isNewUser: boolean; // if user is new then walletAddress is not set
    authDetails: {
      email: string;
      walletAddress?: string;
    };
  };
}

export const decodeAuthCookie = (authCookie: string) => {
  try {
    return jwt.decode(authCookie) as AuthCookie;
  }
  catch {
    //-- invalid auth cookie
    return undefined;
  }
};
