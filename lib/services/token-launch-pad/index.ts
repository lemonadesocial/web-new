import * as ethers from 'ethers';

import ZapContractABI from '../../abis/token-launch-pad/FlaunchZap.json';
import TreasuryManagerFactoryABI from '../../abis/token-launch-pad/TreasuryManagerFactory.json';
import PositionManagerABI from '../../abis/token-launch-pad/PositionManager.json';
import IERC721ABI from '../../abis/token-launch-pad/IERC721.json';
import FlaunchABI from '../../abis/token-launch-pad/Flaunch.json';

export const TOTAL_SUPPLY = BigInt(10) ** BigInt(27);

const parseLogs = (receipt: ethers.TransactionReceipt | null, contractInterface: ethers.Interface) => {
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

interface CreateGroupParams {
  groupERC20Token: string; //-- contract address of the group ERC20 token
  groupOwner: string; //-- wallet address of the group owner
  minEscrowDuration: number;
  minStakeDuration: number;
  creatorSharePercentage: number;
  ownerSharePercentage: number;
  isOpen?: boolean;
  isClosed?: boolean;
}

export const createGroup = async (
  zapContractAddress: string, //-- get from chain
  stakingManagerImplementationContractAddress: string, //-- get from chain
  closedPermissionsContractAddress: string,
  signer: ethers.Signer, //-- signer for write operations
  params: CreateGroupParams,
) => {
  const permissionsContractAddress = params.isOpen ? ethers.ZeroAddress : params.isClosed ? closedPermissionsContractAddress : '';

  if (!permissionsContractAddress) {
    throw new Error('Permissions contract address is required');
  }

  //-- write operation: deploy and initialize manager
  const writeContract = new ethers.Contract(zapContractAddress, ZapContractABI.abi, signer);

  const data = ethers.AbiCoder.defaultAbiCoder().encode(['address', 'uint256', 'uint256', 'uint256', 'uint256'], [
    params.groupERC20Token,
    params.minEscrowDuration,
    params.minStakeDuration,
    params.creatorSharePercentage * 100000,
    params.ownerSharePercentage * 100000,
  ]);

  const tx: ethers.TransactionResponse = await writeContract.deployAndInitializeManager(
    stakingManagerImplementationContractAddress, params.groupOwner, data, permissionsContractAddress
  );

  const receipt = await tx.wait();

  //-- read operation: parse logs to get manager address
  const contractInterface = new ethers.Interface(TreasuryManagerFactoryABI.abi);
  const event = parseLogs(receipt, contractInterface).find((log) => log.parsedLog.name === 'ManagerDeployed');
  const managerAddress = event?.parsedLog.args._manager as string;

  return {
    managerAddress,
  };
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
    params.creator, //-- use creator address from params
    '0x', //-- premine swap hook data (empty bytes)
    ['0x', '0x', 0], //-- whitelist params (empty bytes for strings)
    [0, 0, 0, '0x', '0x'], //-- airdrop params (empty bytes for strings)
    [
      addressFeeSplitManagerImplementationContract,
      ethers.ZeroAddress, //-- open permission
      ethers.AbiCoder.defaultAbiCoder().encode(
        ['uint256', 'uint256', 'tuple(address,uint256)[]'],
        [0, 0, params.feeSplit.map(fee => [fee.recipient, fee.percentage * 100000])], //-- 1% = 1_00000
      ),
      '0x', //-- no deposit data (empty bytes)
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

export const executeLaunchToken = async (
  zapContractAddress: string,
  rpcProvider: ethers.Provider,
  signer: ethers.Signer,
  txParams: LaunchTokenTxParams,
) => {
  const writeContract = new ethers.Contract(zapContractAddress, ZapContractABI.abi, signer);
  const readContract = new ethers.Contract(zapContractAddress, ZapContractABI.abi, rpcProvider);

  //-- estimate gas for the transaction
  const estimatedGas = await writeContract.flaunch.estimateGas(...txParams.flaunchParams, { value: txParams.fee });

  //-- write operation: launch the token
  const tx: ethers.TransactionResponse = await writeContract.flaunch(...txParams.flaunchParams, {
    value: txParams.fee,
    gasLimit: estimatedGas,
  });

  const receipt = await tx.wait();

  //-- read operations: get contract addresses and token info
  const flaunch = await readContract.flaunchContract() as string;

  //-- read token id from Transfer event in the flaunch contract
  const flaunchInterface = new ethers.Interface(FlaunchABI.abi);
  const event = parseLogs(receipt, flaunchInterface).find(
    (log) => log.address == flaunch.toLowerCase() && log.parsedLog.name === 'Transfer'
  );

  const tokenId = event?.parsedLog.args.tokenId as bigint;

  //-- get the memecoin from the flaunch contract (read operation)
  const flaunchContract = new ethers.Contract(flaunch, FlaunchABI.abi, rpcProvider);

  const memecoin = await flaunchContract.memecoin(tokenId) as string;

  return {
    memecoin,
    flaunch,
    tokenId,
  };
}

export const launchToken = async (
  zapContractAddress: string, //-- get from chain
  addressFeeSplitManagerImplementationContract: string, //-- get from chain
  rpcProvider: ethers.Provider, //-- RPC provider for read operations
  signer: ethers.Signer, //-- signer for write operations
  params: LaunchTokenParams,
) => {
  const txParams = await getLaunchTokenParams(
    zapContractAddress,
    addressFeeSplitManagerImplementationContract,
    rpcProvider,
    params,
  );

  return executeLaunchToken(zapContractAddress, rpcProvider, signer, txParams);
}

export const launchTokenToGroup = async (
  zapContractAddress: string, //-- get from chain
  addressFeeSplitManagerImplementationContract: string, //-- get from chain
  rpcProvider: ethers.Provider, //-- RPC provider for read operations
  signer: ethers.Signer, //-- signer for write operations
  params: LaunchTokenParams,
  groupAddress: string, //-- the treasury manager address returned from the createGroup function
) => {
  //-- first launch the token as normal
  const { memecoin, flaunch, tokenId } = await launchToken(
    zapContractAddress,
    addressFeeSplitManagerImplementationContract,
    rpcProvider,
    signer,
    { ...params, feeSplit: undefined },//-- no fee split when launching the token to a group
  );
  
  //-- read operation: get creator from flaunch contract
  const flaunchContract = new ethers.Contract(flaunch, FlaunchABI.abi, rpcProvider);
  const creator = await flaunchContract.ownerOf(tokenId) as string;

  //-- write operation: approve the transfer of NFT to the group
  const erc721Contract = new ethers.Contract(memecoin, IERC721ABI.abi, signer);
  const approveTx = await erc721Contract.approve(groupAddress, 1);
  await approveTx.wait();

  //-- write operation: call the group to deposit the NFT
  const groupContract = new ethers.Contract(groupAddress, PositionManagerABI.abi, signer);
  const depositTx = await groupContract.deposit([flaunch, tokenId], creator, '');
  await depositTx.wait();

  return {
    memecoin,
  };
}
