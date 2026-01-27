/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  jsonb: { input: any; output: any; }
  numeric: { input: any; output: any; }
  timestamptz: { input: any; output: any; }
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Boolean']['input']>;
  _gt?: InputMaybe<Scalars['Boolean']['input']>;
  _gte?: InputMaybe<Scalars['Boolean']['input']>;
  _in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Boolean']['input']>;
  _lte?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Scalars['Boolean']['input']>;
  _nin?: InputMaybe<Array<Scalars['Boolean']['input']>>;
};

/** columns and relationships of "Envelope" */
export type Envelope = {
  __typename?: 'Envelope';
  amount?: Maybe<Scalars['numeric']['output']>;
  chain_id: Scalars['numeric']['output'];
  claimed: Scalars['Boolean']['output'];
  claimed_at?: Maybe<Scalars['numeric']['output']>;
  created_at: Scalars['numeric']['output'];
  currency?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  message?: Maybe<Scalars['String']['output']>;
  owner: Scalars['String']['output'];
  recipient?: Maybe<Scalars['String']['output']>;
  sealed_at?: Maybe<Scalars['numeric']['output']>;
  token_id: Scalars['numeric']['output'];
};

/** Boolean expression to filter rows from the table "Envelope". All fields are combined with a logical 'AND'. */
export type Envelope_Bool_Exp = {
  _and?: InputMaybe<Array<Envelope_Bool_Exp>>;
  _not?: InputMaybe<Envelope_Bool_Exp>;
  _or?: InputMaybe<Array<Envelope_Bool_Exp>>;
  amount?: InputMaybe<Numeric_Comparison_Exp>;
  chain_id?: InputMaybe<Numeric_Comparison_Exp>;
  claimed?: InputMaybe<Boolean_Comparison_Exp>;
  claimed_at?: InputMaybe<Numeric_Comparison_Exp>;
  created_at?: InputMaybe<Numeric_Comparison_Exp>;
  currency?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  message?: InputMaybe<String_Comparison_Exp>;
  owner?: InputMaybe<String_Comparison_Exp>;
  recipient?: InputMaybe<String_Comparison_Exp>;
  sealed_at?: InputMaybe<Numeric_Comparison_Exp>;
  token_id?: InputMaybe<Numeric_Comparison_Exp>;
};

/** Ordering options when selecting data from "Envelope". */
export type Envelope_Order_By = {
  amount?: InputMaybe<Order_By>;
  chain_id?: InputMaybe<Order_By>;
  claimed?: InputMaybe<Order_By>;
  claimed_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  currency?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  message?: InputMaybe<Order_By>;
  owner?: InputMaybe<Order_By>;
  recipient?: InputMaybe<Order_By>;
  sealed_at?: InputMaybe<Order_By>;
  token_id?: InputMaybe<Order_By>;
};

/** select columns of table "Envelope" */
export enum Envelope_Select_Column {
  /** column name */
  Amount = 'amount',
  /** column name */
  ChainId = 'chain_id',
  /** column name */
  Claimed = 'claimed',
  /** column name */
  ClaimedAt = 'claimed_at',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Currency = 'currency',
  /** column name */
  Id = 'id',
  /** column name */
  Message = 'message',
  /** column name */
  Owner = 'owner',
  /** column name */
  Recipient = 'recipient',
  /** column name */
  SealedAt = 'sealed_at',
  /** column name */
  TokenId = 'token_id'
}

/** Streaming cursor of the table "Envelope" */
export type Envelope_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Envelope_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Envelope_Stream_Cursor_Value_Input = {
  amount?: InputMaybe<Scalars['numeric']['input']>;
  chain_id?: InputMaybe<Scalars['numeric']['input']>;
  claimed?: InputMaybe<Scalars['Boolean']['input']>;
  claimed_at?: InputMaybe<Scalars['numeric']['input']>;
  created_at?: InputMaybe<Scalars['numeric']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  owner?: InputMaybe<Scalars['String']['input']>;
  recipient?: InputMaybe<Scalars['String']['input']>;
  sealed_at?: InputMaybe<Scalars['numeric']['input']>;
  token_id?: InputMaybe<Scalars['numeric']['input']>;
};

/** columns and relationships of "FairLaunch" */
export type FairLaunch = {
  __typename?: 'FairLaunch';
  burnedAmount?: Maybe<Scalars['numeric']['output']>;
  chainId: Scalars['Int']['output'];
  closeAt?: Maybe<Scalars['numeric']['output']>;
  endAt: Scalars['numeric']['output'];
  id: Scalars['String']['output'];
  poolId: Scalars['String']['output'];
  startAt: Scalars['numeric']['output'];
};

/** Boolean expression to filter rows from the table "FairLaunch". All fields are combined with a logical 'AND'. */
export type FairLaunch_Bool_Exp = {
  _and?: InputMaybe<Array<FairLaunch_Bool_Exp>>;
  _not?: InputMaybe<FairLaunch_Bool_Exp>;
  _or?: InputMaybe<Array<FairLaunch_Bool_Exp>>;
  burnedAmount?: InputMaybe<Numeric_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  closeAt?: InputMaybe<Numeric_Comparison_Exp>;
  endAt?: InputMaybe<Numeric_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  poolId?: InputMaybe<String_Comparison_Exp>;
  startAt?: InputMaybe<Numeric_Comparison_Exp>;
};

/** Ordering options when selecting data from "FairLaunch". */
export type FairLaunch_Order_By = {
  burnedAmount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  closeAt?: InputMaybe<Order_By>;
  endAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  poolId?: InputMaybe<Order_By>;
  startAt?: InputMaybe<Order_By>;
};

/** select columns of table "FairLaunch" */
export enum FairLaunch_Select_Column {
  /** column name */
  BurnedAmount = 'burnedAmount',
  /** column name */
  ChainId = 'chainId',
  /** column name */
  CloseAt = 'closeAt',
  /** column name */
  EndAt = 'endAt',
  /** column name */
  Id = 'id',
  /** column name */
  PoolId = 'poolId',
  /** column name */
  StartAt = 'startAt'
}

/** Streaming cursor of the table "FairLaunch" */
export type FairLaunch_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: FairLaunch_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type FairLaunch_Stream_Cursor_Value_Input = {
  burnedAmount?: InputMaybe<Scalars['numeric']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  closeAt?: InputMaybe<Scalars['numeric']['input']>;
  endAt?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  poolId?: InputMaybe<Scalars['String']['input']>;
  startAt?: InputMaybe<Scalars['numeric']['input']>;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']['input']>;
  _gt?: InputMaybe<Scalars['Int']['input']>;
  _gte?: InputMaybe<Scalars['Int']['input']>;
  _in?: InputMaybe<Array<Scalars['Int']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Int']['input']>;
  _lte?: InputMaybe<Scalars['Int']['input']>;
  _neq?: InputMaybe<Scalars['Int']['input']>;
  _nin?: InputMaybe<Array<Scalars['Int']['input']>>;
};

/** columns and relationships of "ManagerDeployed" */
export type ManagerDeployed = {
  __typename?: 'ManagerDeployed';
  blockNumber: Scalars['numeric']['output'];
  blockTimestamp: Scalars['numeric']['output'];
  chainId: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  manager: Scalars['String']['output'];
  managerImplementation: Scalars['String']['output'];
  transactionHash: Scalars['String']['output'];
};

/** Boolean expression to filter rows from the table "ManagerDeployed". All fields are combined with a logical 'AND'. */
export type ManagerDeployed_Bool_Exp = {
  _and?: InputMaybe<Array<ManagerDeployed_Bool_Exp>>;
  _not?: InputMaybe<ManagerDeployed_Bool_Exp>;
  _or?: InputMaybe<Array<ManagerDeployed_Bool_Exp>>;
  blockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  blockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  manager?: InputMaybe<String_Comparison_Exp>;
  managerImplementation?: InputMaybe<String_Comparison_Exp>;
  transactionHash?: InputMaybe<String_Comparison_Exp>;
};

/** Ordering options when selecting data from "ManagerDeployed". */
export type ManagerDeployed_Order_By = {
  blockNumber?: InputMaybe<Order_By>;
  blockTimestamp?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  manager?: InputMaybe<Order_By>;
  managerImplementation?: InputMaybe<Order_By>;
  transactionHash?: InputMaybe<Order_By>;
};

/** select columns of table "ManagerDeployed" */
export enum ManagerDeployed_Select_Column {
  /** column name */
  BlockNumber = 'blockNumber',
  /** column name */
  BlockTimestamp = 'blockTimestamp',
  /** column name */
  ChainId = 'chainId',
  /** column name */
  Id = 'id',
  /** column name */
  Manager = 'manager',
  /** column name */
  ManagerImplementation = 'managerImplementation',
  /** column name */
  TransactionHash = 'transactionHash'
}

