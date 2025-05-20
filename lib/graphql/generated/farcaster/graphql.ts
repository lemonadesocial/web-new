/* eslint-disable */
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
  Address: { input: any; output: any; }
  Any: { input: any; output: any; }
  DateRange: { input: any; output: any; }
  Identity: { input: any; output: any; }
  IntString: { input: any; output: any; }
  Map: { input: any; output: any; }
  Range: { input: any; output: any; }
  Time: { input: any; output: any; }
  TimeRange: { input: any; output: any; }
};

export type AccountOrderBy = {
  createdAtBlockTimestamp?: InputMaybe<OrderBy>;
};

export type Address_Comparator_Exp = {
  _eq?: InputMaybe<Scalars['Address']['input']>;
  _in?: InputMaybe<Array<Scalars['Address']['input']>>;
  _ne?: InputMaybe<Scalars['Address']['input']>;
  _nin?: InputMaybe<Array<Scalars['Address']['input']>>;
};

export type AllocationDistribution = {
  __typename?: 'AllocationDistribution';
  allocationType: Scalars['String']['output'];
  earningsAmount: Scalars['Float']['output'];
  earningsAmountInWei: Scalars['String']['output'];
};

export type AnimationUrlVariants = {
  __typename?: 'AnimationUrlVariants';
  original?: Maybe<Scalars['String']['output']>;
};

export enum Audience {
  All = 'all',
  Farcaster = 'farcaster'
}

export type AudioVariants = {
  __typename?: 'AudioVariants';
  original?: Maybe<Scalars['String']['output']>;
};

export type BaseMoxieEarningLeaderboardData = {
  __typename?: 'BaseMoxieEarningLeaderboardData';
  allTimeRewards: Scalars['Float']['output'];
  gasSpent: Scalars['Float']['output'];
  rewards?: Maybe<Scalars['Float']['output']>;
  rewardsPercentage?: Maybe<Scalars['Float']['output']>;
  rewardsScore: Scalars['Float']['output'];
  userId: Scalars['String']['output'];
};

export type BaseMoxieEarningLeaderboardInput = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  endDate: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  order: BaseMoxieEarningLeaderboardOrder;
  startDate: Scalars['String']['input'];
};

export enum BaseMoxieEarningLeaderboardOrder {
  GasSpent = 'GAS_SPENT',
  MoxieScore = 'MOXIE_SCORE',
  PercentageRewards = 'PERCENTAGE_REWARDS',
  RewardsAllTime = 'REWARDS_ALL_TIME',
  RewardsTimeframe = 'REWARDS_TIMEFRAME'
}

export type BaseMoxieEarningLeaderboardOutput = {
  __typename?: 'BaseMoxieEarningLeaderboardOutput';
  BaseMoxieEarningLeaderboardData?: Maybe<Array<BaseMoxieEarningLeaderboardData>>;
  pageInfo?: Maybe<PageInfo>;
};

export type BaseMoxieEarningStatV2 = {
  __typename?: 'BaseMoxieEarningStatV2';
  allEarningsAmount?: Maybe<Scalars['Float']['output']>;
  allEarningsAmountInWei?: Maybe<Scalars['String']['output']>;
  avgDailyEarnings?: Maybe<Scalars['Float']['output']>;
  entityId: Scalars['String']['output'];
  entityType: FarcasterMoxieEarningStatsV2EntityType;
  timeframe: FarcasterMoxieEarningStatsTimeframe;
};

export type BaseMoxieEarningStatsV2Filter = {
  entityId?: InputMaybe<String_Eq_In_Comparator_Exp>;
  entityType: FarcasterMoxieEarningStatsV2EntityType_Comparator_Exp;
};

export type BaseMoxieEarningStatsV2Input = {
  blockchain: EveryBlockchain;
  cursor?: InputMaybe<Scalars['String']['input']>;
  filter: BaseMoxieEarningStatsV2Filter;
  limit?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<BaseMoxieEarningStatsV2OrderBy>>;
  timeframe: FarcasterMoxieEarningStatsTimeframe;
};

export type BaseMoxieEarningStatsV2OrderBy = {
  allEarnings?: InputMaybe<OrderBy>;
};

export type BaseMoxieEarningStatsV2Output = {
  __typename?: 'BaseMoxieEarningStatsV2Output';
  BaseMoxieEarningStatV2?: Maybe<Array<BaseMoxieEarningStatV2>>;
  pageInfo?: Maybe<PageInfo>;
};

export type BeneficiaryVestingAddress = {
  __typename?: 'BeneficiaryVestingAddress';
  beneficiaryAddress?: Maybe<Scalars['String']['output']>;
  vestingContractAddress?: Maybe<Scalars['String']['output']>;
};

export enum Blockchain {
  Ethereum = 'ethereum'
}

