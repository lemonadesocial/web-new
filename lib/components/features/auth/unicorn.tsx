import { useHandleUnicornCookie } from '../../../hooks/useConnectUnicornWallet';
import { useSession } from '../../../hooks/useSession';

import { Button } from '../../core/button';

interface Props {
  authCookie: string;
  onSuccess: (reload: boolean) => void;
}
export function UnicornAuth({ authCookie, onSuccess }: Props) {
  const session = useSession();

  const { processing, linking, showLinkOptions } = useHandleUnicornCookie(authCookie, onSuccess);

  const onLinkCurrentAccount = () => {
    console.log('link with current account');
  };

  const onLinkOtherAccount = () => {
    console.log('link with other account');
  };

  const onCreateNewAccount = () => {
    console.log('create new account');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 13, padding: 21 }}>
      {showLinkOptions ? (
        <>
          {session && <Button onClick={onLinkCurrentAccount}>{'Link with current account'}</Button>}
          <Button onClick={onLinkOtherAccount}>{'Link with other account'}</Button>
          <Button onClick={onCreateNewAccount}>{'Create new account'}</Button>
        </>
      ) : processing ? (
        <div>{'Authenticating with Unicorn...'}</div>
      ) : linking ? (
        <div>{'Linking with Unicorn...'}</div>
      ) : null}
    </div>
  );
}