/** Streaming cursor of the table "ManagerDeployed" */
export type ManagerDeployed_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: ManagerDeployed_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type ManagerDeployed_Stream_Cursor_Value_Input = {
  blockNumber?: InputMaybe<Scalars['numeric']['input']>;
  blockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  manager?: InputMaybe<Scalars['String']['input']>;
  managerImplementation?: InputMaybe<Scalars['String']['input']>;
  transactionHash?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "MemecoinHolder" */
export type MemecoinHolder = {
  __typename?: 'MemecoinHolder';
  balance: Scalars['numeric']['output'];
  chainId: Scalars['Int']['output'];
  holder: Scalars['String']['output'];
  id: Scalars['String']['output'];
  memecoin: Scalars['String']['output'];
};

/** Boolean expression to filter rows from the table "MemecoinHolder". All fields are combined with a logical 'AND'. */
export type MemecoinHolder_Bool_Exp = {
  _and?: InputMaybe<Array<MemecoinHolder_Bool_Exp>>;
  _not?: InputMaybe<MemecoinHolder_Bool_Exp>;
  _or?: InputMaybe<Array<MemecoinHolder_Bool_Exp>>;
  balance?: InputMaybe<Numeric_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  holder?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  memecoin?: InputMaybe<String_Comparison_Exp>;
};

/** Ordering options when selecting data from "MemecoinHolder". */
export type MemecoinHolder_Order_By = {
  balance?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  holder?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  memecoin?: InputMaybe<Order_By>;
};

/** select columns of table "MemecoinHolder" */
export enum MemecoinHolder_Select_Column {
  /** column name */
  Balance = 'balance',
  /** column name */
  ChainId = 'chainId',
  /** column name */
  Holder = 'holder',
  /** column name */
  Id = 'id',
  /** column name */
  Memecoin = 'memecoin'
}

/** Streaming cursor of the table "MemecoinHolder" */
export type MemecoinHolder_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: MemecoinHolder_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type MemecoinHolder_Stream_Cursor_Value_Input = {
  balance?: InputMaybe<Scalars['numeric']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  holder?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  memecoin?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "MemecoinMetadata" */
export type MemecoinMetadata = {
  __typename?: 'MemecoinMetadata';
  chainId: Scalars['Int']['output'];
  holdersCount: Scalars['numeric']['output'];
  id: Scalars['String']['output'];
  memecoin: Scalars['String']['output'];
};

/** Boolean expression to filter rows from the table "MemecoinMetadata". All fields are combined with a logical 'AND'. */
export type MemecoinMetadata_Bool_Exp = {
  _and?: InputMaybe<Array<MemecoinMetadata_Bool_Exp>>;
  _not?: InputMaybe<MemecoinMetadata_Bool_Exp>;
  _or?: InputMaybe<Array<MemecoinMetadata_Bool_Exp>>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  holdersCount?: InputMaybe<Numeric_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  memecoin?: InputMaybe<String_Comparison_Exp>;
};

/** Ordering options when selecting data from "MemecoinMetadata". */
export type MemecoinMetadata_Order_By = {
  chainId?: InputMaybe<Order_By>;
  holdersCount?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  memecoin?: InputMaybe<Order_By>;
};

/** select columns of table "MemecoinMetadata" */
export enum MemecoinMetadata_Select_Column {
  /** column name */
  ChainId = 'chainId',
  /** column name */
  HoldersCount = 'holdersCount',
  /** column name */
  Id = 'id',
  /** column name */
  Memecoin = 'memecoin'
}

/** Streaming cursor of the table "MemecoinMetadata" */
export type MemecoinMetadata_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: MemecoinMetadata_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type MemecoinMetadata_Stream_Cursor_Value_Input = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  holdersCount?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  memecoin?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "PoolCreated" */
export type PoolCreated = {
  __typename?: 'PoolCreated';
  blockNumber: Scalars['numeric']['output'];
  blockTimestamp: Scalars['numeric']['output'];
  chainId: Scalars['Int']['output'];
  currencyFlipped: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  latestMarketCapDate?: Maybe<Scalars['String']['output']>;
  latestMarketCapETH?: Maybe<Scalars['numeric']['output']>;
  memecoin: Scalars['String']['output'];
  memecoinTreasury: Scalars['String']['output'];
  paramsCreator: Scalars['String']['output'];
  paramsCreatorFeeAllocation: Scalars['numeric']['output'];
  paramsFeeCalculatorParams: Scalars['String']['output'];
  paramsInitialPriceParams: Scalars['String']['output'];
  poolId: Scalars['String']['output'];
  previousMarketCapDate?: Maybe<Scalars['String']['output']>;
  previousMarketCapETH?: Maybe<Scalars['numeric']['output']>;
  tokenId: Scalars['numeric']['output'];
  tokenURI?: Maybe<Scalars['String']['output']>;
  transactionHash: Scalars['String']['output'];
};

/** Boolean expression to filter rows from the table "PoolCreated". All fields are combined with a logical 'AND'. */
export type PoolCreated_Bool_Exp = {
  _and?: InputMaybe<Array<PoolCreated_Bool_Exp>>;
  _not?: InputMaybe<PoolCreated_Bool_Exp>;
  _or?: InputMaybe<Array<PoolCreated_Bool_Exp>>;
  blockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  blockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  currencyFlipped?: InputMaybe<Boolean_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  latestMarketCapDate?: InputMaybe<String_Comparison_Exp>;
  latestMarketCapETH?: InputMaybe<Numeric_Comparison_Exp>;
  memecoin?: InputMaybe<String_Comparison_Exp>;
  memecoinTreasury?: InputMaybe<String_Comparison_Exp>;
  paramsCreator?: InputMaybe<String_Comparison_Exp>;
  paramsCreatorFeeAllocation?: InputMaybe<Numeric_Comparison_Exp>;
  paramsFeeCalculatorParams?: InputMaybe<String_Comparison_Exp>;
  paramsInitialPriceParams?: InputMaybe<String_Comparison_Exp>;
  poolId?: InputMaybe<String_Comparison_Exp>;
  previousMarketCapDate?: InputMaybe<String_Comparison_Exp>;
  previousMarketCapETH?: InputMaybe<Numeric_Comparison_Exp>;
  tokenId?: InputMaybe<Numeric_Comparison_Exp>;
  tokenURI?: InputMaybe<String_Comparison_Exp>;
  transactionHash?: InputMaybe<String_Comparison_Exp>;
};

/** Ordering options when selecting data from "PoolCreated". */
export type PoolCreated_Order_By = {
  blockNumber?: InputMaybe<Order_By>;
  blockTimestamp?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  currencyFlipped?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  latestMarketCapDate?: InputMaybe<Order_By>;
  latestMarketCapETH?: InputMaybe<Order_By>;
  memecoin?: InputMaybe<Order_By>;
  memecoinTreasury?: InputMaybe<Order_By>;
  paramsCreator?: InputMaybe<Order_By>;
  paramsCreatorFeeAllocation?: InputMaybe<Order_By>;
  paramsFeeCalculatorParams?: InputMaybe<Order_By>;
  paramsInitialPriceParams?: InputMaybe<Order_By>;
  poolId?: InputMaybe<Order_By>;
  previousMarketCapDate?: InputMaybe<Order_By>;
  previousMarketCapETH?: InputMaybe<Order_By>;
  tokenId?: InputMaybe<Order_By>;
  tokenURI?: InputMaybe<Order_By>;
  transactionHash?: InputMaybe<Order_By>;
};

/** select columns of table "PoolCreated" */
export enum PoolCreated_Select_Column {
  /** column name */
  BlockNumber = 'blockNumber',
  /** column name */
  BlockTimestamp = 'blockTimestamp',
  /** column name */
  ChainId = 'chainId',
  /** column name */
  CurrencyFlipped = 'currencyFlipped',
  /** column name */
  Id = 'id',
  /** column name */
  LatestMarketCapDate = 'latestMarketCapDate',
  /** column name */
  LatestMarketCapEth = 'latestMarketCapETH',
  /** column name */
  Memecoin = 'memecoin',
  /** column name */
  MemecoinTreasury = 'memecoinTreasury',
  /** column name */
  ParamsCreator = 'paramsCreator',
  /** column name */
  ParamsCreatorFeeAllocation = 'paramsCreatorFeeAllocation',
  /** column name */
  ParamsFeeCalculatorParams = 'paramsFeeCalculatorParams',
  /** column name */
  ParamsInitialPriceParams = 'paramsInitialPriceParams',
  /** column name */
  PoolId = 'poolId',
  /** column name */
  PreviousMarketCapDate = 'previousMarketCapDate',
  /** column name */
  PreviousMarketCapEth = 'previousMarketCapETH',
  /** column name */
  TokenId = 'tokenId',
  /** column name */
  TokenUri = 'tokenURI',
  /** column name */
  TransactionHash = 'transactionHash'
}

/** Streaming cursor of the table "PoolCreated" */
export type PoolCreated_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: PoolCreated_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type PoolCreated_Stream_Cursor_Value_Input = {
  blockNumber?: InputMaybe<Scalars['numeric']['input']>;
  blockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  currencyFlipped?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  latestMarketCapDate?: InputMaybe<Scalars['String']['input']>;
  latestMarketCapETH?: InputMaybe<Scalars['numeric']['input']>;
  memecoin?: InputMaybe<Scalars['String']['input']>;
  memecoinTreasury?: InputMaybe<Scalars['String']['input']>;
  paramsCreator?: InputMaybe<Scalars['String']['input']>;
  paramsCreatorFeeAllocation?: InputMaybe<Scalars['numeric']['input']>;
  paramsFeeCalculatorParams?: InputMaybe<Scalars['String']['input']>;
  paramsInitialPriceParams?: InputMaybe<Scalars['String']['input']>;
  poolId?: InputMaybe<Scalars['String']['input']>;
  previousMarketCapDate?: InputMaybe<Scalars['String']['input']>;
  previousMarketCapETH?: InputMaybe<Scalars['numeric']['input']>;
  tokenId?: InputMaybe<Scalars['numeric']['input']>;
  tokenURI?: InputMaybe<Scalars['String']['input']>;
  transactionHash?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "PoolSwap" */
export type PoolSwap = {
  __typename?: 'PoolSwap';
  blockNumber: Scalars['numeric']['output'];
  blockTimestamp: Scalars['numeric']['output'];
  chainId: Scalars['Int']['output'];
  flAmount0: Scalars['numeric']['output'];
  flAmount1: Scalars['numeric']['output'];
  flFee0: Scalars['numeric']['output'];
  flFee1: Scalars['numeric']['output'];
  id: Scalars['String']['output'];
  ispAmount0: Scalars['numeric']['output'];
  ispAmount1: Scalars['numeric']['output'];
  ispFee0: Scalars['numeric']['output'];
  ispFee1: Scalars['numeric']['output'];
  poolId: Scalars['String']['output'];
  transactionHash: Scalars['String']['output'];
  uniAmount0: Scalars['numeric']['output'];
  uniAmount1: Scalars['numeric']['output'];
  uniFee0: Scalars['numeric']['output'];
  uniFee1: Scalars['numeric']['output'];
};

/** Boolean expression to filter rows from the table "PoolSwap". All fields are combined with a logical 'AND'. */
export type PoolSwap_Bool_Exp = {
  _and?: InputMaybe<Array<PoolSwap_Bool_Exp>>;
  _not?: InputMaybe<PoolSwap_Bool_Exp>;
  _or?: InputMaybe<Array<PoolSwap_Bool_Exp>>;
  blockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  blockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  flAmount0?: InputMaybe<Numeric_Comparison_Exp>;
  flAmount1?: InputMaybe<Numeric_Comparison_Exp>;
  flFee0?: InputMaybe<Numeric_Comparison_Exp>;
  flFee1?: InputMaybe<Numeric_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  ispAmount0?: InputMaybe<Numeric_Comparison_Exp>;
  ispAmount1?: InputMaybe<Numeric_Comparison_Exp>;
  ispFee0?: InputMaybe<Numeric_Comparison_Exp>;
  ispFee1?: InputMaybe<Numeric_Comparison_Exp>;
  poolId?: InputMaybe<String_Comparison_Exp>;
  transactionHash?: InputMaybe<String_Comparison_Exp>;
  uniAmount0?: InputMaybe<Numeric_Comparison_Exp>;
  uniAmount1?: InputMaybe<Numeric_Comparison_Exp>;
  uniFee0?: InputMaybe<Numeric_Comparison_Exp>;
  uniFee1?: InputMaybe<Numeric_Comparison_Exp>;
};

/** Ordering options when selecting data from "PoolSwap". */
export type PoolSwap_Order_By = {
  blockNumber?: InputMaybe<Order_By>;
  blockTimestamp?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  flAmount0?: InputMaybe<Order_By>;
  flAmount1?: InputMaybe<Order_By>;
  flFee0?: InputMaybe<Order_By>;
  flFee1?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  ispAmount0?: InputMaybe<Order_By>;
  ispAmount1?: InputMaybe<Order_By>;
  ispFee0?: InputMaybe<Order_By>;
  ispFee1?: InputMaybe<Order_By>;
  poolId?: InputMaybe<Order_By>;
  transactionHash?: InputMaybe<Order_By>;
  uniAmount0?: InputMaybe<Order_By>;
  uniAmount1?: InputMaybe<Order_By>;
  uniFee0?: InputMaybe<Order_By>;
  uniFee1?: InputMaybe<Order_By>;
};

/** select columns of table "PoolSwap" */
export enum PoolSwap_Select_Column {
  /** column name */
  BlockNumber = 'blockNumber',
  /** column name */
  BlockTimestamp = 'blockTimestamp',
  /** column name */
  ChainId = 'chainId',
  /** column name */
  FlAmount0 = 'flAmount0',
  /** column name */
  FlAmount1 = 'flAmount1',
  /** column name */
  FlFee0 = 'flFee0',
  /** column name */
  FlFee1 = 'flFee1',
  /** column name */
  Id = 'id',
  /** column name */
  IspAmount0 = 'ispAmount0',
  /** column name */
  IspAmount1 = 'ispAmount1',
  /** column name */
  IspFee0 = 'ispFee0',
  /** column name */
  IspFee1 = 'ispFee1',
  /** column name */
  PoolId = 'poolId',
  /** column name */
  TransactionHash = 'transactionHash',
  /** column name */
  UniAmount0 = 'uniAmount0',
  /** column name */
  UniAmount1 = 'uniAmount1',
  /** column name */
  UniFee0 = 'uniFee0',
  /** column name */
  UniFee1 = 'uniFee1'
}

/** Streaming cursor of the table "PoolSwap" */
export type PoolSwap_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: PoolSwap_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type PoolSwap_Stream_Cursor_Value_Input = {
  blockNumber?: InputMaybe<Scalars['numeric']['input']>;
  blockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  flAmount0?: InputMaybe<Scalars['numeric']['input']>;
  flAmount1?: InputMaybe<Scalars['numeric']['input']>;
  flFee0?: InputMaybe<Scalars['numeric']['input']>;
  flFee1?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  ispAmount0?: InputMaybe<Scalars['numeric']['input']>;
  ispAmount1?: InputMaybe<Scalars['numeric']['input']>;
  ispFee0?: InputMaybe<Scalars['numeric']['input']>;
  ispFee1?: InputMaybe<Scalars['numeric']['input']>;
  poolId?: InputMaybe<Scalars['String']['input']>;
  transactionHash?: InputMaybe<Scalars['String']['input']>;
  uniAmount0?: InputMaybe<Scalars['numeric']['input']>;
  uniAmount1?: InputMaybe<Scalars['numeric']['input']>;
  uniFee0?: InputMaybe<Scalars['numeric']['input']>;
  uniFee1?: InputMaybe<Scalars['numeric']['input']>;
};

/** columns and relationships of "StakingManagerToken" */
export type StakingManagerToken = {
  __typename?: 'StakingManagerToken';
  chainId: Scalars['Int']['output'];
  escrowTransactionHash: Scalars['String']['output'];
  escrowedAt: Scalars['numeric']['output'];
  escrowedBlockNumber: Scalars['numeric']['output'];
  flaunch: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  owner: Scalars['String']['output'];
  reclaimTransactionHash?: Maybe<Scalars['String']['output']>;
  reclaimedAt?: Maybe<Scalars['numeric']['output']>;
  reclaimedBlockNumber?: Maybe<Scalars['numeric']['output']>;
  stakingManagerAddress: Scalars['String']['output'];
  tokenId: Scalars['numeric']['output'];
};

/** Boolean expression to filter rows from the table "StakingManagerToken". All fields are combined with a logical 'AND'. */
export type StakingManagerToken_Bool_Exp = {
  _and?: InputMaybe<Array<StakingManagerToken_Bool_Exp>>;
  _not?: InputMaybe<StakingManagerToken_Bool_Exp>;
  _or?: InputMaybe<Array<StakingManagerToken_Bool_Exp>>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  escrowTransactionHash?: InputMaybe<String_Comparison_Exp>;
  escrowedAt?: InputMaybe<Numeric_Comparison_Exp>;
  escrowedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  flaunch?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  isActive?: InputMaybe<Boolean_Comparison_Exp>;
  owner?: InputMaybe<String_Comparison_Exp>;
  reclaimTransactionHash?: InputMaybe<String_Comparison_Exp>;
  reclaimedAt?: InputMaybe<Numeric_Comparison_Exp>;
  reclaimedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  stakingManagerAddress?: InputMaybe<String_Comparison_Exp>;
  tokenId?: InputMaybe<Numeric_Comparison_Exp>;
};

/** Ordering options when selecting data from "StakingManagerToken". */
export type StakingManagerToken_Order_By = {
  chainId?: InputMaybe<Order_By>;
  escrowTransactionHash?: InputMaybe<Order_By>;
  escrowedAt?: InputMaybe<Order_By>;
  escrowedBlockNumber?: InputMaybe<Order_By>;
  flaunch?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  isActive?: InputMaybe<Order_By>;
  owner?: InputMaybe<Order_By>;
  reclaimTransactionHash?: InputMaybe<Order_By>;
  reclaimedAt?: InputMaybe<Order_By>;
  reclaimedBlockNumber?: InputMaybe<Order_By>;
  stakingManagerAddress?: InputMaybe<Order_By>;
  tokenId?: InputMaybe<Order_By>;
};

/** select columns of table "StakingManagerToken" */
export enum StakingManagerToken_Select_Column {
  /** column name */
  ChainId = 'chainId',
  /** column name */
  EscrowTransactionHash = 'escrowTransactionHash',
  /** column name */
  EscrowedAt = 'escrowedAt',
  /** column name */
  EscrowedBlockNumber = 'escrowedBlockNumber',
  /** column name */
  Flaunch = 'flaunch',
  /** column name */
  Id = 'id',
  /** column name */
  IsActive = 'isActive',
  /** column name */
  Owner = 'owner',
  /** column name */
  ReclaimTransactionHash = 'reclaimTransactionHash',
  /** column name */
  ReclaimedAt = 'reclaimedAt',
  /** column name */
  ReclaimedBlockNumber = 'reclaimedBlockNumber',
  /** column name */
  StakingManagerAddress = 'stakingManagerAddress',
  /** column name */
  TokenId = 'tokenId'
}

/** Streaming cursor of the table "StakingManagerToken" */
export type StakingManagerToken_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: StakingManagerToken_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type StakingManagerToken_Stream_Cursor_Value_Input = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  escrowTransactionHash?: InputMaybe<Scalars['String']['input']>;
  escrowedAt?: InputMaybe<Scalars['numeric']['input']>;
  escrowedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  flaunch?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  owner?: InputMaybe<Scalars['String']['input']>;
  reclaimTransactionHash?: InputMaybe<Scalars['String']['input']>;
  reclaimedAt?: InputMaybe<Scalars['numeric']['input']>;
  reclaimedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  stakingManagerAddress?: InputMaybe<Scalars['String']['input']>;
  tokenId?: InputMaybe<Scalars['numeric']['input']>;
};

/** columns and relationships of "StakingSummary" */
export type StakingSummary = {
  __typename?: 'StakingSummary';
  chainId: Scalars['Int']['output'];
  date: Scalars['String']['output'];
  id: Scalars['String']['output'];
  stakingManagerAddress: Scalars['String']['output'];
  totalDeposited: Scalars['numeric']['output'];
  totalFees: Scalars['numeric']['output'];
  updatedAt: Scalars['numeric']['output'];
};

/** Boolean expression to filter rows from the table "StakingSummary". All fields are combined with a logical 'AND'. */
export type StakingSummary_Bool_Exp = {
  _and?: InputMaybe<Array<StakingSummary_Bool_Exp>>;
  _not?: InputMaybe<StakingSummary_Bool_Exp>;
  _or?: InputMaybe<Array<StakingSummary_Bool_Exp>>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  date?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  stakingManagerAddress?: InputMaybe<String_Comparison_Exp>;
  totalDeposited?: InputMaybe<Numeric_Comparison_Exp>;
  totalFees?: InputMaybe<Numeric_Comparison_Exp>;
  updatedAt?: InputMaybe<Numeric_Comparison_Exp>;
};

/** Ordering options when selecting data from "StakingSummary". */
export type StakingSummary_Order_By = {
  chainId?: InputMaybe<Order_By>;
  date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  stakingManagerAddress?: InputMaybe<Order_By>;
  totalDeposited?: InputMaybe<Order_By>;
  totalFees?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** select columns of table "StakingSummary" */
export enum StakingSummary_Select_Column {
  /** column name */
  ChainId = 'chainId',
  /** column name */
  Date = 'date',
  /** column name */
  Id = 'id',
  /** column name */
  StakingManagerAddress = 'stakingManagerAddress',
  /** column name */
  TotalDeposited = 'totalDeposited',
  /** column name */
  TotalFees = 'totalFees',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** Streaming cursor of the table "StakingSummary" */
export type StakingSummary_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: StakingSummary_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type StakingSummary_Stream_Cursor_Value_Input = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  stakingManagerAddress?: InputMaybe<Scalars['String']['input']>;
  totalDeposited?: InputMaybe<Scalars['numeric']['input']>;
  totalFees?: InputMaybe<Scalars['numeric']['input']>;
  updatedAt?: InputMaybe<Scalars['numeric']['input']>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']['input']>;
  _gt?: InputMaybe<Scalars['String']['input']>;
  _gte?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']['input']>;
  _in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']['input']>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']['input']>;
  _lt?: InputMaybe<Scalars['String']['input']>;
  _lte?: InputMaybe<Scalars['String']['input']>;
  _neq?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']['input']>;
  _nin?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "TokenOwner" */
export type TokenOwner = {
  __typename?: 'TokenOwner';
  chainId: Scalars['numeric']['output'];
  id: Scalars['String']['output'];
  own_at: Scalars['numeric']['output'];
  owner: Scalars['String']['output'];
  tokenAddress: Scalars['String']['output'];
  tokenId: Scalars['numeric']['output'];
};

/** Boolean expression to filter rows from the table "TokenOwner". All fields are combined with a logical 'AND'. */
export type TokenOwner_Bool_Exp = {
  _and?: InputMaybe<Array<TokenOwner_Bool_Exp>>;
  _not?: InputMaybe<TokenOwner_Bool_Exp>;
  _or?: InputMaybe<Array<TokenOwner_Bool_Exp>>;
  chainId?: InputMaybe<Numeric_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  own_at?: InputMaybe<Numeric_Comparison_Exp>;
  owner?: InputMaybe<String_Comparison_Exp>;
  tokenAddress?: InputMaybe<String_Comparison_Exp>;
  tokenId?: InputMaybe<Numeric_Comparison_Exp>;
};

/** Ordering options when selecting data from "TokenOwner". */
export type TokenOwner_Order_By = {
  chainId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  own_at?: InputMaybe<Order_By>;
  owner?: InputMaybe<Order_By>;
  tokenAddress?: InputMaybe<Order_By>;
  tokenId?: InputMaybe<Order_By>;
};

/** select columns of table "TokenOwner" */
export enum TokenOwner_Select_Column {
  /** column name */
  ChainId = 'chainId',
  /** column name */
  Id = 'id',
  /** column name */
  OwnAt = 'own_at',
  /** column name */
  Owner = 'owner',
  /** column name */
  TokenAddress = 'tokenAddress',
  /** column name */
  TokenId = 'tokenId'
}

/** Streaming cursor of the table "TokenOwner" */
export type TokenOwner_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: TokenOwner_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type TokenOwner_Stream_Cursor_Value_Input = {
  chainId?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  own_at?: InputMaybe<Scalars['numeric']['input']>;
  owner?: InputMaybe<Scalars['String']['input']>;
  tokenAddress?: InputMaybe<Scalars['String']['input']>;
  tokenId?: InputMaybe<Scalars['numeric']['input']>;
};

/** columns and relationships of "TradeVolume" */
export type TradeVolume = {
  __typename?: 'TradeVolume';
  chainId: Scalars['Int']['output'];
  date: Scalars['String']['output'];
  id: Scalars['String']['output'];
  memecoin: Scalars['String']['output'];
  tradeCount: Scalars['numeric']['output'];
  updatedAt: Scalars['numeric']['output'];
  volumeETH: Scalars['numeric']['output'];
  volumeMemecoin: Scalars['numeric']['output'];
};

/** Boolean expression to filter rows from the table "TradeVolume". All fields are combined with a logical 'AND'. */
export type TradeVolume_Bool_Exp = {
  _and?: InputMaybe<Array<TradeVolume_Bool_Exp>>;
  _not?: InputMaybe<TradeVolume_Bool_Exp>;
  _or?: InputMaybe<Array<TradeVolume_Bool_Exp>>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  date?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  memecoin?: InputMaybe<String_Comparison_Exp>;
  tradeCount?: InputMaybe<Numeric_Comparison_Exp>;
  updatedAt?: InputMaybe<Numeric_Comparison_Exp>;
  volumeETH?: InputMaybe<Numeric_Comparison_Exp>;
  volumeMemecoin?: InputMaybe<Numeric_Comparison_Exp>;
};

/** Ordering options when selecting data from "TradeVolume". */
export type TradeVolume_Order_By = {
  chainId?: InputMaybe<Order_By>;
  date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  memecoin?: InputMaybe<Order_By>;
  tradeCount?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  volumeETH?: InputMaybe<Order_By>;
  volumeMemecoin?: InputMaybe<Order_By>;
};

/** select columns of table "TradeVolume" */
export enum TradeVolume_Select_Column {
  /** column name */
  ChainId = 'chainId',
  /** column name */
  Date = 'date',
  /** column name */
  Id = 'id',
  /** column name */
  Memecoin = 'memecoin',
  /** column name */
  TradeCount = 'tradeCount',
  /** column name */
  UpdatedAt = 'updatedAt',
  /** column name */
  VolumeEth = 'volumeETH',
  /** column name */
  VolumeMemecoin = 'volumeMemecoin'
}

/** Streaming cursor of the table "TradeVolume" */
export type TradeVolume_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: TradeVolume_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type TradeVolume_Stream_Cursor_Value_Input = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  memecoin?: InputMaybe<Scalars['String']['input']>;
  tradeCount?: InputMaybe<Scalars['numeric']['input']>;
  updatedAt?: InputMaybe<Scalars['numeric']['input']>;
  volumeETH?: InputMaybe<Scalars['numeric']['input']>;
  volumeMemecoin?: InputMaybe<Scalars['numeric']['input']>;
};

/** columns and relationships of "TreasuryEscrowed" */
export type TreasuryEscrowed = {
  __typename?: 'TreasuryEscrowed';
  blockNumber: Scalars['numeric']['output'];
  blockTimestamp: Scalars['numeric']['output'];
  chainId: Scalars['Int']['output'];
  flaunch: Scalars['String']['output'];
  id: Scalars['String']['output'];
  owner: Scalars['String']['output'];
  sender: Scalars['String']['output'];
  tokenId: Scalars['numeric']['output'];
  transactionHash: Scalars['String']['output'];
};

/** Boolean expression to filter rows from the table "TreasuryEscrowed". All fields are combined with a logical 'AND'. */
export type TreasuryEscrowed_Bool_Exp = {
  _and?: InputMaybe<Array<TreasuryEscrowed_Bool_Exp>>;
  _not?: InputMaybe<TreasuryEscrowed_Bool_Exp>;
  _or?: InputMaybe<Array<TreasuryEscrowed_Bool_Exp>>;
  blockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  blockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  flaunch?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  owner?: InputMaybe<String_Comparison_Exp>;
  sender?: InputMaybe<String_Comparison_Exp>;
  tokenId?: InputMaybe<Numeric_Comparison_Exp>;
  transactionHash?: InputMaybe<String_Comparison_Exp>;
};

/** Ordering options when selecting data from "TreasuryEscrowed". */
export type TreasuryEscrowed_Order_By = {
  blockNumber?: InputMaybe<Order_By>;
  blockTimestamp?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  flaunch?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  owner?: InputMaybe<Order_By>;
  sender?: InputMaybe<Order_By>;
  tokenId?: InputMaybe<Order_By>;
  transactionHash?: InputMaybe<Order_By>;
};

/** select columns of table "TreasuryEscrowed" */
export enum TreasuryEscrowed_Select_Column {
  /** column name */
  BlockNumber = 'blockNumber',
  /** column name */
  BlockTimestamp = 'blockTimestamp',
  /** column name */
  ChainId = 'chainId',
  /** column name */
  Flaunch = 'flaunch',
  /** column name */
  Id = 'id',
  /** column name */
  Owner = 'owner',
  /** column name */
  Sender = 'sender',
  /** column name */
  TokenId = 'tokenId',
  /** column name */
  TransactionHash = 'transactionHash'
}

/** Streaming cursor of the table "TreasuryEscrowed" */
export type TreasuryEscrowed_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: TreasuryEscrowed_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type TreasuryEscrowed_Stream_Cursor_Value_Input = {
  blockNumber?: InputMaybe<Scalars['numeric']['input']>;
  blockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  flaunch?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  owner?: InputMaybe<Scalars['String']['input']>;
  sender?: InputMaybe<Scalars['String']['input']>;
  tokenId?: InputMaybe<Scalars['numeric']['input']>;
  transactionHash?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "TreasuryReclaimed" */
export type TreasuryReclaimed = {
  __typename?: 'TreasuryReclaimed';
  blockNumber: Scalars['numeric']['output'];
  blockTimestamp: Scalars['numeric']['output'];
  chainId: Scalars['Int']['output'];
  flaunch: Scalars['String']['output'];
  id: Scalars['String']['output'];
  recipient: Scalars['String']['output'];
  sender: Scalars['String']['output'];
  tokenId: Scalars['numeric']['output'];
  transactionHash: Scalars['String']['output'];
};

/** Boolean expression to filter rows from the table "TreasuryReclaimed". All fields are combined with a logical 'AND'. */
export type TreasuryReclaimed_Bool_Exp = {
  _and?: InputMaybe<Array<TreasuryReclaimed_Bool_Exp>>;
  _not?: InputMaybe<TreasuryReclaimed_Bool_Exp>;
  _or?: InputMaybe<Array<TreasuryReclaimed_Bool_Exp>>;
  blockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  blockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  flaunch?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  recipient?: InputMaybe<String_Comparison_Exp>;
  sender?: InputMaybe<String_Comparison_Exp>;
  tokenId?: InputMaybe<Numeric_Comparison_Exp>;
  transactionHash?: InputMaybe<String_Comparison_Exp>;
};

/** Ordering options when selecting data from "TreasuryReclaimed". */
export type TreasuryReclaimed_Order_By = {
  blockNumber?: InputMaybe<Order_By>;
  blockTimestamp?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  flaunch?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  recipient?: InputMaybe<Order_By>;
  sender?: InputMaybe<Order_By>;
  tokenId?: InputMaybe<Order_By>;
  transactionHash?: InputMaybe<Order_By>;
};

/** select columns of table "TreasuryReclaimed" */
export enum TreasuryReclaimed_Select_Column {
  /** column name */
  BlockNumber = 'blockNumber',
  /** column name */
  BlockTimestamp = 'blockTimestamp',
  /** column name */
  ChainId = 'chainId',
  /** column name */
  Flaunch = 'flaunch',
  /** column name */
  Id = 'id',
  /** column name */
  Recipient = 'recipient',
  /** column name */
  Sender = 'sender',
  /** column name */
  TokenId = 'tokenId',
  /** column name */
  TransactionHash = 'transactionHash'
}

/** Streaming cursor of the table "TreasuryReclaimed" */
export type TreasuryReclaimed_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: TreasuryReclaimed_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type TreasuryReclaimed_Stream_Cursor_Value_Input = {
  blockNumber?: InputMaybe<Scalars['numeric']['input']>;
  blockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  flaunch?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  recipient?: InputMaybe<Scalars['String']['input']>;
  sender?: InputMaybe<Scalars['String']['input']>;
  tokenId?: InputMaybe<Scalars['numeric']['input']>;
  transactionHash?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "_meta" */
export type _Meta = {
  __typename?: '_meta';
  bufferBlock?: Maybe<Scalars['Int']['output']>;
  chainId?: Maybe<Scalars['Int']['output']>;
  endBlock?: Maybe<Scalars['Int']['output']>;
  eventsProcessed?: Maybe<Scalars['Int']['output']>;
  firstEventBlock?: Maybe<Scalars['Int']['output']>;
  isReady?: Maybe<Scalars['Boolean']['output']>;
  progressBlock?: Maybe<Scalars['Int']['output']>;
  readyAt?: Maybe<Scalars['timestamptz']['output']>;
  sourceBlock?: Maybe<Scalars['Int']['output']>;
  startBlock?: Maybe<Scalars['Int']['output']>;
};

/** Boolean expression to filter rows from the table "_meta". All fields are combined with a logical 'AND'. */
export type _Meta_Bool_Exp = {
  _and?: InputMaybe<Array<_Meta_Bool_Exp>>;
  _not?: InputMaybe<_Meta_Bool_Exp>;
  _or?: InputMaybe<Array<_Meta_Bool_Exp>>;
  bufferBlock?: InputMaybe<Int_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  endBlock?: InputMaybe<Int_Comparison_Exp>;
  eventsProcessed?: InputMaybe<Int_Comparison_Exp>;
  firstEventBlock?: InputMaybe<Int_Comparison_Exp>;
  isReady?: InputMaybe<Boolean_Comparison_Exp>;
  progressBlock?: InputMaybe<Int_Comparison_Exp>;
  readyAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  sourceBlock?: InputMaybe<Int_Comparison_Exp>;
  startBlock?: InputMaybe<Int_Comparison_Exp>;
};

/** Ordering options when selecting data from "_meta". */
export type _Meta_Order_By = {
  bufferBlock?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  endBlock?: InputMaybe<Order_By>;
  eventsProcessed?: InputMaybe<Order_By>;
  firstEventBlock?: InputMaybe<Order_By>;
  isReady?: InputMaybe<Order_By>;
  progressBlock?: InputMaybe<Order_By>;
  readyAt?: InputMaybe<Order_By>;
  sourceBlock?: InputMaybe<Order_By>;
  startBlock?: InputMaybe<Order_By>;
};

/** select columns of table "_meta" */
export enum _Meta_Select_Column {
  /** column name */
  BufferBlock = 'bufferBlock',
  /** column name */
  ChainId = 'chainId',
  /** column name */
  EndBlock = 'endBlock',
  /** column name */
  EventsProcessed = 'eventsProcessed',
  /** column name */
  FirstEventBlock = 'firstEventBlock',
  /** column name */
  IsReady = 'isReady',
  /** column name */
  ProgressBlock = 'progressBlock',
  /** column name */
  ReadyAt = 'readyAt',
  /** column name */
  SourceBlock = 'sourceBlock',
  /** column name */
  StartBlock = 'startBlock'
}

/** Streaming cursor of the table "_meta" */
export type _Meta_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: _Meta_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type _Meta_Stream_Cursor_Value_Input = {
  bufferBlock?: InputMaybe<Scalars['Int']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  endBlock?: InputMaybe<Scalars['Int']['input']>;
  eventsProcessed?: InputMaybe<Scalars['Int']['input']>;
  firstEventBlock?: InputMaybe<Scalars['Int']['input']>;
  isReady?: InputMaybe<Scalars['Boolean']['input']>;
  progressBlock?: InputMaybe<Scalars['Int']['input']>;
  readyAt?: InputMaybe<Scalars['timestamptz']['input']>;
  sourceBlock?: InputMaybe<Scalars['Int']['input']>;
  startBlock?: InputMaybe<Scalars['Int']['input']>;
};

/** columns and relationships of "chain_metadata" */
export type Chain_Metadata = {
  __typename?: 'chain_metadata';
  block_height?: Maybe<Scalars['Int']['output']>;
  chain_id?: Maybe<Scalars['Int']['output']>;
  end_block?: Maybe<Scalars['Int']['output']>;
  first_event_block_number?: Maybe<Scalars['Int']['output']>;
  is_hyper_sync?: Maybe<Scalars['Boolean']['output']>;
  latest_fetched_block_number?: Maybe<Scalars['Int']['output']>;
  latest_processed_block?: Maybe<Scalars['Int']['output']>;
  num_batches_fetched?: Maybe<Scalars['Int']['output']>;
  num_events_processed?: Maybe<Scalars['Int']['output']>;
  start_block?: Maybe<Scalars['Int']['output']>;
  timestamp_caught_up_to_head_or_endblock?: Maybe<Scalars['timestamptz']['output']>;
};

/** Boolean expression to filter rows from the table "chain_metadata". All fields are combined with a logical 'AND'. */
export type Chain_Metadata_Bool_Exp = {
  _and?: InputMaybe<Array<Chain_Metadata_Bool_Exp>>;
  _not?: InputMaybe<Chain_Metadata_Bool_Exp>;
  _or?: InputMaybe<Array<Chain_Metadata_Bool_Exp>>;
  block_height?: InputMaybe<Int_Comparison_Exp>;
  chain_id?: InputMaybe<Int_Comparison_Exp>;
  end_block?: InputMaybe<Int_Comparison_Exp>;
  first_event_block_number?: InputMaybe<Int_Comparison_Exp>;
  is_hyper_sync?: InputMaybe<Boolean_Comparison_Exp>;
  latest_fetched_block_number?: InputMaybe<Int_Comparison_Exp>;
  latest_processed_block?: InputMaybe<Int_Comparison_Exp>;
  num_batches_fetched?: InputMaybe<Int_Comparison_Exp>;
  num_events_processed?: InputMaybe<Int_Comparison_Exp>;
  start_block?: InputMaybe<Int_Comparison_Exp>;
  timestamp_caught_up_to_head_or_endblock?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** Ordering options when selecting data from "chain_metadata". */
export type Chain_Metadata_Order_By = {
  block_height?: InputMaybe<Order_By>;
  chain_id?: InputMaybe<Order_By>;
  end_block?: InputMaybe<Order_By>;
  first_event_block_number?: InputMaybe<Order_By>;
  is_hyper_sync?: InputMaybe<Order_By>;
  latest_fetched_block_number?: InputMaybe<Order_By>;
  latest_processed_block?: InputMaybe<Order_By>;
  num_batches_fetched?: InputMaybe<Order_By>;
  num_events_processed?: InputMaybe<Order_By>;
  start_block?: InputMaybe<Order_By>;
  timestamp_caught_up_to_head_or_endblock?: InputMaybe<Order_By>;
};

/** select columns of table "chain_metadata" */
export enum Chain_Metadata_Select_Column {
  /** column name */
  BlockHeight = 'block_height',
  /** column name */
  ChainId = 'chain_id',
  /** column name */
  EndBlock = 'end_block',
  /** column name */
  FirstEventBlockNumber = 'first_event_block_number',
  /** column name */
  IsHyperSync = 'is_hyper_sync',
  /** column name */
  LatestFetchedBlockNumber = 'latest_fetched_block_number',
  /** column name */
  LatestProcessedBlock = 'latest_processed_block',
  /** column name */
  NumBatchesFetched = 'num_batches_fetched',
  /** column name */
  NumEventsProcessed = 'num_events_processed',
  /** column name */
  StartBlock = 'start_block',
  /** column name */
  TimestampCaughtUpToHeadOrEndblock = 'timestamp_caught_up_to_head_or_endblock'
}

/** Streaming cursor of the table "chain_metadata" */
export type Chain_Metadata_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Chain_Metadata_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Chain_Metadata_Stream_Cursor_Value_Input = {
  block_height?: InputMaybe<Scalars['Int']['input']>;
  chain_id?: InputMaybe<Scalars['Int']['input']>;
  end_block?: InputMaybe<Scalars['Int']['input']>;
  first_event_block_number?: InputMaybe<Scalars['Int']['input']>;
  is_hyper_sync?: InputMaybe<Scalars['Boolean']['input']>;
  latest_fetched_block_number?: InputMaybe<Scalars['Int']['input']>;
  latest_processed_block?: InputMaybe<Scalars['Int']['input']>;
  num_batches_fetched?: InputMaybe<Scalars['Int']['input']>;
  num_events_processed?: InputMaybe<Scalars['Int']['input']>;
  start_block?: InputMaybe<Scalars['Int']['input']>;
  timestamp_caught_up_to_head_or_endblock?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** ordering argument of a cursor */
export enum Cursor_Ordering {
  /** ascending ordering of the cursor */
  Asc = 'ASC',
  /** descending ordering of the cursor */
  Desc = 'DESC'
}

export type Jsonb_Cast_Exp = {
  String?: InputMaybe<String_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  _cast?: InputMaybe<Jsonb_Cast_Exp>;
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars['jsonb']['input']>;
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars['jsonb']['input']>;
  _eq?: InputMaybe<Scalars['jsonb']['input']>;
  _gt?: InputMaybe<Scalars['jsonb']['input']>;
  _gte?: InputMaybe<Scalars['jsonb']['input']>;
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars['String']['input']>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars['String']['input']>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars['String']['input']>>;
  _in?: InputMaybe<Array<Scalars['jsonb']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['jsonb']['input']>;
  _lte?: InputMaybe<Scalars['jsonb']['input']>;
  _neq?: InputMaybe<Scalars['jsonb']['input']>;
  _nin?: InputMaybe<Array<Scalars['jsonb']['input']>>;
};

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export type Numeric_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['numeric']['input']>;
  _gt?: InputMaybe<Scalars['numeric']['input']>;
  _gte?: InputMaybe<Scalars['numeric']['input']>;
  _in?: InputMaybe<Array<Scalars['numeric']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['numeric']['input']>;
  _lte?: InputMaybe<Scalars['numeric']['input']>;
  _neq?: InputMaybe<Scalars['numeric']['input']>;
  _nin?: InputMaybe<Array<Scalars['numeric']['input']>>;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "Envelope" */
  Envelope: Array<Envelope>;
  /** fetch data from the table: "Envelope" using primary key columns */
  Envelope_by_pk?: Maybe<Envelope>;
  /** fetch data from the table: "FairLaunch" */
  FairLaunch: Array<FairLaunch>;
  /** fetch data from the table: "FairLaunch" using primary key columns */
  FairLaunch_by_pk?: Maybe<FairLaunch>;
  /** fetch data from the table: "ManagerDeployed" */
  ManagerDeployed: Array<ManagerDeployed>;
  /** fetch data from the table: "ManagerDeployed" using primary key columns */
  ManagerDeployed_by_pk?: Maybe<ManagerDeployed>;
  /** fetch data from the table: "MemecoinHolder" */
  MemecoinHolder: Array<MemecoinHolder>;
  /** fetch data from the table: "MemecoinHolder" using primary key columns */
  MemecoinHolder_by_pk?: Maybe<MemecoinHolder>;
  /** fetch data from the table: "MemecoinMetadata" */
  MemecoinMetadata: Array<MemecoinMetadata>;
  /** fetch data from the table: "MemecoinMetadata" using primary key columns */
  MemecoinMetadata_by_pk?: Maybe<MemecoinMetadata>;
  /** fetch data from the table: "PoolCreated" */
  PoolCreated: Array<PoolCreated>;
  /** fetch data from the table: "PoolCreated" using primary key columns */
  PoolCreated_by_pk?: Maybe<PoolCreated>;
  /** fetch data from the table: "PoolSwap" */
  PoolSwap: Array<PoolSwap>;
  /** fetch data from the table: "PoolSwap" using primary key columns */
  PoolSwap_by_pk?: Maybe<PoolSwap>;
  /** fetch data from the table: "StakingManagerToken" */
  StakingManagerToken: Array<StakingManagerToken>;
  /** fetch data from the table: "StakingManagerToken" using primary key columns */
  StakingManagerToken_by_pk?: Maybe<StakingManagerToken>;
  /** fetch data from the table: "StakingSummary" */
  StakingSummary: Array<StakingSummary>;
  /** fetch data from the table: "StakingSummary" using primary key columns */
  StakingSummary_by_pk?: Maybe<StakingSummary>;
  /** fetch data from the table: "TokenOwner" */
  TokenOwner: Array<TokenOwner>;
  /** fetch data from the table: "TokenOwner" using primary key columns */
  TokenOwner_by_pk?: Maybe<TokenOwner>;
  /** fetch data from the table: "TradeVolume" */
  TradeVolume: Array<TradeVolume>;
  /** fetch data from the table: "TradeVolume" using primary key columns */
  TradeVolume_by_pk?: Maybe<TradeVolume>;
  /** fetch data from the table: "TreasuryEscrowed" */
  TreasuryEscrowed: Array<TreasuryEscrowed>;
  /** fetch data from the table: "TreasuryEscrowed" using primary key columns */
  TreasuryEscrowed_by_pk?: Maybe<TreasuryEscrowed>;
  /** fetch data from the table: "TreasuryReclaimed" */
  TreasuryReclaimed: Array<TreasuryReclaimed>;
  /** fetch data from the table: "TreasuryReclaimed" using primary key columns */
  TreasuryReclaimed_by_pk?: Maybe<TreasuryReclaimed>;
  /** fetch data from the table: "_meta" */
  _meta: Array<_Meta>;
  /** fetch data from the table: "chain_metadata" */
  chain_metadata: Array<Chain_Metadata>;
  /** fetch data from the table: "raw_events" */
  raw_events: Array<Raw_Events>;
  /** fetch data from the table: "raw_events" using primary key columns */
  raw_events_by_pk?: Maybe<Raw_Events>;
};


export type Query_RootEnvelopeArgs = {
  distinct_on?: InputMaybe<Array<Envelope_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Envelope_Order_By>>;
  where?: InputMaybe<Envelope_Bool_Exp>;
};


export type Query_RootEnvelope_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootFairLaunchArgs = {
  distinct_on?: InputMaybe<Array<FairLaunch_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FairLaunch_Order_By>>;
  where?: InputMaybe<FairLaunch_Bool_Exp>;
};


export type Query_RootFairLaunch_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootManagerDeployedArgs = {
  distinct_on?: InputMaybe<Array<ManagerDeployed_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ManagerDeployed_Order_By>>;
  where?: InputMaybe<ManagerDeployed_Bool_Exp>;
};


export type Query_RootManagerDeployed_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootMemecoinHolderArgs = {
  distinct_on?: InputMaybe<Array<MemecoinHolder_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<MemecoinHolder_Order_By>>;
  where?: InputMaybe<MemecoinHolder_Bool_Exp>;
};


export type Query_RootMemecoinHolder_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootMemecoinMetadataArgs = {
  distinct_on?: InputMaybe<Array<MemecoinMetadata_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<MemecoinMetadata_Order_By>>;
  where?: InputMaybe<MemecoinMetadata_Bool_Exp>;
};


export type Query_RootMemecoinMetadata_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootPoolCreatedArgs = {
  distinct_on?: InputMaybe<Array<PoolCreated_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PoolCreated_Order_By>>;
  where?: InputMaybe<PoolCreated_Bool_Exp>;
};


export type Query_RootPoolCreated_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootPoolSwapArgs = {
  distinct_on?: InputMaybe<Array<PoolSwap_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PoolSwap_Order_By>>;
  where?: InputMaybe<PoolSwap_Bool_Exp>;
};


export type Query_RootPoolSwap_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootStakingManagerTokenArgs = {
  distinct_on?: InputMaybe<Array<StakingManagerToken_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<StakingManagerToken_Order_By>>;
  where?: InputMaybe<StakingManagerToken_Bool_Exp>;
};


export type Query_RootStakingManagerToken_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootStakingSummaryArgs = {
  distinct_on?: InputMaybe<Array<StakingSummary_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<StakingSummary_Order_By>>;
  where?: InputMaybe<StakingSummary_Bool_Exp>;
};


export type Query_RootStakingSummary_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootTokenOwnerArgs = {
  distinct_on?: InputMaybe<Array<TokenOwner_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TokenOwner_Order_By>>;
  where?: InputMaybe<TokenOwner_Bool_Exp>;
};


export type Query_RootTokenOwner_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootTradeVolumeArgs = {
  distinct_on?: InputMaybe<Array<TradeVolume_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TradeVolume_Order_By>>;
  where?: InputMaybe<TradeVolume_Bool_Exp>;
};


export type Query_RootTradeVolume_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootTreasuryEscrowedArgs = {
  distinct_on?: InputMaybe<Array<TreasuryEscrowed_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TreasuryEscrowed_Order_By>>;
  where?: InputMaybe<TreasuryEscrowed_Bool_Exp>;
};


export type Query_RootTreasuryEscrowed_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootTreasuryReclaimedArgs = {
  distinct_on?: InputMaybe<Array<TreasuryReclaimed_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TreasuryReclaimed_Order_By>>;
  where?: InputMaybe<TreasuryReclaimed_Bool_Exp>;
};


export type Query_RootTreasuryReclaimed_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_Root_MetaArgs = {
  distinct_on?: InputMaybe<Array<_Meta_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<_Meta_Order_By>>;
  where?: InputMaybe<_Meta_Bool_Exp>;
};


export type Query_RootChain_MetadataArgs = {
  distinct_on?: InputMaybe<Array<Chain_Metadata_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Chain_Metadata_Order_By>>;
  where?: InputMaybe<Chain_Metadata_Bool_Exp>;
};


export type Query_RootRaw_EventsArgs = {
  distinct_on?: InputMaybe<Array<Raw_Events_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Raw_Events_Order_By>>;
  where?: InputMaybe<Raw_Events_Bool_Exp>;
};


export type Query_RootRaw_Events_By_PkArgs = {
  serial: Scalars['Int']['input'];
};

/** columns and relationships of "raw_events" */
export type Raw_Events = {
  __typename?: 'raw_events';
  block_fields: Scalars['jsonb']['output'];
  block_hash: Scalars['String']['output'];
  block_number: Scalars['Int']['output'];
  block_timestamp: Scalars['Int']['output'];
  chain_id: Scalars['Int']['output'];
  contract_name: Scalars['String']['output'];
  event_id: Scalars['numeric']['output'];
  event_name: Scalars['String']['output'];
  log_index: Scalars['Int']['output'];
  params: Scalars['jsonb']['output'];
  serial: Scalars['Int']['output'];
  src_address: Scalars['String']['output'];
  transaction_fields: Scalars['jsonb']['output'];
};


/** columns and relationships of "raw_events" */
export type Raw_EventsBlock_FieldsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "raw_events" */
export type Raw_EventsParamsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "raw_events" */
export type Raw_EventsTransaction_FieldsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** Boolean expression to filter rows from the table "raw_events". All fields are combined with a logical 'AND'. */
export type Raw_Events_Bool_Exp = {
  _and?: InputMaybe<Array<Raw_Events_Bool_Exp>>;
  _not?: InputMaybe<Raw_Events_Bool_Exp>;
  _or?: InputMaybe<Array<Raw_Events_Bool_Exp>>;
  block_fields?: InputMaybe<Jsonb_Comparison_Exp>;
  block_hash?: InputMaybe<String_Comparison_Exp>;
  block_number?: InputMaybe<Int_Comparison_Exp>;
  block_timestamp?: InputMaybe<Int_Comparison_Exp>;
  chain_id?: InputMaybe<Int_Comparison_Exp>;
  contract_name?: InputMaybe<String_Comparison_Exp>;
  event_id?: InputMaybe<Numeric_Comparison_Exp>;
  event_name?: InputMaybe<String_Comparison_Exp>;
  log_index?: InputMaybe<Int_Comparison_Exp>;
  params?: InputMaybe<Jsonb_Comparison_Exp>;
  serial?: InputMaybe<Int_Comparison_Exp>;
  src_address?: InputMaybe<String_Comparison_Exp>;
  transaction_fields?: InputMaybe<Jsonb_Comparison_Exp>;
};

/** Ordering options when selecting data from "raw_events". */
export type Raw_Events_Order_By = {
  block_fields?: InputMaybe<Order_By>;
  block_hash?: InputMaybe<Order_By>;
  block_number?: InputMaybe<Order_By>;
  block_timestamp?: InputMaybe<Order_By>;
  chain_id?: InputMaybe<Order_By>;
  contract_name?: InputMaybe<Order_By>;
  event_id?: InputMaybe<Order_By>;
  event_name?: InputMaybe<Order_By>;
  log_index?: InputMaybe<Order_By>;
  params?: InputMaybe<Order_By>;
  serial?: InputMaybe<Order_By>;
  src_address?: InputMaybe<Order_By>;
  transaction_fields?: InputMaybe<Order_By>;
};

/** select columns of table "raw_events" */
export enum Raw_Events_Select_Column {
  /** column name */
  BlockFields = 'block_fields',
  /** column name */
  BlockHash = 'block_hash',
  /** column name */
  BlockNumber = 'block_number',
  /** column name */
  BlockTimestamp = 'block_timestamp',
  /** column name */
  ChainId = 'chain_id',
  /** column name */
  ContractName = 'contract_name',
  /** column name */
  EventId = 'event_id',
  /** column name */
  EventName = 'event_name',
  /** column name */
  LogIndex = 'log_index',
  /** column name */
  Params = 'params',
  /** column name */
  Serial = 'serial',
  /** column name */
  SrcAddress = 'src_address',
  /** column name */
  TransactionFields = 'transaction_fields'
}

/** Streaming cursor of the table "raw_events" */
export type Raw_Events_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Raw_Events_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Raw_Events_Stream_Cursor_Value_Input = {
  block_fields?: InputMaybe<Scalars['jsonb']['input']>;
  block_hash?: InputMaybe<Scalars['String']['input']>;
  block_number?: InputMaybe<Scalars['Int']['input']>;
  block_timestamp?: InputMaybe<Scalars['Int']['input']>;
  chain_id?: InputMaybe<Scalars['Int']['input']>;
  contract_name?: InputMaybe<Scalars['String']['input']>;
  event_id?: InputMaybe<Scalars['numeric']['input']>;
  event_name?: InputMaybe<Scalars['String']['input']>;
  log_index?: InputMaybe<Scalars['Int']['input']>;
  params?: InputMaybe<Scalars['jsonb']['input']>;
  serial?: InputMaybe<Scalars['Int']['input']>;
  src_address?: InputMaybe<Scalars['String']['input']>;
  transaction_fields?: InputMaybe<Scalars['jsonb']['input']>;
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "Envelope" */
  Envelope: Array<Envelope>;
  /** fetch data from the table: "Envelope" using primary key columns */
  Envelope_by_pk?: Maybe<Envelope>;
  /** fetch data from the table in a streaming manner: "Envelope" */
  Envelope_stream: Array<Envelope>;
  /** fetch data from the table: "FairLaunch" */
  FairLaunch: Array<FairLaunch>;
  /** fetch data from the table: "FairLaunch" using primary key columns */
  FairLaunch_by_pk?: Maybe<FairLaunch>;
  /** fetch data from the table in a streaming manner: "FairLaunch" */
  FairLaunch_stream: Array<FairLaunch>;
  /** fetch data from the table: "ManagerDeployed" */
  ManagerDeployed: Array<ManagerDeployed>;
  /** fetch data from the table: "ManagerDeployed" using primary key columns */
  ManagerDeployed_by_pk?: Maybe<ManagerDeployed>;
  /** fetch data from the table in a streaming manner: "ManagerDeployed" */
  ManagerDeployed_stream: Array<ManagerDeployed>;
  /** fetch data from the table: "MemecoinHolder" */
  MemecoinHolder: Array<MemecoinHolder>;
  /** fetch data from the table: "MemecoinHolder" using primary key columns */
  MemecoinHolder_by_pk?: Maybe<MemecoinHolder>;
  /** fetch data from the table in a streaming manner: "MemecoinHolder" */
  MemecoinHolder_stream: Array<MemecoinHolder>;
  /** fetch data from the table: "MemecoinMetadata" */
  MemecoinMetadata: Array<MemecoinMetadata>;
  /** fetch data from the table: "MemecoinMetadata" using primary key columns */
  MemecoinMetadata_by_pk?: Maybe<MemecoinMetadata>;
  /** fetch data from the table in a streaming manner: "MemecoinMetadata" */
  MemecoinMetadata_stream: Array<MemecoinMetadata>;
  /** fetch data from the table: "PoolCreated" */
  PoolCreated: Array<PoolCreated>;
  /** fetch data from the table: "PoolCreated" using primary key columns */
  PoolCreated_by_pk?: Maybe<PoolCreated>;
  /** fetch data from the table in a streaming manner: "PoolCreated" */
  PoolCreated_stream: Array<PoolCreated>;
  /** fetch data from the table: "PoolSwap" */
  PoolSwap: Array<PoolSwap>;
  /** fetch data from the table: "PoolSwap" using primary key columns */
  PoolSwap_by_pk?: Maybe<PoolSwap>;
  /** fetch data from the table in a streaming manner: "PoolSwap" */
  PoolSwap_stream: Array<PoolSwap>;
  /** fetch data from the table: "StakingManagerToken" */
  StakingManagerToken: Array<StakingManagerToken>;
  /** fetch data from the table: "StakingManagerToken" using primary key columns */
  StakingManagerToken_by_pk?: Maybe<StakingManagerToken>;
  /** fetch data from the table in a streaming manner: "StakingManagerToken" */
  StakingManagerToken_stream: Array<StakingManagerToken>;
  /** fetch data from the table: "StakingSummary" */
  StakingSummary: Array<StakingSummary>;
  /** fetch data from the table: "StakingSummary" using primary key columns */
  StakingSummary_by_pk?: Maybe<StakingSummary>;
  /** fetch data from the table in a streaming manner: "StakingSummary" */
  StakingSummary_stream: Array<StakingSummary>;
  /** fetch data from the table: "TokenOwner" */
  TokenOwner: Array<TokenOwner>;
  /** fetch data from the table: "TokenOwner" using primary key columns */
  TokenOwner_by_pk?: Maybe<TokenOwner>;
  /** fetch data from the table in a streaming manner: "TokenOwner" */
  TokenOwner_stream: Array<TokenOwner>;
  /** fetch data from the table: "TradeVolume" */
  TradeVolume: Array<TradeVolume>;
  /** fetch data from the table: "TradeVolume" using primary key columns */
  TradeVolume_by_pk?: Maybe<TradeVolume>;
  /** fetch data from the table in a streaming manner: "TradeVolume" */
  TradeVolume_stream: Array<TradeVolume>;
  /** fetch data from the table: "TreasuryEscrowed" */
  TreasuryEscrowed: Array<TreasuryEscrowed>;
  /** fetch data from the table: "TreasuryEscrowed" using primary key columns */
  TreasuryEscrowed_by_pk?: Maybe<TreasuryEscrowed>;
  /** fetch data from the table in a streaming manner: "TreasuryEscrowed" */
  TreasuryEscrowed_stream: Array<TreasuryEscrowed>;
  /** fetch data from the table: "TreasuryReclaimed" */
  TreasuryReclaimed: Array<TreasuryReclaimed>;
  /** fetch data from the table: "TreasuryReclaimed" using primary key columns */
  TreasuryReclaimed_by_pk?: Maybe<TreasuryReclaimed>;
  /** fetch data from the table in a streaming manner: "TreasuryReclaimed" */
  TreasuryReclaimed_stream: Array<TreasuryReclaimed>;
  /** fetch data from the table: "_meta" */
  _meta: Array<_Meta>;
  /** fetch data from the table in a streaming manner: "_meta" */
  _meta_stream: Array<_Meta>;
  /** fetch data from the table: "chain_metadata" */
  chain_metadata: Array<Chain_Metadata>;
  /** fetch data from the table in a streaming manner: "chain_metadata" */
  chain_metadata_stream: Array<Chain_Metadata>;
  /** fetch data from the table: "raw_events" */
  raw_events: Array<Raw_Events>;
  /** fetch data from the table: "raw_events" using primary key columns */
  raw_events_by_pk?: Maybe<Raw_Events>;
  /** fetch data from the table in a streaming manner: "raw_events" */
  raw_events_stream: Array<Raw_Events>;
};


export type Subscription_RootEnvelopeArgs = {
  distinct_on?: InputMaybe<Array<Envelope_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Envelope_Order_By>>;
  where?: InputMaybe<Envelope_Bool_Exp>;
};


export type Subscription_RootEnvelope_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootEnvelope_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Envelope_Stream_Cursor_Input>>;
  where?: InputMaybe<Envelope_Bool_Exp>;
};


export type Subscription_RootFairLaunchArgs = {
  distinct_on?: InputMaybe<Array<FairLaunch_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FairLaunch_Order_By>>;
  where?: InputMaybe<FairLaunch_Bool_Exp>;
};


export type Subscription_RootFairLaunch_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootFairLaunch_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<FairLaunch_Stream_Cursor_Input>>;
  where?: InputMaybe<FairLaunch_Bool_Exp>;
};


export type Subscription_RootManagerDeployedArgs = {
  distinct_on?: InputMaybe<Array<ManagerDeployed_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ManagerDeployed_Order_By>>;
  where?: InputMaybe<ManagerDeployed_Bool_Exp>;
};


export type Subscription_RootManagerDeployed_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootManagerDeployed_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<ManagerDeployed_Stream_Cursor_Input>>;
  where?: InputMaybe<ManagerDeployed_Bool_Exp>;
};


export type Subscription_RootMemecoinHolderArgs = {
  distinct_on?: InputMaybe<Array<MemecoinHolder_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<MemecoinHolder_Order_By>>;
  where?: InputMaybe<MemecoinHolder_Bool_Exp>;
};


export type Subscription_RootMemecoinHolder_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootMemecoinHolder_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<MemecoinHolder_Stream_Cursor_Input>>;
  where?: InputMaybe<MemecoinHolder_Bool_Exp>;
};


export type Subscription_RootMemecoinMetadataArgs = {
  distinct_on?: InputMaybe<Array<MemecoinMetadata_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<MemecoinMetadata_Order_By>>;
  where?: InputMaybe<MemecoinMetadata_Bool_Exp>;
};


export type Subscription_RootMemecoinMetadata_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootMemecoinMetadata_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<MemecoinMetadata_Stream_Cursor_Input>>;
  where?: InputMaybe<MemecoinMetadata_Bool_Exp>;
};


