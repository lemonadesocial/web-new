import { Address, Hex } from "viem";

export interface PoolKey {
  currency0: Address;
  currency1: Address;
  fee: number;
  tickSpacing: number;
  hooks: Address;
}

export interface PoolWithHookData extends PoolKey {
  hookData: Hex;
}

export type PermitDetails = {
  token: Address;
  amount: bigint;
  expiration: number;
  nonce: number;
};

export type PermitSingle = {
  details: PermitDetails;
  spender: Address;
  sigDeadline: bigint;
};
