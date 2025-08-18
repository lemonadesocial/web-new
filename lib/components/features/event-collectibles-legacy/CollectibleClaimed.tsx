import { Button, modal, ModalContent } from "$lib/components/core";
import { TokenComplex } from "$lib/graphql/generated/metaverse/graphql";
import { Claim } from "$lib/graphql/generated/wallet/graphql";

import { MetaMedia } from "../MetaMedia";
import { TransferCollectible } from "./TransferCollectible";

export function CollectibleClaimed({ token, claim }: { token?: TokenComplex; claim: Claim; }) {  
  return (
    <ModalContent>
      {
        token && <MetaMedia metadata={token.metadata} className="h-14 rounded-sm border border-card-border mb-4" />
      }
      <div className="space-y-2">
        <p className="text-lg">Collectible Claimed!</p>
        <p className="text-secondary">
          You&apos;ve successfully claimed {token?.metadata?.name}. It&apos;s now stored safely in your Lemonade wallet.
        </p>
        <p className="text-tertiary">
          Want to move it elsewhere?{' '}
          <span
            className="text-accent-400 cursor-pointer"
            onClick={() => {
              modal.close();
              modal.open(
                TransferCollectible,
                {
                  dismissible: false,
                  props: {
                    claim,
                    token
                  }
                }
              );
            }}
          >
            Transfer it to another wallet you own.
          </span>
        </p>
      </div>
      <Button variant="secondary" className="w-full mt-4" onClick={() => modal.close()}>
        Done
      </Button>
    </ModalContent>
  );
}