export type Subscription_RootPoolCreatedArgs = {
  distinct_on?: InputMaybe<Array<PoolCreated_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PoolCreated_Order_By>>;
  where?: InputMaybe<PoolCreated_Bool_Exp>;
};


export type Subscription_RootPoolCreated_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootPoolCreated_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PoolCreated_Stream_Cursor_Input>>;
  where?: InputMaybe<PoolCreated_Bool_Exp>;
};


export type Subscription_RootPoolSwapArgs = {
  distinct_on?: InputMaybe<Array<PoolSwap_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PoolSwap_Order_By>>;
  where?: InputMaybe<PoolSwap_Bool_Exp>;
};


export type Subscription_RootPoolSwap_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootPoolSwap_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PoolSwap_Stream_Cursor_Input>>;
  where?: InputMaybe<PoolSwap_Bool_Exp>;
};


export type Subscription_RootStakingManagerTokenArgs = {
  distinct_on?: InputMaybe<Array<StakingManagerToken_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<StakingManagerToken_Order_By>>;
  where?: InputMaybe<StakingManagerToken_Bool_Exp>;
};


export type Subscription_RootStakingManagerToken_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootStakingManagerToken_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<StakingManagerToken_Stream_Cursor_Input>>;
  where?: InputMaybe<StakingManagerToken_Bool_Exp>;
};


