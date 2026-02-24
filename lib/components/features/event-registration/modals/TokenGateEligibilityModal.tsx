import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useAtom, useAtomValue } from 'jotai';

import { Card, ModalContent, toast } from '$lib/components/core';
import { BlockchainPlatform, EventTokenGate, SetUserWalletDocument } from '$lib/graphql/generated/backend/graphql';
import { appKit, useAppKit, useAppKitAccount } from '$lib/utils/appkit';
import { formatError, formatWallet } from '$lib/utils/crypto';
import { chainsMapAtom } from '$lib/jotai/chains';

import { buyerWalletAtom, ethereumWalletInputAtom, registrationModal, useSetAtom } from '../store';
import ERC20 from '$lib/abis/ERC20.json';
import ERC721 from '$lib/abis/ERC721.json';
import { ConnectWallet } from '../../modals/ConnectWallet';
import { VerifyWalletModal } from './VerifyWalletModal';
import { useMutation } from '$lib/graphql/request';
import { userAtom } from '$lib/jotai';

interface TokenGateEligibilityModalProps {
  tokenGate: EventTokenGate;
  onConfirm: () => void;
}

export function TokenGateEligibilityModal({
  tokenGate,
  onConfirm
}: TokenGateEligibilityModalProps) {
  const { address } = useAppKitAccount();
  const { open } = useAppKit();
  const [me, setMe] = useAtom(userAtom);
  const chainsMap = useAtomValue(chainsMapAtom);
  const chain = chainsMap[tokenGate.network];
  const [setUserWallet] = useMutation(SetUserWalletDocument);
  const setBuyerWallet = useSetAtom(buyerWalletAtom);
  const setEthereumWalletInput = useSetAtom(ethereumWalletInputAtom);

  const userWallets = [...me?.wallets_new?.ethereum || [], me?.wallet_custodial, me?.kratos_wallet_address, me?.kratos_unicorn_wallet_address].filter(Boolean);

  const [showInsufficient, setShowInsufficient] = useState(false);
  const [showConnectWallet, setShowConnectWallet] = useState(false);

  const handleEligibleWallet = async (walletAddress: string) => {
    if (!userWallets.some(x => x === walletAddress)) {
      registrationModal.close();

      setTimeout(() => {
        registrationModal.open(VerifyWalletModal, {
          props: {
            onSuccess: async (signature: string, token: string) => {
              if (me) {
                setUserWallet({
                  variables: {
                    signature,
                    token
                  }
                });

                setMe({
                  ...me,
                  wallets_new: {
                    ...me.wallets_new,
                    ethereum: [...(me.wallets_new?.ethereum ?? []), walletAddress]
                  }
                });
              } else {
                setBuyerWallet(walletAddress);
                setEthereumWalletInput({
                  signature,
                  token,
                  platform: BlockchainPlatform.Ethereum,
                });
              }

              registrationModal.close();
              onConfirm();
            },
          },
        });
      });
      return;
    }

    registrationModal.close();
    onConfirm();
  };

  const checkEligibility = async (wallet: string): Promise<boolean> => {
    if (!chain?.rpc_url) return false;

    try {
      const provider = new ethers.JsonRpcProvider(chain.rpc_url);

      if (tokenGate.is_nft) {
        const erc721Contract = new ethers.Contract(tokenGate.token_address, ERC721, provider);
        const balance = await erc721Contract.balanceOf(wallet);

        return balance > BigInt(0);
      }

      const erc20Contract = new ethers.Contract(tokenGate.token_address, ERC20, provider);
      const balance = await erc20Contract.balanceOf(wallet);

      if (tokenGate.min_value) return balance >= BigInt(tokenGate.min_value);

      return balance > BigInt(0);
    } catch (error) {
      toast.error(formatError(error));
      return false;
    }
  }

  const handleConnectWallet = async () => {
    setShowConnectWallet(false);

    const connectedAddress = appKit.getAddress();

    if (!connectedAddress) return;

    const eligible = await checkEligibility(connectedAddress);

    if (!eligible) {
      setShowInsufficient(true);
      return;
    }

    await handleEligibleWallet(connectedAddress);
  }

  useEffect(() => {
    const checkWallets = async () => {
      if (userWallets.length) {
        for (const wallet of userWallets) {
          const eligible = await checkEligibility(wallet);

          if (eligible) {
            registrationModal.close();
            onConfirm();
            return;
          }
        }
      }

      if (address) {
        const eligible = await checkEligibility(address);

        if (!eligible) {
          setShowInsufficient(true);
          return;
        }

        await handleEligibleWallet(address);
        return;
      }

      setShowConnectWallet(true);
    };

    checkWallets();
  }, [userWallets, address]);

  if (showInsufficient) return (
    <ModalContent
      icon={
        <div className="size-[56px] flex justify-center items-center rounded-full bg-danger-500/16" data-icon>
          <i aria-hidden="true" className="icon-info text-danger-500 size-8" />
        </div>
      }
      onClose={() => registrationModal.close()}
      className="**:data-icon:rounded-md"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-lg">Token Requirements Not Met</p>
          <p className="text-sm text-secondary">
            You do not have enough {tokenGate.name} tokens to access this exclusive ticket.
            Please ensure you have the required tokens in your wallet or try a different wallet.
          </p>
        </div>

        <Card.Root className="border-none bg-none">
          <Card.Content className="justify-between flex items-center py-2 px-3">
            <div className="flex gap-3 items-center">
              <i aria-hidden="true" className="icon-wallet size-5 aspect-square text-tertiary" />
              {address ? <p>{formatWallet(address)}</p> : <p>No wallet connected</p>}
            </div>
            <i
              className="icon-edit-sharp size-5 aspect-square text-quaternary hover:text-primary"
              onClick={() => open()}
            />
          </Card.Content>
        </Card.Root>
      </div>
    </ModalContent>
  );

  if (showConnectWallet) return (
    <ConnectWallet
      onConnect={handleConnectWallet}
      onClose={() => registrationModal.close()}
    />
  );

  return (
    <ModalContent
      onClose={() => registrationModal.close()}
      icon={
        <div className="size-[56px] flex justify-center items-center rounded-full bg-background/64 border border-primary/8">
          <i aria-hidden="true" className="icon-loader animate-spin" />
        </div>
      }
    >
      <div className="space-y-2">
        <p className="text-lg">Checking Token Eligibility</p>
        <p className="text-sm text-secondary">
          We&apos;re verifying your wallets meet the token requirements for this exclusive ticket.
        </p>
      </div>
    </ModalContent>
  );
}
