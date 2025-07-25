'use client';
import { useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { Eip1193Provider, ethers } from 'ethers';
import { useAppKitAccount, useAppKitNetwork, useAppKitProvider } from '@reown/appkit/react';
import { useAtomValue } from 'jotai';
import React from 'react';
import Link from 'next/link';

import { Button, Checkbox, modal, ModalContent, toast } from '$lib/components/core';
import { trpc } from '$lib/trpc/client';
import { useAccount } from '$lib/hooks/useLens';
import { chainsMapAtom } from '$lib/jotai';
import { formatError, LemonheadNFTContract, writeContract } from '$lib/utils/crypto';
import { useQuery } from '$lib/graphql/request';
import LemonheadNFT from '$lib/abis/LemonheadNFT.json';
import { SEPOLIA_ETHERSCAN } from '$lib/utils/constants';
import {
  CanMintLemonheadDocument,
  GetListLemonheadSponsorsDocument,
  LemonheadSponsor,
} from '$lib/graphql/generated/backend/graphql';
import { TraitExtends } from '$lib/trpc/lemonheads/types';

import { ConnectWallet } from '../modals/ConnectWallet';

import { LemonHeadActionKind, LemonHeadStep, useLemonHeadContext } from './provider';
import { LEMONHEAD_CHAIN_ID } from './utils';
import { LemonHeadPreview } from './preview';

export function LemonHeadFooter() {
  const router = useRouter();
  const [state, dispatch] = useLemonHeadContext();

  const currentStep = state.steps[state.currentStep];
  const disabled = state.currentStep === LemonHeadStep.claim && !state.mint.minted;

  const { account: myAccount } = useAccount();
  const chainsMap = useAtomValue(chainsMapAtom);
  const { isConnected } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();

  const validateNft = trpc.validateNft.useMutation();
  const chain = chainsMap[LEMONHEAD_CHAIN_ID];
  const contractAddress = chain?.lemonhead_contract_address;

  const { address } = useAppKitAccount();
  const { data } = useQuery(GetListLemonheadSponsorsDocument, {
    variables: { wallet: address! },
    skip: !address,
    fetchPolicy: 'network-only',
  });

  const { data: dataCanMint } = useQuery(CanMintLemonheadDocument, {
    variables: { wallet: address! },
    skip: !address,
    fetchPolicy: 'network-only',
  });
  const canMint = dataCanMint?.canMintLemonhead;

  // NOTE: only pick one can get free
  const sponsor = data?.listLemonheadSponsors.sponsors.find(
    (s) => s.remaining && s.remaining > 0 && s.remaining <= s.limit,
  )?.sponsor;

  const checkMinted = async () => {
    let isValid = true;

    if (!canMint) {
      toast.error('Not able to mint!');
      return false;
    }

    try {
      if (!state.traits.length || !contractAddress) return;

      const { lookHash } = await validateNft.mutateAsync({ traits: state.traits.filter(Boolean) });

      const provider = new ethers.JsonRpcProvider(chain.rpc_url);
      const contract = LemonheadNFTContract.attach(contractAddress).connect(provider);

      const owner = await contract.getFunction('uniqueLooks')(lookHash);

      if (owner && owner !== ethers.ZeroAddress) {
        toast.error('This LemonHead look has already been minted');
        isValid = false;
      }
    } catch (error: any) {
      toast.error(formatError(error));
      isValid = false;
    }

    return isValid;
  };

  const handlePrev = () => {
    if (state.currentStep === LemonHeadStep.getstarted) router.back();
    else dispatch({ type: LemonHeadActionKind.prev_step });
  };

  const handleNext = async () => {
    if (state.currentStep === LemonHeadStep.create) {
      const valid = await checkMinted();
      if (!valid) return;

      if (!isConnected || chainId?.toString() !== chainsMap[LEMONHEAD_CHAIN_ID].chain_id) {
        modal.open(ConnectWallet, {
          props: {
            onConnect: () => {
              modal.close();

              setTimeout(() => {
                if (!myAccount) {
                  modal.open(BeforeMintModal, {
                    props: {
                      onContinue: () =>
                        modal.open(MintModal, {
                          props: {
                            traits: state.traits,
                            sponsor,
                            onComplete: (payload) => {
                              dispatch({ type: LemonHeadActionKind.set_mint, payload });
                              dispatch({ type: LemonHeadActionKind.next_step });
                            },
                          },
                          dismissible: false,
                        }),
                    },
                  });
                  return;
                }
              });
            },
            chain: chainsMap[LEMONHEAD_CHAIN_ID],
          },
          dismissible: false,
        });

        return;
      } else {
        if (!state.mint.minted) {
          modal.open(MintModal, {
            props: {
              traits: state.traits,
              sponsor,
              onComplete: (payload) => {
                dispatch({ type: LemonHeadActionKind.set_mint, payload });
                dispatch({ type: LemonHeadActionKind.next_step });
              },
            },
            dismissible: false,
          });
        }

        return;
      }
    }

    if (state.currentStep === LemonHeadStep.claim && state.mint.minted) {
      dispatch({ type: LemonHeadActionKind.reset });
      router.push('/');
      return;
    }

    dispatch({ type: LemonHeadActionKind.next_step });
  };

  return (
    <>
      <div className="md:hidden flex items-center gap-2 min-h-[64px] px-4 z-10">
        <Button icon="icon-logout" onClick={handlePrev} variant="tertiary" />
        <Button variant="secondary" className="w-full" onClick={handleNext} disabled={disabled}>
          {currentStep?.btnText}
        </Button>
      </div>

      <div className="hidden md:flex justify-between items-center min-h-[64px] px-4 bg-background/80 backdrop-blur-md">
        <div className="flex-1">
          <Button variant="tertiary" size="sm" onClick={handlePrev}>
            {state.currentStep === LemonHeadStep.getstarted ? 'Exit' : 'Back'}
          </Button>
        </div>

        {LemonHeadStep.getstarted !== state.currentStep && (
          <ul className="flex items-center justify-center flex-2 gap-1.5">
            {Object.entries(state.steps).map(([key, item]) => {
              return (
                <li key={key} className="flex items-center gap-1.5">
                  {item.label && (
                    <p className={twMerge('text-quaternary', item.mounted && 'text-primary')}>{item.label}</p>
                  )}
                  {item.label && (
                    <i
                      className={twMerge('icon-chevron-right size-5 text-quaternary', item.mounted && 'text-primary')}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        )}

        <div className="flex flex-1 justify-end">
          <Button iconRight="icon-chevron-right" variant="secondary" size="sm" onClick={handleNext}>
            {currentStep?.btnText}
          </Button>
        </div>
      </div>
    </>
  );
}

function BeforeMintModal({ onContinue }: { onContinue: () => void }) {
  const [agree, setAgree] = React.useState(false);

  return (
    <ModalContent icon="icon-signature" onClose={() => modal.close()}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-lg">Before You Mint</p>
          <p className="text-sm">Please review and agree to the terms.</p>
          <p className="text-sm">By minting your LemonHead, you agree to our Terms of Use and acknowledge that:</p>
          <ul className="list-disc pl-5.5 text-sm">
            <li>Your avatar will be permanently recorded on-chain.</li>
            <li>It will be publicly visible and tied to your wallet address.</li>
            <li>You won’t be able to edit the name or artwork after minting. All sales are final.</li>
          </ul>

          <div className="flex gap-1 items-center">
            <Link href="" target="_blank" className="text-accent-400 text-sm">
              View Full Terms of Use
            </Link>
            <i className="icon-arrow-outward size-[18px] text-quaternary" />
          </div>
        </div>

        <Checkbox
          containerClass="text-sm items-center [&_i]:size-5"
          id="term"
          value={agree}
          onChange={() => setAgree(!agree)}
        >
          I’ve read and agree to the Terms of Use.
        </Checkbox>

        <Button
          variant="secondary"
          disabled={!agree}
          onClick={() => {
            modal.close();
            onContinue();
          }}
        >
          Continue
        </Button>
      </div>
    </ModalContent>
  );
}

function MintModal({
  traits,
  onComplete,
  sponsor,
}: {
  traits: TraitExtends[];
  onComplete: (mintState: any) => void;
  sponsor?: LemonheadSponsor;
}) {
  const { address } = useAppKitAccount();

  const [isMinting, setIsMinting] = React.useState(false);
  const [mintPrice, setMintPrice] = React.useState<bigint | null>(null);
  const [mintState, setMintState] = React.useState({
    minted: false,
    video: false,
    mute: true,
    txHash: '',
    tokenId: '',
    contract: '',
  });

  const mutation = trpc.mintNft.useMutation();

  const { chainId } = useAppKitNetwork();

  const chainsMap = useAtomValue(chainsMapAtom);
  const chain = chainsMap[LEMONHEAD_CHAIN_ID];
  const contractAddress = chain?.lemonhead_contract_address;
  const { walletProvider } = useAppKitProvider('eip155');
  const [done, setDone] = React.useState(false);
  const [count, setCount] = React.useState(10);

  React.useEffect(() => {
    const fetchMintPrice = async () => {
      if (!contractAddress) return;

      const provider = new ethers.JsonRpcProvider(chain.rpc_url);
      const contract = LemonheadNFTContract.attach(contractAddress).connect(provider);

      try {
        const price = await contract.getFunction('mintPrice')();
        setMintPrice(price);
      } catch (error) {
        console.error('Error fetching mint price:', error);
      }
    };

    if (!sponsor) fetchMintPrice();
  }, [contractAddress, chain.rpc_url, sponsor]);

  React.useEffect(() => {
    if (count === 0) {
      modal.close();
      onComplete({ ...mintState, minted: true, video: true });
    }
  }, [count, mintState]);

  const handleMint = async () => {
    try {
      if (chainId?.toString() !== chainsMap[LEMONHEAD_CHAIN_ID].chain_id) {
        modal.open(ConnectWallet, {
          props: {
            onConnect: () => modal.close(),
            chain: chainsMap[LEMONHEAD_CHAIN_ID],
          },
          dismissible: false,
        });

        return;
      }

      setIsMinting(true);

      if (!address) throw new Error('No wallet address found');

      const mintData = await mutation.mutateAsync({
        wallet: address,
        traits: traits.map(({ _id, image, ...rest }) => rest),
        sponsor: sponsor?._id,
      });
      console.log('Mint data:', mintData);

      if (!contractAddress) throw new Error('LemonheadNFT contract address not set');
      if (!walletProvider) throw new Error('No wallet provider found');
      if (!sponsor && !mintPrice) throw new Error('Mint price not set');

      const tx = await writeContract(
        LemonheadNFTContract,
        contractAddress,
        walletProvider as Eip1193Provider,
        sponsor ? 'mintFree' : 'mint',
        [mintData.look, mintData.metadata, mintData.signature],
        { value: sponsor ? 0 : mintPrice },
      );
      setMintState((prev) => ({ ...prev, txHash: tx?.hash }));

      const receipt = await tx.wait();
      const iface = new ethers.Interface(LemonheadNFT.abi);

      let parsedTransferLog: any = null;

      receipt.logs.some((log: any) => {
        try {
          const parsedLog = iface.parseLog(log);
          if (parsedLog?.name === 'Transfer') {
            parsedTransferLog = parsedLog;
            return true;
          }

          return false;
        } catch (error) {
          console.error('Error parsing log:', error);
          return false;
        }
      });

      if (parsedTransferLog) {
        const tokenId = parsedTransferLog.args?.tokenId?.toString();
        setMintState((prev) => ({ ...prev, tokenId }));
        setDone(true);

        setInterval(() => {
          setCount((prev) => prev - 1);
        }, 1000);
        console.log('Token ID:', tokenId);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(formatError(error));
    } finally {
      setIsMinting(false);
    }
  };

  if (mintState.txHash) {
    return (
      <ModalContent
        icon={
          <div className="size-[56px] flex justify-center items-center rounded-full bg-background/64 border border-primary/8">
            {done ? <p>{count}</p> : <i className="icon-loader animate-spin" />}
          </div>
        }
        title={
          <Button
            size="sm"
            iconRight="icon-arrow-outward"
            className="rounded-full"
            variant="tertiary-alt"
            onClick={() => window.open(`${SEPOLIA_ETHERSCAN}/tx/${mintState.txHash}`)}
          >
            View txn.
          </Button>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-lg">{done ? 'Verifying Transaction' : 'Processing Payment'}</p>
            <p className="text-sm">
              {done
                ? 'Almost there! We’re confirming your transaction and preparing your custom LemonHead. Thanks for your patience!'
                : `We’re securing your payment and locking in your LemonHead. This won’t take long — hang tight while we get things ready.`}
            </p>
          </div>
        </div>
      </ModalContent>
    );
  }

  return (
    <ModalContent
      icon={<LemonHeadPreview className="size-[56px]" traits={traits} />}
      onClose={() => modal.close()}
      className="**:data-icon:rounded-md"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-lg">Claim Your LemonHead</p>
          <p className="text-sm">
            You’re just one step away from owning your unique & personalized LemonHead. Mint & claim your on-chain
            identity.
          </p>
        </div>

        {sponsor && (
          <div className="border-t">
            <div key={sponsor._id} className="flex flex-col gap-3 py-3.5">
              <div className="flex gap-2.5">
                <img src={sponsor.image_url} className="rounded-sm w-[34px] aspect-square" />
                <div>
                  <p>You’ve unlocked a free mint!</p>
                  <p className="text-tertiary text-xs">Supported by {sponsor.name}</p>
                </div>
              </div>

              <div className="relative">
                <div className="w-0 h-0 border-solid border-t-0 border-l-[6px] border-r-[6px] border-b-[6px] border-t-transparent border-r-transparent border-l-transparent border-b-(--btn-tertiary) absolute left-[10px] -top-[6px]" />
                <div className="px-3 py-2 text-sm bg-(--btn-tertiary) rounded-sm">{sponsor.message}</div>
              </div>
            </div>
          </div>
        )}

        <Button variant="secondary" onClick={handleMint} loading={isMinting}>
          Mint {mintPrice && `‣ ${ethers.formatEther(mintPrice)} ETH`}
        </Button>
      </div>
    </ModalContent>
  );
}
