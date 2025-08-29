import { useState } from "react";
import {
  SelfQRcodeWrapper,
  SelfAppBuilder,
  type SelfApp,
} from "@selfxyz/qrcode";

import { Button, modal, ModalContent, toast } from "$lib/components/core";
import { useClient, useMutation } from "$lib/graphql/request";
import { CreateSelfVerificationRequestDocument, GetSelfVerificationStatusDocument } from "$lib/graphql/generated/backend/graphql";

import { EndpointType, getUniversalLink } from "@selfxyz/common";
import { SELF_VERIFICATION_CONFIG } from "$lib/utils/constants";
import { useMe } from "$lib/hooks/useMe";
import { userAvatar } from "$lib/utils/user";
import { ErrorModal } from "./ErrorModal";

export function GetVerifiedModal() {
  const me = useMe();
  const { client } = useClient();

  const [showCode, setShowCode] = useState(false);
  const [selfApp, setSelfApp] = useState<SelfApp | null>(null);
  const [universalLink, setUniversalLink] = useState('');

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const [createSelfVerificationRequest, { loading: creatingRequest }] = useMutation(CreateSelfVerificationRequestDocument, {
    onComplete: (_, data) => {
      if (data?.createSelfVerificationRequest) {
        const { endpoint, endpoint_type, scope, uuid } = data.createSelfVerificationRequest;

        try {
          const app = new SelfAppBuilder({
            version: 2,
            appName: 'lemonade.social',
            scope: scope,
            endpoint: endpoint,
            userId: uuid,
            userIdType: 'uuid',
            endpointType: endpoint_type as EndpointType,
            disclosures: SELF_VERIFICATION_CONFIG
          }).build();

          setSelfApp(app);
          setUniversalLink(getUniversalLink(app));
          setShowCode(true);
        } catch (error: any) {
          toast.error(error.message || "Failed to initialize Self app");
        }
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create verification request");
    },
  });

  const handleRevealCode = () => {
    createSelfVerificationRequest({
      variables: {
        config: SELF_VERIFICATION_CONFIG
      }
    });
  };

  const handleSuccess = () => {
    setShowSuccess(true);
    client.refetchQuery({
      query: GetSelfVerificationStatusDocument,
      variables: {
        config: SELF_VERIFICATION_CONFIG
      }
    });
  };

  if (showSuccess) return (
    <div className="w-[340px] max-w-full p-4 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="relative">
          <img src={userAvatar(me)} className="size-[56px] rounded-full" />
          <i className="icon-verified text-accent-400 absolute bottom-0 right-0 size-4" />
        </div>
        <Button icon="icon-x" size="xs" variant="tertiary" className="rounded-full" onClick={() => modal.close()} />
      </div>
      <div className="space-y-2">
        <p className="text-lg">You're Verified!</p>
        <p className="text-sm text-secondary">Your verified checkmark is official. Start earning rewards at events and stand out wherever you go.</p>
      </div>
      <Button className="w-full" variant="tertiary" onClick={() => modal.close()}>Done</Button>
    </div>
  );

  if (showError) return (
    <ErrorModal
      title="Verification Unsuccessful"
      message="Your details don’t meet the requirements to get verified and receive a checkmark."
      onClose={() => modal.close()}
    />
  );

  if (showCode && selfApp) return (
    <ModalContent
      title="Scan to Verify"
      onBack={() => setShowCode(false)}
      onClose={() => modal.close()}
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-secondary">Open the Self app on your phone and scan the QR code below to confirm your details.</p>
        <div className="p-4 rounded-sm bg-primary/8">
          <SelfQRcodeWrapper
            selfApp={selfApp}
            onSuccess={handleSuccess}
            onError={() => setShowError(true)}
            size={276}
          />
        </div>
        {
          universalLink && (
            <p className="text-sm text-secondary">Already on your phone? <a href={universalLink} target="_blank" rel="noopener noreferrer" className="text-accent-400 cursor-pointer">Open Self</a></p>
          )
        }
      </div>
    </ModalContent>
  );

  return (
    <div className="w-[340px] max-w-full p-4 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="size-[56px] flex justify-center items-center rounded-full bg-violet-400/16">
          <i className="icon-verified text-accent-400" />
        </div>
        <Button icon="icon-x" size="xs" variant="tertiary" className="rounded-full" onClick={() => modal.close()} />
      </div>

      <div className="space-y-2">
        <p className="text-lg">Get Verified</p>
        <p className="text-sm text-secondary">Prove you are a unique human and not a bot. Unlock rewards and build trust across events and communities.</p>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-secondary">You'll be asked to confirm:</p>
        <div className="flex gap-2 items-center">
          <i className="icon-checkbox-sharp size-4" />
          <p className="text-sm">Age [over 18]</p>
        </div>
        <div className="flex gap-2 items-center">
          <i className="icon-checkbox-sharp size-4" />
          <p className="text-sm">Nationality</p>
        </div>
        <div className="flex gap-2 items-center">
          <i className="icon-checkbox-sharp size-4" />
          <p className="text-sm">My name is not present on the OFAC list</p>
        </div>
      </div>

      <p className="text-sm text-secondary">Please note: you'll need the Self app on your phone to complete verification. <a href="https://self.xyz/" target="_blank" className="text-accent-400">Learn more</a>.</p>

      <Button
        className="w-full"
        variant="secondary"
        onClick={handleRevealCode}
        loading={creatingRequest}
      >
        Reveal QR Code
      </Button>
    </div>
  );
}
