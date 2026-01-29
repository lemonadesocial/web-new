export const RedEnvelopeAbi = [
  {
    "type": "constructor",
    "inputs": [
      {"name": "_beneficiary", "type": "address", "internalType": "address"},
      {"name": "_currency", "type": "address", "internalType": "address"}
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "approve",
    "inputs": [
      {"name": "to", "type": "address", "internalType": "address"},
      {"name": "tokenId", "type": "uint256", "internalType": "uint256"}
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [
      {"name": "owner", "type": "address", "internalType": "address"}
    ],
    "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "beneficiary",
    "inputs": [],
    "outputs": [{"name": "", "type": "address", "internalType": "address"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "buyEnvelopes",
    "inputs": [
      {"name": "amount", "type": "uint256", "internalType": "uint256"},
      {"name": "receiver", "type": "address", "internalType": "address"}
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "claim",
    "inputs": [
      {"name": "envelope", "type": "uint256", "internalType": "uint256"}
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "claimed",
    "inputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
    "outputs": [{"name": "", "type": "bool", "internalType": "bool"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "currency",
    "inputs": [],
    "outputs": [{"name": "", "type": "address", "internalType": "address"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getAllPricing",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct Pricing[]",
        "components": [
          {"name": "count", "type": "uint256", "internalType": "uint256"},
          {"name": "price", "type": "uint256", "internalType": "uint256"},
          {
            "name": "preDiscountPrice",
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
    "name": "getApproved",
    "inputs": [
      {"name": "tokenId", "type": "uint256", "internalType": "uint256"}
    ],
    "outputs": [{"name": "", "type": "address", "internalType": "address"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isApprovedForAll",
    "inputs": [
      {"name": "owner", "type": "address", "internalType": "address"},
      {"name": "operator", "type": "address", "internalType": "address"}
    ],
    "outputs": [{"name": "", "type": "bool", "internalType": "bool"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "name",
    "inputs": [],
    "outputs": [{"name": "", "type": "string", "internalType": "string"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [{"name": "", "type": "address", "internalType": "address"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "ownerOf",
    "inputs": [
      {"name": "tokenId", "type": "uint256", "internalType": "uint256"}
    ],
    "outputs": [{"name": "", "type": "address", "internalType": "address"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "pricing",
    "inputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
    "outputs": [
      {"name": "count", "type": "uint256", "internalType": "uint256"},
      {"name": "price", "type": "uint256", "internalType": "uint256"},
      {
        "name": "preDiscountPrice",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "recipients",
    "inputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
    "outputs": [
      {"name": "wallet", "type": "address", "internalType": "address"},
      {"name": "amount", "type": "uint256", "internalType": "uint256"}
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "safeTransferFrom",
    "inputs": [
      {"name": "from", "type": "address", "internalType": "address"},
      {"name": "to", "type": "address", "internalType": "address"},
      {"name": "tokenId", "type": "uint256", "internalType": "uint256"}
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "safeTransferFrom",
    "inputs": [
      {"name": "from", "type": "address", "internalType": "address"},
      {"name": "to", "type": "address", "internalType": "address"},
      {"name": "tokenId", "type": "uint256", "internalType": "uint256"},
      {"name": "data", "type": "bytes", "internalType": "bytes"}
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "seal",
    "inputs": [
      {
        "name": "_seals",
        "type": "tuple[]",
        "internalType": "struct Seal[]",
        "components": [
          {
            "name": "recipient",
            "type": "tuple",
            "internalType": "struct Recipient",
            "components": [
              {
                "name": "wallet",
                "type": "address",
                "internalType": "address"
              },
              {"name": "amount", "type": "uint256", "internalType": "uint256"}
            ]
          },
          {"name": "message", "type": "string", "internalType": "string"},
          {"name": "envelope", "type": "uint256", "internalType": "uint256"}
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "setApprovalForAll",
    "inputs": [
      {"name": "operator", "type": "address", "internalType": "address"},
      {"name": "approved", "type": "bool", "internalType": "bool"}
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setPricing",
    "inputs": [
      {
        "name": "_pricing",
        "type": "tuple[]",
        "internalType": "struct Pricing[]",
        "components": [
          {"name": "count", "type": "uint256", "internalType": "uint256"},
          {"name": "price", "type": "uint256", "internalType": "uint256"},
          {
            "name": "preDiscountPrice",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "supportsInterface",
    "inputs": [
      {"name": "interfaceId", "type": "bytes4", "internalType": "bytes4"}
    ],
    "outputs": [{"name": "", "type": "bool", "internalType": "bool"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "symbol",
    "inputs": [],
    "outputs": [{"name": "", "type": "string", "internalType": "string"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "tokenId",
    "inputs": [],
    "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "tokenURI",
    "inputs": [
      {"name": "tokenId", "type": "uint256", "internalType": "uint256"}
    ],
    "outputs": [{"name": "", "type": "string", "internalType": "string"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "transferFrom",
    "inputs": [
      {"name": "from", "type": "address", "internalType": "address"},
      {"name": "to", "type": "address", "internalType": "address"},
      {"name": "tokenId", "type": "uint256", "internalType": "uint256"}
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [
      {"name": "newOwner", "type": "address", "internalType": "address"}
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "Approval",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "approved",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ApprovalForAll",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "operator",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "approved",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "EnvelopeClaimed",
    "inputs": [
      {
        "name": "recipient",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "EnvelopeMinted",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "EnvelopeSealed",
    "inputs": [
      {
        "name": "recipient",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "currency",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "message",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      {
        "name": "previousOwner",
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
    "name": "Transfer",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {"type": "error", "name": "AlreadyClaimed", "inputs": []},
  {
    "type": "error",
    "name": "AlreadySealed",
    "inputs": [
      {"name": "envelope", "type": "uint256", "internalType": "uint256"}
    ]
  },
  {"type": "error", "name": "CannotRelease", "inputs": []},
  {"type": "error", "name": "CannotSettle", "inputs": []},
  {
    "type": "error",
    "name": "ERC721IncorrectOwner",
    "inputs": [
      {"name": "sender", "type": "address", "internalType": "address"},
      {"name": "tokenId", "type": "uint256", "internalType": "uint256"},
      {"name": "owner", "type": "address", "internalType": "address"}
    ]
  },
  {
    "type": "error",
    "name": "ERC721InsufficientApproval",
    "inputs": [
      {"name": "operator", "type": "address", "internalType": "address"},
      {"name": "tokenId", "type": "uint256", "internalType": "uint256"}
    ]
  },
  {
    "type": "error",
    "name": "ERC721InvalidApprover",
    "inputs": [
      {"name": "approver", "type": "address", "internalType": "address"}
    ]
  },
  {
    "type": "error",
    "name": "ERC721InvalidOperator",
    "inputs": [
      {"name": "operator", "type": "address", "internalType": "address"}
    ]
  },
  {
    "type": "error",
    "name": "ERC721InvalidOwner",
    "inputs": [
      {"name": "owner", "type": "address", "internalType": "address"}
    ]
  },
  {
    "type": "error",
    "name": "ERC721InvalidReceiver",
    "inputs": [
      {"name": "receiver", "type": "address", "internalType": "address"}
    ]
  },
  {
    "type": "error",
    "name": "ERC721InvalidSender",
    "inputs": [
      {"name": "sender", "type": "address", "internalType": "address"}
    ]
  },
  {
    "type": "error",
    "name": "ERC721NonexistentToken",
    "inputs": [
      {"name": "tokenId", "type": "uint256", "internalType": "uint256"}
    ]
  },
  {"type": "error", "name": "InvalidAmount", "inputs": []},
  {"type": "error", "name": "InvalidBalance", "inputs": []},
  {"type": "error", "name": "InvalidBeneficiary", "inputs": []},
  {"type": "error", "name": "InvalidPricing", "inputs": []},
  {"type": "error", "name": "InvalidRecipient", "inputs": []},
  {"type": "error", "name": "NotOwner", "inputs": []},
  {"type": "error", "name": "NotSealed", "inputs": []},
  {
    "type": "error",
    "name": "OwnableInvalidOwner",
    "inputs": [
      {"name": "owner", "type": "address", "internalType": "address"}
    ]
  },
  {
    "type": "error",
    "name": "OwnableUnauthorizedAccount",
    "inputs": [
      {"name": "account", "type": "address", "internalType": "address"}
    ]
  },
  {
    "type": "error",
    "name": "SafeERC20FailedOperation",
    "inputs": [
      {"name": "token", "type": "address", "internalType": "address"}
    ]
  },
  {"type": "error", "name": "TransferNotAllowed", "inputs": []}
] as const;
