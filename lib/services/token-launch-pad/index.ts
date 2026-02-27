import { createPublicClient, encodeAbiParameters, http, zeroAddress, zeroHash, type Address } from 'viem';

import ZapContractABI from '$lib/abis/token-launch-pad/FlaunchZap.json';
import { getViemChainConfig } from '$lib/utils/crypto';
import type { Chain } from '$lib/graphql/generated/backend/graphql';

export const SECONDS_PER_DAY = 86400;
export const DAYS_PER_MONTH = 30;
export const SECONDS_PER_MONTH = SECONDS_PER_DAY * DAYS_PER_MONTH;

export const TOTAL_SUPPLY = BigInt(10) ** BigInt(29);

export interface CreateGroupParams {
  groupERC20Token: string; //-- contract address of the group ERC20 token
  groupOwner: string; //-- wallet address of the group owner
  minEscrowDuration: number;
  minStakeDuration: number;
  creatorSharePercentage: number;
  ownerSharePercentage: number;
  isOpen?: boolean;
}

export interface LaunchTokenParams {
  name: string;
  symbol: string;
  tokenUri: string;
  initialTokenFairLaunch: bigint;
  fairLaunchDuration: number; //-- duration of fair launch in seconds
  premineAmount: bigint;
  creator: string;
  creatorFeeAllocation: number;
  launchAt?: number; //-- launch at a timestamp in seconds
  usdcMarketCap: bigint; //-- market cap in usdc with 6 zero decimals
  feeSplit?: { recipient: string, percentage: number }[]; // 100_00000 = 100%
  vesting?: {
    amount: bigint;
    recipients: {
      cliff: number; // duration in seconds before vesting starts
      duration: number; // duration in seconds for the vesting
      period: number; // period in seconds for the vesting
      beneficiary: string; // address of the beneficiary
      percentage: number; // percentage of tokens to vest for this beneficiary
    }[];
  };
}

type AbiValue = string | bigint | number | AbiValue[];

export interface LaunchTokenTxParams {
  coinData: AbiValue[];
  flaunchParams: AbiValue[];
  fee: bigint;
}

export const getLaunchTokenParams = async (
  chain: Chain,
  zapContractAddress: string,
  addressFeeSplitManagerImplementationContract: string,
  params: LaunchTokenParams,
): Promise<LaunchTokenTxParams> => {
  const publicClient = createPublicClient({
    chain: getViemChainConfig(chain),
    transport: http(chain.rpc_url),
  });

  const initialPriceParams = encodeAbiParameters(
    [
      {
        name: 'config',
        type: 'tuple',
        components: [{ name: 'usdcMarketCap', type: 'uint256' }],
      },
    ],
    [{ usdcMarketCap: params.usdcMarketCap }],
  );

  //-- call to get the fee (read operation)
  const fee = await publicClient.readContract({
    abi: ZapContractABI.abi,
    address: zapContractAddress as Address,
    functionName: 'calculateFee',
    args: [
      params.premineAmount,
      0n, //--assume no slippage
      initialPriceParams,
    ],
  }) as bigint;

  const feeCalculatorParams = '0x'; //-- we use static fee calculator

  const creatorVestingParams = encodeAbiParameters(
    [
      { name: 'amount', type: 'uint256' },
      {
        name: 'recipients',
        type: 'tuple[]',
        components: [
          { name: 'cliff', type: 'uint256' },
          { name: 'duration', type: 'uint256' },
          { name: 'period', type: 'uint256' },
          { name: 'beneficiary', type: 'address' },
          { name: 'percentage', type: 'uint256' },
        ],
      },
    ],
    [
      params.vesting?.amount ?? 0n,
      (params.vesting?.recipients || []).map((recipient) => ({
        cliff: BigInt(recipient.cliff),
        duration: BigInt(recipient.duration),
        period: BigInt(recipient.period),
        beneficiary: recipient.beneficiary as Address,
        percentage: BigInt(recipient.percentage * 100), //-- 1% = 1_00
      })),
    ],
  );

  //-- assemble coin data for the launch
  const coinData = [
    params.name,
    params.symbol,
    params.tokenUri,
    params.initialTokenFairLaunch,
    params.fairLaunchDuration,
    params.premineAmount,
    params.creator,
    params.creatorFeeAllocation * 100,
    params.launchAt || 0, // Default to 0 if launchAt is undefined
    initialPriceParams,
    feeCalculatorParams,
    creatorVestingParams,
  ];

  const flaunchParams = params.feeSplit?.length ? [
    coinData,
    zeroAddress, //-- open permission
    zeroHash, //-- premine swap hook data (bytes32)
    [zeroHash, zeroHash, 0n], //-- whitelist params (bytes32 for merkleRoot)
    [0n, 0n, 0n, zeroHash, zeroHash], //-- airdrop params (bytes32 for merkleRoots)
    [
      addressFeeSplitManagerImplementationContract,
      zeroAddress, //-- open permission
      encodeAbiParameters(
        [
          { name: 'a', type: 'uint256' },
          { name: 'b', type: 'uint256' },
          {
            name: 'splits',
            type: 'tuple[]',
            components: [
              { name: 'recipient', type: 'address' },
              { name: 'percentage', type: 'uint256' },
            ],
          },
        ],
        [
          0n,
          0n,
          params.feeSplit.map((fee) => ({
            recipient: fee.recipient as Address,
            percentage: BigInt(fee.percentage * 100000),
          })),
        ],
      ),
      zeroHash, //-- no deposit data (bytes32)
    ]
  ] : [
    coinData,
    zeroAddress, //-- open permission
    '0x', //-- premine swap hook data (empty bytes)
  ];

  return {
    coinData,
    flaunchParams,
    fee,
  };
}