export type Boolean_Comparator_Exp = {
  _eq?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CastValue = {
  __typename?: 'CastValue';
  formattedValue?: Maybe<Scalars['Float']['output']>;
  hash?: Maybe<Scalars['String']['output']>;
  rawValue?: Maybe<Scalars['String']['output']>;
};

export type ClaimSplit = {
  __typename?: 'ClaimSplit';
  amount?: Maybe<Scalars['Float']['output']>;
  amountInWei?: Maybe<Scalars['String']['output']>;
  rewardType?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Scalars['String']['output']>;
};

export type ConnectedAddress = {
  __typename?: 'ConnectedAddress';
  address?: Maybe<Scalars['Address']['output']>;
  blockchain?: Maybe<Scalars['String']['output']>;
  chainId?: Maybe<Scalars['String']['output']>;
  timestamp?: Maybe<Scalars['Time']['output']>;
};

export type Date_Range_Comparator_Exp = {
  _eq?: InputMaybe<Scalars['String']['input']>;
};

export enum DomainDappName {
  Ens = 'ens'
}

export type DomainDappName_Comparator_Exp = {
  _eq?: InputMaybe<DomainDappName>;
  _in?: InputMaybe<Array<DomainDappName>>;
};

export enum DomainDappSlug {
  EnsV1 = 'ens_v1'
}

export type DomainDappSlug_Comparator_Exp = {
  _eq?: InputMaybe<DomainDappSlug>;
  _in?: InputMaybe<Array<DomainDappSlug>>;
};

export type DomainFilter = {
  isPrimary?: InputMaybe<Boolean_Comparator_Exp>;
  lastUpdatedBlockTimestamp?: InputMaybe<Time_Comparator_Exp>;
  name?: InputMaybe<String_Comparator_Exp>;
  owner?: InputMaybe<Identity_Comparator_Exp>;
  resolvedAddress?: InputMaybe<Address_Comparator_Exp>;
};

export type DomainMultiChainAddress = {
  __typename?: 'DomainMultiChainAddress';
  /** address */
  address?: Maybe<Scalars['String']['output']>;
  /** symbol according to SLIP-0044 */
  symbol?: Maybe<Scalars['String']['output']>;
};

export type DomainOrderBy = {
  createdAtBlockTimestamp?: InputMaybe<OrderBy>;
  expiryTimestamp?: InputMaybe<OrderBy>;
  lastUpdatedBlockTimestamp?: InputMaybe<OrderBy>;
};

export type DomainTexts = {
  __typename?: 'DomainTexts';
  /** key of the text */
  key?: Maybe<Scalars['String']['output']>;
  /** value of the text */
  value?: Maybe<Scalars['String']['output']>;
};

export type DomainsInput = {
  blockchain: Blockchain;
  cursor?: InputMaybe<Scalars['String']['input']>;
  filter: DomainFilter;
  limit?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<DomainOrderBy>>;
};

export enum EarnerType {
  ChannelFans = 'CHANNEL_FANS',
  Creator = 'CREATOR',
  CreatorFans = 'CREATOR_FANS',
  Network = 'NETWORK'
}

export type EarningsDistribution = {
  __typename?: 'EarningsDistribution';
  earningSourceLogo: Scalars['String']['output'];
  earningSourceUrl: Scalars['String']['output'];
  earningsAmount: Scalars['Float']['output'];
  earningsAmountInWei: Scalars['String']['output'];
  earningsSource: Scalars['String']['output'];
  earningsType: Scalars['String']['output'];
};

export enum EveryBlockchain {
  All = 'ALL'
}

export type FarScoreFilter = {
  farRank?: InputMaybe<Int_Comparator_Exp>;
  farScore?: InputMaybe<Float_Comparator_Exp>;
  fid?: InputMaybe<Int_Comparator_Exp>;
  heroBoost?: InputMaybe<Float_Comparator_Exp>;
  lpBoost?: InputMaybe<Float_Comparator_Exp>;
  organicScore?: InputMaybe<Float_Comparator_Exp>;
  organicScoreRank?: InputMaybe<Int_Comparator_Exp>;
  powerBoost?: InputMaybe<Float_Comparator_Exp>;
  tvlBoost?: InputMaybe<Float_Comparator_Exp>;
};

export type FarScoreInput = {
  blockchain?: InputMaybe<EveryBlockchain>;
  cursor?: InputMaybe<Scalars['String']['input']>;
  filter: FarScoreFilter;
  limit?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<FarScoreOrderBy>>;
};

export type FarScoreOrderBy = {
  farRank?: InputMaybe<OrderBy>;
  farScore?: InputMaybe<OrderBy>;
  lpBoost?: InputMaybe<OrderBy>;
  organicScore?: InputMaybe<OrderBy>;
  organicScoreRank?: InputMaybe<OrderBy>;
  powerBoost?: InputMaybe<OrderBy>;
  tvlBoost?: InputMaybe<OrderBy>;
};

export type FarcasterCastFilter = {
  castedAtTimestamp?: InputMaybe<Time_Comparator_Exp>;
  castedBy?: InputMaybe<Identity_Comparator_Exp>;
  frameUrl?: InputMaybe<String_Eq_In_Comparator_Exp>;
  hasEmbeds?: InputMaybe<Boolean_Comparator_Exp>;
  hasFrames?: InputMaybe<Boolean_Comparator_Exp>;
  hasMentions?: InputMaybe<Boolean_Comparator_Exp>;
  hash?: InputMaybe<String_Eq_In_Comparator_Exp>;
  rootParentUrl?: InputMaybe<String_Eq_In_Comparator_Exp>;
  showDeleted?: InputMaybe<Boolean_Comparator_Exp>;
  url?: InputMaybe<String_Eq_In_Comparator_Exp>;
};

export enum FarcasterChannelActionType {
  Cast = 'cast',
  Follow = 'follow',
  Member = 'member',
  Reply = 'reply'
}

export type FarcasterChannelActionType_Comparator_Exp = {
  _eq?: InputMaybe<FarcasterChannelActionType>;
  _in?: InputMaybe<Array<FarcasterChannelActionType>>;
};

export type FarcasterChannelFilter = {
  channelId?: InputMaybe<Regex_String_Comparator_Exp>;
  createdAtTimestamp?: InputMaybe<Time_Comparator_Exp>;
  leadId?: InputMaybe<String_Comparator_Exp>;
  leadIdentity?: InputMaybe<Identity_Comparator_Exp>;
  moderatorId?: InputMaybe<String_Comparator_Exp>;
  moderatorIdentity?: InputMaybe<Identity_Comparator_Exp>;
  name?: InputMaybe<Regex_String_Comparator_Exp>;
  url?: InputMaybe<String_Comparator_Exp>;
};

export type FarcasterChannelOrderBy = {
  createdAtTimestamp?: InputMaybe<OrderBy>;
  followerCount?: InputMaybe<OrderBy>;
};

export type FarcasterChannelParticipantFilter = {
  channelActions?: InputMaybe<FarcasterChannelActionType_Comparator_Exp>;
  channelId?: InputMaybe<Regex_String_Comparator_Exp>;
  channelName?: InputMaybe<Regex_String_Comparator_Exp>;
  lastActionTimestamp?: InputMaybe<Time_Comparator_Exp>;
  participant?: InputMaybe<Identity_Comparator_Exp>;
  participantId?: InputMaybe<String_Eq_In_Comparator_Exp>;
};

export type FarcasterChannelParticipantOrderBy = {
  lastActionTimestamp?: InputMaybe<OrderBy>;
};

export type FarcasterChannelParticipantsInput = {
  blockchain: EveryBlockchain;
  cursor?: InputMaybe<Scalars['String']['input']>;
  filter: FarcasterChannelParticipantFilter;
  limit?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<FarcasterChannelParticipantOrderBy>>;
};

export type FarcasterChannelsInput = {
  blockchain: EveryBlockchain;
  cursor?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<FarcasterChannelFilter>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<FarcasterChannelOrderBy>>;
};

export type FarcasterFanTokenAuction = {
  __typename?: 'FarcasterFanTokenAuction';
  auctionId?: Maybe<Scalars['Int']['output']>;
  auctionSupply?: Maybe<Scalars['Float']['output']>;
  decimals?: Maybe<Scalars['Int']['output']>;
  entityId: Scalars['String']['output'];
  entityName?: Maybe<Scalars['String']['output']>;
  entitySymbol?: Maybe<Scalars['String']['output']>;
  entityType: FarcasterFanTokenAuctionEntityType;
  estimatedEndTimestamp: Scalars['Time']['output'];
  estimatedStartTimestamp: Scalars['Time']['output'];
  launchCastUrl?: Maybe<Scalars['String']['output']>;
  minBiddingAmount?: Maybe<Scalars['Float']['output']>;
  minFundingAmount?: Maybe<Scalars['Float']['output']>;
  minPriceInMoxie?: Maybe<Scalars['Float']['output']>;
  rewardDistributionPercentage?: Maybe<RewardDistributionPercentage>;
  status: FarcasterFanTokenAuctionStatusType;
  subjectAddress?: Maybe<Scalars['String']['output']>;
};

export enum FarcasterFanTokenAuctionEntityType {
  Channel = 'CHANNEL',
  Network = 'NETWORK',
  User = 'USER'
}

export type FarcasterFanTokenAuctionEntityType_Comparator_Exp = {
  _eq?: InputMaybe<FarcasterFanTokenAuctionEntityType>;
  _in?: InputMaybe<Array<FarcasterFanTokenAuctionEntityType>>;
};

export enum FarcasterFanTokenAuctionStatusType {
  Active = 'ACTIVE',
  Completed = 'COMPLETED',
  Upcoming = 'UPCOMING'
}

export type FarcasterFanTokenAuctionStatusType_Comparator_Exp = {
  _eq?: InputMaybe<FarcasterFanTokenAuctionStatusType>;
  _in?: InputMaybe<Array<FarcasterFanTokenAuctionStatusType>>;
};

export type FarcasterFanTokenAuctionsFilter = {
  entityId?: InputMaybe<String_Eq_In_Comparator_Exp>;
  entityName?: InputMaybe<String_Eq_In_Comparator_Exp>;
  entityType: FarcasterFanTokenAuctionEntityType_Comparator_Exp;
  status?: InputMaybe<FarcasterFanTokenAuctionStatusType_Comparator_Exp>;
};

export type FarcasterFanTokenAuctionsInput = {
  blockchain: EveryBlockchain;
  cursor?: InputMaybe<Scalars['String']['input']>;
  filter: FarcasterFanTokenAuctionsFilter;
  limit?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<FarcasterFanTokenAuctionsOrderBy>>;
};

export type FarcasterFanTokenAuctionsOrderBy = {
  estimatedEndTimestamp?: InputMaybe<OrderBy>;
  estimatedStartTimestamp?: InputMaybe<OrderBy>;
};

export type FarcasterFanTokenAuctionsOutput = {
  __typename?: 'FarcasterFanTokenAuctionsOutput';
  FarcasterFanTokenAuction?: Maybe<Array<FarcasterFanTokenAuction>>;
  pageInfo?: Maybe<PageInfo>;
};

export type FarcasterFrameMessageInput = {
  filter: FarcasterFrameMessageInputFilter;
};

export type FarcasterFrameMessageInputFilter = {
  messageBytes?: InputMaybe<Scalars['String']['input']>;
};

export type FarcasterMoxieClaimDetails = {
  __typename?: 'FarcasterMoxieClaimDetails';
  availableClaimAmount?: Maybe<Scalars['Float']['output']>;
  availableClaimAmountInWei?: Maybe<Scalars['String']['output']>;
  availableClaimAmountSplits?: Maybe<Array<Maybe<ClaimSplit>>>;
  chainId?: Maybe<Scalars['String']['output']>;
  claimedAmount?: Maybe<Scalars['Float']['output']>;
  claimedAmountInWei?: Maybe<Scalars['String']['output']>;
  claimedAmountSplits?: Maybe<Array<Maybe<ClaimSplit>>>;
  fid?: Maybe<Scalars['String']['output']>;
  processingAmount?: Maybe<Scalars['Float']['output']>;
  processingAmountInWei?: Maybe<Scalars['String']['output']>;
  processingAmountSplits?: Maybe<Array<Maybe<ClaimSplit>>>;
  tokenAddress?: Maybe<Scalars['String']['output']>;
  transactionAmountSplits?: Maybe<Array<Maybe<ClaimSplit>>>;
};

export type FarcasterMoxieClaimDetailsFilter = {
  fid?: InputMaybe<String_Eq_In_Comparator_Exp>;
};

export type FarcasterMoxieClaimDetailsInput = {
  blockchain: EveryBlockchain;
  cursor?: InputMaybe<Scalars['String']['input']>;
  filter: FarcasterMoxieClaimDetailsFilter;
  limit?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<FarcasterMoxieClaimDetailsOrderBy>>;
};

export type FarcasterMoxieClaimDetailsOrderBy = {
  availableClaimAmount?: InputMaybe<OrderBy>;
  claimedAmount?: InputMaybe<OrderBy>;
  processingAmount?: InputMaybe<OrderBy>;
};

export type FarcasterMoxieClaimDetailsOutput = {
  __typename?: 'FarcasterMoxieClaimDetailsOutput';
  FarcasterMoxieClaimDetails?: Maybe<Array<FarcasterMoxieClaimDetails>>;
  pageInfo?: Maybe<PageInfo>;
};

export type FarcasterMoxieEarningStat = {
  __typename?: 'FarcasterMoxieEarningStat';
  allEarningsAmount?: Maybe<Scalars['Float']['output']>;
  allEarningsAmountInWei?: Maybe<Scalars['String']['output']>;
  castEarningsAmount?: Maybe<Scalars['Float']['output']>;
  castEarningsAmountInWei?: Maybe<Scalars['String']['output']>;
  endTimestamp: Scalars['Time']['output'];
  entityId: Scalars['String']['output'];
  entityType: FarcasterMoxieEarningStatsEntityType;
  frameDevEarningsAmount?: Maybe<Scalars['Float']['output']>;
  frameDevEarningsAmountInWei?: Maybe<Scalars['String']['output']>;
  otherEarningsAmount?: Maybe<Scalars['Float']['output']>;
  otherEarningsAmountInWei?: Maybe<Scalars['String']['output']>;
  splitDetails?: Maybe<Array<FarcasterMoxieEarningStatSplitDetails>>;
  startTimestamp: Scalars['Time']['output'];
  timeframe: FarcasterMoxieEarningStatsTimeframe;
};

export type FarcasterMoxieEarningStatSplitDetails = {
  __typename?: 'FarcasterMoxieEarningStatSplitDetails';
  castEarningsAmount?: Maybe<Scalars['Float']['output']>;
  castEarningsAmountInWei?: Maybe<Scalars['String']['output']>;
  entityType: Scalars['String']['output'];
  frameDevEarningsAmount?: Maybe<Scalars['Float']['output']>;
  frameDevEarningsAmountInWei?: Maybe<Scalars['String']['output']>;
  otherEarningsAmount?: Maybe<Scalars['Float']['output']>;
  otherEarningsAmountInWei?: Maybe<Scalars['String']['output']>;
};

export type FarcasterMoxieEarningStatV2 = {
  __typename?: 'FarcasterMoxieEarningStatV2';
  allEarningsAmount?: Maybe<Scalars['Float']['output']>;
  allEarningsAmountInWei?: Maybe<Scalars['String']['output']>;
  allocationDistribution?: Maybe<Array<AllocationDistribution>>;
  earningsDistribution?: Maybe<Array<EarningsDistribution>>;
  entityId: Scalars['String']['output'];
  entityType: FarcasterMoxieEarningStatsV2EntityType;
  isFtaUser?: Maybe<Scalars['Boolean']['output']>;
  isNonFtaEarner?: Maybe<Scalars['Boolean']['output']>;
  nonFtaEarnerLimits?: Maybe<Scalars['Int']['output']>;
  timeframe: FarcasterMoxieEarningStatsTimeframe;
};

export enum FarcasterMoxieEarningStatsEntityType {
  Channel = 'CHANNEL',
  Network = 'NETWORK',
  User = 'USER'
}

export type FarcasterMoxieEarningStatsEntityType_Comparator_Exp = {
  _eq?: InputMaybe<FarcasterMoxieEarningStatsEntityType>;
  _in?: InputMaybe<Array<FarcasterMoxieEarningStatsEntityType>>;
};

export type FarcasterMoxieEarningStatsFilter = {
  entityId?: InputMaybe<String_Eq_In_Comparator_Exp>;
  entityType: FarcasterMoxieEarningStatsEntityType_Comparator_Exp;
};

export type FarcasterMoxieEarningStatsInput = {
  blockchain: EveryBlockchain;
  cursor?: InputMaybe<Scalars['String']['input']>;
  filter: FarcasterMoxieEarningStatsFilter;
  limit?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<FarcasterMoxieEarningStatsOrderBy>>;
  timeframe: FarcasterMoxieEarningStatsTimeframe;
};

export type FarcasterMoxieEarningStatsOrderBy = {
  allEarnings?: InputMaybe<OrderBy>;
  castEarnings?: InputMaybe<OrderBy>;
  frameDevEarnings?: InputMaybe<OrderBy>;
  otherEarnings?: InputMaybe<OrderBy>;
};

export type FarcasterMoxieEarningStatsOutput = {
  __typename?: 'FarcasterMoxieEarningStatsOutput';
  FarcasterMoxieEarningStat?: Maybe<Array<FarcasterMoxieEarningStat>>;
  pageInfo?: Maybe<PageInfo>;
};

export enum FarcasterMoxieEarningStatsTimeframe {
  Hourly = 'HOURLY',
  Lifetime = 'LIFETIME',
  Today = 'TODAY',
  Weekly = 'WEEKLY',
  Yesterday = 'YESTERDAY'
}

export enum FarcasterMoxieEarningStatsV2EntityType {
  Channel = 'CHANNEL',
  Network = 'NETWORK',
  User = 'USER'
}

export type FarcasterMoxieEarningStatsV2EntityType_Comparator_Exp = {
  _eq?: InputMaybe<FarcasterMoxieEarningStatsV2EntityType>;
  _in?: InputMaybe<Array<FarcasterMoxieEarningStatsV2EntityType>>;
};

export type FarcasterMoxieEarningStatsV2Filter = {
  earning_source?: InputMaybe<String_Eq_In_Comparator_Exp>;
  entityId?: InputMaybe<String_Eq_In_Comparator_Exp>;
  entityType: FarcasterMoxieEarningStatsV2EntityType_Comparator_Exp;
  isFtaUser?: InputMaybe<Boolean_Comparator_Exp>;
};

export type FarcasterMoxieEarningStatsV2Input = {
  blockchain: EveryBlockchain;
  cursor?: InputMaybe<Scalars['String']['input']>;
  filter: FarcasterMoxieEarningStatsV2Filter;
  limit?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<FarcasterMoxieEarningStatsV2OrderBy>>;
  timeframe: FarcasterMoxieEarningStatsTimeframe;
};

export type FarcasterMoxieEarningStatsV2OrderBy = {
  allEarnings?: InputMaybe<OrderBy>;
};

export type FarcasterMoxieEarningStatsV2Output = {
  __typename?: 'FarcasterMoxieEarningStatsV2Output';
  FarcasterMoxieEarningStatV2?: Maybe<Array<FarcasterMoxieEarningStatV2>>;
  pageInfo?: Maybe<PageInfo>;
};

export type FarcasterNotaEarningStat = {
  __typename?: 'FarcasterNotaEarningStat';
  allEarningsAmount?: Maybe<Scalars['Float']['output']>;
  allEarningsAmountInWei?: Maybe<Scalars['String']['output']>;
  castEarningsAmount?: Maybe<Scalars['Float']['output']>;
  castEarningsAmountInWei?: Maybe<Scalars['String']['output']>;
  endTimestamp: Scalars['Time']['output'];
  entityId: Scalars['String']['output'];
  entityType: FarcasterFanTokenAuctionEntityType;
  frameDevEarningsAmount?: Maybe<Scalars['Float']['output']>;
  frameDevEarningsAmountInWei?: Maybe<Scalars['String']['output']>;
  otherEarningsAmount?: Maybe<Scalars['Float']['output']>;
  otherEarningsAmountInWei?: Maybe<Scalars['String']['output']>;
  startTimestamp: Scalars['Time']['output'];
  timeframe: FarcasterNotaEarningStatsTimeframe;
};

export enum FarcasterNotaEarningStatsEntityType {
  Channel = 'CHANNEL',
  User = 'USER'
}

export type FarcasterNotaEarningStatsEntityType_Comparator_Exp = {
  _eq?: InputMaybe<FarcasterNotaEarningStatsEntityType>;
  _in?: InputMaybe<Array<FarcasterNotaEarningStatsEntityType>>;
};

export type FarcasterNotaEarningStatsFilter = {
  entityId?: InputMaybe<String_Eq_In_Comparator_Exp>;
  entityType: FarcasterNotaEarningStatsEntityType_Comparator_Exp;
};

export type FarcasterNotaEarningStatsInput = {
  blockchain: EveryBlockchain;
  cursor?: InputMaybe<Scalars['String']['input']>;
  filter: FarcasterNotaEarningStatsFilter;
  limit?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<FarcasterNotaEarningStatsOrderBy>>;
  timeframe: FarcasterNotaEarningStatsTimeframe;
};

export type FarcasterNotaEarningStatsOrderBy = {
  allEarnings?: InputMaybe<OrderBy>;
  castEarnings?: InputMaybe<OrderBy>;
  frameDevEarnings?: InputMaybe<OrderBy>;
  otherEarnings?: InputMaybe<OrderBy>;
};

export type FarcasterNotaEarningStatsOutput = {
  __typename?: 'FarcasterNotaEarningStatsOutput';
  FarcasterNotaEarningStat?: Maybe<Array<FarcasterNotaEarningStat>>;
  pageInfo?: Maybe<PageInfo>;
};

export enum FarcasterNotaEarningStatsTimeframe {
  Lifetime = 'LIFETIME'
}

export type FarcasterScore = {
  __typename?: 'FarcasterScore';
  farBoost?: Maybe<Scalars['Float']['output']>;
  farRank?: Maybe<Scalars['Int']['output']>;
  farScore?: Maybe<Scalars['Float']['output']>;
  farScoreRaw?: Maybe<Scalars['String']['output']>;
  heroBoost?: Maybe<Scalars['Float']['output']>;
  liquidityBoost?: Maybe<Scalars['Float']['output']>;
  powerBoost?: Maybe<Scalars['Float']['output']>;
  tvl?: Maybe<Scalars['String']['output']>;
  tvlBoost?: Maybe<Scalars['Float']['output']>;
};

export type Float_Comparator_Exp = {
  _eq?: InputMaybe<Scalars['Float']['input']>;
  _gt?: InputMaybe<Scalars['Float']['input']>;
  _gte?: InputMaybe<Scalars['Float']['input']>;
  _in?: InputMaybe<Array<Scalars['Float']['input']>>;
  _lt?: InputMaybe<Scalars['Float']['input']>;
  _lte?: InputMaybe<Scalars['Float']['input']>;
  _ne?: InputMaybe<Scalars['Float']['input']>;
  _nin?: InputMaybe<Array<Scalars['Float']['input']>>;
};

export type Identity_Comparator_Exp = {
  _eq?: InputMaybe<Scalars['Identity']['input']>;
  _in?: InputMaybe<Array<Scalars['Identity']['input']>>;
};

export type ImageSizes = {
  __typename?: 'ImageSizes';
  extraSmall?: Maybe<Scalars['String']['output']>;
  large?: Maybe<Scalars['String']['output']>;
  medium?: Maybe<Scalars['String']['output']>;
  original?: Maybe<Scalars['String']['output']>;
  small?: Maybe<Scalars['String']['output']>;
};

export type Int_Comparator_Exp = {
  _eq?: InputMaybe<Scalars['Int']['input']>;
  _gt?: InputMaybe<Scalars['Int']['input']>;
  _gte?: InputMaybe<Scalars['Int']['input']>;
  _in?: InputMaybe<Array<Scalars['Int']['input']>>;
  _lt?: InputMaybe<Scalars['Int']['input']>;
  _lte?: InputMaybe<Scalars['Int']['input']>;
  _ne?: InputMaybe<Scalars['Int']['input']>;
  _nin?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type Int_String_Comparator_Exp = {
  _eq?: InputMaybe<Scalars['String']['input']>;
  _gt?: InputMaybe<Scalars['String']['input']>;
  _gte?: InputMaybe<Scalars['String']['input']>;
  _in?: InputMaybe<Array<Scalars['String']['input']>>;
  _lt?: InputMaybe<Scalars['String']['input']>;
  _lte?: InputMaybe<Scalars['String']['input']>;
  _ne?: InputMaybe<Scalars['String']['input']>;
  _nin?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type LockedInfo = {
  __typename?: 'LockedInfo';
  amount?: Maybe<Scalars['Float']['output']>;
  amountInWei?: Maybe<Scalars['String']['output']>;
  unlockTimeInSec?: Maybe<Scalars['Float']['output']>;
};

export type LogoSizes = {
  __typename?: 'LogoSizes';
  external?: Maybe<Scalars['String']['output']>;
  large?: Maybe<Scalars['String']['output']>;
  medium?: Maybe<Scalars['String']['output']>;
  original?: Maybe<Scalars['String']['output']>;
  small?: Maybe<Scalars['String']['output']>;
};

export type Media = {
  __typename?: 'Media';
  animation_url?: Maybe<AnimationUrlVariants>;
  audio?: Maybe<AudioVariants>;
  image?: Maybe<ImageSizes>;
  json?: Maybe<Scalars['String']['output']>;
  video?: Maybe<VideoVariants>;
};

export type MoxieEarningsSplit = {
  __typename?: 'MoxieEarningsSplit';
  earnerType: EarnerType;
  earningsAmount?: Maybe<Scalars['Float']['output']>;
  earningsAmountInWei?: Maybe<Scalars['String']['output']>;
};

export type MoxieFanToken = {
  __typename?: 'MoxieFanToken';
  currentPrice?: Maybe<Scalars['Float']['output']>;
  currentPriceInWei?: Maybe<Scalars['Float']['output']>;
  dailyVolumeChange?: Maybe<Scalars['Float']['output']>;
  fanTokenAddress?: Maybe<Scalars['String']['output']>;
  fanTokenName?: Maybe<Scalars['String']['output']>;
  fanTokenSymbol?: Maybe<Scalars['String']['output']>;
  lockedTvl?: Maybe<Scalars['Float']['output']>;
  lockedTvlInWei?: Maybe<Scalars['String']['output']>;
  tlv?: Maybe<Scalars['Float']['output']>;
  tokenLockedAmount?: Maybe<Scalars['Float']['output']>;
  tokenLockedAmountInWei?: Maybe<Scalars['String']['output']>;
  tokenUnlockedAmount?: Maybe<Scalars['Float']['output']>;
  tokenUnlockedAmountInWei?: Maybe<Scalars['String']['output']>;
  totalSupply?: Maybe<Scalars['Float']['output']>;
  uniqueHolders?: Maybe<Scalars['Int']['output']>;
  unlockedTvl?: Maybe<Scalars['Float']['output']>;
  unlockedTvlInWei?: Maybe<Scalars['String']['output']>;
};

export type MoxieFanTokenFilter = {
  fanTokenAddress?: InputMaybe<String_Eq_In_Comparator_Exp>;
  fanTokenSymbol?: InputMaybe<String_Eq_In_Comparator_Exp>;
  uniqueHolders?: InputMaybe<Int_String_Comparator_Exp>;
};

export type MoxieFanTokenInput = {
  blockchain?: InputMaybe<EveryBlockchain>;
  cursor?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<MoxieFanTokenFilter>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<MoxieFanTokenOrderBy>>;
};

export type MoxieFanTokenOrderBy = {
  currentPrice?: InputMaybe<OrderBy>;
  fanTokenSymbol?: InputMaybe<OrderBy>;
  lockedTvl?: InputMaybe<OrderBy>;
  uniqueHolders?: InputMaybe<OrderBy>;
  unlockedTvl?: InputMaybe<OrderBy>;
};

export type MoxieFanTokenOutput = {
  __typename?: 'MoxieFanTokenOutput';
  MoxieFanToken?: Maybe<Array<MoxieFanToken>>;
  pageInfo?: Maybe<PageInfo>;
};

export type MoxieOrdersCandlestick = {
  __typename?: 'MoxieOrdersCandlestick';
  blockTimestamp?: Maybe<Scalars['Int']['output']>;
  /** Closing price at the end of the duration */
  closingPrice?: Maybe<Scalars['Float']['output']>;
  /** fan token address */
  fanTokenAddress?: Maybe<Scalars['String']['output']>;
  /** Highest price during the duration */
  maxPrice?: Maybe<Scalars['Float']['output']>;
  /** Lowest price during the duration */
  minPrice?: Maybe<Scalars['Float']['output']>;
  /** Opening price at the start of the duration */
  openingPrice?: Maybe<Scalars['Float']['output']>;
  /** Number of orders during the duration */
  orderCount?: Maybe<Scalars['Int']['output']>;
  /** Moxie spent on the orders */
  orderVolume?: Maybe<Scalars['Float']['output']>;
};

export type MoxieOrdersCandlestickFilter = {
  candleDuration: MoxieOrdersCandlestickTimeframe;
  endTimestamp: Scalars['Int']['input'];
  fanTokenAddress: Scalars['String']['input'];
  startTimestamp: Scalars['Int']['input'];
};

export type MoxieOrdersCandlestickInput = {
  blockchain?: InputMaybe<EveryBlockchain>;
  cursor?: InputMaybe<Scalars['String']['input']>;
  filter: MoxieOrdersCandlestickFilter;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type MoxieOrdersCandlestickOutput = {
  __typename?: 'MoxieOrdersCandlestickOutput';
  MoxieOrdersCandleStick?: Maybe<Array<MoxieOrdersCandlestick>>;
  pageInfo?: Maybe<PageInfo>;
};

export enum MoxieOrdersCandlestickTimeframe {
  FiveMin = 'FIVE_MIN',
  OneDay = 'ONE_DAY',
  OneHour = 'ONE_HOUR',
  OneMin = 'ONE_MIN',
  OneMonth = 'ONE_MONTH',
  OneWeek = 'ONE_WEEK',
  ThirtyMin = 'THIRTY_MIN',
  TwelveHour = 'TWELVE_HOUR'
}

export type MoxieReferralEarningLeaderboardData = {
  __typename?: 'MoxieReferralEarningLeaderboardData';
  rewards?: Maybe<Scalars['Float']['output']>;
  userId: Scalars['String']['output'];
};

export type MoxieReferralEarningLeaderboardInput = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type MoxieReferralEarningLeaderboardOutput = {
  __typename?: 'MoxieReferralEarningLeaderboardOutput';
  MoxieReferralEarningLeaderboardData?: Maybe<Array<MoxieReferralEarningLeaderboardData>>;
  pageInfo?: Maybe<PageInfo>;
};

export type MoxieUserPortfolio = {
  __typename?: 'MoxieUserPortfolio';
  beneficiaryVestingAddress?: Maybe<Array<Maybe<BeneficiaryVestingAddress>>>;
  currentPrice?: Maybe<Scalars['Float']['output']>;
  currentPriceInWei?: Maybe<Scalars['Float']['output']>;
  fanTokenAddress?: Maybe<Scalars['String']['output']>;
  fanTokenMoxieUserId?: Maybe<Scalars['String']['output']>;
  fanTokenName?: Maybe<Scalars['String']['output']>;
  fanTokenSymbol?: Maybe<Scalars['String']['output']>;
  fid?: Maybe<Scalars['String']['output']>;
  lockedTvl?: Maybe<Scalars['Float']['output']>;
  lockedTvlInWei?: Maybe<Scalars['String']['output']>;
  protocolTokenInvested?: Maybe<Scalars['Float']['output']>;
  protocolTokenInvestedInWei?: Maybe<Scalars['String']['output']>;
  tokenLockedTvl?: Maybe<Scalars['Float']['output']>;
  tokenLockedTvlInWei?: Maybe<Scalars['String']['output']>;
  tokenUnlockedTvl?: Maybe<Scalars['Float']['output']>;
  tokenUnlockedTvlInWei?: Maybe<Scalars['String']['output']>;
  totalLockedAmount?: Maybe<Scalars['Float']['output']>;
  totalLockedAmountInWei?: Maybe<Scalars['String']['output']>;
  totalTvl?: Maybe<Scalars['Float']['output']>;
  totalTvlInWei?: Maybe<Scalars['String']['output']>;
  totalUnlockedAmount?: Maybe<Scalars['Float']['output']>;
  totalUnlockedAmountInWei?: Maybe<Scalars['String']['output']>;
  unlockedTvl?: Maybe<Scalars['Float']['output']>;
  unlockedTvlInWei?: Maybe<Scalars['String']['output']>;
  walletAddresses?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  walletFanTokens?: Maybe<Array<Maybe<WalletFanTokens>>>;
};

export type MoxieUserPortfolioFilter = {
  fanTokenAddress?: InputMaybe<String_Eq_In_Comparator_Exp>;
  fanTokenSymbol?: InputMaybe<String_Eq_In_Comparator_Exp>;
  fid?: InputMaybe<String_Eq_In_Comparator_Exp>;
  moxieUserId?: InputMaybe<String_Eq_In_Comparator_Exp>;
  walletAddress?: InputMaybe<String_Eq_In_Comparator_Exp>;
};

export type MoxieUserPortfolioInput = {
  blockchain?: InputMaybe<EveryBlockchain>;
  cursor?: InputMaybe<Scalars['String']['input']>;
  filter: MoxieUserPortfolioFilter;
  limit?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<MoxieUserPortfolioOrderBy>>;
};

export type MoxieUserPortfolioOrderBy = {
  fid?: InputMaybe<OrderBy>;
  lockedTvl?: InputMaybe<OrderBy>;
  tokenLockedTvl?: InputMaybe<OrderBy>;
  tokenUnlockedTvl?: InputMaybe<OrderBy>;
  totalLockedAmount?: InputMaybe<OrderBy>;
  totalTvl?: InputMaybe<OrderBy>;
  totalUnlockedAmount?: InputMaybe<OrderBy>;
  unlockedTvl?: InputMaybe<OrderBy>;
};

export type MoxieUserPortfolioOutput = {
  __typename?: 'MoxieUserPortfolioOutput';
  MoxieUserPortfolio?: Maybe<Array<MoxieUserPortfolio>>;
  pageInfo?: Maybe<PageInfo>;
};

export type NativeBalanceFilter = {
  formattedAmount?: InputMaybe<Float_Comparator_Exp>;
  lastUpdatedTimestamp?: InputMaybe<Time_Comparator_Exp>;
  owner?: InputMaybe<Identity_Comparator_Exp>;
};

export type NativeBalanceOrderBy = {
  lastUpdatedTimestamp?: InputMaybe<OrderBy>;
};

export enum OrderBy {
  Asc = 'ASC',
  Desc = 'DESC'
}

export enum OrderByAsIntString {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type PageInfo = {
  __typename?: 'PageInfo';
  hasNextPage: Scalars['Boolean']['output'];
  hasPrevPage: Scalars['Boolean']['output'];
  nextCursor: Scalars['String']['output'];
  prevCursor: Scalars['String']['output'];
};

export type PopularDapp = {
  __typename?: 'PopularDapp';
  address?: Maybe<Scalars['String']['output']>;
  blockchain?: Maybe<Scalars['String']['output']>;
  chainId?: Maybe<Scalars['String']['output']>;
  criteria?: Maybe<Scalars['String']['output']>;
  criteriaCount?: Maybe<Scalars['Int']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  lastTransactionBlockNumber?: Maybe<Scalars['Int']['output']>;
  lastTransactionHash?: Maybe<Scalars['String']['output']>;
  lastTransactionTimestamp?: Maybe<Scalars['Time']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  timeFrom?: Maybe<Scalars['Time']['output']>;
  timeTo?: Maybe<Scalars['Time']['output']>;
  userbase?: Maybe<Scalars['String']['output']>;
  website?: Maybe<Scalars['String']['output']>;
};

export enum PopularDappsCriteria {
  GasSpent = 'GAS_SPENT',
  TotalTransactions = 'TOTAL_TRANSACTIONS',
  UniqueUsers = 'UNIQUE_USERS'
}

export type Query = {
  __typename?: 'Query';
  BaseMoxieEarningLeaderboard?: Maybe<BaseMoxieEarningLeaderboardOutput>;
  BaseMoxieEarningStatsV2?: Maybe<BaseMoxieEarningStatsV2Output>;
  FarcasterFanTokenAuctions?: Maybe<FarcasterFanTokenAuctionsOutput>;
  FarcasterMoxieEarningStats?: Maybe<FarcasterMoxieEarningStatsOutput>;
  FarcasterMoxieEarningStatsV2?: Maybe<FarcasterMoxieEarningStatsV2Output>;
  MoxieOrdersCandlesticks?: Maybe<MoxieOrdersCandlestickOutput>;
  MoxieReferralEarningLeaderboard?: Maybe<MoxieReferralEarningLeaderboardOutput>;
};


export type QueryBaseMoxieEarningLeaderboardArgs = {
  input: BaseMoxieEarningLeaderboardInput;
};


export type QueryBaseMoxieEarningStatsV2Args = {
  input: BaseMoxieEarningStatsV2Input;
};


export type QueryFarcasterFanTokenAuctionsArgs = {
  input: FarcasterFanTokenAuctionsInput;
};


export type QueryFarcasterMoxieEarningStatsArgs = {
  input: FarcasterMoxieEarningStatsInput;
};


export type QueryFarcasterMoxieEarningStatsV2Args = {
  input: FarcasterMoxieEarningStatsV2Input;
};


export type QueryMoxieOrdersCandlesticksArgs = {
  input: MoxieOrdersCandlestickInput;
};


export type QueryMoxieReferralEarningLeaderboardArgs = {
  input: MoxieReferralEarningLeaderboardInput;
};

export type Range_Comparator_Exp = {
  _eq?: InputMaybe<Scalars['Int']['input']>;
};

export type RealTimeFarScore = {
  __typename?: 'RealTimeFarScore';
  farRank?: Maybe<Scalars['Int']['output']>;
  farScore?: Maybe<Scalars['Float']['output']>;
  heroBoost?: Maybe<Scalars['Float']['output']>;
  lpBoost?: Maybe<Scalars['Float']['output']>;
  organicScore?: Maybe<Scalars['Float']['output']>;
  organicScoreRank?: Maybe<Scalars['Int']['output']>;
  powerBoost?: Maybe<Scalars['Float']['output']>;
  tvl?: Maybe<Scalars['String']['output']>;
  tvlBoost?: Maybe<Scalars['Float']['output']>;
};

export type Regex_String_Comparator_Exp = {
  _eq?: InputMaybe<Scalars['String']['input']>;
  _gt?: InputMaybe<Scalars['String']['input']>;
  _gte?: InputMaybe<Scalars['String']['input']>;
  _in?: InputMaybe<Array<Scalars['String']['input']>>;
  _lt?: InputMaybe<Scalars['String']['input']>;
  _lte?: InputMaybe<Scalars['String']['input']>;
  _ne?: InputMaybe<Scalars['String']['input']>;
  _nin?: InputMaybe<Array<Scalars['String']['input']>>;
  _regex?: InputMaybe<Scalars['String']['input']>;
  _regex_in?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type RewardDistributionPercentage = {
  __typename?: 'RewardDistributionPercentage';
  channelFans: Scalars['Float']['output'];
  creator: Scalars['Float']['output'];
  creatorFans: Scalars['Float']['output'];
  network: Scalars['Float']['output'];
};

export type Simple_String_Comparator_Exp = {
  _eq?: InputMaybe<Scalars['String']['input']>;
  _in?: InputMaybe<Array<Scalars['String']['input']>>;
  _ne?: InputMaybe<Scalars['String']['input']>;
  _nin?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type SocialCapital = {
  __typename?: 'SocialCapital';
  farBoost?: Maybe<Scalars['Float']['output']>;
  heroBoost?: Maybe<Scalars['Float']['output']>;
  liquidityBoost?: Maybe<Scalars['Float']['output']>;
  powerBoost?: Maybe<Scalars['Float']['output']>;
  socialCapitalRank?: Maybe<Scalars['Int']['output']>;
  socialCapitalScore?: Maybe<Scalars['Float']['output']>;
  socialCapitalScoreRaw?: Maybe<Scalars['String']['output']>;
  tvl?: Maybe<Scalars['String']['output']>;
  tvlBoost?: Maybe<Scalars['Float']['output']>;
};

export type SocialCapitalValue = {
  __typename?: 'SocialCapitalValue';
  formattedValue?: Maybe<Scalars['Float']['output']>;
  hash?: Maybe<Scalars['String']['output']>;
  rawValue?: Maybe<Scalars['String']['output']>;
};

export enum SocialDappName {
  Farcaster = 'farcaster'
}

export type SocialDappName_Comparator_Exp = {
  _eq?: InputMaybe<SocialDappName>;
  _in?: InputMaybe<Array<SocialDappName>>;
};

export enum SocialDappSlug {
  FarcasterGoerli = 'farcaster_goerli',
  FarcasterOptimism = 'farcaster_optimism',
  FarcasterV2Optimism = 'farcaster_v2_optimism',
  FarcasterV3Optimism = 'farcaster_v3_optimism'
}

export type SocialDappSlug_Comparator_Exp = {
  _eq?: InputMaybe<SocialDappSlug>;
  _in?: InputMaybe<Array<SocialDappSlug>>;
};

export type String_Comparator_Exp = {
  _eq?: InputMaybe<Scalars['String']['input']>;
  _gt?: InputMaybe<Scalars['String']['input']>;
  _gte?: InputMaybe<Scalars['String']['input']>;
  _in?: InputMaybe<Array<Scalars['String']['input']>>;
  _lt?: InputMaybe<Scalars['String']['input']>;
  _lte?: InputMaybe<Scalars['String']['input']>;
  _ne?: InputMaybe<Scalars['String']['input']>;
  _nin?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type String_Eq_Comparator_Exp = {
  _eq?: InputMaybe<Scalars['String']['input']>;
};

export type String_Eq_In_Comparator_Exp = {
  _eq?: InputMaybe<Scalars['String']['input']>;
  _in?: InputMaybe<Array<Scalars['String']['input']>>;
};

export enum TimeFrame {
  EightHours = 'eight_hours',
  OneDay = 'one_day',
  OneHour = 'one_hour',
  SevenDays = 'seven_days',
  TwoDays = 'two_days',
  TwoHours = 'two_hours'
}

export type Time_Comparator_Exp = {
  _eq?: InputMaybe<Scalars['Time']['input']>;
  _gt?: InputMaybe<Scalars['Time']['input']>;
  _gte?: InputMaybe<Scalars['Time']['input']>;
  _in?: InputMaybe<Array<Scalars['Time']['input']>>;
  _lt?: InputMaybe<Scalars['Time']['input']>;
  _lte?: InputMaybe<Scalars['Time']['input']>;
  _ne?: InputMaybe<Scalars['Time']['input']>;
  _nin?: InputMaybe<Array<Scalars['Time']['input']>>;
};

export type Time_Range_Comparator_Exp = {
  _eq?: InputMaybe<Scalars['Int']['input']>;
};

export enum TokenType {
  Erc20 = 'ERC20',
  Erc721 = 'ERC721',
  Erc1155 = 'ERC1155'
}

export type TokenType_Comparator_Exp = {
  _eq?: InputMaybe<TokenType>;
  _in?: InputMaybe<Array<TokenType>>;
};

export type TotalSpendAllowance = {
  __typename?: 'TotalSpendAllowance';
  frameInteractions?: Maybe<Scalars['Int']['output']>;
  likes?: Maybe<Scalars['Int']['output']>;
  recasts?: Maybe<Scalars['Int']['output']>;
  replies?: Maybe<Scalars['Int']['output']>;
};

export type TrendingCastFilter = {
  fid?: InputMaybe<TrendingCast_Int_Comparator_Exp>;
  rootParentUrl?: InputMaybe<String_Eq_Comparator_Exp>;
};

export enum TrendingCastTimeFrame {
  EightHours = 'eight_hours',
  FourHours = 'four_hours',
  OneDay = 'one_day',
  OneHour = 'one_hour',
  SevenDays = 'seven_days',
  TwelveHours = 'twelve_hours',
  TwoDays = 'two_days',
  TwoHours = 'two_hours'
}

export type TrendingCast_Int_Comparator_Exp = {
  _eq?: InputMaybe<Scalars['Int']['input']>;
};

export type TrendingFilter = {
  address?: InputMaybe<Trending_Comparator_Exp>;
};

export type Trending_Comparator_Exp = {
  _eq?: InputMaybe<Scalars['Address']['input']>;
  _in?: InputMaybe<Array<Scalars['Address']['input']>>;
};

export type VideoVariants = {
  __typename?: 'VideoVariants';
  original?: Maybe<Scalars['String']['output']>;
};

export type WalletFanTokens = {
  __typename?: 'WalletFanTokens';
  lockedAmount?: Maybe<Scalars['Float']['output']>;
  lockedAmountInWei?: Maybe<Scalars['String']['output']>;
  lockedInfo?: Maybe<Array<Maybe<LockedInfo>>>;
  lockedTvl?: Maybe<Scalars['Float']['output']>;
  lockedTvlInWei?: Maybe<Scalars['String']['output']>;
  protocolTokenInvested?: Maybe<Scalars['Float']['output']>;
  protocolTokenInvestedInWei?: Maybe<Scalars['String']['output']>;
  unLockedTvl?: Maybe<Scalars['Float']['output']>;
  unlockedAmount?: Maybe<Scalars['Float']['output']>;
  unlockedAmountInWei?: Maybe<Scalars['String']['output']>;
  unlockedTvlInWei?: Maybe<Scalars['String']['output']>;
  walletAddress?: Maybe<Scalars['String']['output']>;
};

export type WalletInput = {
  identity: Scalars['Identity']['input'];
};
