import * as ethers from 'ethers';

import ZapContractABI from '../../abis/token-launch-pad/FlaunchZap.json';
import TreasuryManagerFactoryABI from '../../abis/token-launch-pad/TreasuryManagerFactory.json';
import PositionManagerABI from '../../abis/token-launch-pad/PositionManager.json';
import IERC721ABI from '../../abis/token-launch-pad/IERC721.json';
import FlaunchABI from '../../abis/token-launch-pad/Flaunch.json';

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
  provider: ethers.Provider, //-- create provider from chain rpc url
  params: CreateGroupParams,
) => {
  const permissionsContractAddress = params.isOpen ? ethers.ZeroAddress : params.isClosed ? closedPermissionsContractAddress : '';

  if (!permissionsContractAddress) {
    throw new Error('Permissions contract address is required');
  }

  const contract = new ethers.Contract(zapContractAddress, ZapContractABI.abi, provider);

  const data = ethers.AbiCoder.defaultAbiCoder().encode(['address', 'uint256', 'uint256', 'uint256', 'uint256'], [
    params.groupERC20Token,
    params.minEscrowDuration,
    params.minStakeDuration,
    params.creatorSharePercentage * 100000,
    params.ownerSharePercentage * 100000,
  ]);

  const tx: ethers.TransactionResponse = await contract.deployAndInitializeManager(
    stakingManagerImplementationContractAddress, params.groupOwner, data, permissionsContractAddress
  );

  const receipt = await tx.wait();

  const contractInterface = new ethers.Interface(TreasuryManagerFactoryABI.abi);

  const event = parseLogs(receipt, contractInterface).find((log) => log.parsedLog.name === 'ManagerDeployed');

  const managerAddress = event?.parsedLog.args._manager as string;

  return {
    managerAddress,
  };
}

interface LaunchTokenParams {
  name: string;
  symbol: string;
  tokenUri: string;
  initialTokenFairLaunch: bigint;
  fairLaunchDuration: number;
  premineAmount: bigint;
  creator: string;
  creatorFeeAllocation: number;
  flaunchAt: number;
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

export const launchToken = async (
  zapContractAddress: string, //-- get from chain
  addressFeeSplitManagerImplementationContract: string, //-- get from chain
  provider: ethers.Provider, //-- create provider from chain rpc url
  params: LaunchTokenParams,
) => {
  const contract = new ethers.Contract(zapContractAddress, ZapContractABI.abi, provider);

  const initialPriceParams = ethers.AbiCoder.defaultAbiCoder().encode(['tuple(uint256)'], [[params.usdcMarketCap]]);

  //-- call to get the fee
  const fee = await contract.calculateFee(
    params.premineAmount,
    0, //--assume no slippage
    initialPriceParams,
  );

  const feeCalculatorParams = ''; //-- we use static fee calculator

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

  const coinData = [
    params.name,
    params.symbol,
    params.tokenUri,
    params.initialTokenFairLaunch,
    params.fairLaunchDuration,
    params.premineAmount,
    params.creator,
    params.creatorFeeAllocation,
    params.flaunchAt,
    initialPriceParams,
    feeCalculatorParams,
    creatorVestingParams,
  ];

  let tx: ethers.TransactionResponse;

  if (!params.feeSplit) {
    //-- no fee split, call the simple function
    const flaunchParams = [
      coinData,
      ethers.ZeroAddress, //-- trusted fee signer
      '', //-- premine swap hook data
    ];

    tx = await contract.flaunch(...flaunchParams, { value: fee });
  }
  else {
    //-- with fee split, call the function with the fee split
    const flaunchParams = [
      coinData,
      ethers.ZeroAddress, //-- trusted fee signer
      '', //-- premine swap hook data
      ['', '', 0], //-- whitelist params
      [0, 0, 0, '', ''], //-- airdrop params
      [
        addressFeeSplitManagerImplementationContract,
        ethers.ZeroAddress, //-- open permission
        ethers.AbiCoder.defaultAbiCoder().encode(
          ['uint256', 'uint256', 'tuple(address,uint256)[]'],
          [0, 0, params.feeSplit.map(fee => [fee.recipient, fee.percentage * 100000])], //-- 1% = 1_00000
        ),
        '', //-- no deposit data
      ]
    ];

    tx = await contract.flaunch(...flaunchParams, { value: fee });
  }

  const receipt = await tx.wait();

  //-- read flaunch from the zap
  const flaunch = await contract.flaunchContract() as string;

  //-- read token id from Transfer event in the flaunch contract
  const flaunchInterface = new ethers.Interface(FlaunchABI.abi);
  const event = parseLogs(receipt, flaunchInterface).find(
    (log) => log.address == flaunch.toLowerCase() && log.parsedLog.name === 'Transfer'
  );

  const tokenId = event?.parsedLog.args.tokenId as bigint;

  //-- get the memecoin from the flaunch contract
  const flaunchContract = new ethers.Contract(flaunch, FlaunchABI.abi, provider);

  const memecoin = await flaunchContract.memecoin(tokenId) as string;

  return {
    memecoin,
    flaunch,
    tokenId,
  };
}

export const launchTokenToGroup = async (
  zapContractAddress: string, //-- get from chain
  addressFeeSplitManagerImplementationContract: string, //-- get from chain
  provider: ethers.Provider, //-- create provider from chain rpc url
  params: LaunchTokenParams,
  groupAddress: string, //-- the treasury manager address returned from the createGroup function
) => {
  //-- first launch the token as normal
  const { memecoin, flaunch, tokenId } = await launchToken(
    zapContractAddress,
    addressFeeSplitManagerImplementationContract,
    provider,
    { ...params, feeSplit: undefined },//-- no fee split when launching the token to a group
  );
  const flaunchContract = new ethers.Contract(flaunch, FlaunchABI.abi, provider);

  const creator = await flaunchContract.ownerOf(tokenId) as string;

  //-- then approve the transfer of NFT to the group
  const contract = new ethers.Contract(memecoin, IERC721ABI.abi, provider);

  const approveTx = await contract.approve(groupAddress, 1);

  await approveTx.wait();

  //-- call the group to deposit the NFT
  const groupContract = new ethers.Contract(groupAddress, PositionManagerABI.abi, provider);

  const depositTx = await groupContract.deposit([flaunch, tokenId], creator, '');

  await depositTx.wait();

  return {
    memecoin,
  };
}