export type Subscription_RootStakingSummaryArgs = {
  distinct_on?: InputMaybe<Array<StakingSummary_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<StakingSummary_Order_By>>;
  where?: InputMaybe<StakingSummary_Bool_Exp>;
};


export type Subscription_RootStakingSummary_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootStakingSummary_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<StakingSummary_Stream_Cursor_Input>>;
  where?: InputMaybe<StakingSummary_Bool_Exp>;
};


export type Subscription_RootTokenOwnerArgs = {
  distinct_on?: InputMaybe<Array<TokenOwner_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TokenOwner_Order_By>>;
  where?: InputMaybe<TokenOwner_Bool_Exp>;
};


export type Subscription_RootTokenOwner_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootTokenOwner_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<TokenOwner_Stream_Cursor_Input>>;
  where?: InputMaybe<TokenOwner_Bool_Exp>;
};


export type Subscription_RootTradeVolumeArgs = {
  distinct_on?: InputMaybe<Array<TradeVolume_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TradeVolume_Order_By>>;
  where?: InputMaybe<TradeVolume_Bool_Exp>;
};


export type Subscription_RootTradeVolume_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootTradeVolume_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<TradeVolume_Stream_Cursor_Input>>;
  where?: InputMaybe<TradeVolume_Bool_Exp>;
};


