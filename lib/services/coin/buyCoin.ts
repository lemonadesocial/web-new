// buyCoin.ts
import {
  createDrift,
  Drift,
  ReadWriteAdapter,
  type Address,
} from "@gud/drift";
import {
  zeroAddress,
  Hex,
  encodeAbiParameters,
  maxUint256,
  parseEther,
} from "viem";
import { ReadQuoter } from "./QuoterClient";
import { UniversalRouterAbi } from "./abi/UniversalRouter";
import { PoolWithHookData, PermitSingle } from "./types";
import { LETHAddress, LETHHooksAddress, QuoterAddress, UniversalRouterAddress } from "./addresses";

// Types matching the original SDK
type BuyCoinBase = {
  coinAddress: Address;
  slippagePercent: number;
  referrer?: Address;
  intermediatePoolKey?: PoolWithHookData;
  permitSingle?: PermitSingle;
  signature?: Hex;
  hookData?: Hex;
};

type BuyCoinExactInParams = BuyCoinBase & {
  swapType: "EXACT_IN";
  amountIn: bigint;
  amountOutMin?: bigint;
};

type BuyCoinExactOutParams = BuyCoinBase & {
  swapType: "EXACT_OUT";
  amountOut: bigint;
  amountInMax?: bigint;
};

type BuyCoinParams = BuyCoinExactInParams | BuyCoinExactOutParams;

// Constants from universalRouter.ts
const IV4RouterAbiExactInput = [
  {
    type: "tuple",
    components: [
      { type: "address", name: "currencyIn" },
      {
        type: "tuple[]",
        name: "path",
        components: [
          { type: "address", name: "intermediateCurrency" },
          { type: "uint24", name: "fee" },
          { type: "int24", name: "tickSpacing" },
          { type: "address", name: "hooks" },
          { type: "bytes", name: "hookData" },
        ],
      },
      { type: "uint128", name: "amountIn" },
      { type: "uint128", name: "amountOutMinimum" },
    ],
  },
] as const;

const IV4RouterAbiExactOutput = [
  {
    type: "tuple",
    components: [
      { type: "address", name: "currencyOut" },
      {
        type: "tuple[]",
        name: "path",
        components: [
          { type: "address", name: "intermediateCurrency" },
          { type: "uint24", name: "fee" },
          { type: "int24", name: "tickSpacing" },
          { type: "address", name: "hooks" },
          { type: "bytes", name: "hookData" },
        ],
      },
      { type: "uint128", name: "amountOut" },
      { type: "uint128", name: "amountInMaximum" },
    ],
  },
] as const;

const V4Actions = {
  SWAP_EXACT_IN: "07",
  SWAP_EXACT_OUT: "09",
  SETTLE_ALL: "0c",
  TAKE_ALL: "0f",
};

const URCommands = {
  V4_SWAP: "10",
  SWEEP: "04",
  PERMIT2_PERMIT: "0a",
};

const ETH = zeroAddress;

/**
 * @dev EXACT_OUT adds the slippage, EXACT_IN removes it
 */
const getAmountWithSlippage = ({
  amount,
  slippage,
  swapType,
}: {
  amount: bigint | undefined;
  slippage: string;
  swapType: "EXACT_IN" | "EXACT_OUT";
}) => {
  if (amount == null) {
    return BigInt(0);
  }

  const absAmount = amount < BigInt(0) ? -amount : amount;
  const slippageMultiplier =
    swapType === "EXACT_IN"
      ? BigInt(1e18) - parseEther(slippage)
      : BigInt(1e18) + parseEther(slippage);

  return (absAmount * slippageMultiplier) / BigInt(1e18);
};

/**
 * Version of buyMemecoin that accepts FLETH and FLETHHooks addresses
 */
