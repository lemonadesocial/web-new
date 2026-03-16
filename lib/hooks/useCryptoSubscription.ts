'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { type Address, type EIP1193Provider } from 'viem';
import * as Sentry from '@sentry/nextjs';

import { toast } from '$lib/components/core';
import { useMutation } from '$lib/graphql/request';
import { useSubscription } from '$lib/graphql/subscription/useSubscription';
import {
  CreateCryptoSubscriptionDocument,
  CryptoSubscriptionActivatedDocument,
  GetCryptoSubscriptionStatusDocument,
  type Space,
  type SubscriptionItemType,
} from '$lib/graphql/generated/backend/graphql';
import { defaultClient } from '$lib/graphql/request/instances';
import { createViemClients } from '$lib/utils/crypto';
import { formatError } from '$lib/utils/error';
import { appKit } from '$lib/utils/appkit';
import { ERC20 } from '$lib/abis/ERC20';
import { LemonadeForwardPaymentABI } from '$lib/abis/LemonadeForwardPayment';

export type CryptoSubscriptionStatus =
  | 'idle'
  | 'approving'
  | 'paying'
  | 'confirming'
  | 'active'
  | 'error';

interface UseCryptoSubscriptionParams {
  space: Space;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

const POLL_INTERVAL_MS = 5000;

export function useCryptoSubscription({ space, onSuccess, onError }: UseCryptoSubscriptionParams) {
  const [status, setStatus] = useState<CryptoSubscriptionStatus>('idle');
  const [error, setError] = useState<unknown>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;
  const statusRef = useRef(status);
  statusRef.current = status;
  const activatedRef = useRef(false);

  const [createCryptoSub] = useMutation(CreateCryptoSubscriptionDocument);

  const handleActivated = useCallback(() => {
    if (activatedRef.current) return;
    activatedRef.current = true;
    setStatus('active');
    toast.success('Subscription activated successfully!');
    onSuccessRef.current?.();
  }, []);

  // Subscribe to real-time activation events only when we have a subscription ID
  useSubscription(CryptoSubscriptionActivatedDocument, {
    ...(subscriptionId ? { variables: { subscriptionId } } : {}),
    onData: (data) => {
      const activated = data?.cryptoSubscriptionActivated;
      if (activated?.subscription?.status === 'active') {
        handleActivated();
      }
    },
    onError: (err) => {
      // WebSocket error — fall back to polling (handled below)
      console.error('Subscription WS error:', err);
    },
  });

  // Polling fallback: if WebSocket disconnects or misses the event,
  // poll getCryptoSubscriptionStatus every 5s while confirming
  useEffect(() => {
    if (status !== 'confirming' || !subscriptionId) return;

    const interval = setInterval(async () => {
      if (statusRef.current !== 'confirming' || activatedRef.current) {
        clearInterval(interval);
        return;
      }

      try {
        const result = await defaultClient.query({
          query: GetCryptoSubscriptionStatusDocument,
          variables: { subscriptionId },
          fetchPolicy: 'network-only',
        });

        if (result?.data?.getCryptoSubscriptionStatus?.subscription?.status === 'active') {
          handleActivated();
          clearInterval(interval);
        }
      } catch {
        // Ignore polling errors — will retry next interval
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [subscriptionId, status, handleActivated]);

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
    setSubscriptionId(null);
    activatedRef.current = false;
  }, []);

  const createCryptoSubscription = useCallback(
    async (
      chainId: string,
      tokenAddress: string,
      items: SubscriptionItemType[],
      annual?: boolean,
    ) => {
      setStatus('idle');
      setError(null);
      activatedRef.current = false;

      const walletProvider = appKit.getProvider('eip155');
      const userAddress = appKit.getAddress();

      if (!walletProvider || !userAddress) {
        toast.error("Wallet isn't fully connected yet. Please try again in a moment.");
        return;
      }

      try {
        // Step 1: Create the crypto subscription on the backend
        const { data, error: mutationError } = await createCryptoSub({
          variables: {
            input: {
              space: space._id,
              items,
              chain_id: chainId,
              token_address: tokenAddress,
              annual: annual ?? false,
            },
          },
        });

        if (mutationError || !data?.createCryptoSubscription) {
          const errMsg = formatError(mutationError || new Error('Failed to create crypto subscription'));
          setStatus('error');
          setError(mutationError);
          toast.error(errMsg);
          onErrorRef.current?.(mutationError);
          return;
        }

        const paymentInfo = data.createCryptoSubscription;
        setSubscriptionId(paymentInfo.subscription_id);

        // Step 2: Approve ERC20 token for the forwarder contract
        setStatus('approving');

        const { walletClient, publicClient, account } = await createViemClients(
          paymentInfo.chain_id,
          walletProvider as EIP1193Provider,
        );

        const amount = BigInt(paymentInfo.amount);

        const approveHash = await walletClient.writeContract({
          abi: ERC20,
          address: paymentInfo.token_address as Address,
          functionName: 'approve',
          args: [paymentInfo.forwarder_contract as Address, amount],
          account,
          chain: walletClient.chain,
        });

        await publicClient.waitForTransactionReceipt({ hash: approveHash });

        // Step 3: Call the forwarder contract's pay() function
        setStatus('paying');

        const payHash = await walletClient.writeContract({
          abi: LemonadeForwardPaymentABI,
          address: paymentInfo.forwarder_contract as Address,
          functionName: 'pay',
          args: [
            paymentInfo.token_address as Address,
            amount,
            paymentInfo.destination as Address,
            paymentInfo.reference as `0x${string}`,
          ],
          account,
          chain: walletClient.chain,
        });

        await publicClient.waitForTransactionReceipt({ hash: payHash });

        // Step 4: Wait for backend to verify the on-chain payment
        setStatus('confirming');
        // The useSubscription hook + polling fallback will handle activation
      } catch (err) {
        Sentry.captureException(err);
        setStatus('error');
        setError(err);
        toast.error(formatError(err));
        onErrorRef.current?.(err);
      }
    },
    [space._id, createCryptoSub],
  );

  return {
    status,
    error,
    subscriptionId,
    createCryptoSubscription,
    reset,
  };
}
