export const FairLaunch = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_poolManager",
        "type": "address",
        "internalType": "contract IPoolManager"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "DEFAULT_ADMIN_ROLE",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "closePosition",
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
      },
      {
        "name": "_tokenFees",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_nativeIsZero",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct FairLaunch.FairLaunchInfo",
        "components": [
          {
            "name": "startsAt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "endsAt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "initialTick",
            "type": "int24",
            "internalType": "int24"
          },
          {
            "name": "revenue",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "supply",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "closed",
            "type": "bool",
            "internalType": "bool"
          }
        ]
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "createPosition",
    "inputs": [
      {
        "name": "_poolId",
        "type": "bytes32",
        "internalType": "PoolId"
      },
      {
        "name": "_initialTick",
        "type": "int24",
        "internalType": "int24"
      },
      {
        "name": "_flaunchesAt",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_initialTokenFairLaunch",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_fairLaunchDuration",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct FairLaunch.FairLaunchInfo",
        "components": [
          {
            "name": "startsAt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "endsAt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "initialTick",
            "type": "int24",
            "internalType": "int24"
          },
          {
            "name": "revenue",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "supply",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "closed",
            "type": "bool",
            "internalType": "bool"
          }
        ]
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "fairLaunchInfo",
    "inputs": [
      {
        "name": "_poolId",
        "type": "bytes32",
        "internalType": "PoolId"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct FairLaunch.FairLaunchInfo",
        "components": [
          {
            "name": "startsAt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "endsAt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "initialTick",
            "type": "int24",
            "internalType": "int24"
          },
          {
            "name": "revenue",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "supply",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "closed",
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
    "name": "fillFromPosition",
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
      },
      {
        "name": "_amountSpecified",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "_nativeIsZero",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [
      {
        "name": "beforeSwapDelta_",
        "type": "int256",
        "internalType": "BeforeSwapDelta"
      },
      {
        "name": "balanceDelta_",
        "type": "int256",
        "internalType": "BalanceDelta"
      },
      {
        "name": "fairLaunchInfo_",
        "type": "tuple",
        "internalType": "struct FairLaunch.FairLaunchInfo",
        "components": [
          {
            "name": "startsAt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "endsAt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "initialTick",
            "type": "int24",
            "internalType": "int24"
          },
          {
            "name": "revenue",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "supply",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "closed",
            "type": "bool",
            "internalType": "bool"
          }
        ]
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getRoleAdmin",
    "inputs": [
      {
        "name": "role",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "grantRole",
    "inputs": [
      {
        "name": "role",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "hasRole",
    "inputs": [
      {
        "name": "role",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "inFairLaunchWindow",
    "inputs": [
      {
        "name": "_poolId",
        "type": "bytes32",
        "internalType": "PoolId"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "modifyRevenue",
    "inputs": [
      {
        "name": "_poolId",
        "type": "bytes32",
        "internalType": "PoolId"
      },
      {
        "name": "_revenue",
        "type": "int256",
        "internalType": "int256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
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
    "name": "renounceRole",
    "inputs": [
      {
        "name": "role",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "callerConfirmation",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "revokeRole",
    "inputs": [
      {
        "name": "role",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "supportsInterface",
    "inputs": [
      {
        "name": "interfaceId",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "FairLaunchCreated",
    "inputs": [
      {
        "name": "_poolId",
        "type": "bytes32",
        "indexed": true,
        "internalType": "PoolId"
      },
      {
        "name": "_tokens",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "_startsAt",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "_endsAt",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "FairLaunchEnded",
    "inputs": [
      {
        "name": "_poolId",
        "type": "bytes32",
        "indexed": true,
        "internalType": "PoolId"
      },
      {
        "name": "_revenue",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "_supply",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "_endedAt",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "RoleAdminChanged",
    "inputs": [
      {
        "name": "role",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "previousAdminRole",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "newAdminRole",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "RoleGranted",
    "inputs": [
      {
        "name": "role",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "account",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "RoleRevoked",
    "inputs": [
      {
        "name": "role",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "account",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "AccessControlBadConfirmation",
    "inputs": []
  },
  {
    "type": "error",
    "name": "AccessControlUnauthorizedAccount",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "neededRole",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
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
    "name": "NotPositionManager",
    "inputs": []
  }
] as const;
