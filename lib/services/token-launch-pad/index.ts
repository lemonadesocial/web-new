import * as ethers from 'ethers';

import ZapContractABI from '../../abis/token-launch-pad/FlaunchZap.json';

export const SECONDS_PER_DAY = 86400;
export const DAYS_PER_MONTH = 30;
export const SECONDS_PER_MONTH = SECONDS_PER_DAY * DAYS_PER_MONTH;

export const TOTAL_SUPPLY = BigInt(10) ** BigInt(29);

export const parseLogs = (receipt: ethers.TransactionReceipt | null, contractInterface: ethers.Interface) => {
  if (!receipt) return [];

  return receipt.logs
    .flatMap((log) => {
      try {
        const parsedLog = contractInterface.parseLog(log);
        return parsedLog ? [{ address: log.address.toLowerCase(), parsedLog }] : [];
      } catch (_e) {
        return [];
      }
    })
}

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

export interface LaunchTokenTxParams {
  coinData: any[];
  flaunchParams: any[];
  fee: bigint;
}

export const getLaunchTokenParams = async (
  zapContractAddress: string,
  addressFeeSplitManagerImplementationContract: string,
  rpcProvider: ethers.Provider,
  params: LaunchTokenParams,
): Promise<LaunchTokenTxParams> => {
  const readContract = new ethers.Contract(zapContractAddress, ZapContractABI.abi, rpcProvider);

  const initialPriceParams = ethers.AbiCoder.defaultAbiCoder().encode(['tuple(uint256)'], [[params.usdcMarketCap]]);

  //-- call to get the fee (read operation)
  const fee = await readContract.calculateFee(
    params.premineAmount,
    0, //--assume no slippage
    initialPriceParams,
  );

  const feeCalculatorParams = '0x'; //-- we use static fee calculator

  const creatorVestingParams = ethers.AbiCoder.defaultAbiCoder().encode(
    ['uint256', 'tuple(uint256,uint256,uint256,address,uint256)[]'],
    [params.vesting?.amount || 0, (params.vesting?.recipients || []).map(recipient => [
      recipient.cliff,
      recipient.duration,
      recipient.period,
      recipient.beneficiary,
      recipient.percentage * 100 //-- 1% = 1_00
    ])]
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
    ethers.ZeroAddress, //-- open permission
    ethers.ZeroHash, //-- premine swap hook data (bytes32)
    [ethers.ZeroHash, ethers.ZeroHash, 0], //-- whitelist params (bytes32 for merkleRoot)
    [0, 0, 0, ethers.ZeroHash, ethers.ZeroHash], //-- airdrop params (bytes32 for merkleRoots)
    [
      addressFeeSplitManagerImplementationContract,
      ethers.ZeroAddress, //-- open permission
      ethers.AbiCoder.defaultAbiCoder().encode(
        ['uint256', 'uint256', 'tuple(address,uint256)[]'],
        [0, 0, params.feeSplit.map(fee => [fee.recipient, fee.percentage * 100000])], //-- 1% = 1_00000
      ),
      ethers.ZeroHash, //-- no deposit data (bytes32)
    ]
  ] : [
    coinData,
    ethers.ZeroAddress, //-- open permission
    '0x', //-- premine swap hook data (empty bytes)
  ];

  return {
    coinData,
    flaunchParams,
    fee,
  };
}
