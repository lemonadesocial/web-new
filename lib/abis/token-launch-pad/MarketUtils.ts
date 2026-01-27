export const MarketUtils = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_flaunch",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_poolManager",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "currentSqrtPriceX96",
    "inputs": [
      {
        "name": "memecoin",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "slippage",
        "type": "uint16",
        "internalType": "uint16"
      }
    ],
    "outputs": [
      {
        "name": "min",
        "type": "uint160",
        "internalType": "uint160"
      },
      {
        "name": "max",
        "type": "uint160",
        "internalType": "uint160"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "marketCap",
    "inputs": [
      {
        "name": "memecoin",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "tokenAmount",
        "type": "uint256",
        "internalType": "uint256"
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
    "name": "poolLiquidity",
    "inputs": [
      {
        "name": "memecoin",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "_tokenAmount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_ethAmount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  }
] as const;
