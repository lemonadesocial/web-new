export const LemonadeForwardPaymentABI = [
  {
    inputs: [
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'address', name: 'destination', type: 'address' },
      { internalType: 'bytes32', name: 'paymentRef', type: 'bytes32' },
    ],
    name: 'pay',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
