import { IDENTITY_URL } from '$lib/utils/constants';

export interface IdentityError {
  id: number;
  text: string;
  type: string;
}

export interface IdentityResponse {
  flow_id?: string;
  token?: string;
  session?: {
    token: string;
    expires_at: string;
  };
  error?: IdentityError[];
}

export interface RefreshResponse {
  session: {
    token: string;
    expires_at: string;
  };
}

export interface RefreshError {
  error: string;
}

export interface UpdateSettingsRequest {
  flow_id?: string;
  traits?: any;
  session_token?: string;
  transient_payload?: TransientPayload;
}

export interface UpdateSettingsResponse {
  flow_id: string;
  error?: IdentityError[];
}

export interface VerificationRequest {
  flow_id?: string;
  code?: string;
  email?: string;
}

export interface VerificationResponse {
  flow_id: string;
  error?: IdentityError[];
}

export interface LoginCodeRequest {
  method: 'code';
  identifier: string;
  flow_id?: string;
  code?: string;
  resend?: boolean;
}

export interface TransientPayload {
  farcaster_jwt?: string;
  farcaster_app_hostname?: string;
  unicorn_auth_cookie?: string;
  wallet_signature?: string;
  wallet_signature_token?: string;
}

export interface LoginWalletRequest {
  identifier: string;
  password: string;
  transient_payload: TransientPayload;
}

export interface SignupCodeRequest {
  method: 'code';
  traits: {
    email: string;
  };
  flow_id?: string;
  code?: string;
  resend?: boolean;
}

export interface SignupWalletRequest {
  traits: {
    wallet: string;
  };
  password: string;
  transient_payload: TransientPayload;
}

export const identityApi = {
  async loginWithCode(request: LoginCodeRequest): Promise<IdentityResponse> {
    const response = await fetch(`${IDENTITY_URL}/api/oauth2/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    return response.json();
  },

  async signupWithCode(request: SignupCodeRequest): Promise<IdentityResponse> {
    const response = await fetch(`${IDENTITY_URL}/api/oauth2/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    return response.json();
  },

  async updateSettings(request: UpdateSettingsRequest): Promise<UpdateSettingsResponse> {
    const response = await fetch(`${IDENTITY_URL}/api/oauth2/setting`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    return response.json();
  },

  async verify(request: VerificationRequest): Promise<VerificationResponse> {
    const response = await fetch(`${IDENTITY_URL}/api/oauth2/verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    return response.json();
  },

  async loginWithWallet(request: LoginWalletRequest): Promise<IdentityResponse> {
    const response = await fetch(`${IDENTITY_URL}/api/oauth2/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    return response.json();
  },

  async signupWithWallet(request: SignupWalletRequest): Promise<IdentityResponse> {
    const response = await fetch(`${IDENTITY_URL}/api/oauth2/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    return response.json();
  },

  async refreshSession(sessionToken: string): Promise<RefreshResponse> {
    const response = await fetch(`${IDENTITY_URL}/api/oauth2/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_token: sessionToken,
      }),
    });
    if (!response.ok) {
      const errorData: RefreshError = await response.json();
      throw new Error(errorData.error || 'Failed to refresh session');
    }
    const data: RefreshResponse = await response.json();
    return data;
  },
};