function buyMemecoin(params: {
  sender: Address;
  memecoin: Address;
  referrer: Address | null;
  chainId: number;
  swapType: "EXACT_IN" | "EXACT_OUT";
  amountIn?: bigint;
  amountOutMin?: bigint;
  amountOut?: bigint;
  amountInMax?: bigint;
  positionManagerAddress: Address;
  intermediatePoolKey?: PoolWithHookData;
  permitSingle?: PermitSingle;
  signature?: Hex;
  hookData?: Hex;
}) {
  const flETH = LETHAddress[params.chainId];
  const flETHHooks = LETHHooksAddress[params.chainId];
  const flaunchHooks = params.positionManagerAddress;

  // Determine actions based on swapType
  const v4Actions = ("0x" +
    (params.swapType === "EXACT_IN"
      ? V4Actions.SWAP_EXACT_IN
      : V4Actions.SWAP_EXACT_OUT) +
    V4Actions.SETTLE_ALL +
    V4Actions.TAKE_ALL) as Hex;

  let v4Params;

  // Verify that ETH exists in the intermediate pool key, if it's provided
  if (
    params.intermediatePoolKey &&
    params.intermediatePoolKey.currency0 !== ETH &&
    params.intermediatePoolKey.currency1 !== ETH
  ) {
    throw new Error(
      "ETH must be one of the currencies in the intermediatePoolKey"
    );
  }

  // If not intermediate pool key, ETH is the input token
  const inputToken = params.intermediatePoolKey
    ? params.intermediatePoolKey.currency0 === ETH
      ? params.intermediatePoolKey.currency1
      : params.intermediatePoolKey.currency0
    : ETH;

  // Configure path and parameters based on swapType
  if (params.swapType === "EXACT_IN") {
    if (params.amountIn == null || params.amountOutMin == null) {
      throw new Error(
        "amountIn and amountOutMin are required for EXACT_IN swap"
      );
    }

    // Base Path for 'EXACT_IN' swap
    const basePath = [
      {
        intermediateCurrency: flETH,
        fee: 0,
        tickSpacing: 60,
        hooks: flETHHooks,
        hookData: "0x" as Hex,
      },
      {
        intermediateCurrency: params.memecoin,
        fee: 0,
        tickSpacing: 60,
        hooks: flaunchHooks,
        hookData:
          params.hookData ??
          encodeAbiParameters(
            [{ type: "address", name: "referrer" }],
            [params.referrer ?? zeroAddress]
          ),
      },
    ];

    console.log('[buyMemecoin] EXACT_IN encodeAbiParameters')

    // Parameters for 'EXACT_IN' swap
    v4Params = encodeAbiParameters(IV4RouterAbiExactInput, [
      {
        currencyIn: inputToken,
        path: params.intermediatePoolKey
          ? [
              {
                intermediateCurrency: ETH,
                fee: params.intermediatePoolKey.fee,
                tickSpacing: params.intermediatePoolKey.tickSpacing,
                hooks: params.intermediatePoolKey.hooks,
                hookData: params.intermediatePoolKey.hookData,
              },
              ...basePath,
            ]
          : basePath,
        amountIn: params.amountIn,
        amountOutMinimum: params.amountOutMin,
      },
    ]);
  } else {
    if (params.amountOut == null || params.amountInMax == null) {
      throw new Error(
        "amountOut and amountInMax are required for EXACT_OUT swap"
      );
    }

    const basePath = [
      {
        fee: 0,
        tickSpacing: 60,
        hookData: "0x" as Hex,
        hooks: flETHHooks,
        intermediateCurrency: ETH,
      },
      {
        fee: 0,
        tickSpacing: 60,
        hooks: flaunchHooks,
        intermediateCurrency: flETH,
        hookData:
          params.hookData ??
          (encodeAbiParameters(
            [{ type: "address", name: "referrer" }],
            [params.referrer ?? zeroAddress]
          ) as Hex),
      },
    ];

    // Parameters for 'EXACT_OUT' swap
    v4Params = encodeAbiParameters(IV4RouterAbiExactOutput, [
      {
        currencyOut: params.memecoin,
        path: params.intermediatePoolKey
          ? [
              {
                fee: params.intermediatePoolKey.fee,
                tickSpacing: params.intermediatePoolKey.tickSpacing,
                hookData: params.intermediatePoolKey.hookData,
                hooks: params.intermediatePoolKey.hooks,
                intermediateCurrency: inputToken,
              },
              ...basePath,
            ]
          : basePath,
        amountOut: params.amountOut,
        amountInMaximum: params.amountInMax,
      },
    ]);
  }

  // Common parameters for both swap types
  const settleParams = encodeAbiParameters(
    [
      {
        type: "address",
        name: "currency",
      },
      {
        type: "uint256",
        name: "maxAmount",
      },
    ],
    [
      inputToken,
      params.swapType === "EXACT_IN"
        ? params.amountIn ?? maxUint256
        : params.amountInMax ?? maxUint256,
    ]
  );

  const takeParams = encodeAbiParameters(
    [
      {
        type: "address",
        name: "currency",
      },
      {
        type: "uint256",
        name: "minAmount",
      },
    ],
    [
      params.memecoin,
      params.swapType === "EXACT_IN"
        ? params.amountOutMin ?? maxUint256
        : params.amountOut ?? maxUint256,
    ]
  );

  // Encode router data
  const v4RouterData = encodeAbiParameters(
    [
      { type: "bytes", name: "actions" },
      { type: "bytes[]", name: "params" },
    ],
    [v4Actions, [v4Params, settleParams, takeParams]]
  );

  if (params.intermediatePoolKey && params.signature && params.permitSingle) {
    // Commands for Universal Router
    const urCommands = ("0x" +
      URCommands.PERMIT2_PERMIT +
      URCommands.V4_SWAP) as Hex;

    const permit2PermitInput = encodeAbiParameters(
      [
        {
          type: "tuple",
          components: [
            {
              type: "tuple",
              components: [
                { type: "address", name: "token" },
                { type: "uint160", name: "amount" },
                { type: "uint48", name: "expiration" },
                { type: "uint48", name: "nonce" },
              ],
              name: "details",
            },
            { type: "address", name: "spender" },
            { type: "uint256", name: "sigDeadline" },
          ],
          name: "PermitSingle",
        },
        { type: "bytes", name: "signature" },
      ],
      [params.permitSingle, params.signature]
    );

    // Encode calldata for Universal Router
    const inputs = [permit2PermitInput, v4RouterData];
    
    return {
      commands: urCommands,
      inputs,
    };
  } else {
    // Commands for Universal Router
    const urCommands = ("0x" + URCommands.V4_SWAP + URCommands.SWEEP) as Hex;
    const sweepInput = encodeAbiParameters(
      [
        { type: "address", name: "token" },
        { type: "address", name: "recipient" },
        { type: "uint160", name: "amountIn" },
      ],
      [ETH, params.sender, BigInt(0)]
    );

    // Encode calldata for Universal Router
    const inputs = [v4RouterData, sweepInput];
    
    return {
      commands: urCommands,
      inputs,
    };
  }
}

