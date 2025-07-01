import { useAtomValue } from 'jotai';

import { hydraClientIdAtom } from '$lib/jotai';
// import { handleSignIn } from "$lib/utils/ory";

import { modal } from '../components/core';
import { Input, Button } from '../components/core';

import { useOAuth2 } from './useOAuth2';

interface Props {}
function UnifiedLoginSignupModal(props: Props) {
  return (
    <div style={{ padding: 21, gap: 13, display: 'flex', flexDirection: 'column' }}>
			<div style={{display: 'flex', justifyContent: 'space-between', gap: 13, alignItems:"center"}}>
      <div>unified login signup modal</div>
			<Button onClick={() => modal.close()}>X</Button>
			</div>

      <div>
				<Input placeholder="Email address"/>
				<Button>Continue with Email</Button>
				
			</div>
      
    </div>
  );
}

function handleSignIn() {
  modal.open(UnifiedLoginSignupModal, {});
}

export function useSignIn() {
  const { signIn } = useOAuth2();
  const hydraClientId = useAtomValue(hydraClientIdAtom);

  return () => {
    if (hydraClientId) {
      console.log('hydraClientId', hydraClientId);
      // signIn();
      return;
    }

    handleSignIn();
  };
}