export type Subscription_RootTreasuryEscrowedArgs = {
  distinct_on?: InputMaybe<Array<TreasuryEscrowed_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TreasuryEscrowed_Order_By>>;
  where?: InputMaybe<TreasuryEscrowed_Bool_Exp>;
};


export type Subscription_RootTreasuryEscrowed_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootTreasuryEscrowed_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<TreasuryEscrowed_Stream_Cursor_Input>>;
  where?: InputMaybe<TreasuryEscrowed_Bool_Exp>;
};


export type Subscription_RootTreasuryReclaimedArgs = {
  distinct_on?: InputMaybe<Array<TreasuryReclaimed_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TreasuryReclaimed_Order_By>>;
  where?: InputMaybe<TreasuryReclaimed_Bool_Exp>;
};


export type Subscription_RootTreasuryReclaimed_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootTreasuryReclaimed_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<TreasuryReclaimed_Stream_Cursor_Input>>;
  where?: InputMaybe<TreasuryReclaimed_Bool_Exp>;
};


export type Subscription_Root_MetaArgs = {
  distinct_on?: InputMaybe<Array<_Meta_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<_Meta_Order_By>>;
  where?: InputMaybe<_Meta_Bool_Exp>;
};


export type Subscription_Root_Meta_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<_Meta_Stream_Cursor_Input>>;
  where?: InputMaybe<_Meta_Bool_Exp>;
};