/**
 * buyCoin function that accepts configurable addresses
 * Can be used in different projects with different contract addresses
 * 
 * @param params - Parameters for buying the coin
 * @param addresses - Addresses for all required contracts
 * @param chainId - The chain ID
 * @param drift - Drift instance for contract interactions (optional, creates new if not provided)
 * @param publicClient - Optional public client for read operations
 * @returns Transaction response for the buy operation
 */
export async function buyCoin(
  params: BuyCoinParams,
  positionManagerAddress: Address,
  chainId: number,
  drift: Drift<ReadWriteAdapter>,
) {
  const sender = await drift.getSignerAddress();

  let amountIn: bigint | undefined;
  let amountOutMin: bigint | undefined;
  let amountOut: bigint | undefined;
  let amountInMax: bigint | undefined;

  // Initialize Quoter with configured address
  const readQuoter = new ReadQuoter(chainId, QuoterAddress[chainId], drift);
  
  // Clear cache before getting quotes
  await readQuoter.contract.cache.clear();

  if (params.swapType === "EXACT_IN") {
    amountIn = params.amountIn;
    if (params.amountOutMin === undefined) {
      amountOutMin = getAmountWithSlippage({
        amount: await readQuoter.getBuyQuoteExactInput({
          coinAddress: params.coinAddress,
          amountIn,
          positionManagerAddress,
          intermediatePoolKey: params.intermediatePoolKey,
          hookData: params.hookData,
          userWallet: sender,
        }),
        slippage: (params.slippagePercent / 100).toFixed(18).toString(),
        swapType: params.swapType,
      });
    } else {
      amountOutMin = params.amountOutMin;
    }
  } else {
    amountOut = params.amountOut;
    if (params.amountInMax === undefined) {
      amountInMax = getAmountWithSlippage({
        amount: await readQuoter.getBuyQuoteExactOutput({
          coinAddress: params.coinAddress,
          coinOut: amountOut,
          positionManagerAddress: positionManagerAddress,
          intermediatePoolKey: params.intermediatePoolKey,
          hookData: params.hookData,
          userWallet: sender,
        }),
        slippage: (params.slippagePercent / 100).toFixed(18).toString(),
        swapType: params.swapType,
      });
    } else {
      amountInMax = params.amountInMax;
    }
  }

  // Build the transaction using buyMemecoin
  const { commands, inputs } = buyMemecoin({
    sender: sender,
    memecoin: params.coinAddress,
    referrer: params.referrer ?? null,
    swapType: params.swapType,
    amountIn: amountIn,
    amountOutMin: amountOutMin,
    amountOut: amountOut,
    amountInMax: amountInMax,
    positionManagerAddress: positionManagerAddress,
    chainId: chainId,
    intermediatePoolKey: params.intermediatePoolKey,
    permitSingle: params.permitSingle,
    signature: params.signature,
    hookData: params.hookData,
  });

  const executeAbiItem = UniversalRouterAbi.find(
    (item) =>
      item.type === "function" &&
      item.name === "execute" &&
      item.inputs.length === 2
  );

  if (!executeAbiItem) {
    throw new Error("execute function with 2 parameters not found in ABI");
  }

  return drift.adapter.write({
    abi: [executeAbiItem],
    address: UniversalRouterAddress[chainId],
    fn: "execute",
    args: {
      commands,
      inputs,
    },
    value: params.intermediatePoolKey
      ? BigInt(0) // 0 ETH as inputToken is in another currency
      : params.swapType === "EXACT_IN"
      ? amountIn
      : amountInMax,
  });
}
