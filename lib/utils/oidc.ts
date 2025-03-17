import { User, UserManager, Log } from 'oidc-client-ts';
import { HYDRA_PUBLIC_URL } from './constants';

class Oidc {
  userManager?: UserManager;

  setUserManager(clientId: string, clientSecret: string) {
    const oauth2Url = HYDRA_PUBLIC_URL;

    const userManager = new UserManager({
      automaticSilentRenew: false,
      authority: oauth2Url,
      metadata: {
        authorization_endpoint: `${oauth2Url}oauth2/auth`,
        token_endpoint: `${oauth2Url}oauth2/token`,
        userinfo_endpoint: `${oauth2Url}userinfo`,
        end_session_endpoint: `${oauth2Url}oauth2/sessions/logout`,
      },
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: `${window.location.origin}/oauth2/callback`,
      response_mode: 'query',
    });

    this.userManager = userManager;

    return userManager;
  }

  async restoreUser(oidcUserString: string) {
    if (!this.userManager) return;

    const userManager = this.userManager;
    const user = User.fromStorageString(oidcUserString);

    if (!user || !user.access_token) return;

    await userManager.storeUser(user);

    if (user.expired) {
      return await userManager.signinSilent();
    }

    return user;
  }
}

Log.setLogger(console);
Log.setLevel(Log.DEBUG);

export const oidc = new Oidc();
