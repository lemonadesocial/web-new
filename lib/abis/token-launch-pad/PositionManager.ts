export const PositionManager = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "params",
        "type": "tuple",
        "internalType": "struct PositionManager.ConstructorParams",
        "components": [
          {
            "name": "nativeToken",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "poolManager",
            "type": "address",
            "internalType": "contract IPoolManager"
          },
          {
            "name": "feeDistribution",
            "type": "tuple",
            "internalType": "struct FeeDistributor.FeeDistribution",
            "components": [
              {
                "name": "swapFee",
                "type": "uint24",
                "internalType": "uint24"
              },
              {
                "name": "referrer",
                "type": "uint24",
                "internalType": "uint24"
              },
              {
                "name": "protocol",
                "type": "uint24",
                "internalType": "uint24"
              },
              {
                "name": "active",
                "type": "bool",
                "internalType": "bool"
              }
            ]
          },
          {
            "name": "initialPrice",
            "type": "address",
            "internalType": "contract IInitialPrice"
          },
          {
            "name": "protocolOwner",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "protocolFeeRecipient",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "flayGovernance",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "feeEscrow",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "feeExemptions",
            "type": "address",
            "internalType": "contract FeeExemptions"
          },
          {
            "name": "actionManager",
            "type": "address",
            "internalType": "contract TreasuryActionManager"
          },
          {
            "name": "bidWall",
            "type": "address",
            "internalType": "contract BidWall"
          },
          {
            "name": "fairLaunch",
            "type": "address",
            "internalType": "contract FairLaunch"
          }
        ]
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "receive",
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "MAX_PROTOCOL_ALLOCATION",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint24",
        "internalType": "uint24"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "actionManager",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract TreasuryActionManager"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "afterAddLiquidity",
    "inputs": [
      {
        "name": "_sender",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_key",
        "type": "tuple",
        "internalType": "struct PoolKey",
        "components": [
          {
            "name": "currency0",
            "type": "address",
            "internalType": "Currency"
          },
          {
            "name": "currency1",
            "type": "address",
            "internalType": "Currency"
          },
          {
            "name": "fee",
            "type": "uint24",
            "internalType": "uint24"
          },
          {
            "name": "tickSpacing",
            "type": "int24",
            "internalType": "int24"
          },
          {
            "name": "hooks",
            "type": "address",
            "internalType": "contract IHooks"
          }
        ]
      },
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct IPoolManager.ModifyLiquidityParams",
        "components": [
          {
            "name": "tickLower",
            "type": "int24",
            "internalType": "int24"
          },
          {
            "name": "tickUpper",
            "type": "int24",
            "internalType": "int24"
          },
          {
            "name": "liquidityDelta",
            "type": "int256",
            "internalType": "int256"
          },
          {
            "name": "salt",
            "type": "bytes32",
            "internalType": "bytes32"
          }
        ]
      },
      {
        "name": "_delta",
        "type": "int256",
        "internalType": "BalanceDelta"
      },
      {
        "name": "_feesAccrued",
        "type": "int256",
        "internalType": "BalanceDelta"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "selector_",
        "type": "bytes4",
        "internalType": "bytes4"
      },
      {
        "name": "",
        "type": "int256",
        "internalType": "BalanceDelta"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterDonate",
    "inputs": [
      {
        "name": "_sender",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_key",
        "type": "tuple",
        "internalType": "struct PoolKey",
        "components": [
          {
            "name": "currency0",
            "type": "address",
            "internalType": "Currency"
          },
          {
            "name": "currency1",
            "type": "address",
            "internalType": "Currency"
          },
          {
            "name": "fee",
            "type": "uint24",
            "internalType": "uint24"
          },
          {
            "name": "tickSpacing",
            "type": "int24",
            "internalType": "int24"
          },
          {
            "name": "hooks",
            "type": "address",
            "internalType": "contract IHooks"
          }
        ]
      },
      {
        "name": "_amount0",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_amount1",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "selector_",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterInitialize",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct PoolKey",
        "components": [
          {
            "name": "currency0",
            "type": "address",
            "internalType": "Currency"
          },
          {
            "name": "currency1",
            "type": "address",
            "internalType": "Currency"
          },
          {
            "name": "fee",
            "type": "uint24",
            "internalType": "uint24"
          },
          {
            "name": "tickSpacing",
            "type": "int24",
            "internalType": "int24"
          },
          {
            "name": "hooks",
            "type": "address",
            "internalType": "contract IHooks"
          }
        ]
      },
      {
        "name": "",
        "type": "uint160",
        "internalType": "uint160"
      },
      {
        "name": "",
        "type": "int24",
        "internalType": "int24"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterRemoveLiquidity",
    "inputs": [
      {
        "name": "_sender",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_key",
        "type": "tuple",
        "internalType": "struct PoolKey",
        "components": [
          {
            "name": "currency0",
            "type": "address",
            "internalType": "Currency"
          },
          {
            "name": "currency1",
            "type": "address",
            "internalType": "Currency"
          },
          {
            "name": "fee",
            "type": "uint24",
            "internalType": "uint24"
          },
          {
            "name": "tickSpacing",
            "type": "int24",
            "internalType": "int24"
          },
          {
            "name": "hooks",
            "type": "address",
            "internalType": "contract IHooks"
          }
        ]
      },
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct IPoolManager.ModifyLiquidityParams",
        "components": [
          {
            "name": "tickLower",
            "type": "int24",
            "internalType": "int24"
          },
          {
            "name": "tickUpper",
            "type": "int24",
            "internalType": "int24"
          },
          {
            "name": "liquidityDelta",
            "type": "int256",
            "internalType": "int256"
          },
          {
            "name": "salt",
            "type": "bytes32",
            "internalType": "bytes32"
          }
        ]
      },
      {
        "name": "_delta",
        "type": "int256",
        "internalType": "BalanceDelta"
      },
      {
        "name": "_feesAccrued",
        "type": "int256",
        "internalType": "BalanceDelta"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "selector_",
        "type": "bytes4",
        "internalType": "bytes4"
      },
      {
        "name": "",
        "type": "int256",
        "internalType": "BalanceDelta"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterSwap",
    "inputs": [
      {
        "name": "_sender",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_key",
        "type": "tuple",
        "internalType": "struct PoolKey",
        "components": [
          {
            "name": "currency0",
            "type": "address",
            "internalType": "Currency"
          },
          {
            "name": "currency1",
            "type": "address",
            "internalType": "Currency"
          },
          {
            "name": "fee",
            "type": "uint24",
            "internalType": "uint24"
          },
          {
            "name": "tickSpacing",
            "type": "int24",
            "internalType": "int24"
          },
          {
            "name": "hooks",
            "type": "address",
            "internalType": "contract IHooks"
          }
        ]
      },
      {
        "name": "_params",
        "type": "tuple",
        "internalType": "struct IPoolManager.SwapParams",
        "components": [
          {
            "name": "zeroForOne",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "amountSpecified",
            "type": "int256",
            "internalType": "int256"
          },
          {
            "name": "sqrtPriceLimitX96",
            "type": "uint160",
            "internalType": "uint160"
          }
        ]
      },
      {
        "name": "_delta",
        "type": "int256",
        "internalType": "BalanceDelta"
      },
      {
        "name": "_hookData",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "selector_",
        "type": "bytes4",
        "internalType": "bytes4"
      },
      {
        "name": "hookDeltaUnspecified_",
        "type": "int128",
        "internalType": "int128"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeAddLiquidity",
    "inputs": [
      {
        "name": "_sender",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_key",
        "type": "tuple",
        "internalType": "struct PoolKey",
        "components": [
          {
            "name": "currency0",
            "type": "address",
            "internalType": "Currency"
          },
          {
            "name": "currency1",
            "type": "address",
            "internalType": "Currency"
          },
          {
            "name": "fee",
            "type": "uint24",
            "internalType": "uint24"
          },
          {
            "name": "tickSpacing",
            "type": "int24",
            "internalType": "int24"
          },
          {
            "name": "hooks",
            "type": "address",
            "internalType": "contract IHooks"
          }
        ]
      },
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct IPoolManager.ModifyLiquidityParams",
        "components": [
          {
            "name": "tickLower",
            "type": "int24",
            "internalType": "int24"
          },
          {
            "name": "tickUpper",
            "type": "int24",
            "internalType": "int24"
          },
          {
            "name": "liquidityDelta",
            "type": "int256",
            "internalType": "int256"
          },
          {
            "name": "salt",
            "type": "bytes32",
            "internalType": "bytes32"
          }
        ]
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "selector_",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "beforeDonate",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct PoolKey",
        "components": [
          {
            "name": "currency0",
            "type": "address",
            "internalType": "Currency"
          },
          {
            "name": "currency1",
            "type": "address",
            "internalType": "Currency"
          },
          {
            "name": "fee",
            "type": "uint24",
            "internalType": "uint24"
          },
          {
            "name": "tickSpacing",
            "type": "int24",
            "internalType": "int24"
          },
          {
            "name": "hooks",
            "type": "address",
            "internalType": "contract IHooks"
          }
        ]
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeInitialize",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct PoolKey",
        "components": [
          {
            "name": "currency0",
            "type": "address",
            "internalType": "Currency"
          },
          {
            "name": "currency1",
            "type": "address",
            "internalType": "Currency"
          },
          {
            "name": "fee",
            "type": "uint24",
            "internalType": "uint24"
          },
          {
            "name": "tickSpacing",
            "type": "int24",
            "internalType": "int24"
          },
          {
            "name": "hooks",
            "type": "address",
            "internalType": "contract IHooks"
          }
        ]
      },
      {
        "name": "",
        "type": "uint160",
        "internalType": "uint160"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "beforeRemoveLiquidity",
    "inputs": [
      {
        "name": "_sender",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_key",
        "type": "tuple",
        "internalType": "struct PoolKey",
        "components": [
          {
            "name": "currency0",
            "type": "address",
            "internalType": "Currency"
          },
          {
            "name": "currency1",
            "type": "address",
            "internalType": "Currency"
          },
          {
            "name": "fee",
            "type": "uint24",
            "internalType": "uint24"
          },
          {
            "name": "tickSpacing",
            "type": "int24",
            "internalType": "int24"
          },
          {
            "name": "hooks",
            "type": "address",
            "internalType": "contract IHooks"
          }
        ]
      },
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct IPoolManager.ModifyLiquidityParams",
        "components": [
          {
            "name": "tickLower",
            "type": "int24",
            "internalType": "int24"
          },
          {
            "name": "tickUpper",
            "type": "int24",
            "internalType": "int24"
          },
          {
            "name": "liquidityDelta",
            "type": "int256",
            "internalType": "int256"
          },
          {
            "name": "salt",
            "type": "bytes32",
            "internalType": "bytes32"
          }
        ]
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "selector_",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "beforeSwap",
    "inputs": [
      {
        "name": "_sender",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_key",
        "type": "tuple",
        "internalType": "struct PoolKey",
        "components": [
          {
            "name": "currency0",
            "type": "address",
            "internalType": "Currency"
          },
          {
            "name": "currency1",
            "type": "address",
            "internalType": "Currency"
          },
          {
            "name": "fee",
            "type": "uint24",
            "internalType": "uint24"
          },
          {
            "name": "tickSpacing",
            "type": "int24",
            "internalType": "int24"
          },
          {
            "name": "hooks",
            "type": "address",
            "internalType": "contract IHooks"
          }
        ]
      },
      {
        "name": "_params",
        "type": "tuple",
        "internalType": "struct IPoolManager.SwapParams",
        "components": [
          {
            "name": "zeroForOne",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "amountSpecified",
            "type": "int256",
            "internalType": "int256"
          },
          {
            "name": "sqrtPriceLimitX96",
            "type": "uint160",
            "internalType": "uint160"
          }
        ]
      },
      {
        "name": "_hookData",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "selector_",
        "type": "bytes4",
        "internalType": "bytes4"
      },
      {
        "name": "beforeSwapDelta_",
        "type": "int256",
        "internalType": "BeforeSwapDelta"
      },
      {
        "name": "",
        "type": "uint24",
        "internalType": "uint24"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "bidWall",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract BidWall"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "cancelOwnershipHandover",
    "inputs": [],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "closeBidWall",
    "inputs": [
      {
        "name": "_key",
        "type": "tuple",
        "internalType": "struct PoolKey",
        "components": [
          {
            "name": "currency0",
            "type": "address",
            "internalType": "Currency"
          },
          {
            "name": "currency1",
            "type": "address",
            "internalType": "Currency"
          },
          {
            "name": "fee",
            "type": "uint24",
            "internalType": "uint24"
          },
          {
            "name": "tickSpacing",
            "type": "int24",
            "internalType": "int24"
          },
          {
            "name": "hooks",
            "type": "address",
            "internalType": "contract IHooks"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "completeOwnershipHandover",
    "inputs": [
      {
        "name": "pendingOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "fairLaunch",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract FairLaunch"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "fairLaunchFeeCalculator",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IFeeCalculator"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "feeCalculator",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IFeeCalculator"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "feeEscrow",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract FeeEscrow"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "feeExemptions",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract FeeExemptions"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "feeSplit",
    "inputs": [
      {
        "name": "_poolId",
        "type": "bytes32",
        "internalType": "PoolId"
      },
      {
        "name": "_amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "bidWall_",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "creator_",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "protocol_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "flaunch",
    "inputs": [
      {
        "name": "_params",
        "type": "tuple",
        "internalType": "struct PositionManager.FlaunchParams",
        "components": [
          {
            "name": "name",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "symbol",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "tokenUri",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "initialTokenFairLaunch",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "fairLaunchDuration",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "premineAmount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "creator",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "creatorFeeAllocation",
            "type": "uint24",
            "internalType": "uint24"
          },
          {
            "name": "flaunchAt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "initialPriceParams",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "feeCalculatorParams",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "creatorVestingParams",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [
      {
        "name": "memecoin_",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "flaunchContract",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IFlaunch"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "flaunchesAt",
    "inputs": [
      {
        "name": "_poolId",
        "type": "bytes32",
        "internalType": "PoolId"
      }
    ],
    "outputs": [
      {
        "name": "_flaunchTime",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "flayGovernance",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getFeeCalculator",
    "inputs": [
      {
        "name": "_isFairLaunch",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IFeeCalculator"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getFlaunchingFee",
    "inputs": [
      {
        "name": "_initialPriceParams",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getFlaunchingMarketCap",
    "inputs": [
      {
        "name": "_initialPriceParams",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getHookPermissions",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct Hooks.Permissions",
        "components": [
          {
            "name": "beforeInitialize",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "afterInitialize",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "beforeAddLiquidity",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "afterAddLiquidity",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "beforeRemoveLiquidity",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "afterRemoveLiquidity",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "beforeSwap",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "afterSwap",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "beforeDonate",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "afterDonate",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "beforeSwapReturnDelta",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "afterSwapReturnDelta",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "afterAddLiquidityReturnDelta",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "afterRemoveLiquidityReturnDelta",
            "type": "bool",
            "internalType": "bool"
          }
        ]
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "getPoolFeeDistribution",
    "inputs": [
      {
        "name": "_poolId",
        "type": "bytes32",
        "internalType": "PoolId"
      }
    ],
    "outputs": [
      {
        "name": "feeDistribution_",
        "type": "tuple",
        "internalType": "struct FeeDistributor.FeeDistribution",
        "components": [
          {
            "name": "swapFee",
            "type": "uint24",
            "internalType": "uint24"
          },
          {
            "name": "referrer",
            "type": "uint24",
            "internalType": "uint24"
          },
          {
            "name": "protocol",
            "type": "uint24",
            "internalType": "uint24"
          },
          {
            "name": "active",
            "type": "bool",
            "internalType": "bool"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "initialPrice",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IInitialPrice"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "nativeToken",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "notifier",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract Notifier"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [
      {
        "name": "result",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "ownershipHandoverExpiresAt",
    "inputs": [
      {
        "name": "pendingOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "result",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "poolFees",
    "inputs": [
      {
        "name": "_poolKey",
        "type": "tuple",
        "internalType": "struct PoolKey",
        "components": [
          {
            "name": "currency0",
            "type": "address",
            "internalType": "Currency"
          },
          {
            "name": "currency1",
            "type": "address",
            "internalType": "Currency"
          },
          {
            "name": "fee",
            "type": "uint24",
            "internalType": "uint24"
          },
          {
            "name": "tickSpacing",
            "type": "int24",
            "internalType": "int24"
          },
          {
            "name": "hooks",
            "type": "address",
            "internalType": "contract IHooks"
          }
        ]
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct InternalSwapPool.ClaimableFees",
        "components": [
          {
            "name": "amount0",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "amount1",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "poolKey",
    "inputs": [
      {
        "name": "_token",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct PoolKey",
        "components": [
          {
            "name": "currency0",
            "type": "address",
            "internalType": "Currency"
          },
          {
            "name": "currency1",
            "type": "address",
            "internalType": "Currency"
          },
          {
            "name": "fee",
            "type": "uint24",
            "internalType": "uint24"
          },
          {
            "name": "tickSpacing",
            "type": "int24",
            "internalType": "int24"
          },
          {
            "name": "hooks",
            "type": "address",
            "internalType": "contract IHooks"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "poolManager",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IPoolManager"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "referralEscrow",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract ReferralEscrow"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "requestOwnershipHandover",
    "inputs": [],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "setFairLaunchFeeCalculator",
    "inputs": [
      {
        "name": "_feeCalculator",
        "type": "address",
        "internalType": "contract IFeeCalculator"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setFeeCalculator",
    "inputs": [
      {
        "name": "_feeCalculator",
        "type": "address",
        "internalType": "contract IFeeCalculator"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setFeeDistribution",
    "inputs": [
      {
        "name": "_feeDistribution",
        "type": "tuple",
        "internalType": "struct FeeDistributor.FeeDistribution",
        "components": [
          {
            "name": "swapFee",
            "type": "uint24",
            "internalType": "uint24"
          },
          {
            "name": "referrer",
            "type": "uint24",
            "internalType": "uint24"
          },
          {
            "name": "protocol",
            "type": "uint24",
            "internalType": "uint24"
          },
          {
            "name": "active",
            "type": "bool",
            "internalType": "bool"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setFlaunch",
    "inputs": [
      {
        "name": "_flaunchContract",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setInitialPrice",
    "inputs": [
      {
        "name": "_initialPrice",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setPoolFeeDistribution",
    "inputs": [
      {
        "name": "_poolId",
        "type": "bytes32",
        "internalType": "PoolId"
      },
      {
        "name": "_feeDistribution",
        "type": "tuple",
        "internalType": "struct FeeDistributor.FeeDistribution",
        "components": [
          {
            "name": "swapFee",
            "type": "uint24",
            "internalType": "uint24"
          },
          {
            "name": "referrer",
            "type": "uint24",
            "internalType": "uint24"
          },
          {
            "name": "protocol",
            "type": "uint24",
            "internalType": "uint24"
          },
          {
            "name": "active",
            "type": "bool",
            "internalType": "bool"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setProtocolFeeDistribution",
    "inputs": [
      {
        "name": "_protocol",
        "type": "uint24",
        "internalType": "uint24"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setReferralEscrow",
    "inputs": [
      {
        "name": "_referralEscrow",
        "type": "address",
        "internalType": "address payable"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [
      {
        "name": "newOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "unlockCallback",
    "inputs": [
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "CreatorFeeAllocationUpdated",
    "inputs": [
      {
        "name": "_poolId",
        "type": "bytes32",
        "indexed": true,
        "internalType": "PoolId"
      },
      {
        "name": "_allocation",
        "type": "uint24",
        "indexed": false,
        "internalType": "uint24"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "FairLaunchBurn",
    "inputs": [
      {
        "name": "_poolId",
        "type": "bytes32",
        "indexed": true,
        "internalType": "PoolId"
      },
      {
        "name": "_unsoldSupply",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "FairLaunchFeeCalculatorUpdated",
    "inputs": [
      {
        "name": "_feeCalculator",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "FeeCalculatorUpdated",
    "inputs": [
      {
        "name": "_feeCalculator",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "FeeDistributionUpdated",
    "inputs": [
      {
        "name": "_feeDistribution",
        "type": "tuple",
        "indexed": false,
        "internalType": "struct FeeDistributor.FeeDistribution",
        "components": [
          {
            "name": "swapFee",
            "type": "uint24",
            "internalType": "uint24"
          },
          {
            "name": "referrer",
            "type": "uint24",
            "internalType": "uint24"
          },
          {
            "name": "protocol",
            "type": "uint24",
            "internalType": "uint24"
          },
          {
            "name": "active",
            "type": "bool",
            "internalType": "bool"
          }
        ]
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "HookFee",
    "inputs": [
      {
        "name": "id",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "feeAmount0",
        "type": "uint128",
        "indexed": false,
        "internalType": "uint128"
      },
      {
        "name": "feeAmount1",
        "type": "uint128",
        "indexed": false,
        "internalType": "uint128"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "HookSwap",
    "inputs": [
      {
        "name": "id",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "amount0",
        "type": "int128",
        "indexed": false,
        "internalType": "int128"
      },
      {
        "name": "amount1",
        "type": "int128",
        "indexed": false,
        "internalType": "int128"
      },
      {
        "name": "hookLPfeeAmount0",
        "type": "uint128",
        "indexed": false,
        "internalType": "uint128"
      },
      {
        "name": "hookLPfeeAmount1",
        "type": "uint128",
        "indexed": false,
        "internalType": "uint128"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "InitialPriceUpdated",
    "inputs": [
      {
        "name": "_initialPrice",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipHandoverCanceled",
    "inputs": [
      {
        "name": "pendingOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipHandoverRequested",
    "inputs": [
      {
        "name": "pendingOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      {
        "name": "oldOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PoolCreated",
    "inputs": [
      {
        "name": "_poolId",
        "type": "bytes32",
        "indexed": true,
        "internalType": "PoolId"
      },
      {
        "name": "_memecoin",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "_memecoinTreasury",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "_tokenId",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "_currencyFlipped",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      },
      {
        "name": "_flaunchFee",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "_params",
        "type": "tuple",
        "indexed": false,
        "internalType": "struct PositionManager.FlaunchParams",
        "components": [
          {
            "name": "name",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "symbol",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "tokenUri",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "initialTokenFairLaunch",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "fairLaunchDuration",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "premineAmount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "creator",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "creatorFeeAllocation",
            "type": "uint24",
            "internalType": "uint24"
          },
          {
            "name": "flaunchAt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "initialPriceParams",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "feeCalculatorParams",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "creatorVestingParams",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PoolFeeDistributionUpdated",
    "inputs": [
      {
        "name": "_poolId",
        "type": "bytes32",
        "indexed": true,
        "internalType": "PoolId"
      },
      {
        "name": "_feeDistribution",
        "type": "tuple",
        "indexed": false,
        "internalType": "struct FeeDistributor.FeeDistribution",
        "components": [
          {
            "name": "swapFee",
            "type": "uint24",
            "internalType": "uint24"
          },
          {
            "name": "referrer",
            "type": "uint24",
            "internalType": "uint24"
          },
          {
            "name": "protocol",
            "type": "uint24",
            "internalType": "uint24"
          },
          {
            "name": "active",
            "type": "bool",
            "internalType": "bool"
          }
        ]
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PoolFeesDistributed",
    "inputs": [
      {
        "name": "_poolId",
        "type": "bytes32",
        "indexed": true,
        "internalType": "PoolId"
      },
      {
        "name": "_donateAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "_creatorAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "_bidWallAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "_governanceAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "_protocolAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PoolFeesReceived",
    "inputs": [
      {
        "name": "_poolId",
        "type": "bytes32",
        "indexed": true,
        "internalType": "PoolId"
      },
      {
        "name": "_amount0",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "_amount1",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PoolFeesSwapped",
    "inputs": [
      {
        "name": "_poolId",
        "type": "bytes32",
        "indexed": true,
        "internalType": "PoolId"
      },
      {
        "name": "zeroForOne",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      },
      {
        "name": "_amount0",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "_amount1",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PoolPremine",
    "inputs": [
      {
        "name": "_poolId",
        "type": "bytes32",
        "indexed": true,
        "internalType": "PoolId"
      },
      {
        "name": "_premineAmount",
        "type": "int256",
        "indexed": false,
        "internalType": "int256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PoolScheduled",
    "inputs": [
      {
        "name": "_poolId",
        "type": "bytes32",
        "indexed": true,
        "internalType": "PoolId"
      },
      {
        "name": "_flaunchesAt",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PoolStateUpdated",
    "inputs": [
      {
        "name": "_poolId",
        "type": "bytes32",
        "indexed": true,
        "internalType": "PoolId"
      },
      {
        "name": "_sqrtPriceX96",
        "type": "uint160",
        "indexed": false,
        "internalType": "uint160"
      },
      {
        "name": "_tick",
        "type": "int24",
        "indexed": false,
        "internalType": "int24"
      },
      {
        "name": "_protocolFee",
        "type": "uint24",
        "indexed": false,
        "internalType": "uint24"
      },
      {
        "name": "_swapFee",
        "type": "uint24",
        "indexed": false,
        "internalType": "uint24"
      },
      {
        "name": "_liquidity",
        "type": "uint128",
        "indexed": false,
        "internalType": "uint128"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PoolSwap",
    "inputs": [
      {
        "name": "poolId",
        "type": "bytes32",
        "indexed": true,
        "internalType": "PoolId"
      },
      {
        "name": "flAmount0",
        "type": "int256",
        "indexed": false,
        "internalType": "int256"
      },
      {
        "name": "flAmount1",
        "type": "int256",
        "indexed": false,
        "internalType": "int256"
      },
      {
        "name": "flFee0",
        "type": "int256",
        "indexed": false,
        "internalType": "int256"
      },
      {
        "name": "flFee1",
        "type": "int256",
        "indexed": false,
        "internalType": "int256"
      },
      {
        "name": "ispAmount0",
        "type": "int256",
        "indexed": false,
        "internalType": "int256"
      },
      {
        "name": "ispAmount1",
        "type": "int256",
        "indexed": false,
        "internalType": "int256"
      },
      {
        "name": "ispFee0",
        "type": "int256",
        "indexed": false,
        "internalType": "int256"
      },
      {
        "name": "ispFee1",
        "type": "int256",
        "indexed": false,
        "internalType": "int256"
      },
      {
        "name": "uniAmount0",
        "type": "int256",
        "indexed": false,
        "internalType": "int256"
      },
      {
        "name": "uniAmount1",
        "type": "int256",
        "indexed": false,
        "internalType": "int256"
      },
      {
        "name": "uniFee0",
        "type": "int256",
        "indexed": false,
        "internalType": "int256"
      },
      {
        "name": "uniFee1",
        "type": "int256",
        "indexed": false,
        "internalType": "int256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ReferralEscrowUpdated",
    "inputs": [
      {
        "name": "_referralEscrow",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ReferrerFeePaid",
    "inputs": [
      {
        "name": "_poolId",
        "type": "bytes32",
        "indexed": true,
        "internalType": "PoolId"
      },
      {
        "name": "_recipient",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "_token",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "_amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "AlreadyInitialized",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CallerIsNotBidWall",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CallerNotCreator",
    "inputs": [
      {
        "name": "_caller",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "CannotBeInitializedDirectly",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CannotModifyLiquidityDuringFairLaunch",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CannotSellTokenDuringFairLaunch",
    "inputs": []
  },
  {
    "type": "error",
    "name": "HookNotImplemented",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InsufficientFlaunchFee",
    "inputs": [
      {
        "name": "_paid",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_required",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "InvalidPool",
    "inputs": []
  },
  {
    "type": "error",
    "name": "LockFailure",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NewOwnerIsZeroAddress",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NoHandoverRequest",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotPoolManager",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotSelf",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ProtocolFeeInvalid",
    "inputs": []
  },
  {
    "type": "error",
    "name": "RecipientZeroAddress",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ReferrerFeeInvalid",
    "inputs": []
  },
  {
    "type": "error",
    "name": "SwapFeeInvalid",
    "inputs": []
  },
  {
    "type": "error",
    "name": "TokenNotFlaunched",
    "inputs": [
      {
        "name": "_flaunchesAt",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "Unauthorized",
    "inputs": []
  },
  {
    "type": "error",
    "name": "UnknownPool",
    "inputs": [
      {
        "name": "_poolId",
        "type": "bytes32",
        "internalType": "PoolId"
      }
    ]
  }
] as const;
