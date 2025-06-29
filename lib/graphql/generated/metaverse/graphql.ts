 
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
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: { input: any; output: any; }
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: { input: any; output: any; }
};

export type Order = {
  __typename?: 'Order';
  /** The highest bid amount (for auctions). */
  bidAmount?: Maybe<Scalars['String']['output']>;
  /** The highest bidder (for auctions). */
  bidder?: Maybe<Scalars['String']['output']>;
  /** The LemonadeMarketplace contract address. */
  contract: Scalars['String']['output'];
  /** When this order was created. */
  createdAt: Scalars['DateTime']['output'];
  /** The ERC20 token the maker wants to be paid in. */
  currency?: Maybe<OrderCurrency>;
  id: Scalars['String']['output'];
  /** Is `AUCTION` for auctions and `DIRECT` for direct sales. */
  kind: OrderKind;
  /** The maker (seller). */
  maker: Scalars['String']['output'];
  makerExpanded?: Maybe<User>;
  network: Scalars['String']['output'];
  /** Indicates whether this order is fillable given that the opening and closing time constraints are met. So this order is fillable if `open` and `openFrom is 0 or now >= openFrom` and `openTo is 0 or now < openTo`. */
  open: Scalars['Boolean']['output'];
  /** The opening (Epoch) time in UTC. */
  openFrom?: Maybe<Scalars['DateTime']['output']>;
  /** The closing (Epoch) time in UTC. */
  openTo?: Maybe<Scalars['DateTime']['output']>;
  /** The LemonadeMarketplace order ID. */
  orderId: Scalars['String']['output'];
  /** The paid amount. */
  paidAmount?: Maybe<Scalars['String']['output']>;
  /** The (minimum) price or amount of ERC20 tokens the maker wants to be paid. */
  price: Scalars['String']['output'];
  /** The taker (buyer). */
  taker?: Maybe<Scalars['String']['output']>;
  /** When this order was last updated. */
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type OrderComplex = {
  __typename?: 'OrderComplex';
  /** The highest bid amount (for auctions). */
  bidAmount?: Maybe<Scalars['String']['output']>;
  /** The highest bidder (for auctions). */
  bidder?: Maybe<Scalars['String']['output']>;
  /** The LemonadeMarketplace contract address. */
  contract: Scalars['String']['output'];
  /** When this order was created. */
  createdAt: Scalars['DateTime']['output'];
  /** The ERC20 token the maker wants to be paid in. */
  currency?: Maybe<OrderCurrency>;
  id: Scalars['String']['output'];
  /** Is `AUCTION` for auctions and `DIRECT` for direct sales. */
  kind: OrderKind;
  /** The maker (seller). */
  maker: Scalars['String']['output'];
  makerExpanded?: Maybe<User>;
  network: Scalars['String']['output'];
  /** Indicates whether this order is fillable given that the opening and closing time constraints are met. So this order is fillable if `open` and `openFrom is 0 or now >= openFrom` and `openTo is 0 or now < openTo`. */
  open: Scalars['Boolean']['output'];
  /** The opening (Epoch) time in UTC. */
  openFrom?: Maybe<Scalars['DateTime']['output']>;
  /** The closing (Epoch) time in UTC. */
  openTo?: Maybe<Scalars['DateTime']['output']>;
  /** The LemonadeMarketplace order ID. */
  orderId: Scalars['String']['output'];
  /** The paid amount. */
  paidAmount?: Maybe<Scalars['String']['output']>;
  /** The (minimum) price or amount of ERC20 tokens the maker wants to be paid. */
  price: Scalars['String']['output'];
  /** The taker (buyer). */
  taker?: Maybe<Scalars['String']['output']>;
  /** The ERC721 token. */
  token: TokenSimple;
  /** When this order was last updated. */
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type OrderCurrency = {
  __typename?: 'OrderCurrency';
  id: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  symbol?: Maybe<Scalars['String']['output']>;
};

export type OrderCurrencyWhere = {
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  name_eq?: InputMaybe<Scalars['String']['input']>;
  name_exists?: InputMaybe<Scalars['Boolean']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  symbol_eq?: InputMaybe<Scalars['String']['input']>;
  symbol_exists?: InputMaybe<Scalars['Boolean']['input']>;
  symbol_gt?: InputMaybe<Scalars['String']['input']>;
  symbol_gte?: InputMaybe<Scalars['String']['input']>;
  symbol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_lt?: InputMaybe<Scalars['String']['input']>;
  symbol_lte?: InputMaybe<Scalars['String']['input']>;
};

export enum OrderKind {
  Auction = 'AUCTION',
  Direct = 'DIRECT'
}

export type OrderSimple = {
  __typename?: 'OrderSimple';
  /** The highest bid amount (for auctions). */
  bidAmount?: Maybe<Scalars['String']['output']>;
  /** The highest bidder (for auctions). */
  bidder?: Maybe<Scalars['String']['output']>;
  /** The LemonadeMarketplace contract address. */
  contract: Scalars['String']['output'];
  /** When this order was created. */
  createdAt: Scalars['DateTime']['output'];
  /** The ERC20 token the maker wants to be paid in. */
  currency?: Maybe<OrderCurrency>;
  id: Scalars['String']['output'];
  /** Is `AUCTION` for auctions and `DIRECT` for direct sales. */
  kind: OrderKind;
  /** The maker (seller). */
  maker: Scalars['String']['output'];
  makerExpanded?: Maybe<User>;
  network: Scalars['String']['output'];
  /** Indicates whether this order is fillable given that the opening and closing time constraints are met. So this order is fillable if `open` and `openFrom is 0 or now >= openFrom` and `openTo is 0 or now < openTo`. */
  open: Scalars['Boolean']['output'];
  /** The opening (Epoch) time in UTC. */
  openFrom?: Maybe<Scalars['DateTime']['output']>;
  /** The closing (Epoch) time in UTC. */
  openTo?: Maybe<Scalars['DateTime']['output']>;
  /** The LemonadeMarketplace order ID. */
  orderId: Scalars['String']['output'];
  /** The paid amount. */
  paidAmount?: Maybe<Scalars['String']['output']>;
  /** The (minimum) price or amount of ERC20 tokens the maker wants to be paid. */
  price: Scalars['String']['output'];
  /** The taker (buyer). */
  taker?: Maybe<Scalars['String']['output']>;
  /** The ERC721 token. */
  token: Scalars['String']['output'];
  /** When this order was last updated. */
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type OrderSort = {
  by: OrderSortBy;
  direction?: InputMaybe<SortDirection>;
};

export enum OrderSortBy {
  BidAmount = 'bidAmount',
  Bidder = 'bidder',
  Contract = 'contract',
  CreatedAt = 'createdAt',
  Currency = 'currency',
  Id = 'id',
  Kind = 'kind',
  Maker = 'maker',
  Network = 'network',
  Open = 'open',
  OpenFrom = 'openFrom',
  OpenTo = 'openTo',
  OrderId = 'orderId',
  PaidAmount = 'paidAmount',
  Price = 'price',
  Taker = 'taker',
  UpdatedAt = 'updatedAt'
}

export type OrderWhere = {
  /** The highest bid amount (for auctions). */
  bidAmount_eq?: InputMaybe<Scalars['String']['input']>;
  /** The highest bid amount (for auctions). */
  bidAmount_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The highest bid amount (for auctions). */
  bidAmount_gt?: InputMaybe<Scalars['String']['input']>;
  /** The highest bid amount (for auctions). */
  bidAmount_gte?: InputMaybe<Scalars['String']['input']>;
  /** The highest bid amount (for auctions). */
  bidAmount_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The highest bid amount (for auctions). */
  bidAmount_lt?: InputMaybe<Scalars['String']['input']>;
  /** The highest bid amount (for auctions). */
  bidAmount_lte?: InputMaybe<Scalars['String']['input']>;
  /** The highest bidder (for auctions). */
  bidder_eq?: InputMaybe<Scalars['String']['input']>;
  /** The highest bidder (for auctions). */
  bidder_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The highest bidder (for auctions). */
  bidder_gt?: InputMaybe<Scalars['String']['input']>;
  /** The highest bidder (for auctions). */
  bidder_gte?: InputMaybe<Scalars['String']['input']>;
  /** The highest bidder (for auctions). */
  bidder_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The highest bidder (for auctions). */
  bidder_lt?: InputMaybe<Scalars['String']['input']>;
  /** The highest bidder (for auctions). */
  bidder_lte?: InputMaybe<Scalars['String']['input']>;
  /** The LemonadeMarketplace contract address. */
  contract_eq?: InputMaybe<Scalars['String']['input']>;
  /** The LemonadeMarketplace contract address. */
  contract_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The LemonadeMarketplace contract address. */
  contract_gt?: InputMaybe<Scalars['String']['input']>;
  /** The LemonadeMarketplace contract address. */
  contract_gte?: InputMaybe<Scalars['String']['input']>;
  /** The LemonadeMarketplace contract address. */
  contract_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The LemonadeMarketplace contract address. */
  contract_lt?: InputMaybe<Scalars['String']['input']>;
  /** The LemonadeMarketplace contract address. */
  contract_lte?: InputMaybe<Scalars['String']['input']>;
  /** When this order was created. */
  createdAt_eq?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this order was created. */
  createdAt_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** When this order was created. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this order was created. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this order was created. */
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  /** When this order was created. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this order was created. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
  currency?: InputMaybe<OrderCurrencyWhere>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  /** Is `AUCTION` for auctions and `DIRECT` for direct sales. */
  kind_eq?: InputMaybe<OrderKind>;
  /** Is `AUCTION` for auctions and `DIRECT` for direct sales. */
  kind_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** Is `AUCTION` for auctions and `DIRECT` for direct sales. */
  kind_gt?: InputMaybe<OrderKind>;
  /** Is `AUCTION` for auctions and `DIRECT` for direct sales. */
  kind_gte?: InputMaybe<OrderKind>;
  /** Is `AUCTION` for auctions and `DIRECT` for direct sales. */
  kind_in?: InputMaybe<Array<OrderKind>>;
  /** Is `AUCTION` for auctions and `DIRECT` for direct sales. */
  kind_lt?: InputMaybe<OrderKind>;
  /** Is `AUCTION` for auctions and `DIRECT` for direct sales. */
  kind_lte?: InputMaybe<OrderKind>;
  /** The maker (seller). */
  maker_eq?: InputMaybe<Scalars['String']['input']>;
  /** The maker (seller). */
  maker_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The maker (seller). */
  maker_gt?: InputMaybe<Scalars['String']['input']>;
  /** The maker (seller). */
  maker_gte?: InputMaybe<Scalars['String']['input']>;
  /** The maker (seller). */
  maker_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The maker (seller). */
  maker_lt?: InputMaybe<Scalars['String']['input']>;
  /** The maker (seller). */
  maker_lte?: InputMaybe<Scalars['String']['input']>;
  network_eq?: InputMaybe<Scalars['String']['input']>;
  network_exists?: InputMaybe<Scalars['Boolean']['input']>;
  network_gt?: InputMaybe<Scalars['String']['input']>;
  network_gte?: InputMaybe<Scalars['String']['input']>;
  network_in?: InputMaybe<Array<Scalars['String']['input']>>;
  network_lt?: InputMaybe<Scalars['String']['input']>;
  network_lte?: InputMaybe<Scalars['String']['input']>;
  /** The opening (Epoch) time in UTC. */
  openFrom_eq?: InputMaybe<Scalars['DateTime']['input']>;
  /** The opening (Epoch) time in UTC. */
  openFrom_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The opening (Epoch) time in UTC. */
  openFrom_gt?: InputMaybe<Scalars['DateTime']['input']>;
  /** The opening (Epoch) time in UTC. */
  openFrom_gte?: InputMaybe<Scalars['DateTime']['input']>;
  /** The opening (Epoch) time in UTC. */
  openFrom_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  /** The opening (Epoch) time in UTC. */
  openFrom_lt?: InputMaybe<Scalars['DateTime']['input']>;
  /** The opening (Epoch) time in UTC. */
  openFrom_lte?: InputMaybe<Scalars['DateTime']['input']>;
  /** The closing (Epoch) time in UTC. */
  openTo_eq?: InputMaybe<Scalars['DateTime']['input']>;
  /** The closing (Epoch) time in UTC. */
  openTo_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The closing (Epoch) time in UTC. */
  openTo_gt?: InputMaybe<Scalars['DateTime']['input']>;
  /** The closing (Epoch) time in UTC. */
  openTo_gte?: InputMaybe<Scalars['DateTime']['input']>;
  /** The closing (Epoch) time in UTC. */
  openTo_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  /** The closing (Epoch) time in UTC. */
  openTo_lt?: InputMaybe<Scalars['DateTime']['input']>;
  /** The closing (Epoch) time in UTC. */
  openTo_lte?: InputMaybe<Scalars['DateTime']['input']>;
  /** Indicates whether this order is fillable given that the opening and closing time constraints are met. So this order is fillable if `open` and `openFrom is 0 or now >= openFrom` and `openTo is 0 or now < openTo`. */
  open_eq?: InputMaybe<Scalars['Boolean']['input']>;
  /** Indicates whether this order is fillable given that the opening and closing time constraints are met. So this order is fillable if `open` and `openFrom is 0 or now >= openFrom` and `openTo is 0 or now < openTo`. */
  open_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** Indicates whether this order is fillable given that the opening and closing time constraints are met. So this order is fillable if `open` and `openFrom is 0 or now >= openFrom` and `openTo is 0 or now < openTo`. */
  open_gt?: InputMaybe<Scalars['Boolean']['input']>;
  /** Indicates whether this order is fillable given that the opening and closing time constraints are met. So this order is fillable if `open` and `openFrom is 0 or now >= openFrom` and `openTo is 0 or now < openTo`. */
  open_gte?: InputMaybe<Scalars['Boolean']['input']>;
  /** Indicates whether this order is fillable given that the opening and closing time constraints are met. So this order is fillable if `open` and `openFrom is 0 or now >= openFrom` and `openTo is 0 or now < openTo`. */
  open_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  /** Indicates whether this order is fillable given that the opening and closing time constraints are met. So this order is fillable if `open` and `openFrom is 0 or now >= openFrom` and `openTo is 0 or now < openTo`. */
  open_lt?: InputMaybe<Scalars['Boolean']['input']>;
  /** Indicates whether this order is fillable given that the opening and closing time constraints are met. So this order is fillable if `open` and `openFrom is 0 or now >= openFrom` and `openTo is 0 or now < openTo`. */
  open_lte?: InputMaybe<Scalars['Boolean']['input']>;
  /** The LemonadeMarketplace order ID. */
  orderId_eq?: InputMaybe<Scalars['String']['input']>;
  /** The LemonadeMarketplace order ID. */
  orderId_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The LemonadeMarketplace order ID. */
  orderId_gt?: InputMaybe<Scalars['String']['input']>;
  /** The LemonadeMarketplace order ID. */
  orderId_gte?: InputMaybe<Scalars['String']['input']>;
  /** The LemonadeMarketplace order ID. */
  orderId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The LemonadeMarketplace order ID. */
  orderId_lt?: InputMaybe<Scalars['String']['input']>;
  /** The LemonadeMarketplace order ID. */
  orderId_lte?: InputMaybe<Scalars['String']['input']>;
  /** The paid amount. */
  paidAmount_eq?: InputMaybe<Scalars['String']['input']>;
  /** The paid amount. */
  paidAmount_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The paid amount. */
  paidAmount_gt?: InputMaybe<Scalars['String']['input']>;
  /** The paid amount. */
  paidAmount_gte?: InputMaybe<Scalars['String']['input']>;
  /** The paid amount. */
  paidAmount_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The paid amount. */
  paidAmount_lt?: InputMaybe<Scalars['String']['input']>;
  /** The paid amount. */
  paidAmount_lte?: InputMaybe<Scalars['String']['input']>;
  /** The (minimum) price or amount of ERC20 tokens the maker wants to be paid. */
  price_eq?: InputMaybe<Scalars['String']['input']>;
  /** The (minimum) price or amount of ERC20 tokens the maker wants to be paid. */
  price_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The (minimum) price or amount of ERC20 tokens the maker wants to be paid. */
  price_gt?: InputMaybe<Scalars['String']['input']>;
  /** The (minimum) price or amount of ERC20 tokens the maker wants to be paid. */
  price_gte?: InputMaybe<Scalars['String']['input']>;
  /** The (minimum) price or amount of ERC20 tokens the maker wants to be paid. */
  price_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The (minimum) price or amount of ERC20 tokens the maker wants to be paid. */
  price_lt?: InputMaybe<Scalars['String']['input']>;
  /** The (minimum) price or amount of ERC20 tokens the maker wants to be paid. */
  price_lte?: InputMaybe<Scalars['String']['input']>;
  /** The taker (buyer). */
  taker_eq?: InputMaybe<Scalars['String']['input']>;
  /** The taker (buyer). */
  taker_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The taker (buyer). */
  taker_gt?: InputMaybe<Scalars['String']['input']>;
  /** The taker (buyer). */
  taker_gte?: InputMaybe<Scalars['String']['input']>;
  /** The taker (buyer). */
  taker_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The taker (buyer). */
  taker_lt?: InputMaybe<Scalars['String']['input']>;
  /** The taker (buyer). */
  taker_lte?: InputMaybe<Scalars['String']['input']>;
  /** When this order was last updated. */
  updatedAt_eq?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this order was last updated. */
  updatedAt_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** When this order was last updated. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this order was last updated. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this order was last updated. */
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  /** When this order was last updated. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this order was last updated. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
};

export type OrderWhereComplex = {
  /** The highest bid amount (for auctions). */
  bidAmount_eq?: InputMaybe<Scalars['String']['input']>;
  /** The highest bid amount (for auctions). */
  bidAmount_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The highest bid amount (for auctions). */
  bidAmount_gt?: InputMaybe<Scalars['String']['input']>;
  /** The highest bid amount (for auctions). */
  bidAmount_gte?: InputMaybe<Scalars['String']['input']>;
  /** The highest bid amount (for auctions). */
  bidAmount_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The highest bid amount (for auctions). */
  bidAmount_lt?: InputMaybe<Scalars['String']['input']>;
  /** The highest bid amount (for auctions). */
  bidAmount_lte?: InputMaybe<Scalars['String']['input']>;
  /** The highest bidder (for auctions). */
  bidder_eq?: InputMaybe<Scalars['String']['input']>;
  /** The highest bidder (for auctions). */
  bidder_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The highest bidder (for auctions). */
  bidder_gt?: InputMaybe<Scalars['String']['input']>;
  /** The highest bidder (for auctions). */
  bidder_gte?: InputMaybe<Scalars['String']['input']>;
  /** The highest bidder (for auctions). */
  bidder_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The highest bidder (for auctions). */
  bidder_lt?: InputMaybe<Scalars['String']['input']>;
  /** The highest bidder (for auctions). */
  bidder_lte?: InputMaybe<Scalars['String']['input']>;
  /** The LemonadeMarketplace contract address. */
  contract_eq?: InputMaybe<Scalars['String']['input']>;
  /** The LemonadeMarketplace contract address. */
  contract_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The LemonadeMarketplace contract address. */
  contract_gt?: InputMaybe<Scalars['String']['input']>;
  /** The LemonadeMarketplace contract address. */
  contract_gte?: InputMaybe<Scalars['String']['input']>;
  /** The LemonadeMarketplace contract address. */
  contract_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The LemonadeMarketplace contract address. */
  contract_lt?: InputMaybe<Scalars['String']['input']>;
  /** The LemonadeMarketplace contract address. */
  contract_lte?: InputMaybe<Scalars['String']['input']>;
  /** When this order was created. */
  createdAt_eq?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this order was created. */
  createdAt_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** When this order was created. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this order was created. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this order was created. */
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  /** When this order was created. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this order was created. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
  currency?: InputMaybe<OrderCurrencyWhere>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  /** Is `AUCTION` for auctions and `DIRECT` for direct sales. */
  kind_eq?: InputMaybe<OrderKind>;
  /** Is `AUCTION` for auctions and `DIRECT` for direct sales. */
  kind_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** Is `AUCTION` for auctions and `DIRECT` for direct sales. */
  kind_gt?: InputMaybe<OrderKind>;
  /** Is `AUCTION` for auctions and `DIRECT` for direct sales. */
  kind_gte?: InputMaybe<OrderKind>;
  /** Is `AUCTION` for auctions and `DIRECT` for direct sales. */
  kind_in?: InputMaybe<Array<OrderKind>>;
  /** Is `AUCTION` for auctions and `DIRECT` for direct sales. */
  kind_lt?: InputMaybe<OrderKind>;
  /** Is `AUCTION` for auctions and `DIRECT` for direct sales. */
  kind_lte?: InputMaybe<OrderKind>;
  /** The maker (seller). */
  maker_eq?: InputMaybe<Scalars['String']['input']>;
  /** The maker (seller). */
  maker_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The maker (seller). */
  maker_gt?: InputMaybe<Scalars['String']['input']>;
  /** The maker (seller). */
  maker_gte?: InputMaybe<Scalars['String']['input']>;
  /** The maker (seller). */
  maker_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The maker (seller). */
  maker_lt?: InputMaybe<Scalars['String']['input']>;
  /** The maker (seller). */
  maker_lte?: InputMaybe<Scalars['String']['input']>;
  network_eq?: InputMaybe<Scalars['String']['input']>;
  network_exists?: InputMaybe<Scalars['Boolean']['input']>;
  network_gt?: InputMaybe<Scalars['String']['input']>;
  network_gte?: InputMaybe<Scalars['String']['input']>;
  network_in?: InputMaybe<Array<Scalars['String']['input']>>;
  network_lt?: InputMaybe<Scalars['String']['input']>;
  network_lte?: InputMaybe<Scalars['String']['input']>;
  /** The opening (Epoch) time in UTC. */
  openFrom_eq?: InputMaybe<Scalars['DateTime']['input']>;
  /** The opening (Epoch) time in UTC. */
  openFrom_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The opening (Epoch) time in UTC. */
  openFrom_gt?: InputMaybe<Scalars['DateTime']['input']>;
  /** The opening (Epoch) time in UTC. */
  openFrom_gte?: InputMaybe<Scalars['DateTime']['input']>;
  /** The opening (Epoch) time in UTC. */
  openFrom_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  /** The opening (Epoch) time in UTC. */
  openFrom_lt?: InputMaybe<Scalars['DateTime']['input']>;
  /** The opening (Epoch) time in UTC. */
  openFrom_lte?: InputMaybe<Scalars['DateTime']['input']>;
  /** The closing (Epoch) time in UTC. */
  openTo_eq?: InputMaybe<Scalars['DateTime']['input']>;
  /** The closing (Epoch) time in UTC. */
  openTo_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The closing (Epoch) time in UTC. */
  openTo_gt?: InputMaybe<Scalars['DateTime']['input']>;
  /** The closing (Epoch) time in UTC. */
  openTo_gte?: InputMaybe<Scalars['DateTime']['input']>;
  /** The closing (Epoch) time in UTC. */
  openTo_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  /** The closing (Epoch) time in UTC. */
  openTo_lt?: InputMaybe<Scalars['DateTime']['input']>;
  /** The closing (Epoch) time in UTC. */
  openTo_lte?: InputMaybe<Scalars['DateTime']['input']>;
  /** Indicates whether this order is fillable given that the opening and closing time constraints are met. So this order is fillable if `open` and `openFrom is 0 or now >= openFrom` and `openTo is 0 or now < openTo`. */
  open_eq?: InputMaybe<Scalars['Boolean']['input']>;
  /** Indicates whether this order is fillable given that the opening and closing time constraints are met. So this order is fillable if `open` and `openFrom is 0 or now >= openFrom` and `openTo is 0 or now < openTo`. */
  open_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** Indicates whether this order is fillable given that the opening and closing time constraints are met. So this order is fillable if `open` and `openFrom is 0 or now >= openFrom` and `openTo is 0 or now < openTo`. */
  open_gt?: InputMaybe<Scalars['Boolean']['input']>;
  /** Indicates whether this order is fillable given that the opening and closing time constraints are met. So this order is fillable if `open` and `openFrom is 0 or now >= openFrom` and `openTo is 0 or now < openTo`. */
  open_gte?: InputMaybe<Scalars['Boolean']['input']>;
  /** Indicates whether this order is fillable given that the opening and closing time constraints are met. So this order is fillable if `open` and `openFrom is 0 or now >= openFrom` and `openTo is 0 or now < openTo`. */
  open_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  /** Indicates whether this order is fillable given that the opening and closing time constraints are met. So this order is fillable if `open` and `openFrom is 0 or now >= openFrom` and `openTo is 0 or now < openTo`. */
  open_lt?: InputMaybe<Scalars['Boolean']['input']>;
  /** Indicates whether this order is fillable given that the opening and closing time constraints are met. So this order is fillable if `open` and `openFrom is 0 or now >= openFrom` and `openTo is 0 or now < openTo`. */
  open_lte?: InputMaybe<Scalars['Boolean']['input']>;
  /** The LemonadeMarketplace order ID. */
  orderId_eq?: InputMaybe<Scalars['String']['input']>;
  /** The LemonadeMarketplace order ID. */
  orderId_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The LemonadeMarketplace order ID. */
  orderId_gt?: InputMaybe<Scalars['String']['input']>;
  /** The LemonadeMarketplace order ID. */
  orderId_gte?: InputMaybe<Scalars['String']['input']>;
  /** The LemonadeMarketplace order ID. */
  orderId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The LemonadeMarketplace order ID. */
  orderId_lt?: InputMaybe<Scalars['String']['input']>;
  /** The LemonadeMarketplace order ID. */
  orderId_lte?: InputMaybe<Scalars['String']['input']>;
  /** The paid amount. */
  paidAmount_eq?: InputMaybe<Scalars['String']['input']>;
  /** The paid amount. */
  paidAmount_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The paid amount. */
  paidAmount_gt?: InputMaybe<Scalars['String']['input']>;
  /** The paid amount. */
  paidAmount_gte?: InputMaybe<Scalars['String']['input']>;
  /** The paid amount. */
  paidAmount_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The paid amount. */
  paidAmount_lt?: InputMaybe<Scalars['String']['input']>;
  /** The paid amount. */
  paidAmount_lte?: InputMaybe<Scalars['String']['input']>;
  /** The (minimum) price or amount of ERC20 tokens the maker wants to be paid. */
  price_eq?: InputMaybe<Scalars['String']['input']>;
  /** The (minimum) price or amount of ERC20 tokens the maker wants to be paid. */
  price_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The (minimum) price or amount of ERC20 tokens the maker wants to be paid. */
  price_gt?: InputMaybe<Scalars['String']['input']>;
  /** The (minimum) price or amount of ERC20 tokens the maker wants to be paid. */
  price_gte?: InputMaybe<Scalars['String']['input']>;
  /** The (minimum) price or amount of ERC20 tokens the maker wants to be paid. */
  price_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The (minimum) price or amount of ERC20 tokens the maker wants to be paid. */
  price_lt?: InputMaybe<Scalars['String']['input']>;
  /** The (minimum) price or amount of ERC20 tokens the maker wants to be paid. */
  price_lte?: InputMaybe<Scalars['String']['input']>;
  /** The taker (buyer). */
  taker_eq?: InputMaybe<Scalars['String']['input']>;
  /** The taker (buyer). */
  taker_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The taker (buyer). */
  taker_gt?: InputMaybe<Scalars['String']['input']>;
  /** The taker (buyer). */
  taker_gte?: InputMaybe<Scalars['String']['input']>;
  /** The taker (buyer). */
  taker_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The taker (buyer). */
  taker_lt?: InputMaybe<Scalars['String']['input']>;
  /** The taker (buyer). */
  taker_lte?: InputMaybe<Scalars['String']['input']>;
  token?: InputMaybe<TokenWhereSimple>;
  /** When this order was last updated. */
  updatedAt_eq?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this order was last updated. */
  updatedAt_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** When this order was last updated. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this order was last updated. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this order was last updated. */
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  /** When this order was last updated. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this order was last updated. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
};

export type OrderWhereSimple = {
  /** The highest bid amount (for auctions). */
  bidAmount_eq?: InputMaybe<Scalars['String']['input']>;
  /** The highest bid amount (for auctions). */
  bidAmount_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The highest bid amount (for auctions). */
  bidAmount_gt?: InputMaybe<Scalars['String']['input']>;
  /** The highest bid amount (for auctions). */
  bidAmount_gte?: InputMaybe<Scalars['String']['input']>;
  /** The highest bid amount (for auctions). */
  bidAmount_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The highest bid amount (for auctions). */
  bidAmount_lt?: InputMaybe<Scalars['String']['input']>;
  /** The highest bid amount (for auctions). */
  bidAmount_lte?: InputMaybe<Scalars['String']['input']>;
  /** The highest bidder (for auctions). */
  bidder_eq?: InputMaybe<Scalars['String']['input']>;
  /** The highest bidder (for auctions). */
  bidder_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The highest bidder (for auctions). */
  bidder_gt?: InputMaybe<Scalars['String']['input']>;
  /** The highest bidder (for auctions). */
  bidder_gte?: InputMaybe<Scalars['String']['input']>;
  /** The highest bidder (for auctions). */
  bidder_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The highest bidder (for auctions). */
  bidder_lt?: InputMaybe<Scalars['String']['input']>;
  /** The highest bidder (for auctions). */
  bidder_lte?: InputMaybe<Scalars['String']['input']>;
  /** The LemonadeMarketplace contract address. */
  contract_eq?: InputMaybe<Scalars['String']['input']>;
  /** The LemonadeMarketplace contract address. */
  contract_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The LemonadeMarketplace contract address. */
  contract_gt?: InputMaybe<Scalars['String']['input']>;
  /** The LemonadeMarketplace contract address. */
  contract_gte?: InputMaybe<Scalars['String']['input']>;
  /** The LemonadeMarketplace contract address. */
  contract_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The LemonadeMarketplace contract address. */
  contract_lt?: InputMaybe<Scalars['String']['input']>;
  /** The LemonadeMarketplace contract address. */
  contract_lte?: InputMaybe<Scalars['String']['input']>;
  /** When this order was created. */
  createdAt_eq?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this order was created. */
  createdAt_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** When this order was created. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this order was created. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this order was created. */
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  /** When this order was created. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this order was created. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
  currency?: InputMaybe<OrderCurrencyWhere>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  /** Is `AUCTION` for auctions and `DIRECT` for direct sales. */
  kind_eq?: InputMaybe<OrderKind>;
  /** Is `AUCTION` for auctions and `DIRECT` for direct sales. */
  kind_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** Is `AUCTION` for auctions and `DIRECT` for direct sales. */
  kind_gt?: InputMaybe<OrderKind>;
  /** Is `AUCTION` for auctions and `DIRECT` for direct sales. */
  kind_gte?: InputMaybe<OrderKind>;
  /** Is `AUCTION` for auctions and `DIRECT` for direct sales. */
  kind_in?: InputMaybe<Array<OrderKind>>;
  /** Is `AUCTION` for auctions and `DIRECT` for direct sales. */
  kind_lt?: InputMaybe<OrderKind>;
  /** Is `AUCTION` for auctions and `DIRECT` for direct sales. */
  kind_lte?: InputMaybe<OrderKind>;
  /** The maker (seller). */
  maker_eq?: InputMaybe<Scalars['String']['input']>;
  /** The maker (seller). */
  maker_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The maker (seller). */
  maker_gt?: InputMaybe<Scalars['String']['input']>;
  /** The maker (seller). */
  maker_gte?: InputMaybe<Scalars['String']['input']>;
  /** The maker (seller). */
  maker_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The maker (seller). */
  maker_lt?: InputMaybe<Scalars['String']['input']>;
  /** The maker (seller). */
  maker_lte?: InputMaybe<Scalars['String']['input']>;
  network_eq?: InputMaybe<Scalars['String']['input']>;
  network_exists?: InputMaybe<Scalars['Boolean']['input']>;
  network_gt?: InputMaybe<Scalars['String']['input']>;
  network_gte?: InputMaybe<Scalars['String']['input']>;
  network_in?: InputMaybe<Array<Scalars['String']['input']>>;
  network_lt?: InputMaybe<Scalars['String']['input']>;
  network_lte?: InputMaybe<Scalars['String']['input']>;
  /** The opening (Epoch) time in UTC. */
  openFrom_eq?: InputMaybe<Scalars['DateTime']['input']>;
  /** The opening (Epoch) time in UTC. */
  openFrom_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The opening (Epoch) time in UTC. */
  openFrom_gt?: InputMaybe<Scalars['DateTime']['input']>;
  /** The opening (Epoch) time in UTC. */
  openFrom_gte?: InputMaybe<Scalars['DateTime']['input']>;
  /** The opening (Epoch) time in UTC. */
  openFrom_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  /** The opening (Epoch) time in UTC. */
  openFrom_lt?: InputMaybe<Scalars['DateTime']['input']>;
  /** The opening (Epoch) time in UTC. */
  openFrom_lte?: InputMaybe<Scalars['DateTime']['input']>;
  /** The closing (Epoch) time in UTC. */
  openTo_eq?: InputMaybe<Scalars['DateTime']['input']>;
  /** The closing (Epoch) time in UTC. */
  openTo_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The closing (Epoch) time in UTC. */
  openTo_gt?: InputMaybe<Scalars['DateTime']['input']>;
  /** The closing (Epoch) time in UTC. */
  openTo_gte?: InputMaybe<Scalars['DateTime']['input']>;
  /** The closing (Epoch) time in UTC. */
  openTo_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  /** The closing (Epoch) time in UTC. */
  openTo_lt?: InputMaybe<Scalars['DateTime']['input']>;
  /** The closing (Epoch) time in UTC. */
  openTo_lte?: InputMaybe<Scalars['DateTime']['input']>;
  /** Indicates whether this order is fillable given that the opening and closing time constraints are met. So this order is fillable if `open` and `openFrom is 0 or now >= openFrom` and `openTo is 0 or now < openTo`. */
  open_eq?: InputMaybe<Scalars['Boolean']['input']>;
  /** Indicates whether this order is fillable given that the opening and closing time constraints are met. So this order is fillable if `open` and `openFrom is 0 or now >= openFrom` and `openTo is 0 or now < openTo`. */
  open_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** Indicates whether this order is fillable given that the opening and closing time constraints are met. So this order is fillable if `open` and `openFrom is 0 or now >= openFrom` and `openTo is 0 or now < openTo`. */
  open_gt?: InputMaybe<Scalars['Boolean']['input']>;
  /** Indicates whether this order is fillable given that the opening and closing time constraints are met. So this order is fillable if `open` and `openFrom is 0 or now >= openFrom` and `openTo is 0 or now < openTo`. */
  open_gte?: InputMaybe<Scalars['Boolean']['input']>;
  /** Indicates whether this order is fillable given that the opening and closing time constraints are met. So this order is fillable if `open` and `openFrom is 0 or now >= openFrom` and `openTo is 0 or now < openTo`. */
  open_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  /** Indicates whether this order is fillable given that the opening and closing time constraints are met. So this order is fillable if `open` and `openFrom is 0 or now >= openFrom` and `openTo is 0 or now < openTo`. */
  open_lt?: InputMaybe<Scalars['Boolean']['input']>;
  /** Indicates whether this order is fillable given that the opening and closing time constraints are met. So this order is fillable if `open` and `openFrom is 0 or now >= openFrom` and `openTo is 0 or now < openTo`. */
  open_lte?: InputMaybe<Scalars['Boolean']['input']>;
  /** The LemonadeMarketplace order ID. */
  orderId_eq?: InputMaybe<Scalars['String']['input']>;
  /** The LemonadeMarketplace order ID. */
  orderId_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The LemonadeMarketplace order ID. */
  orderId_gt?: InputMaybe<Scalars['String']['input']>;
  /** The LemonadeMarketplace order ID. */
  orderId_gte?: InputMaybe<Scalars['String']['input']>;
  /** The LemonadeMarketplace order ID. */
  orderId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The LemonadeMarketplace order ID. */
  orderId_lt?: InputMaybe<Scalars['String']['input']>;
  /** The LemonadeMarketplace order ID. */
  orderId_lte?: InputMaybe<Scalars['String']['input']>;
  /** The paid amount. */
  paidAmount_eq?: InputMaybe<Scalars['String']['input']>;
  /** The paid amount. */
  paidAmount_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The paid amount. */
  paidAmount_gt?: InputMaybe<Scalars['String']['input']>;
  /** The paid amount. */
  paidAmount_gte?: InputMaybe<Scalars['String']['input']>;
  /** The paid amount. */
  paidAmount_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The paid amount. */
  paidAmount_lt?: InputMaybe<Scalars['String']['input']>;
  /** The paid amount. */
  paidAmount_lte?: InputMaybe<Scalars['String']['input']>;
  /** The (minimum) price or amount of ERC20 tokens the maker wants to be paid. */
  price_eq?: InputMaybe<Scalars['String']['input']>;
  /** The (minimum) price or amount of ERC20 tokens the maker wants to be paid. */
  price_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The (minimum) price or amount of ERC20 tokens the maker wants to be paid. */
  price_gt?: InputMaybe<Scalars['String']['input']>;
  /** The (minimum) price or amount of ERC20 tokens the maker wants to be paid. */
  price_gte?: InputMaybe<Scalars['String']['input']>;
  /** The (minimum) price or amount of ERC20 tokens the maker wants to be paid. */
  price_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The (minimum) price or amount of ERC20 tokens the maker wants to be paid. */
  price_lt?: InputMaybe<Scalars['String']['input']>;
  /** The (minimum) price or amount of ERC20 tokens the maker wants to be paid. */
  price_lte?: InputMaybe<Scalars['String']['input']>;
  /** The taker (buyer). */
  taker_eq?: InputMaybe<Scalars['String']['input']>;
  /** The taker (buyer). */
  taker_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The taker (buyer). */
  taker_gt?: InputMaybe<Scalars['String']['input']>;
  /** The taker (buyer). */
  taker_gte?: InputMaybe<Scalars['String']['input']>;
  /** The taker (buyer). */
  taker_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The taker (buyer). */
  taker_lt?: InputMaybe<Scalars['String']['input']>;
  /** The taker (buyer). */
  taker_lte?: InputMaybe<Scalars['String']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
  /** When this order was last updated. */
  updatedAt_eq?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this order was last updated. */
  updatedAt_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** When this order was last updated. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this order was last updated. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this order was last updated. */
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  /** When this order was last updated. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this order was last updated. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
};

export type Query = {
  __typename?: 'Query';
  getToken?: Maybe<TokenDetail>;
  getTokens: Array<TokenComplex>;
  orders: Array<OrderComplex>;
  tokens: Array<TokenComplex>;
  wertOptions: Scalars['JSONObject']['output'];
};


export type QueryGetTokenArgs = {
  id: Scalars['String']['input'];
  network?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetTokensArgs = {
  contract?: InputMaybe<Scalars['String']['input']>;
  creator?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  network?: InputMaybe<Scalars['String']['input']>;
  owner?: InputMaybe<Scalars['String']['input']>;
  owner_in?: InputMaybe<Array<Scalars['String']['input']>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  tokenId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryOrdersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<OrderSort>;
  where?: InputMaybe<OrderWhereComplex>;
};


export type QueryTokensArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  sample?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<TokenSort>;
  where?: InputMaybe<TokenWhereComplex>;
};


export type QueryWertOptionsArgs = {
  amount: Scalars['String']['input'];
  order: WertOptionsOrder;
  subject: Scalars['String']['input'];
  type: WertOptionsType;
};

export type Registry = {
  __typename?: 'Registry';
  id: Scalars['String']['output'];
  isERC721?: Maybe<Scalars['Boolean']['output']>;
  network: Scalars['String']['output'];
  supportsERC721Metadata?: Maybe<Scalars['Boolean']['output']>;
  supportsERC2981?: Maybe<Scalars['Boolean']['output']>;
  supportsLemonadePoapV1?: Maybe<Scalars['Boolean']['output']>;
  supportsRaribleRoyaltiesV2?: Maybe<Scalars['Boolean']['output']>;
};

export type RegistryWhere = {
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  isERC721_eq?: InputMaybe<Scalars['Boolean']['input']>;
  isERC721_exists?: InputMaybe<Scalars['Boolean']['input']>;
  isERC721_gt?: InputMaybe<Scalars['Boolean']['input']>;
  isERC721_gte?: InputMaybe<Scalars['Boolean']['input']>;
  isERC721_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isERC721_lt?: InputMaybe<Scalars['Boolean']['input']>;
  isERC721_lte?: InputMaybe<Scalars['Boolean']['input']>;
  network_eq?: InputMaybe<Scalars['String']['input']>;
  network_exists?: InputMaybe<Scalars['Boolean']['input']>;
  network_gt?: InputMaybe<Scalars['String']['input']>;
  network_gte?: InputMaybe<Scalars['String']['input']>;
  network_in?: InputMaybe<Array<Scalars['String']['input']>>;
  network_lt?: InputMaybe<Scalars['String']['input']>;
  network_lte?: InputMaybe<Scalars['String']['input']>;
  supportsERC721Metadata_eq?: InputMaybe<Scalars['Boolean']['input']>;
  supportsERC721Metadata_exists?: InputMaybe<Scalars['Boolean']['input']>;
  supportsERC721Metadata_gt?: InputMaybe<Scalars['Boolean']['input']>;
  supportsERC721Metadata_gte?: InputMaybe<Scalars['Boolean']['input']>;
  supportsERC721Metadata_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  supportsERC721Metadata_lt?: InputMaybe<Scalars['Boolean']['input']>;
  supportsERC721Metadata_lte?: InputMaybe<Scalars['Boolean']['input']>;
  supportsERC2981_eq?: InputMaybe<Scalars['Boolean']['input']>;
  supportsERC2981_exists?: InputMaybe<Scalars['Boolean']['input']>;
  supportsERC2981_gt?: InputMaybe<Scalars['Boolean']['input']>;
  supportsERC2981_gte?: InputMaybe<Scalars['Boolean']['input']>;
  supportsERC2981_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  supportsERC2981_lt?: InputMaybe<Scalars['Boolean']['input']>;
  supportsERC2981_lte?: InputMaybe<Scalars['Boolean']['input']>;
  supportsLemonadePoapV1_eq?: InputMaybe<Scalars['Boolean']['input']>;
  supportsLemonadePoapV1_exists?: InputMaybe<Scalars['Boolean']['input']>;
  supportsLemonadePoapV1_gt?: InputMaybe<Scalars['Boolean']['input']>;
  supportsLemonadePoapV1_gte?: InputMaybe<Scalars['Boolean']['input']>;
  supportsLemonadePoapV1_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  supportsLemonadePoapV1_lt?: InputMaybe<Scalars['Boolean']['input']>;
  supportsLemonadePoapV1_lte?: InputMaybe<Scalars['Boolean']['input']>;
  supportsRaribleRoyaltiesV2_eq?: InputMaybe<Scalars['Boolean']['input']>;
  supportsRaribleRoyaltiesV2_exists?: InputMaybe<Scalars['Boolean']['input']>;
  supportsRaribleRoyaltiesV2_gt?: InputMaybe<Scalars['Boolean']['input']>;
  supportsRaribleRoyaltiesV2_gte?: InputMaybe<Scalars['Boolean']['input']>;
  supportsRaribleRoyaltiesV2_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  supportsRaribleRoyaltiesV2_lt?: InputMaybe<Scalars['Boolean']['input']>;
  supportsRaribleRoyaltiesV2_lte?: InputMaybe<Scalars['Boolean']['input']>;
};

export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Subscription = {
  __typename?: 'Subscription';
  orders: Array<OrderComplex>;
  tokens: Array<TokenComplex>;
};


export type SubscriptionOrdersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<Scalars['Boolean']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<OrderSort>;
  where?: InputMaybe<OrderWhereComplex>;
};


export type SubscriptionTokensArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<Scalars['Boolean']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<TokenSort>;
  where?: InputMaybe<TokenWhereComplex>;
};

export type Token = {
  __typename?: 'Token';
  /** The contract address. */
  contract: Scalars['String']['output'];
  /** When this token was created. */
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** The creator. The transaction creator. */
  creator?: Maybe<Scalars['String']['output']>;
  creatorExpanded?: Maybe<User>;
  /** The number of times this token has been enriched. */
  enrichCount?: Maybe<Scalars['Float']['output']>;
  /** When this token was last enriched. */
  enrichedAt?: Maybe<Scalars['DateTime']['output']>;
  /** The founder. The first owner. */
  founder?: Maybe<Scalars['String']['output']>;
  founderExpanded?: Maybe<User>;
  id: Scalars['String']['output'];
  /** The actual metadata. */
  metadata?: Maybe<Scalars['JSONObject']['output']>;
  metadataCreatorsExpanded?: Maybe<Array<Maybe<User>>>;
  network: Scalars['String']['output'];
  /** The token royalties. */
  royalties?: Maybe<Array<TokenRoyalty>>;
  /**
   * The royalty fraction.
   * @deprecated Use royalties.
   */
  royaltyFraction?: Maybe<Scalars['String']['output']>;
  /**
   * The royalty maker.
   * @deprecated Use royalties.
   */
  royaltyMaker?: Maybe<Scalars['String']['output']>;
  /** The token ID. */
  tokenId: Scalars['String']['output'];
  /** The metadata URI. */
  uri?: Maybe<Scalars['String']['output']>;
};

export type TokenComplex = {
  __typename?: 'TokenComplex';
  /** The contract address. */
  contract: Scalars['String']['output'];
  /** When this token was created. */
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** The creator. The transaction creator. */
  creator?: Maybe<Scalars['String']['output']>;
  creatorExpanded?: Maybe<User>;
  /** The number of times this token has been enriched. */
  enrichCount?: Maybe<Scalars['Float']['output']>;
  /** When this token was last enriched. */
  enrichedAt?: Maybe<Scalars['DateTime']['output']>;
  /** The founder. The first owner. */
  founder?: Maybe<Scalars['String']['output']>;
  founderExpanded?: Maybe<User>;
  id: Scalars['String']['output'];
  /** The actual metadata. */
  metadata?: Maybe<Scalars['JSONObject']['output']>;
  metadataCreatorsExpanded?: Maybe<Array<Maybe<User>>>;
  network: Scalars['String']['output'];
  /** The order. */
  order?: Maybe<OrderSimple>;
  /** The owner. Requires data from the indexer. */
  owner?: Maybe<Scalars['String']['output']>;
  ownerExpanded?: Maybe<User>;
  registry: Registry;
  /** The token royalties. */
  royalties?: Maybe<Array<TokenRoyalty>>;
  /**
   * The royalty fraction.
   * @deprecated Use royalties.
   */
  royaltyFraction?: Maybe<Scalars['String']['output']>;
  /**
   * The royalty maker.
   * @deprecated Use royalties.
   */
  royaltyMaker?: Maybe<Scalars['String']['output']>;
  /** The token ID. */
  tokenId: Scalars['String']['output'];
  /** The metadata URI. */
  uri?: Maybe<Scalars['String']['output']>;
};

export type TokenDetail = {
  __typename?: 'TokenDetail';
  /** The contract address. */
  contract: Scalars['String']['output'];
  /** When this token was created. */
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** The creator. The transaction creator. */
  creator?: Maybe<Scalars['String']['output']>;
  creatorExpanded?: Maybe<User>;
  /** The number of times this token has been enriched. */
  enrichCount?: Maybe<Scalars['Float']['output']>;
  /** When this token was last enriched. */
  enrichedAt?: Maybe<Scalars['DateTime']['output']>;
  /** The founder. The first owner. */
  founder?: Maybe<Scalars['String']['output']>;
  founderExpanded?: Maybe<User>;
  id: Scalars['String']['output'];
  /** The actual metadata. */
  metadata?: Maybe<Scalars['JSONObject']['output']>;
  metadataCreatorsExpanded?: Maybe<Array<Maybe<User>>>;
  network: Scalars['String']['output'];
  /** The order. */
  order?: Maybe<OrderSimple>;
  /** This token's orders. */
  orders?: Maybe<Array<TokenDetailOrder>>;
  /** The owner. Requires data from the indexer. */
  owner?: Maybe<Scalars['String']['output']>;
  ownerExpanded?: Maybe<User>;
  registry: Registry;
  /** The token royalties. */
  royalties?: Maybe<Array<TokenRoyalty>>;
  /**
   * The royalty fraction.
   * @deprecated Use royalties.
   */
  royaltyFraction?: Maybe<Scalars['String']['output']>;
  /**
   * The royalty maker.
   * @deprecated Use royalties.
   */
  royaltyMaker?: Maybe<Scalars['String']['output']>;
  /** The token ID. */
  tokenId: Scalars['String']['output'];
  /** This token's transfers. */
  transfers?: Maybe<Array<TokenDetailTransfer>>;
  /** The metadata URI. */
  uri?: Maybe<Scalars['String']['output']>;
};

export type TokenDetailOrder = {
  __typename?: 'TokenDetailOrder';
  bids: Array<TokenDetailOrderBid>;
  createdAt: Scalars['String']['output'];
  currency?: Maybe<OrderCurrency>;
  maker: Scalars['String']['output'];
  makerExpanded?: Maybe<User>;
  paidAmount?: Maybe<Scalars['String']['output']>;
  price: Scalars['String']['output'];
  taker?: Maybe<Scalars['String']['output']>;
  takerExpanded?: Maybe<User>;
  transaction: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedTransaction?: Maybe<Scalars['String']['output']>;
};

export type TokenDetailOrderBid = {
  __typename?: 'TokenDetailOrderBid';
  bidAmount: Scalars['String']['output'];
  bidder: Scalars['String']['output'];
  bidderExpanded?: Maybe<User>;
  createdAt: Scalars['String']['output'];
  transaction: Scalars['String']['output'];
};

export type TokenDetailTransfer = {
  __typename?: 'TokenDetailTransfer';
  createdAt: Scalars['String']['output'];
  from: Scalars['String']['output'];
  fromExpanded?: Maybe<User>;
  to: Scalars['String']['output'];
  toExpanded?: Maybe<User>;
  transaction: Scalars['String']['output'];
};

export type TokenRoyalty = {
  __typename?: 'TokenRoyalty';
  account: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type TokenSimple = {
  __typename?: 'TokenSimple';
  /** The contract address. */
  contract: Scalars['String']['output'];
  /** When this token was created. */
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** The creator. The transaction creator. */
  creator?: Maybe<Scalars['String']['output']>;
  creatorExpanded?: Maybe<User>;
  /** The number of times this token has been enriched. */
  enrichCount?: Maybe<Scalars['Float']['output']>;
  /** When this token was last enriched. */
  enrichedAt?: Maybe<Scalars['DateTime']['output']>;
  /** The founder. The first owner. */
  founder?: Maybe<Scalars['String']['output']>;
  founderExpanded?: Maybe<User>;
  id: Scalars['String']['output'];
  /** The actual metadata. */
  metadata?: Maybe<Scalars['JSONObject']['output']>;
  metadataCreatorsExpanded?: Maybe<Array<Maybe<User>>>;
  network: Scalars['String']['output'];
  /** The order. */
  order?: Maybe<Scalars['String']['output']>;
  /** The token royalties. */
  royalties?: Maybe<Array<TokenRoyalty>>;
  /**
   * The royalty fraction.
   * @deprecated Use royalties.
   */
  royaltyFraction?: Maybe<Scalars['String']['output']>;
  /**
   * The royalty maker.
   * @deprecated Use royalties.
   */
  royaltyMaker?: Maybe<Scalars['String']['output']>;
  /** The token ID. */
  tokenId: Scalars['String']['output'];
  /** The metadata URI. */
  uri?: Maybe<Scalars['String']['output']>;
};

export type TokenSort = {
  by: TokenSortBy;
  direction?: InputMaybe<SortDirection>;
};

export enum TokenSortBy {
  Contract = 'contract',
  CreatedAt = 'createdAt',
  Creator = 'creator',
  EnrichCount = 'enrichCount',
  EnrichedAt = 'enrichedAt',
  Founder = 'founder',
  Id = 'id',
  Metadata = 'metadata',
  Network = 'network',
  Royalties = 'royalties',
  RoyaltyFraction = 'royaltyFraction',
  RoyaltyMaker = 'royaltyMaker',
  TokenId = 'tokenId',
  Uri = 'uri'
}

export type TokenWhere = {
  /** The contract address. */
  contract_eq?: InputMaybe<Scalars['String']['input']>;
  /** The contract address. */
  contract_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The contract address. */
  contract_gt?: InputMaybe<Scalars['String']['input']>;
  /** The contract address. */
  contract_gte?: InputMaybe<Scalars['String']['input']>;
  /** The contract address. */
  contract_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The contract address. */
  contract_lt?: InputMaybe<Scalars['String']['input']>;
  /** The contract address. */
  contract_lte?: InputMaybe<Scalars['String']['input']>;
  /** When this token was created. */
  createdAt_eq?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this token was created. */
  createdAt_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** When this token was created. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this token was created. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this token was created. */
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  /** When this token was created. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this token was created. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
  /** The creator. The transaction creator. */
  creator_eq?: InputMaybe<Scalars['String']['input']>;
  /** The creator. The transaction creator. */
  creator_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The creator. The transaction creator. */
  creator_gt?: InputMaybe<Scalars['String']['input']>;
  /** The creator. The transaction creator. */
  creator_gte?: InputMaybe<Scalars['String']['input']>;
  /** The creator. The transaction creator. */
  creator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The creator. The transaction creator. */
  creator_lt?: InputMaybe<Scalars['String']['input']>;
  /** The creator. The transaction creator. */
  creator_lte?: InputMaybe<Scalars['String']['input']>;
  /** The number of times this token has been enriched. */
  enrichCount_eq?: InputMaybe<Scalars['Float']['input']>;
  /** The number of times this token has been enriched. */
  enrichCount_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The number of times this token has been enriched. */
  enrichCount_gt?: InputMaybe<Scalars['Float']['input']>;
  /** The number of times this token has been enriched. */
  enrichCount_gte?: InputMaybe<Scalars['Float']['input']>;
  /** The number of times this token has been enriched. */
  enrichCount_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  /** The number of times this token has been enriched. */
  enrichCount_lt?: InputMaybe<Scalars['Float']['input']>;
  /** The number of times this token has been enriched. */
  enrichCount_lte?: InputMaybe<Scalars['Float']['input']>;
  /** When this token was last enriched. */
  enrichedAt_eq?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this token was last enriched. */
  enrichedAt_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** When this token was last enriched. */
  enrichedAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this token was last enriched. */
  enrichedAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this token was last enriched. */
  enrichedAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  /** When this token was last enriched. */
  enrichedAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this token was last enriched. */
  enrichedAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
  /** The founder. The first owner. */
  founder_eq?: InputMaybe<Scalars['String']['input']>;
  /** The founder. The first owner. */
  founder_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The founder. The first owner. */
  founder_gt?: InputMaybe<Scalars['String']['input']>;
  /** The founder. The first owner. */
  founder_gte?: InputMaybe<Scalars['String']['input']>;
  /** The founder. The first owner. */
  founder_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The founder. The first owner. */
  founder_lt?: InputMaybe<Scalars['String']['input']>;
  /** The founder. The first owner. */
  founder_lte?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  /** The actual metadata. */
  metadata_eq?: InputMaybe<Scalars['JSONObject']['input']>;
  /** The actual metadata. */
  metadata_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The actual metadata. */
  metadata_gt?: InputMaybe<Scalars['JSONObject']['input']>;
  /** The actual metadata. */
  metadata_gte?: InputMaybe<Scalars['JSONObject']['input']>;
  /** The actual metadata. */
  metadata_in?: InputMaybe<Array<Scalars['JSONObject']['input']>>;
  /** The actual metadata. */
  metadata_lt?: InputMaybe<Scalars['JSONObject']['input']>;
  /** The actual metadata. */
  metadata_lte?: InputMaybe<Scalars['JSONObject']['input']>;
  network_eq?: InputMaybe<Scalars['String']['input']>;
  network_exists?: InputMaybe<Scalars['Boolean']['input']>;
  network_gt?: InputMaybe<Scalars['String']['input']>;
  network_gte?: InputMaybe<Scalars['String']['input']>;
  network_in?: InputMaybe<Array<Scalars['String']['input']>>;
  network_lt?: InputMaybe<Scalars['String']['input']>;
  network_lte?: InputMaybe<Scalars['String']['input']>;
  /** The royalty fraction. */
  royaltyFraction_eq?: InputMaybe<Scalars['String']['input']>;
  /** The royalty fraction. */
  royaltyFraction_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The royalty fraction. */
  royaltyFraction_gt?: InputMaybe<Scalars['String']['input']>;
  /** The royalty fraction. */
  royaltyFraction_gte?: InputMaybe<Scalars['String']['input']>;
  /** The royalty fraction. */
  royaltyFraction_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The royalty fraction. */
  royaltyFraction_lt?: InputMaybe<Scalars['String']['input']>;
  /** The royalty fraction. */
  royaltyFraction_lte?: InputMaybe<Scalars['String']['input']>;
  /** The royalty maker. */
  royaltyMaker_eq?: InputMaybe<Scalars['String']['input']>;
  /** The royalty maker. */
  royaltyMaker_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The royalty maker. */
  royaltyMaker_gt?: InputMaybe<Scalars['String']['input']>;
  /** The royalty maker. */
  royaltyMaker_gte?: InputMaybe<Scalars['String']['input']>;
  /** The royalty maker. */
  royaltyMaker_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The royalty maker. */
  royaltyMaker_lt?: InputMaybe<Scalars['String']['input']>;
  /** The royalty maker. */
  royaltyMaker_lte?: InputMaybe<Scalars['String']['input']>;
  /** The token ID. */
  tokenId_eq?: InputMaybe<Scalars['String']['input']>;
  /** The token ID. */
  tokenId_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The token ID. */
  tokenId_gt?: InputMaybe<Scalars['String']['input']>;
  /** The token ID. */
  tokenId_gte?: InputMaybe<Scalars['String']['input']>;
  /** The token ID. */
  tokenId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The token ID. */
  tokenId_lt?: InputMaybe<Scalars['String']['input']>;
  /** The token ID. */
  tokenId_lte?: InputMaybe<Scalars['String']['input']>;
  /** The metadata URI. */
  uri_eq?: InputMaybe<Scalars['String']['input']>;
  /** The metadata URI. */
  uri_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The metadata URI. */
  uri_gt?: InputMaybe<Scalars['String']['input']>;
  /** The metadata URI. */
  uri_gte?: InputMaybe<Scalars['String']['input']>;
  /** The metadata URI. */
  uri_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The metadata URI. */
  uri_lt?: InputMaybe<Scalars['String']['input']>;
  /** The metadata URI. */
  uri_lte?: InputMaybe<Scalars['String']['input']>;
};

export type TokenWhereComplex = {
  /** The contract address. */
  contract_eq?: InputMaybe<Scalars['String']['input']>;
  /** The contract address. */
  contract_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The contract address. */
  contract_gt?: InputMaybe<Scalars['String']['input']>;
  /** The contract address. */
  contract_gte?: InputMaybe<Scalars['String']['input']>;
  /** The contract address. */
  contract_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The contract address. */
  contract_lt?: InputMaybe<Scalars['String']['input']>;
  /** The contract address. */
  contract_lte?: InputMaybe<Scalars['String']['input']>;
  /** When this token was created. */
  createdAt_eq?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this token was created. */
  createdAt_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** When this token was created. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this token was created. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this token was created. */
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  /** When this token was created. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this token was created. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
  /** The creator. The transaction creator. */
  creator_eq?: InputMaybe<Scalars['String']['input']>;
  /** The creator. The transaction creator. */
  creator_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The creator. The transaction creator. */
  creator_gt?: InputMaybe<Scalars['String']['input']>;
  /** The creator. The transaction creator. */
  creator_gte?: InputMaybe<Scalars['String']['input']>;
  /** The creator. The transaction creator. */
  creator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The creator. The transaction creator. */
  creator_lt?: InputMaybe<Scalars['String']['input']>;
  /** The creator. The transaction creator. */
  creator_lte?: InputMaybe<Scalars['String']['input']>;
  /** The number of times this token has been enriched. */
  enrichCount_eq?: InputMaybe<Scalars['Float']['input']>;
  /** The number of times this token has been enriched. */
  enrichCount_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The number of times this token has been enriched. */
  enrichCount_gt?: InputMaybe<Scalars['Float']['input']>;
  /** The number of times this token has been enriched. */
  enrichCount_gte?: InputMaybe<Scalars['Float']['input']>;
  /** The number of times this token has been enriched. */
  enrichCount_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  /** The number of times this token has been enriched. */
  enrichCount_lt?: InputMaybe<Scalars['Float']['input']>;
  /** The number of times this token has been enriched. */
  enrichCount_lte?: InputMaybe<Scalars['Float']['input']>;
  /** When this token was last enriched. */
  enrichedAt_eq?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this token was last enriched. */
  enrichedAt_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** When this token was last enriched. */
  enrichedAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this token was last enriched. */
  enrichedAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this token was last enriched. */
  enrichedAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  /** When this token was last enriched. */
  enrichedAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this token was last enriched. */
  enrichedAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
  /** The founder. The first owner. */
  founder_eq?: InputMaybe<Scalars['String']['input']>;
  /** The founder. The first owner. */
  founder_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The founder. The first owner. */
  founder_gt?: InputMaybe<Scalars['String']['input']>;
  /** The founder. The first owner. */
  founder_gte?: InputMaybe<Scalars['String']['input']>;
  /** The founder. The first owner. */
  founder_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The founder. The first owner. */
  founder_lt?: InputMaybe<Scalars['String']['input']>;
  /** The founder. The first owner. */
  founder_lte?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  /** The actual metadata. */
  metadata_eq?: InputMaybe<Scalars['JSONObject']['input']>;
  /** The actual metadata. */
  metadata_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The actual metadata. */
  metadata_gt?: InputMaybe<Scalars['JSONObject']['input']>;
  /** The actual metadata. */
  metadata_gte?: InputMaybe<Scalars['JSONObject']['input']>;
  /** The actual metadata. */
  metadata_in?: InputMaybe<Array<Scalars['JSONObject']['input']>>;
  /** The actual metadata. */
  metadata_lt?: InputMaybe<Scalars['JSONObject']['input']>;
  /** The actual metadata. */
  metadata_lte?: InputMaybe<Scalars['JSONObject']['input']>;
  network_eq?: InputMaybe<Scalars['String']['input']>;
  network_exists?: InputMaybe<Scalars['Boolean']['input']>;
  network_gt?: InputMaybe<Scalars['String']['input']>;
  network_gte?: InputMaybe<Scalars['String']['input']>;
  network_in?: InputMaybe<Array<Scalars['String']['input']>>;
  network_lt?: InputMaybe<Scalars['String']['input']>;
  network_lte?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<OrderWhereSimple>;
  registry?: InputMaybe<RegistryWhere>;
  /** The royalty fraction. */
  royaltyFraction_eq?: InputMaybe<Scalars['String']['input']>;
  /** The royalty fraction. */
  royaltyFraction_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The royalty fraction. */
  royaltyFraction_gt?: InputMaybe<Scalars['String']['input']>;
  /** The royalty fraction. */
  royaltyFraction_gte?: InputMaybe<Scalars['String']['input']>;
  /** The royalty fraction. */
  royaltyFraction_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The royalty fraction. */
  royaltyFraction_lt?: InputMaybe<Scalars['String']['input']>;
  /** The royalty fraction. */
  royaltyFraction_lte?: InputMaybe<Scalars['String']['input']>;
  /** The royalty maker. */
  royaltyMaker_eq?: InputMaybe<Scalars['String']['input']>;
  /** The royalty maker. */
  royaltyMaker_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The royalty maker. */
  royaltyMaker_gt?: InputMaybe<Scalars['String']['input']>;
  /** The royalty maker. */
  royaltyMaker_gte?: InputMaybe<Scalars['String']['input']>;
  /** The royalty maker. */
  royaltyMaker_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The royalty maker. */
  royaltyMaker_lt?: InputMaybe<Scalars['String']['input']>;
  /** The royalty maker. */
  royaltyMaker_lte?: InputMaybe<Scalars['String']['input']>;
  /** The token ID. */
  tokenId_eq?: InputMaybe<Scalars['String']['input']>;
  /** The token ID. */
  tokenId_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The token ID. */
  tokenId_gt?: InputMaybe<Scalars['String']['input']>;
  /** The token ID. */
  tokenId_gte?: InputMaybe<Scalars['String']['input']>;
  /** The token ID. */
  tokenId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The token ID. */
  tokenId_lt?: InputMaybe<Scalars['String']['input']>;
  /** The token ID. */
  tokenId_lte?: InputMaybe<Scalars['String']['input']>;
  /** The metadata URI. */
  uri_eq?: InputMaybe<Scalars['String']['input']>;
  /** The metadata URI. */
  uri_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The metadata URI. */
  uri_gt?: InputMaybe<Scalars['String']['input']>;
  /** The metadata URI. */
  uri_gte?: InputMaybe<Scalars['String']['input']>;
  /** The metadata URI. */
  uri_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The metadata URI. */
  uri_lt?: InputMaybe<Scalars['String']['input']>;
  /** The metadata URI. */
  uri_lte?: InputMaybe<Scalars['String']['input']>;
};

export type TokenWhereSimple = {
  /** The contract address. */
  contract_eq?: InputMaybe<Scalars['String']['input']>;
  /** The contract address. */
  contract_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The contract address. */
  contract_gt?: InputMaybe<Scalars['String']['input']>;
  /** The contract address. */
  contract_gte?: InputMaybe<Scalars['String']['input']>;
  /** The contract address. */
  contract_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The contract address. */
  contract_lt?: InputMaybe<Scalars['String']['input']>;
  /** The contract address. */
  contract_lte?: InputMaybe<Scalars['String']['input']>;
  /** When this token was created. */
  createdAt_eq?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this token was created. */
  createdAt_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** When this token was created. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this token was created. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this token was created. */
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  /** When this token was created. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this token was created. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
  /** The creator. The transaction creator. */
  creator_eq?: InputMaybe<Scalars['String']['input']>;
  /** The creator. The transaction creator. */
  creator_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The creator. The transaction creator. */
  creator_gt?: InputMaybe<Scalars['String']['input']>;
  /** The creator. The transaction creator. */
  creator_gte?: InputMaybe<Scalars['String']['input']>;
  /** The creator. The transaction creator. */
  creator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The creator. The transaction creator. */
  creator_lt?: InputMaybe<Scalars['String']['input']>;
  /** The creator. The transaction creator. */
  creator_lte?: InputMaybe<Scalars['String']['input']>;
  /** The number of times this token has been enriched. */
  enrichCount_eq?: InputMaybe<Scalars['Float']['input']>;
  /** The number of times this token has been enriched. */
  enrichCount_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The number of times this token has been enriched. */
  enrichCount_gt?: InputMaybe<Scalars['Float']['input']>;
  /** The number of times this token has been enriched. */
  enrichCount_gte?: InputMaybe<Scalars['Float']['input']>;
  /** The number of times this token has been enriched. */
  enrichCount_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  /** The number of times this token has been enriched. */
  enrichCount_lt?: InputMaybe<Scalars['Float']['input']>;
  /** The number of times this token has been enriched. */
  enrichCount_lte?: InputMaybe<Scalars['Float']['input']>;
  /** When this token was last enriched. */
  enrichedAt_eq?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this token was last enriched. */
  enrichedAt_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** When this token was last enriched. */
  enrichedAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this token was last enriched. */
  enrichedAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this token was last enriched. */
  enrichedAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  /** When this token was last enriched. */
  enrichedAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
  /** When this token was last enriched. */
  enrichedAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
  /** The founder. The first owner. */
  founder_eq?: InputMaybe<Scalars['String']['input']>;
  /** The founder. The first owner. */
  founder_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The founder. The first owner. */
  founder_gt?: InputMaybe<Scalars['String']['input']>;
  /** The founder. The first owner. */
  founder_gte?: InputMaybe<Scalars['String']['input']>;
  /** The founder. The first owner. */
  founder_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The founder. The first owner. */
  founder_lt?: InputMaybe<Scalars['String']['input']>;
  /** The founder. The first owner. */
  founder_lte?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  /** The actual metadata. */
  metadata_eq?: InputMaybe<Scalars['JSONObject']['input']>;
  /** The actual metadata. */
  metadata_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The actual metadata. */
  metadata_gt?: InputMaybe<Scalars['JSONObject']['input']>;
  /** The actual metadata. */
  metadata_gte?: InputMaybe<Scalars['JSONObject']['input']>;
  /** The actual metadata. */
  metadata_in?: InputMaybe<Array<Scalars['JSONObject']['input']>>;
  /** The actual metadata. */
  metadata_lt?: InputMaybe<Scalars['JSONObject']['input']>;
  /** The actual metadata. */
  metadata_lte?: InputMaybe<Scalars['JSONObject']['input']>;
  network_eq?: InputMaybe<Scalars['String']['input']>;
  network_exists?: InputMaybe<Scalars['Boolean']['input']>;
  network_gt?: InputMaybe<Scalars['String']['input']>;
  network_gte?: InputMaybe<Scalars['String']['input']>;
  network_in?: InputMaybe<Array<Scalars['String']['input']>>;
  network_lt?: InputMaybe<Scalars['String']['input']>;
  network_lte?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
  /** The royalty fraction. */
  royaltyFraction_eq?: InputMaybe<Scalars['String']['input']>;
  /** The royalty fraction. */
  royaltyFraction_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The royalty fraction. */
  royaltyFraction_gt?: InputMaybe<Scalars['String']['input']>;
  /** The royalty fraction. */
  royaltyFraction_gte?: InputMaybe<Scalars['String']['input']>;
  /** The royalty fraction. */
  royaltyFraction_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The royalty fraction. */
  royaltyFraction_lt?: InputMaybe<Scalars['String']['input']>;
  /** The royalty fraction. */
  royaltyFraction_lte?: InputMaybe<Scalars['String']['input']>;
  /** The royalty maker. */
  royaltyMaker_eq?: InputMaybe<Scalars['String']['input']>;
  /** The royalty maker. */
  royaltyMaker_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The royalty maker. */
  royaltyMaker_gt?: InputMaybe<Scalars['String']['input']>;
  /** The royalty maker. */
  royaltyMaker_gte?: InputMaybe<Scalars['String']['input']>;
  /** The royalty maker. */
  royaltyMaker_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The royalty maker. */
  royaltyMaker_lt?: InputMaybe<Scalars['String']['input']>;
  /** The royalty maker. */
  royaltyMaker_lte?: InputMaybe<Scalars['String']['input']>;
  /** The token ID. */
  tokenId_eq?: InputMaybe<Scalars['String']['input']>;
  /** The token ID. */
  tokenId_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The token ID. */
  tokenId_gt?: InputMaybe<Scalars['String']['input']>;
  /** The token ID. */
  tokenId_gte?: InputMaybe<Scalars['String']['input']>;
  /** The token ID. */
  tokenId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The token ID. */
  tokenId_lt?: InputMaybe<Scalars['String']['input']>;
  /** The token ID. */
  tokenId_lte?: InputMaybe<Scalars['String']['input']>;
  /** The metadata URI. */
  uri_eq?: InputMaybe<Scalars['String']['input']>;
  /** The metadata URI. */
  uri_exists?: InputMaybe<Scalars['Boolean']['input']>;
  /** The metadata URI. */
  uri_gt?: InputMaybe<Scalars['String']['input']>;
  /** The metadata URI. */
  uri_gte?: InputMaybe<Scalars['String']['input']>;
  /** The metadata URI. */
  uri_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The metadata URI. */
  uri_lt?: InputMaybe<Scalars['String']['input']>;
  /** The metadata URI. */
  uri_lte?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  _id: Scalars['String']['output'];
  handle_instagram?: Maybe<Scalars['String']['output']>;
  handle_twitter?: Maybe<Scalars['String']['output']>;
  image_avatar?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  tagline?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export type WertOptionsOrder = {
  id: Scalars['String']['input'];
  network: Scalars['String']['input'];
};

export enum WertOptionsType {
  Bid = 'BID',
  Fill = 'FILL'
}

export type TokensQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sample?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TokenWhereComplex>;
  sort?: InputMaybe<TokenSort>;
}>;


export type TokensQuery = { __typename: 'Query', tokens: Array<{ __typename: 'TokenComplex', id: string, contract: string, tokenId: string, uri?: string | null, creator?: string | null, metadata?: any | null, network: string, creatorExpanded?: { __typename: 'User', _id: string, name: string, username?: string | null, image_avatar?: string | null } | null }> };

export type GetTokenQueryVariables = Exact<{
  id: Scalars['String']['input'];
  network?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetTokenQuery = { __typename: 'Query', token?: { __typename: 'TokenDetail', network: string, id: string, contract: string, tokenId: string, uri?: string | null, metadata?: any | null, owner?: string | null, creator?: string | null, royalties?: Array<{ __typename: 'TokenRoyalty', account: string, value: string }> | null, ownerExpanded?: { __typename: 'User', name: string, image_avatar?: string | null, username?: string | null, _id: string } | null, creatorExpanded?: { __typename: 'User', _id: string, name: string, username?: string | null, image_avatar?: string | null } | null, metadataCreatorsExpanded?: Array<{ __typename: 'User', _id: string, name: string, username?: string | null, image_avatar?: string | null } | null> | null, orders?: Array<{ __typename: 'TokenDetailOrder', createdAt: string, updatedAt?: string | null, updatedTransaction?: string | null, maker: string, price: string, transaction: string, paidAmount?: string | null, taker?: string | null, makerExpanded?: { __typename: 'User', _id: string, image_avatar?: string | null, name: string, username?: string | null } | null, currency?: { __typename: 'OrderCurrency', id: string, name?: string | null, symbol?: string | null } | null, bids: Array<{ __typename: 'TokenDetailOrderBid', createdAt: string, bidder: string, bidAmount: string, transaction: string, bidderExpanded?: { __typename: 'User', _id: string, image_avatar?: string | null, name: string, username?: string | null } | null }>, takerExpanded?: { __typename: 'User', _id: string, image_avatar?: string | null, name: string, username?: string | null } | null }> | null, transfers?: Array<{ __typename: 'TokenDetailTransfer', createdAt: string, from: string, to: string, transaction: string, fromExpanded?: { __typename: 'User', _id: string, image_avatar?: string | null, name: string, username?: string | null } | null, toExpanded?: { __typename: 'User', _id: string, username?: string | null, image_avatar?: string | null, name: string } | null }> | null, registry: { __typename: 'Registry', supportsLemonadePoapV1?: boolean | null } } | null };


export const TokensDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"tokens"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sample"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TokenWhereComplex"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TokenSort"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"tokens"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"sample"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sample"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"contract"}},{"kind":"Field","name":{"kind":"Name","value":"tokenId"}},{"kind":"Field","name":{"kind":"Name","value":"uri"}},{"kind":"Field","name":{"kind":"Name","value":"creator"}},{"kind":"Field","name":{"kind":"Name","value":"creatorExpanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"network"}}]}}]}}]} as unknown as DocumentNode<TokensQuery, TokensQueryVariables>;
export const GetTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"network"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","alias":{"kind":"Name","value":"token"},"name":{"kind":"Name","value":"getToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"network"},"value":{"kind":"Variable","name":{"kind":"Name","value":"network"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"contract"}},{"kind":"Field","name":{"kind":"Name","value":"tokenId"}},{"kind":"Field","name":{"kind":"Name","value":"uri"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"royalties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"account"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"ownerExpanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"creator"}},{"kind":"Field","name":{"kind":"Name","value":"creatorExpanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadataCreatorsExpanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"orders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedTransaction"}},{"kind":"Field","name":{"kind":"Name","value":"maker"}},{"kind":"Field","name":{"kind":"Name","value":"makerExpanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"currency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"bids"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"bidder"}},{"kind":"Field","name":{"kind":"Name","value":"bidderExpanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bidAmount"}},{"kind":"Field","name":{"kind":"Name","value":"transaction"}}]}},{"kind":"Field","name":{"kind":"Name","value":"transaction"}},{"kind":"Field","name":{"kind":"Name","value":"paidAmount"}},{"kind":"Field","name":{"kind":"Name","value":"taker"}},{"kind":"Field","name":{"kind":"Name","value":"takerExpanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"transfers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"from"}},{"kind":"Field","name":{"kind":"Name","value":"to"}},{"kind":"Field","name":{"kind":"Name","value":"fromExpanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"toExpanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"transaction"}}]}},{"kind":"Field","name":{"kind":"Name","value":"registry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"supportsLemonadePoapV1"}}]}}]}}]}}]} as unknown as DocumentNode<GetTokenQuery, GetTokenQueryVariables>;