export type Subscription_RootChain_MetadataArgs = {
  distinct_on?: InputMaybe<Array<Chain_Metadata_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Chain_Metadata_Order_By>>;
  where?: InputMaybe<Chain_Metadata_Bool_Exp>;
};


export type Subscription_RootChain_Metadata_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Chain_Metadata_Stream_Cursor_Input>>;
  where?: InputMaybe<Chain_Metadata_Bool_Exp>;
};


export type Subscription_RootRaw_EventsArgs = {
  distinct_on?: InputMaybe<Array<Raw_Events_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Raw_Events_Order_By>>;
  where?: InputMaybe<Raw_Events_Bool_Exp>;
};


export type Subscription_RootRaw_Events_By_PkArgs = {
  serial: Scalars['Int']['input'];
};


export type Subscription_RootRaw_Events_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Raw_Events_Stream_Cursor_Input>>;
  where?: InputMaybe<Raw_Events_Bool_Exp>;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']['input']>;
  _gt?: InputMaybe<Scalars['timestamptz']['input']>;
  _gte?: InputMaybe<Scalars['timestamptz']['input']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['timestamptz']['input']>;
  _lte?: InputMaybe<Scalars['timestamptz']['input']>;
  _neq?: InputMaybe<Scalars['timestamptz']['input']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
};

export type TokenOwnerQueryVariables = Exact<{
  where?: InputMaybe<TokenOwner_Bool_Exp>;
}>;


export type TokenOwnerQuery = { __typename: 'query_root', TokenOwner: Array<{ __typename: 'TokenOwner', id: string, tokenId: any }> };


export const TokenOwnerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TokenOwner"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TokenOwner_bool_exp"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"TokenOwner"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tokenId"}}]}}]}}]} as unknown as DocumentNode<TokenOwnerQuery, TokenOwnerQueryVariables>;