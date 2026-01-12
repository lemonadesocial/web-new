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
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.This scalar is serialized to a string in ISO 8601 format and parsed from a string in ISO 8601 format. */
  DateTimeISO: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
  MongoID: { input: any; output: any; }
};

export type AcceptEventTermsInput = {
  _id: Scalars['MongoID']['input'];
  email_permission?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AcceptUserDiscoveryResponse = {
  __typename?: 'AcceptUserDiscoveryResponse';
  state?: Maybe<UserDiscoverySwipeState>;
  user?: Maybe<User>;
};

export type AccessPass = {
  __typename?: 'AccessPass';
  base: Scalars['String']['output'];
  card_description: Scalars['String']['output'];
  card_image_url: Scalars['String']['output'];
  card_logo_url: Scalars['String']['output'];
  checkin?: Maybe<Scalars['Boolean']['output']>;
  contract: Scalars['String']['output'];
  dialog_background_url: Scalars['String']['output'];
  dialog_description: Scalars['String']['output'];
  dialog_title: Scalars['String']['output'];
  discord_url?: Maybe<Scalars['String']['output']>;
  frame: Scalars['String']['output'];
  gallery_logo_url: Scalars['String']['output'];
  info_url: Scalars['String']['output'];
  instagram_url?: Maybe<Scalars['String']['output']>;
  logo_url: Scalars['String']['output'];
  metadata_creators: Array<Scalars['String']['output']>;
  metadata_description: Scalars['String']['output'];
  metadata_name: Scalars['String']['output'];
  name: Scalars['String']['output'];
  network: Scalars['String']['output'];
  twitter_url?: Maybe<Scalars['String']['output']>;
  unlocked_description?: Maybe<Scalars['String']['output']>;
};

export type AccessPassInput = {
  base: Scalars['String']['input'];
  card_description: Scalars['String']['input'];
  card_image_url: Scalars['String']['input'];
  card_logo_url: Scalars['String']['input'];
  checkin?: InputMaybe<Scalars['Boolean']['input']>;
  contract: Scalars['String']['input'];
  dialog_background_url: Scalars['String']['input'];
  dialog_description: Scalars['String']['input'];
  dialog_title: Scalars['String']['input'];
  discord_url?: InputMaybe<Scalars['String']['input']>;
  frame: Scalars['String']['input'];
  gallery_logo_url: Scalars['String']['input'];
  info_url: Scalars['String']['input'];
  instagram_url?: InputMaybe<Scalars['String']['input']>;
  logo_url: Scalars['String']['input'];
  metadata_creators: Array<Scalars['String']['input']>;
  metadata_description: Scalars['String']['input'];
  metadata_name: Scalars['String']['input'];
  name: Scalars['String']['input'];
  network: Scalars['String']['input'];
  twitter_url?: InputMaybe<Scalars['String']['input']>;
  unlocked_description?: InputMaybe<Scalars['String']['input']>;
};

export type AccountInfo = DigitalAccount | EthereumAccount | EthereumEscrowAccount | EthereumRelayAccount | EthereumStakeAccount | SafeAccount | SolanaAccount | StripeAccount;

export type AccountKeyRequest = {
  __typename?: 'AccountKeyRequest';
  accepted?: Maybe<Scalars['Boolean']['output']>;
  deeplink_url: Scalars['String']['output'];
  token: Scalars['String']['output'];
};

export type ActivatePersonalSpace = {
  __typename?: 'ActivatePersonalSpace';
  personal_space: Space;
  space: Space;
};

export type AddLaunchpadGroupInput = {
  /** Contract address of the group */
  address: Scalars['String']['input'];
  chain_id: Scalars['Float']['input'];
  cover_photo?: InputMaybe<Scalars['MongoID']['input']>;
  /** URL of the cover photo, this can be useful in non login mode */
  cover_photo_url?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  handle_discord?: InputMaybe<Scalars['String']['input']>;
  handle_farcaster?: InputMaybe<Scalars['String']['input']>;
  handle_telegram?: InputMaybe<Scalars['String']['input']>;
  handle_twitter?: InputMaybe<Scalars['String']['input']>;
  /** Implementation address of the StakingManager contract that used to create the group */
  implementation_address: Scalars['String']['input'];
  /** Name of the group */
  name: Scalars['String']['input'];
  space?: InputMaybe<Scalars['MongoID']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type AddMemberInput = {
  email: Scalars['String']['input'];
  user_name?: InputMaybe<Scalars['String']['input']>;
};

export type AddSpaceMemberInput = {
  role: SpaceRole;
  space: Scalars['MongoID']['input'];
  tags?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  users: Array<AddMemberInput>;
  visible?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Address = {
  __typename?: 'Address';
  _id?: Maybe<Scalars['MongoID']['output']>;
  additional_directions?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  latitude?: Maybe<Scalars['Float']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  postal?: Maybe<Scalars['String']['output']>;
  recipient_name?: Maybe<Scalars['String']['output']>;
  region?: Maybe<Scalars['String']['output']>;
  street_1?: Maybe<Scalars['String']['output']>;
  street_2?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type AddressInput = {
  _id?: InputMaybe<Scalars['MongoID']['input']>;
  additional_directions?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  postal?: InputMaybe<Scalars['String']['input']>;
  recipient_name?: InputMaybe<Scalars['String']['input']>;
  region?: InputMaybe<Scalars['String']['input']>;
  street_1?: InputMaybe<Scalars['String']['input']>;
  street_2?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type Applicant = {
  __typename?: 'Applicant';
  _id?: Maybe<Scalars['MongoID']['output']>;
  active?: Maybe<Scalars['Boolean']['output']>;
  calendly_url?: Maybe<Scalars['String']['output']>;
  company_name?: Maybe<Scalars['String']['output']>;
  date_of_birth?: Maybe<Scalars['DateTimeISO']['output']>;
  /** This is the biography of the user */
  description?: Maybe<Scalars['String']['output']>;
  display_name?: Maybe<Scalars['String']['output']>;
  education_title?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  ethnicity?: Maybe<Scalars['String']['output']>;
  handle_farcaster?: Maybe<Scalars['String']['output']>;
  handle_github?: Maybe<Scalars['String']['output']>;
  handle_instagram?: Maybe<Scalars['String']['output']>;
  handle_lens?: Maybe<Scalars['String']['output']>;
  handle_linkedin?: Maybe<Scalars['String']['output']>;
  handle_mirror?: Maybe<Scalars['String']['output']>;
  handle_twitter?: Maybe<Scalars['String']['output']>;
  image_avatar?: Maybe<Scalars['String']['output']>;
  industry?: Maybe<Scalars['String']['output']>;
  job_title?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  new_gender?: Maybe<Scalars['String']['output']>;
  pronoun?: Maybe<Scalars['String']['output']>;
  tagline?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
  wallet_custodial?: Maybe<Scalars['String']['output']>;
  wallets_new?: Maybe<Scalars['JSON']['output']>;
};

export type ApplicationBlokchainPlatform = {
  __typename?: 'ApplicationBlokchainPlatform';
  platform: BlockchainPlatform;
  required?: Maybe<Scalars['Boolean']['output']>;
};

export type ApplicationBlokchainPlatformInput = {
  platform: BlockchainPlatform;
  required?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ApplicationProfileField = {
  __typename?: 'ApplicationProfileField';
  field: Scalars['String']['output'];
  question?: Maybe<Scalars['String']['output']>;
  required?: Maybe<Scalars['Boolean']['output']>;
};

export type ApplicationProfileFieldInput = {
  field: Scalars['String']['input'];
  question?: InputMaybe<Scalars['String']['input']>;
  required?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AssignTicketsInput = {
  assignees: Array<TicketAssignee>;
  event: Scalars['MongoID']['input'];
};

export type Badge = {
  __typename?: 'Badge';
  _id: Scalars['MongoID']['output'];
  city?: Maybe<Scalars['String']['output']>;
  claimable?: Maybe<Scalars['Boolean']['output']>;
  contract: Scalars['String']['output'];
  country?: Maybe<Scalars['String']['output']>;
  /** Distance in meters */
  distance?: Maybe<Scalars['Float']['output']>;
  list: Scalars['MongoID']['output'];
  list_expanded?: Maybe<BadgeList>;
  network: Scalars['String']['output'];
};

export type BadgeCity = {
  __typename?: 'BadgeCity';
  city: Scalars['String']['output'];
  country: Scalars['String']['output'];
};

export type BadgeList = {
  __typename?: 'BadgeList';
  _id: Scalars['MongoID']['output'];
  image_url?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  user: Scalars['MongoID']['output'];
  user_expanded?: Maybe<User>;
};

export type BaseTokenRewardSetting = {
  __typename?: 'BaseTokenRewardSetting';
  _id: Scalars['MongoID']['output'];
  currency_address: Scalars['String']['output'];
  photo?: Maybe<Scalars['MongoID']['output']>;
  photo_expanded?: Maybe<File>;
  title: Scalars['String']['output'];
  user: Scalars['MongoID']['output'];
  vault: Scalars['MongoID']['output'];
  vault_expanded?: Maybe<TokenRewardVault>;
};

export type BasicUserInfo = {
  __typename?: 'BasicUserInfo';
  _id: Scalars['MongoID']['output'];
  company_name?: Maybe<Scalars['String']['output']>;
  display_name?: Maybe<Scalars['String']['output']>;
  image_avatar?: Maybe<Scalars['String']['output']>;
  job_title?: Maybe<Scalars['String']['output']>;
  kratos_unicorn_wallet_address?: Maybe<Scalars['String']['output']>;
  kratos_wallet_address?: Maybe<Scalars['String']['output']>;
  matrix_localpart?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  username?: Maybe<Scalars['String']['output']>;
};

export type BillingInfo = {
  __typename?: 'BillingInfo';
  _id?: Maybe<Scalars['MongoID']['output']>;
  additional_directions?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstname?: Maybe<Scalars['String']['output']>;
  lastname?: Maybe<Scalars['String']['output']>;
  latitude?: Maybe<Scalars['Float']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  postal?: Maybe<Scalars['String']['output']>;
  recipient_name?: Maybe<Scalars['String']['output']>;
  region?: Maybe<Scalars['String']['output']>;
  street_1?: Maybe<Scalars['String']['output']>;
  street_2?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type BillingInfoInput = {
  _id?: InputMaybe<Scalars['MongoID']['input']>;
  additional_directions?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstname?: InputMaybe<Scalars['String']['input']>;
  lastname?: InputMaybe<Scalars['String']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  postal?: InputMaybe<Scalars['String']['input']>;
  recipient_name?: InputMaybe<Scalars['String']['input']>;
  region?: InputMaybe<Scalars['String']['input']>;
  street_1?: InputMaybe<Scalars['String']['input']>;
  street_2?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export enum BlockchainPlatform {
  Ethereum = 'ethereum',
  Solana = 'solana'
}

export type Broadcast = {
  __typename?: 'Broadcast';
  _id?: Maybe<Scalars['MongoID']['output']>;
  active: Scalars['Boolean']['output'];
  deactivation_code?: Maybe<Scalars['String']['output']>;
  deactivation_message?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  eligible: Scalars['Boolean']['output'];
  end_time?: Maybe<Scalars['DateTimeISO']['output']>;
  life_cycle_status: BroadcastLifeCycleStatus;
  meta_data?: Maybe<BroadcastMetaData>;
  position?: Maybe<Scalars['Float']['output']>;
  processed_by_job?: Maybe<Scalars['Boolean']['output']>;
  provider: BroadcastProvider;
  provider_id: Scalars['String']['output'];
  recording_status: BroadcastRecordingStatus;
  rooms?: Maybe<Array<Scalars['MongoID']['output']>>;
  scheduled_end_time?: Maybe<Scalars['DateTimeISO']['output']>;
  scheduled_start_time?: Maybe<Scalars['DateTimeISO']['output']>;
  start_time?: Maybe<Scalars['DateTimeISO']['output']>;
  thumbnail?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  user: Scalars['MongoID']['output'];
  user_expanded?: Maybe<User>;
};

export enum BroadcastLifeCycleStatus {
  Complete = 'complete',
  Created = 'created',
  Live = 'live',
  LiveStarting = 'liveStarting',
  Ready = 'ready',
  Revoked = 'revoked',
  TestStarting = 'testStarting',
  Testing = 'testing'
}

export type BroadcastMetaData = {
  __typename?: 'BroadcastMetaData';
  boundStreamId?: Maybe<Scalars['String']['output']>;
  boundStreamStamp?: Maybe<Scalars['DateTimeISO']['output']>;
  enableAutoStop?: Maybe<Scalars['Boolean']['output']>;
  password?: Maybe<Scalars['String']['output']>;
  static_thumbnail?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  user?: Maybe<Scalars['String']['output']>;
  video?: Maybe<Scalars['String']['output']>;
};

export enum BroadcastProvider {
  Embed = 'embed',
  Local = 'local',
  Twitch = 'twitch',
  Video = 'video',
  Youtube = 'youtube',
  Zoom = 'zoom'
}

export enum BroadcastRecordingStatus {
  NotRecording = 'notRecording',
  Recorded = 'recorded',
  Recording = 'recording'
}

export type BroadcastRoom = {
  __typename?: 'BroadcastRoom';
  _id?: Maybe<Scalars['MongoID']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  event_payment_ticket_types?: Maybe<Array<Scalars['MongoID']['output']>>;
  iframe_src?: Maybe<Scalars['String']['output']>;
  photos?: Maybe<Array<Scalars['MongoID']['output']>>;
  photos_expanded?: Maybe<Array<Maybe<File>>>;
  position?: Maybe<Scalars['Float']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};


export type BroadcastRoomPhotos_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};

export type BroadcastRoomBase = {
  __typename?: 'BroadcastRoomBase';
  _id?: Maybe<Scalars['MongoID']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  event_payment_ticket_types?: Maybe<Array<Scalars['MongoID']['output']>>;
  iframe_src?: Maybe<Scalars['String']['output']>;
  photos?: Maybe<Array<Scalars['MongoID']['output']>>;
  position?: Maybe<Scalars['Float']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type BroadcastRoomInput = {
  _id?: InputMaybe<Scalars['MongoID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  event_payment_ticket_types?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  iframe_src?: InputMaybe<Scalars['String']['input']>;
  photos?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  position?: InputMaybe<Scalars['Float']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type BuyTicketsInput = {
  account_id: Scalars['MongoID']['input'];
  billing_info?: InputMaybe<BillingInfoInput>;
  buyer_info?: InputMaybe<BuyerInfoInput>;
  /** The wallet address to check for token gating. The wallet must be one of the connected walets. */
  buyer_wallet?: InputMaybe<Scalars['String']['input']>;
  connect_wallets?: InputMaybe<Array<ConnectWalletInput>>;
  currency: Scalars['String']['input'];
  discount?: InputMaybe<Scalars['String']['input']>;
  event: Scalars['MongoID']['input'];
  fee?: InputMaybe<Scalars['String']['input']>;
  inviter?: InputMaybe<Scalars['MongoID']['input']>;
  items: Array<PurchasableItem>;
  /** Array of passcodes to verify against the ticket types */
  passcodes?: InputMaybe<Array<Scalars['String']['input']>>;
  total: Scalars['String']['input'];
  transfer_params?: InputMaybe<Scalars['JSON']['input']>;
  /** In case the event requires application profile fields, this is used to call updateUser */
  user_info?: InputMaybe<UserInput>;
};

export type BuyTicketsResponse = {
  __typename?: 'BuyTicketsResponse';
  join_request?: Maybe<EventJoinRequest>;
  payment: NewPayment;
};

export type BuyerInfo = {
  __typename?: 'BuyerInfo';
  email: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type BuyerInfoInput = {
  email: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type CalculateTicketsPricingInput = {
  buyer_info?: InputMaybe<BuyerInfoInput>;
  /** The wallet address to check for token gating. The wallet must be one of the connected walets. */
  buyer_wallet?: InputMaybe<Scalars['String']['input']>;
  connect_wallets?: InputMaybe<Array<ConnectWalletInput>>;
  currency: Scalars['String']['input'];
  discount?: InputMaybe<Scalars['String']['input']>;
  event: Scalars['MongoID']['input'];
  inviter?: InputMaybe<Scalars['MongoID']['input']>;
  items: Array<PurchasableItem>;
  /** Array of passcodes to verify against the ticket types */
  passcodes?: InputMaybe<Array<Scalars['String']['input']>>;
  /** In case the event requires application profile fields, this is used to call updateUser */
  user_info?: InputMaybe<UserInput>;
};

export type CancelEventInvitationsInput = {
  event: Scalars['MongoID']['input'];
  invitations: Array<Scalars['MongoID']['input']>;
};

export type CancelMyTicketInput = {
  event: Scalars['MongoID']['input'];
  id: Scalars['MongoID']['input'];
};

export type CancelPaymentInput = {
  _id: Scalars['MongoID']['input'];
  payment_secret?: InputMaybe<Scalars['String']['input']>;
};

export type CancelTicketsInput = {
  event: Scalars['MongoID']['input'];
  tickets: Array<Scalars['MongoID']['input']>;
};

export type Capability = {
  __typename?: 'Capability';
  detail: CapabilityDetail;
  type: StripeCapabilityType;
};

export type CapabilityDetail = {
  __typename?: 'CapabilityDetail';
  available: Scalars['Boolean']['output'];
  display_preference: DisplayPreference;
};

export type CapabilityInput = {
  preference: StripeAccountCapabilityDisplayPreferencePreference;
  type: StripeCapabilityType;
};

export type CastVoteInput = {
  option_id?: InputMaybe<Scalars['String']['input']>;
  voting_id: Scalars['MongoID']['input'];
};

export type Chain = {
  __typename?: 'Chain';
  access_registry_contract?: Maybe<Scalars['String']['output']>;
  active?: Maybe<Scalars['Boolean']['output']>;
  aragon_network?: Maybe<Scalars['String']['output']>;
  aragon_subgraph_url?: Maybe<Scalars['String']['output']>;
  axelar_chain_name?: Maybe<Scalars['String']['output']>;
  biconomy_api_key?: Maybe<Scalars['String']['output']>;
  block_explorer_for_address?: Maybe<Scalars['String']['output']>;
  block_explorer_for_token?: Maybe<Scalars['String']['output']>;
  block_explorer_for_tx?: Maybe<Scalars['String']['output']>;
  block_explorer_icon_url?: Maybe<Scalars['String']['output']>;
  block_explorer_name?: Maybe<Scalars['String']['output']>;
  block_explorer_url?: Maybe<Scalars['String']['output']>;
  block_time: Scalars['Float']['output'];
  chain_id: Scalars['String']['output'];
  code_name: Scalars['String']['output'];
  donation_registry_contract?: Maybe<Scalars['String']['output']>;
  drip_nation_passport_contract_address?: Maybe<Scalars['String']['output']>;
  eas_event_contract?: Maybe<Scalars['String']['output']>;
  eas_graphql_url?: Maybe<Scalars['String']['output']>;
  ens_registry?: Maybe<Scalars['String']['output']>;
  escrow_manager_contract?: Maybe<Scalars['String']['output']>;
  festival_nation_passport_contract_address?: Maybe<Scalars['String']['output']>;
  fluffle_contract_address?: Maybe<Scalars['String']['output']>;
  is_zerodev_compatible?: Maybe<Scalars['Boolean']['output']>;
  launchpad_closed_permissions_contract_address?: Maybe<Scalars['String']['output']>;
  launchpad_fee_escrow_contract_address?: Maybe<Scalars['String']['output']>;
  launchpad_market_capped_price_contract_address?: Maybe<Scalars['String']['output']>;
  launchpad_market_utils_contract_address?: Maybe<Scalars['String']['output']>;
  launchpad_token_importer_contract_address?: Maybe<Scalars['String']['output']>;
  launchpad_treasury_address_fee_split_manager_implementation_contract_address?: Maybe<Scalars['String']['output']>;
  launchpad_treasury_staking_manager_implementation_contract_address?: Maybe<Scalars['String']['output']>;
  launchpad_zap_contract_address?: Maybe<Scalars['String']['output']>;
  lemonade_passport_contract_address?: Maybe<Scalars['String']['output']>;
  lemonade_username_contract_address?: Maybe<Scalars['String']['output']>;
  lemonhead_contract_address?: Maybe<Scalars['String']['output']>;
  logo_url?: Maybe<Scalars['String']['output']>;
  marketplace_contract?: Maybe<Scalars['String']['output']>;
  marketplace_version?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  payment_config_registry_contract?: Maybe<Scalars['String']['output']>;
  platform: Scalars['String']['output'];
  poap_contract?: Maybe<Scalars['String']['output']>;
  poap_enabled?: Maybe<Scalars['Boolean']['output']>;
  proxy_admin_contract?: Maybe<Scalars['String']['output']>;
  relay_payment_contract?: Maybe<Scalars['String']['output']>;
  reward_registry_contract?: Maybe<Scalars['String']['output']>;
  rpc_url: Scalars['String']['output'];
  safe_confirmations: Scalars['Float']['output'];
  stake_payment_contract?: Maybe<Scalars['String']['output']>;
  tokens?: Maybe<Array<Token>>;
  vinyl_nation_passport_contract_address?: Maybe<Scalars['String']['output']>;
  zugrama_passport_contract_address?: Maybe<Scalars['String']['output']>;
};

export type CheckinTokenRewardSetting = {
  __typename?: 'CheckinTokenRewardSetting';
  _id: Scalars['MongoID']['output'];
  currency_address: Scalars['String']['output'];
  event: Scalars['MongoID']['output'];
  photo?: Maybe<Scalars['MongoID']['output']>;
  photo_expanded?: Maybe<File>;
  rewards: Array<TicketTypeReward>;
  title: Scalars['String']['output'];
  user: Scalars['MongoID']['output'];
  vault: Scalars['MongoID']['output'];
  vault_expanded?: Maybe<TokenRewardVault>;
};

export type CheckinTokenRewardSettingInput = {
  currency_address?: InputMaybe<Scalars['String']['input']>;
  event?: InputMaybe<Scalars['MongoID']['input']>;
  photo?: InputMaybe<Scalars['MongoID']['input']>;
  rewards?: InputMaybe<Array<TicketTypeRewardInput>>;
  title?: InputMaybe<Scalars['String']['input']>;
  vault?: InputMaybe<Scalars['MongoID']['input']>;
};

export type ClaimCheckinRewardSignatureResponse = {
  __typename?: 'ClaimCheckinRewardSignatureResponse';
  claim?: Maybe<TokenRewardClaim>;
  settings: Array<CheckinTokenRewardSetting>;
  signature?: Maybe<TokenRewardSignature>;
};

export type ClaimTicketRewardSignatureResponse = {
  __typename?: 'ClaimTicketRewardSignatureResponse';
  claim?: Maybe<TokenRewardClaim>;
  settings: Array<TicketTokenRewardSetting>;
  signature: TokenRewardSignature;
};

export enum ClaimType {
  Checkin = 'checkin',
  Ticket = 'ticket'
}

export type ClaimedToken = {
  __typename?: 'ClaimedToken';
  amount: Scalars['String']['output'];
  formatted_amount?: Maybe<Scalars['String']['output']>;
  network: Scalars['String']['output'];
  token?: Maybe<RewardToken>;
  token_address: Scalars['String']['output'];
};

export type CloneEventInput = {
  dates: Array<Scalars['DateTimeISO']['input']>;
  event: Scalars['MongoID']['input'];
  overrides?: InputMaybe<EventInput>;
};

export type Comment = {
  __typename?: 'Comment';
  _id: Scalars['MongoID']['output'];
  comment?: Maybe<Scalars['MongoID']['output']>;
  created_at: Scalars['DateTimeISO']['output'];
  post: Scalars['MongoID']['output'];
  text: Scalars['String']['output'];
  user: Scalars['MongoID']['output'];
  user_expanded?: Maybe<User>;
};

export type CommentInput = {
  comment?: InputMaybe<Scalars['MongoID']['input']>;
  post: Scalars['MongoID']['input'];
  text: Scalars['String']['input'];
};

export type ConfidentialUserInfo = {
  __typename?: 'ConfidentialUserInfo';
  _id: Scalars['MongoID']['output'];
  company_name?: Maybe<Scalars['String']['output']>;
  display_name?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  image_avatar?: Maybe<Scalars['String']['output']>;
  job_title?: Maybe<Scalars['String']['output']>;
  kratos_unicorn_wallet_address?: Maybe<Scalars['String']['output']>;
  kratos_wallet_address?: Maybe<Scalars['String']['output']>;
  matrix_localpart?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  username?: Maybe<Scalars['String']['output']>;
};

export type ConnectWalletInput = {
  platform: BlockchainPlatform;
  signature: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type CreateBadgeInput = {
  contract: Scalars['String']['input'];
  list: Scalars['MongoID']['input'];
  network: Scalars['String']['input'];
};

export type CreateBadgeListInput = {
  image_url?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type CreateDonationInput = {
  amount: Scalars['String']['input'];
  category: DonationCategory;
  /** Id of the target event or user that receives the donation */
  category_ref: Scalars['String']['input'];
  currency: Scalars['String']['input'];
  from_email?: InputMaybe<Scalars['String']['input']>;
  vault: Scalars['MongoID']['input'];
};

export type CreateEventBroadcastInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  position?: InputMaybe<Scalars['Float']['input']>;
  provider: BroadcastProvider;
  provider_id: Scalars['String']['input'];
  rooms?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  scheduled_end_time?: InputMaybe<Scalars['DateTimeISO']['input']>;
  scheduled_start_time?: InputMaybe<Scalars['DateTimeISO']['input']>;
  thumbnail?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type CreateEventEmailSettingInput = {
  cc?: InputMaybe<Array<Scalars['String']['input']>>;
  custom_body_html?: InputMaybe<Scalars['String']['input']>;
  custom_subject_html?: InputMaybe<Scalars['String']['input']>;
  disabled?: InputMaybe<Scalars['Boolean']['input']>;
  draft?: InputMaybe<Scalars['Boolean']['input']>;
  event: Scalars['MongoID']['input'];
  recipient_filters?: InputMaybe<EmailRecipientFiltersInput>;
  recipient_types?: InputMaybe<Array<EmailRecipientType>>;
  scheduled_at?: InputMaybe<Scalars['DateTimeISO']['input']>;
  type: EmailTemplateType;
};

export type CreateEventFromEventbriteInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  end?: InputMaybe<Scalars['DateTimeISO']['input']>;
  start?: InputMaybe<Scalars['DateTimeISO']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type CreateEventQuestionsInput = {
  event: Scalars['MongoID']['input'];
  question: Scalars['String']['input'];
  session?: InputMaybe<Scalars['MongoID']['input']>;
};

export type CreateEventTicketCategoryInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  event: Scalars['MongoID']['input'];
  position?: InputMaybe<Scalars['Int']['input']>;
  ticket_types?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  title: Scalars['String']['input'];
};

export type CreateFarcasterAccountKeyResponse = {
  __typename?: 'CreateFarcasterAccountKeyResponse';
  account_key_request: AccountKeyRequest;
};

export type CreateNewPaymentAccountInput = {
  account_info?: InputMaybe<Scalars['JSON']['input']>;
  provider?: InputMaybe<NewPaymentProvider>;
  title?: InputMaybe<Scalars['String']['input']>;
  type: PaymentAccountType;
};

export type CreatePoapInput = {
  /** Requested poap amount */
  amount: Scalars['Int']['input'];
  claim_mode: PoapClaimMode;
  description: Scalars['String']['input'];
  event?: InputMaybe<Scalars['MongoID']['input']>;
  image?: InputMaybe<Scalars['MongoID']['input']>;
  minting_network?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  private?: InputMaybe<Scalars['Boolean']['input']>;
  ticket_types?: InputMaybe<Array<Scalars['MongoID']['input']>>;
};

export type CreateSiteInput = {
  access_pass?: InputMaybe<AccessPassInput>;
  ai_config?: InputMaybe<Scalars['MongoID']['input']>;
  client: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  event?: InputMaybe<Scalars['MongoID']['input']>;
  favicon_url?: InputMaybe<Scalars['String']['input']>;
  footer_scripts?: InputMaybe<Array<SiteFooterScriptInput>>;
  header_links?: InputMaybe<Array<SiteHeaderLinkInput>>;
  header_metas?: InputMaybe<Array<SiteHeaderMetaInput>>;
  hostnames?: InputMaybe<Array<Scalars['String']['input']>>;
  logo_mobile_url?: InputMaybe<Scalars['String']['input']>;
  logo_url?: InputMaybe<Scalars['String']['input']>;
  onboarding_steps?: InputMaybe<Array<SiteOnboardingStepInput>>;
  owners?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  partners?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  passports?: InputMaybe<Array<SitePassportInput>>;
  privacy_url?: InputMaybe<Scalars['String']['input']>;
  share_url?: InputMaybe<Scalars['JSON']['input']>;
  text?: InputMaybe<Scalars['JSON']['input']>;
  theme_data?: InputMaybe<Scalars['JSON']['input']>;
  theme_type?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  visibility?: InputMaybe<Scalars['JSON']['input']>;
};

export type CreateSpaceNewsletterInput = {
  cc?: InputMaybe<Array<Scalars['String']['input']>>;
  custom_body_html?: InputMaybe<Scalars['String']['input']>;
  custom_subject_html?: InputMaybe<Scalars['String']['input']>;
  disabled?: InputMaybe<Scalars['Boolean']['input']>;
  draft?: InputMaybe<Scalars['Boolean']['input']>;
  recipient_filters?: InputMaybe<EmailRecipientFiltersInput>;
  recipient_types?: InputMaybe<Array<EmailRecipientType>>;
  scheduled_at?: InputMaybe<Scalars['DateTimeISO']['input']>;
  space: Scalars['MongoID']['input'];
};

export type CreateStripeOnrampSessionInput = {
  destination_amount?: InputMaybe<Scalars['Float']['input']>;
  destination_currency?: InputMaybe<Scalars['String']['input']>;
  destination_network?: InputMaybe<Scalars['String']['input']>;
  source_currency?: InputMaybe<Scalars['String']['input']>;
  wallet_address?: InputMaybe<Scalars['String']['input']>;
};

export type CreateSubscriptionInput = {
  items: Array<SubscriptionItemType>;
  payment_method_id: Scalars['String']['input'];
};

export type CreateUserFriendshipInput = {
  type?: InputMaybe<UserFriendshipType>;
  user: Scalars['MongoID']['input'];
};

export type CryptoPaymentInfo = {
  __typename?: 'CryptoPaymentInfo';
  network?: Maybe<Scalars['String']['output']>;
  tx_hash?: Maybe<Scalars['String']['output']>;
};

export type CryptoPaymentNetworkStatistics = {
  __typename?: 'CryptoPaymentNetworkStatistics';
  chain_id: Scalars['String']['output'];
  count: Scalars['Int']['output'];
};

export type CryptoPaymentStatistics = {
  __typename?: 'CryptoPaymentStatistics';
  count: Scalars['Int']['output'];
  networks: Array<CryptoPaymentNetworkStatistics>;
  revenue: Array<PaymentRevenue>;
};

export type Currency = {
  __typename?: 'Currency';
  code: Scalars['String']['output'];
  decimals: Scalars['Float']['output'];
};

export type DateRangeInput = {
  /** End exclusive */
  end: Scalars['DateTimeISO']['input'];
  /** Start inclusive */
  start: Scalars['DateTimeISO']['input'];
};

export type DecideEventCohostRequestInput = {
  decision: Scalars['Boolean']['input'];
  event: Scalars['MongoID']['input'];
};

export type DecideRoomAccessRequestInput = {
  _id: Scalars['MongoID']['input'];
  decision: Scalars['Boolean']['input'];
  user: Scalars['MongoID']['input'];
};

export type DecideRoomStageRequestInput = {
  _id: Scalars['MongoID']['input'];
  decision: Scalars['Boolean']['input'];
  user: Scalars['MongoID']['input'];
};

export type DecideSpaceEventRequestsInput = {
  decision: SpaceEventRequestState;
  requests: Array<Scalars['MongoID']['input']>;
  space: Scalars['MongoID']['input'];
};

export type DecideUserJoinRequestsInput = {
  decision: EventJoinRequestState;
  event: Scalars['MongoID']['input'];
  requests: Array<Scalars['MongoID']['input']>;
};

export type DecidedJoinRequest = {
  __typename?: 'DecidedJoinRequest';
  _id: Scalars['MongoID']['output'];
  processed: Scalars['Boolean']['output'];
};

export type DeleteSpaceMemberInput = {
  ids: Array<Scalars['MongoID']['input']>;
  space: Scalars['MongoID']['input'];
};

export type DeleteUserFriendshipInput = {
  user: Scalars['MongoID']['input'];
};

export type DeliveryOption = {
  __typename?: 'DeliveryOption';
  _id: Scalars['MongoID']['output'];
  cities?: Maybe<Array<Scalars['String']['output']>>;
  cost: Scalars['Float']['output'];
  countries?: Maybe<Array<Scalars['String']['output']>>;
  description?: Maybe<Scalars['String']['output']>;
  fulfillment_address?: Maybe<Scalars['MongoID']['output']>;
  group?: Maybe<Scalars['String']['output']>;
  latitude?: Maybe<Scalars['Float']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  pickup_addresses?: Maybe<Array<Scalars['MongoID']['output']>>;
  polygon?: Maybe<Scalars['JSON']['output']>;
  postal_ranges?: Maybe<Array<DeliveryOptionPostalRange>>;
  postals?: Maybe<Array<Scalars['String']['output']>>;
  regions?: Maybe<Array<Scalars['String']['output']>>;
  search_range?: Maybe<Scalars['Float']['output']>;
  title: Scalars['String']['output'];
  type: DeliveryOptionType;
  waive_type?: Maybe<DeliveryOptionWaiveType>;
  waive_value_threshold?: Maybe<Scalars['Float']['output']>;
};

export type DeliveryOptionInput = {
  _id: Scalars['MongoID']['input'];
  cities?: InputMaybe<Array<Scalars['String']['input']>>;
  cost: Scalars['Float']['input'];
  countries?: InputMaybe<Array<Scalars['String']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  fulfillment_address?: InputMaybe<Scalars['MongoID']['input']>;
  group?: InputMaybe<Scalars['String']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  pickup_addresses?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  polygon?: InputMaybe<Scalars['JSON']['input']>;
  postal_ranges?: InputMaybe<Array<DeliveryOptionPostalRangeInput>>;
  postals?: InputMaybe<Array<Scalars['String']['input']>>;
  regions?: InputMaybe<Array<Scalars['String']['input']>>;
  search_range?: InputMaybe<Scalars['Float']['input']>;
  title: Scalars['String']['input'];
  type: DeliveryOptionType;
  waive_type?: InputMaybe<DeliveryOptionWaiveType>;
  waive_value_threshold?: InputMaybe<Scalars['Float']['input']>;
};

export type DeliveryOptionPostalRange = {
  __typename?: 'DeliveryOptionPostalRange';
  _id: Scalars['MongoID']['output'];
  max: Scalars['Float']['output'];
  min: Scalars['Float']['output'];
  pattern: Scalars['String']['output'];
};

export type DeliveryOptionPostalRangeInput = {
  _id: Scalars['MongoID']['input'];
  max: Scalars['Float']['input'];
  min: Scalars['Float']['input'];
  pattern: Scalars['String']['input'];
};

export enum DeliveryOptionType {
  City = 'city',
  Country = 'country',
  GeoZone = 'geo_zone',
  Postal = 'postal',
  Region = 'region',
  Worldwide = 'worldwide'
}

export enum DeliveryOptionWaiveType {
  Any = 'any',
  Product = 'product',
  Store = 'store'
}

export type DigitalAccount = {
  __typename?: 'DigitalAccount';
  account_id: Scalars['String']['output'];
  currencies: Array<Scalars['String']['output']>;
  currency_map?: Maybe<Scalars['JSON']['output']>;
};

export type DisplayPreference = {
  __typename?: 'DisplayPreference';
  overridable: Scalars['Boolean']['output'];
  preference: StripeAccountCapabilityDisplayPreferencePreference;
  value: StripeAccountCapabilityDisplayPreferenceValue;
};

export type Donation = {
  __typename?: 'Donation';
  _id: Scalars['MongoID']['output'];
  amount: Scalars['String']['output'];
  category: DonationCategory;
  /** Id of the target event or user that receives the donation */
  category_ref: Scalars['String']['output'];
  created_at: Scalars['DateTimeISO']['output'];
  currency: Scalars['String']['output'];
  from_email?: Maybe<Scalars['String']['output']>;
  from_user?: Maybe<Scalars['MongoID']['output']>;
  from_wallet?: Maybe<Scalars['String']['output']>;
  ticket_type?: Maybe<Scalars['MongoID']['output']>;
  ticket_type_expanded?: Maybe<EventTicketType>;
  tx_hash?: Maybe<Scalars['String']['output']>;
  user_info?: Maybe<DonationUserInfo>;
  vault: Scalars['MongoID']['output'];
  vault_expanded?: Maybe<DonationVault>;
};

export enum DonationCategory {
  Event = 'EVENT',
  User = 'USER'
}

export type DonationRecommendation = {
  __typename?: 'DonationRecommendation';
  amount: Array<Scalars['String']['output']>;
  currency: Scalars['String']['output'];
};

export type DonationUserInfo = {
  __typename?: 'DonationUserInfo';
  _id?: Maybe<Scalars['MongoID']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  image_avatar?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type DonationVault = {
  __typename?: 'DonationVault';
  _id: Scalars['MongoID']['output'];
  address: Scalars['String']['output'];
  events?: Maybe<Array<Scalars['MongoID']['output']>>;
  network: Scalars['String']['output'];
  title: Scalars['String']['output'];
  user: Scalars['MongoID']['output'];
};

export type DonationVaultInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  network?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type EasEvent = {
  __typename?: 'EASEvent';
  _id?: Maybe<Scalars['MongoID']['output']>;
  cohosts: Array<EasEventCohost>;
  creatorName?: Maybe<Scalars['String']['output']>;
  creatorProfile?: Maybe<Scalars['String']['output']>;
  date?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  detail_uid?: Maybe<Scalars['String']['output']>;
  diff?: Maybe<Array<Scalars['String']['output']>>;
  eventLink?: Maybe<Scalars['String']['output']>;
  tickets: Scalars['Float']['output'];
  title: Scalars['String']['output'];
  type?: Maybe<Scalars['String']['output']>;
  uid?: Maybe<Scalars['String']['output']>;
};

export type EasEventCohost = {
  __typename?: 'EASEventCohost';
  cohostName?: Maybe<Scalars['String']['output']>;
  cohostProfile?: Maybe<Scalars['String']['output']>;
  eventLink?: Maybe<Scalars['String']['output']>;
  uid?: Maybe<Scalars['String']['output']>;
  wallet: Scalars['String']['output'];
};

export type EasTicket = {
  __typename?: 'EASTicket';
  _id: Scalars['MongoID']['output'];
  assignedBy?: Maybe<Scalars['String']['output']>;
  eventLink?: Maybe<Scalars['String']['output']>;
  eventName?: Maybe<Scalars['String']['output']>;
  guest?: Maybe<Scalars['String']['output']>;
  ticket?: Maybe<Scalars['String']['output']>;
  wallet_address: Scalars['String']['output'];
};

export type EasTicketType = {
  __typename?: 'EASTicketType';
  _id: Scalars['MongoID']['output'];
  cost: Scalars['String']['output'];
  currency?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  detail_uid?: Maybe<Scalars['String']['output']>;
  diff?: Maybe<Array<Scalars['String']['output']>>;
  eventLink?: Maybe<Scalars['String']['output']>;
  eventName?: Maybe<Scalars['String']['output']>;
  provider?: Maybe<Scalars['String']['output']>;
  tickets?: Maybe<Array<EasTicket>>;
  title: Scalars['String']['output'];
  uid?: Maybe<Scalars['String']['output']>;
};

export enum EasyshipCategory {
  AccessoryBattery = 'accessory_battery',
  AccessoryNoBattery = 'accessory_no_battery',
  AudioVideo = 'audio_video',
  BooksCollectionables = 'books_collectionables',
  Cameras = 'cameras',
  ComputersLaptops = 'computers_laptops',
  Documents = 'documents',
  DryFoodSupplements = 'dry_food_supplements',
  Fashion = 'fashion',
  Gaming = 'gaming',
  HealthBeauty = 'health_beauty',
  HomeAppliances = 'home_appliances',
  HomeDecor = 'home_decor',
  Jewelry = 'jewelry',
  Luggage = 'luggage',
  Mobiles = 'mobiles',
  PetAccessory = 'pet_accessory',
  Sport = 'sport',
  Tablets = 'tablets',
  Toys = 'toys',
  Watches = 'watches'
}

export type EmailRecipientFilters = {
  __typename?: 'EmailRecipientFilters';
  join_request_states?: Maybe<Array<EventJoinRequestState>>;
  space_members?: Maybe<SpaceMemberRecipientFilter>;
  ticket_types?: Maybe<Array<Scalars['MongoID']['output']>>;
};

export type EmailRecipientFiltersInput = {
  join_request_states?: InputMaybe<Array<EventJoinRequestState>>;
  space_members?: InputMaybe<SpaceMemberRecipientFilterInput>;
  ticket_types?: InputMaybe<Array<Scalars['MongoID']['input']>>;
};

export enum EmailRecipientType {
  Assigned = 'assigned',
  Attending = 'attending',
  EventHosts = 'event_hosts',
  Invited = 'invited',
  JoinRequester = 'join_requester',
  Registration = 'registration',
  SpaceAdmins = 'space_admins',
  SpaceAmbassadors = 'space_ambassadors',
  SpaceEventAttendees = 'space_event_attendees',
  SpaceEventHosts = 'space_event_hosts',
  SpaceSubscribers = 'space_subscribers',
  SpaceTaggedPeople = 'space_tagged_people',
  TicketCancelled = 'ticket_cancelled',
  TicketIssued = 'ticket_issued',
  TicketTypeWhitelisted = 'ticket_type_whitelisted'
}

export type EmailSetting = {
  __typename?: 'EmailSetting';
  _id: Scalars['MongoID']['output'];
  body_preview?: Maybe<Scalars['String']['output']>;
  cc?: Maybe<Array<Scalars['String']['output']>>;
  context?: Maybe<Scalars['JSON']['output']>;
  created_at?: Maybe<Scalars['DateTimeISO']['output']>;
  custom_body_html?: Maybe<Scalars['String']['output']>;
  custom_subject_html?: Maybe<Scalars['String']['output']>;
  disabled?: Maybe<Scalars['Boolean']['output']>;
  draft?: Maybe<Scalars['Boolean']['output']>;
  failed_at?: Maybe<Scalars['DateTimeISO']['output']>;
  failed_reason?: Maybe<Scalars['String']['output']>;
  is_system_email: Scalars['Boolean']['output'];
  opened?: Maybe<Array<EmailTracking>>;
  owner: Scalars['MongoID']['output'];
  owner_expanded?: Maybe<User>;
  pending_recipients?: Maybe<Array<Scalars['String']['output']>>;
  recipient_filters?: Maybe<EmailRecipientFilters>;
  recipient_types?: Maybe<Array<EmailRecipientType>>;
  recipients?: Maybe<Array<Scalars['String']['output']>>;
  recipients_details?: Maybe<Array<RecipientDetail>>;
  scheduled_at?: Maybe<Scalars['DateTimeISO']['output']>;
  sendgrid_template_id?: Maybe<Scalars['String']['output']>;
  sent_at?: Maybe<Scalars['DateTimeISO']['output']>;
  subject_preview?: Maybe<Scalars['String']['output']>;
  template: Scalars['MongoID']['output'];
  type: EmailTemplateType;
};

export enum EmailTemplateType {
  BuyerStoreOrderAccepted = 'buyer_store_order_accepted',
  BuyerStoreOrderCancelled = 'buyer_store_order_cancelled',
  BuyerStoreOrderDeclined = 'buyer_store_order_declined',
  BuyerStoreOrderDelivered = 'buyer_store_order_delivered',
  BuyerStoreOrderPending = 'buyer_store_order_pending',
  BuyerStoreOrderPreparing = 'buyer_store_order_preparing',
  BuyerStoreOrderTracking = 'buyer_store_order_tracking',
  CryptoPaymentReceipt = 'crypto_payment_receipt',
  Custom = 'custom',
  EventCancelled = 'event_cancelled',
  EventCohostInvitation = 'event_cohost_invitation',
  EventCreatedNotification = 'event_created_notification',
  Feedback = 'feedback',
  Invitation = 'invitation',
  InvitationCancelled = 'invitation_cancelled',
  JoinRequestApproved = 'join_request_approved',
  JoinRequestApprovedWithTickets = 'join_request_approved_with_tickets',
  JoinRequestDeclined = 'join_request_declined',
  JoinRequested = 'join_requested',
  PostRsvp = 'post_rsvp',
  Reminder = 'reminder',
  SellerStoreOrderPending = 'seller_store_order_pending',
  SpaceAddAdminInvitation = 'space_add_admin_invitation',
  SpaceAddAmbassadorInvitation = 'space_add_ambassador_invitation',
  SpaceAddSubscriberManuallyInvitation = 'space_add_subscriber_manually_invitation',
  SpaceNewsletter = 'space_newsletter',
  SpaceRequestPinningEvent = 'space_request_pinning_event',
  SpaceVerificationApproved = 'space_verification_approved',
  SpaceVerificationDeclined = 'space_verification_declined',
  TicketCancelled = 'ticket_cancelled',
  TicketIssued = 'ticket_issued',
  TicketReceived = 'ticket_received',
  TicketTypeWhitelisted = 'ticket_type_whitelisted',
  Updated = 'updated',
  UserContactInvite = 'user_contact_invite'
}

export type EmailTracking = {
  __typename?: 'EmailTracking';
  email: Scalars['String']['output'];
  stamp: Scalars['DateTimeISO']['output'];
};

export type EscrowDepositInfo = {
  __typename?: 'EscrowDepositInfo';
  minimum_amount: Scalars['String']['output'];
  minimum_percent: Scalars['Float']['output'];
};

export type EthereumAccount = {
  __typename?: 'EthereumAccount';
  address: Scalars['String']['output'];
  currencies: Array<Scalars['String']['output']>;
  currency_map?: Maybe<Scalars['JSON']['output']>;
  network: Scalars['String']['output'];
};

export type EthereumEscrowAccount = {
  __typename?: 'EthereumEscrowAccount';
  address: Scalars['String']['output'];
  currencies: Array<Scalars['String']['output']>;
  currency_map?: Maybe<Scalars['JSON']['output']>;
  host_refund_percent: Scalars['Float']['output'];
  minimum_deposit_percent: Scalars['Int']['output'];
  network: Scalars['String']['output'];
  refund_policies?: Maybe<Array<RefundPolicy>>;
};

export type EthereumRelayAccount = {
  __typename?: 'EthereumRelayAccount';
  address: Scalars['String']['output'];
  currencies: Array<Scalars['String']['output']>;
  currency_map?: Maybe<Scalars['JSON']['output']>;
  network: Scalars['String']['output'];
  payment_splitter_contract?: Maybe<Scalars['String']['output']>;
};

export type EthereumStakeAccount = {
  __typename?: 'EthereumStakeAccount';
  address: Scalars['String']['output'];
  config_id: Scalars['String']['output'];
  currencies: Array<Scalars['String']['output']>;
  currency_map?: Maybe<Scalars['JSON']['output']>;
  network: Scalars['String']['output'];
  requirement_checkin_before?: Maybe<Scalars['DateTimeISO']['output']>;
};

export type Event = {
  __typename?: 'Event';
  _id?: Maybe<Scalars['MongoID']['output']>;
  accepted?: Maybe<Array<Scalars['MongoID']['output']>>;
  accepted_expanded?: Maybe<Array<Maybe<User>>>;
  accepted_store_promotion?: Maybe<Scalars['MongoID']['output']>;
  accepted_user_fields_required?: Maybe<Array<Scalars['String']['output']>>;
  access_pass?: Maybe<AccessPass>;
  active: Scalars['Boolean']['output'];
  address?: Maybe<Address>;
  address_directions?: Maybe<Array<Scalars['String']['output']>>;
  application_form_submission?: Maybe<Scalars['DateTimeISO']['output']>;
  application_form_url?: Maybe<Scalars['String']['output']>;
  application_profile_fields?: Maybe<Array<ApplicationProfileField>>;
  application_questions?: Maybe<Array<EventApplicationQuestion>>;
  application_required?: Maybe<Scalars['Boolean']['output']>;
  /** @deprecated To be removed */
  application_self_verification?: Maybe<Scalars['Boolean']['output']>;
  application_self_verification_required?: Maybe<Scalars['Boolean']['output']>;
  approval_required?: Maybe<Scalars['Boolean']['output']>;
  approved?: Maybe<Scalars['Boolean']['output']>;
  /** Number of users who have tickets */
  attending_count?: Maybe<Scalars['Float']['output']>;
  broadcast_rooms?: Maybe<Array<BroadcastRoom>>;
  broadcasts?: Maybe<Array<Broadcast>>;
  button_icon?: Maybe<Scalars['String']['output']>;
  button_text?: Maybe<Scalars['String']['output']>;
  button_url?: Maybe<Scalars['String']['output']>;
  calendar_links?: Maybe<EventCalendarLinks>;
  checkedin?: Maybe<Scalars['Boolean']['output']>;
  /** @deprecated No longer in use and will be removed in a future release. */
  checkin_count?: Maybe<Scalars['Float']['output']>;
  checkin_menu_text?: Maybe<Scalars['String']['output']>;
  cohosts?: Maybe<Array<Scalars['MongoID']['output']>>;
  /** @deprecated Use `cohosts_expanded_new` instead. */
  cohosts_expanded?: Maybe<Array<Maybe<User>>>;
  cohosts_expanded_new?: Maybe<Array<Maybe<PossibleUserWithEmail>>>;
  comments?: Maybe<Scalars['String']['output']>;
  cost?: Maybe<Scalars['Float']['output']>;
  cover?: Maybe<Scalars['String']['output']>;
  cta_button_text?: Maybe<Scalars['String']['output']>;
  /** Show secondary CTA button text */
  cta_secondary_visible?: Maybe<Scalars['Boolean']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  dark_theme_image?: Maybe<Scalars['MongoID']['output']>;
  dark_theme_image_expanded?: Maybe<File>;
  data?: Maybe<Scalars['JSON']['output']>;
  declined?: Maybe<Array<Scalars['MongoID']['output']>>;
  declined_expanded?: Maybe<Array<Maybe<User>>>;
  description?: Maybe<Scalars['String']['output']>;
  description_plain_text?: Maybe<Scalars['String']['output']>;
  donation_enabled?: Maybe<Scalars['Boolean']['output']>;
  donation_show_history?: Maybe<Scalars['Boolean']['output']>;
  donation_vaults?: Maybe<Array<Scalars['MongoID']['output']>>;
  donation_vaults_expanded?: Maybe<Array<DonationVault>>;
  end: Scalars['DateTimeISO']['output'];
  event_ticket_types?: Maybe<Array<EventTicketType>>;
  eventbrite_enabled?: Maybe<Scalars['Boolean']['output']>;
  eventbrite_event_id?: Maybe<Scalars['String']['output']>;
  eventbrite_tickets_imported?: Maybe<Scalars['Boolean']['output']>;
  events?: Maybe<Array<Scalars['MongoID']['output']>>;
  events_expanded?: Maybe<Array<Maybe<Event>>>;
  external_hostname?: Maybe<Scalars['String']['output']>;
  external_url?: Maybe<Scalars['String']['output']>;
  frequent_questions?: Maybe<Array<FrequentQuestion>>;
  guest_directory_enabled?: Maybe<Scalars['Boolean']['output']>;
  guest_limit?: Maybe<Scalars['Float']['output']>;
  guest_limit_per?: Maybe<Scalars['Float']['output']>;
  guests?: Maybe<Scalars['Int']['output']>;
  has_terms_accepted?: Maybe<Scalars['Boolean']['output']>;
  hide_attending?: Maybe<Scalars['Boolean']['output']>;
  hide_chat_action?: Maybe<Scalars['Boolean']['output']>;
  hide_cohosts?: Maybe<Scalars['Boolean']['output']>;
  hide_creators?: Maybe<Scalars['Boolean']['output']>;
  hide_invite_action?: Maybe<Scalars['Boolean']['output']>;
  hide_lounge?: Maybe<Scalars['Boolean']['output']>;
  hide_question_box?: Maybe<Scalars['Boolean']['output']>;
  hide_rooms_action?: Maybe<Scalars['Boolean']['output']>;
  hide_session_guests?: Maybe<Scalars['Boolean']['output']>;
  hide_speakers?: Maybe<Scalars['Boolean']['output']>;
  hide_stories_action?: Maybe<Scalars['Boolean']['output']>;
  highlight?: Maybe<Scalars['Boolean']['output']>;
  host: Scalars['MongoID']['output'];
  host_expanded?: Maybe<User>;
  host_expanded_new?: Maybe<UserWithEmail>;
  inherited_cohosts?: Maybe<Array<Scalars['MongoID']['output']>>;
  invited?: Maybe<Array<Scalars['MongoID']['output']>>;
  invited_count?: Maybe<Scalars['Float']['output']>;
  invited_expanded?: Maybe<Array<Maybe<User>>>;
  inviter_user_map?: Maybe<Scalars['JSON']['output']>;
  inviters?: Maybe<Array<Scalars['MongoID']['output']>>;
  latitude?: Maybe<Scalars['Float']['output']>;
  layout_sections?: Maybe<Array<LayoutSection>>;
  light_theme_image?: Maybe<Scalars['MongoID']['output']>;
  light_theme_image_expanded?: Maybe<File>;
  listing_spaces?: Maybe<Array<Scalars['MongoID']['output']>>;
  location?: Maybe<Point>;
  longitude?: Maybe<Scalars['Float']['output']>;
  matrix_event_room_id?: Maybe<Scalars['String']['output']>;
  me_awaiting_approval?: Maybe<Scalars['Boolean']['output']>;
  me_going?: Maybe<Scalars['Boolean']['output']>;
  me_invited?: Maybe<Scalars['Boolean']['output']>;
  me_is_host?: Maybe<Scalars['Boolean']['output']>;
  new_new_photos?: Maybe<Array<Scalars['MongoID']['output']>>;
  new_new_photos_expanded?: Maybe<Array<Maybe<File>>>;
  new_photos?: Maybe<Array<FileInline>>;
  offers?: Maybe<Array<EventOffer>>;
  payment_accounts_expanded?: Maybe<Array<Maybe<NewPaymentAccount>>>;
  payment_accounts_new?: Maybe<Array<Scalars['MongoID']['output']>>;
  payment_donation?: Maybe<Scalars['Boolean']['output']>;
  payment_donation_amount_includes_tickets?: Maybe<Scalars['Boolean']['output']>;
  payment_donation_amount_increment?: Maybe<Scalars['Float']['output']>;
  payment_donation_message?: Maybe<Scalars['String']['output']>;
  payment_donation_target?: Maybe<Scalars['Float']['output']>;
  payment_enabled?: Maybe<Scalars['Boolean']['output']>;
  payment_fee: Scalars['Float']['output'];
  payment_optional?: Maybe<Scalars['Boolean']['output']>;
  payment_ticket_count?: Maybe<Scalars['Float']['output']>;
  payment_ticket_discounts?: Maybe<Array<EventPaymentTicketDiscount>>;
  payment_ticket_external_message?: Maybe<Scalars['String']['output']>;
  payment_ticket_external_url?: Maybe<Scalars['String']['output']>;
  payment_ticket_purchase_title?: Maybe<Scalars['String']['output']>;
  payment_ticket_unassigned_count?: Maybe<Scalars['Float']['output']>;
  pending?: Maybe<Array<Scalars['MongoID']['output']>>;
  pending_expanded?: Maybe<Array<Maybe<User>>>;
  pending_request_count?: Maybe<Scalars['Float']['output']>;
  photos?: Maybe<Array<Scalars['String']['output']>>;
  private?: Maybe<Scalars['Boolean']['output']>;
  published?: Maybe<Scalars['Boolean']['output']>;
  registration_disabled?: Maybe<Scalars['Boolean']['output']>;
  reward_uses?: Maybe<Scalars['JSON']['output']>;
  rewards?: Maybe<Array<EventReward>>;
  rsvp_wallet_platforms?: Maybe<Array<ApplicationBlokchainPlatform>>;
  self_verification?: Maybe<SelfVerification>;
  session_guests?: Maybe<Scalars['JSON']['output']>;
  sessions?: Maybe<Array<EventSession>>;
  shortid: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  space?: Maybe<Scalars['MongoID']['output']>;
  space_expanded?: Maybe<Space>;
  space_tags?: Maybe<Array<SpaceTag>>;
  speaker_users?: Maybe<Array<Scalars['MongoID']['output']>>;
  speaker_users_expanded?: Maybe<Array<Maybe<User>>>;
  stamp: Scalars['DateTimeISO']['output'];
  start: Scalars['DateTimeISO']['output'];
  state: EventState;
  stores?: Maybe<Array<Scalars['MongoID']['output']>>;
  stores_expanded?: Maybe<Array<Maybe<Store>>>;
  stories?: Maybe<Array<Scalars['MongoID']['output']>>;
  stories_eponym?: Maybe<Scalars['Boolean']['output']>;
  subevent_enabled?: Maybe<Scalars['Boolean']['output']>;
  subevent_parent?: Maybe<Scalars['MongoID']['output']>;
  subevent_parent_expanded?: Maybe<Event>;
  subevent_settings?: Maybe<SubeventSettings>;
  tags?: Maybe<Array<Scalars['String']['output']>>;
  telegram_channels?: Maybe<Array<TelegramChannel>>;
  terms_email_permission_text?: Maybe<Scalars['Boolean']['output']>;
  terms_link?: Maybe<Scalars['String']['output']>;
  terms_text?: Maybe<Scalars['String']['output']>;
  theme_data?: Maybe<Scalars['JSON']['output']>;
  ticket_count?: Maybe<Scalars['Float']['output']>;
  /** The number of tickets available per user for this event */
  ticket_limit_per?: Maybe<Scalars['Float']['output']>;
  tickets?: Maybe<Array<TicketBase>>;
  timezone?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  unlisted?: Maybe<Scalars['Boolean']['output']>;
  unsure?: Maybe<Array<Scalars['MongoID']['output']>>;
  url?: Maybe<Scalars['String']['output']>;
  url_go?: Maybe<Scalars['String']['output']>;
  videos?: Maybe<Array<Video>>;
  virtual?: Maybe<Scalars['Boolean']['output']>;
  virtual_url?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use data from event cohost requests table */
  visible_cohosts?: Maybe<Array<Scalars['MongoID']['output']>>;
  /** @deprecated Use `visible_cohosts_expanded_new` instead. */
  visible_cohosts_expanded?: Maybe<Array<Maybe<UserWithEmail>>>;
  visible_cohosts_expanded_new?: Maybe<Array<Maybe<PossibleUserWithEmail>>>;
  welcome_text?: Maybe<Scalars['String']['output']>;
  welcome_video?: Maybe<Video>;
  zones_menu_text?: Maybe<Scalars['String']['output']>;
};


export type EventAccepted_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type EventCohosts_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type EventDeclined_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type EventEvents_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type EventInvited_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type EventNew_New_Photos_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type EventPayment_Accounts_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type EventPending_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type EventSpeaker_Users_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type EventStores_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};

export type EventApplicationAnswer = {
  __typename?: 'EventApplicationAnswer';
  _id: Scalars['MongoID']['output'];
  answer?: Maybe<Scalars['String']['output']>;
  answers?: Maybe<Array<Scalars['String']['output']>>;
  email?: Maybe<Scalars['String']['output']>;
  question: Scalars['MongoID']['output'];
  question_expanded: EventApplicationQuestion;
  user?: Maybe<Scalars['MongoID']['output']>;
};

export type EventApplicationAnswerExport = {
  __typename?: 'EventApplicationAnswerExport';
  _id: Scalars['MongoID']['output'];
  answer?: Maybe<Scalars['String']['output']>;
};

export type EventApplicationAnswerInput = {
  answer?: InputMaybe<Scalars['String']['input']>;
  answers?: InputMaybe<Array<Scalars['String']['input']>>;
  question: Scalars['MongoID']['input'];
};

export type EventApplicationExport = {
  __typename?: 'EventApplicationExport';
  answers: Array<EventApplicationAnswerExport>;
  non_login_user?: Maybe<EventApplicationUserExport>;
  questions: Array<Scalars['String']['output']>;
  user?: Maybe<EventApplicationUserExport>;
};

export type EventApplicationQuestion = {
  __typename?: 'EventApplicationQuestion';
  _id: Scalars['MongoID']['output'];
  options?: Maybe<Array<Scalars['String']['output']>>;
  position?: Maybe<Scalars['Int']['output']>;
  question?: Maybe<Scalars['String']['output']>;
  /** @deprecated Nolonger needed */
  questions?: Maybe<Array<Scalars['String']['output']>>;
  required?: Maybe<Scalars['Boolean']['output']>;
  select_type?: Maybe<SelectType>;
  type?: Maybe<QuestionType>;
};

export type EventApplicationQuestionAndAnswer = {
  __typename?: 'EventApplicationQuestionAndAnswer';
  answer?: Maybe<Scalars['String']['output']>;
  answers?: Maybe<Array<Scalars['String']['output']>>;
  question?: Maybe<Scalars['String']['output']>;
};

export type EventApplicationUserExport = {
  __typename?: 'EventApplicationUserExport';
  _id: Scalars['MongoID']['output'];
  email: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type EventAttestation = {
  __typename?: 'EventAttestation';
  event_address?: Maybe<Scalars['String']['output']>;
  last_sync: Scalars['DateTimeISO']['output'];
  uid?: Maybe<Scalars['String']['output']>;
};

export type EventAttestationDiff = {
  __typename?: 'EventAttestationDiff';
  event?: Maybe<EasEvent>;
  ticket_types?: Maybe<Array<EasTicketType>>;
};

export type EventBase = {
  __typename?: 'EventBase';
  _id?: Maybe<Scalars['MongoID']['output']>;
  accepted?: Maybe<Array<Scalars['MongoID']['output']>>;
  accepted_store_promotion?: Maybe<Scalars['MongoID']['output']>;
  accepted_user_fields_required?: Maybe<Array<Scalars['String']['output']>>;
  access_pass?: Maybe<AccessPass>;
  active: Scalars['Boolean']['output'];
  address?: Maybe<Address>;
  address_directions?: Maybe<Array<Scalars['String']['output']>>;
  alert_payments?: Maybe<Array<Scalars['MongoID']['output']>>;
  alert_tickets?: Maybe<Scalars['JSON']['output']>;
  application_form_url?: Maybe<Scalars['String']['output']>;
  application_profile_fields?: Maybe<Array<ApplicationProfileField>>;
  application_required?: Maybe<Scalars['Boolean']['output']>;
  /** @deprecated To be removed */
  application_self_verification?: Maybe<Scalars['Boolean']['output']>;
  application_self_verification_required?: Maybe<Scalars['Boolean']['output']>;
  approval_required?: Maybe<Scalars['Boolean']['output']>;
  approved?: Maybe<Scalars['Boolean']['output']>;
  /** Number of users who have tickets */
  attending_count?: Maybe<Scalars['Float']['output']>;
  broadcast_rooms?: Maybe<Array<BroadcastRoomBase>>;
  button_icon?: Maybe<Scalars['String']['output']>;
  button_text?: Maybe<Scalars['String']['output']>;
  button_url?: Maybe<Scalars['String']['output']>;
  /** @deprecated No longer in use and will be removed in a future release. */
  checkin_count?: Maybe<Scalars['Float']['output']>;
  checkin_menu_text?: Maybe<Scalars['String']['output']>;
  cohosts?: Maybe<Array<Scalars['MongoID']['output']>>;
  comments?: Maybe<Scalars['String']['output']>;
  cost?: Maybe<Scalars['Float']['output']>;
  cover?: Maybe<Scalars['String']['output']>;
  cta_button_text?: Maybe<Scalars['String']['output']>;
  /** Show secondary CTA button text */
  cta_secondary_visible?: Maybe<Scalars['Boolean']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  dark_theme_image?: Maybe<Scalars['MongoID']['output']>;
  declined?: Maybe<Array<Scalars['MongoID']['output']>>;
  description?: Maybe<Scalars['String']['output']>;
  description_plain_text?: Maybe<Scalars['String']['output']>;
  donation_enabled?: Maybe<Scalars['Boolean']['output']>;
  donation_show_history?: Maybe<Scalars['Boolean']['output']>;
  donation_vaults?: Maybe<Array<Scalars['MongoID']['output']>>;
  end: Scalars['DateTimeISO']['output'];
  eventbrite_enabled?: Maybe<Scalars['Boolean']['output']>;
  eventbrite_event_id?: Maybe<Scalars['String']['output']>;
  eventbrite_tickets_imported?: Maybe<Scalars['Boolean']['output']>;
  eventbrite_token?: Maybe<Scalars['String']['output']>;
  events?: Maybe<Array<Scalars['MongoID']['output']>>;
  external_hostname?: Maybe<Scalars['String']['output']>;
  external_url?: Maybe<Scalars['String']['output']>;
  frequent_questions?: Maybe<Array<FrequentQuestion>>;
  guest_directory_enabled?: Maybe<Scalars['Boolean']['output']>;
  guest_limit?: Maybe<Scalars['Float']['output']>;
  guest_limit_per?: Maybe<Scalars['Float']['output']>;
  guests?: Maybe<Scalars['Int']['output']>;
  hide_attending?: Maybe<Scalars['Boolean']['output']>;
  hide_chat_action?: Maybe<Scalars['Boolean']['output']>;
  hide_cohosts?: Maybe<Scalars['Boolean']['output']>;
  hide_creators?: Maybe<Scalars['Boolean']['output']>;
  hide_invite_action?: Maybe<Scalars['Boolean']['output']>;
  hide_lounge?: Maybe<Scalars['Boolean']['output']>;
  hide_question_box?: Maybe<Scalars['Boolean']['output']>;
  hide_rooms_action?: Maybe<Scalars['Boolean']['output']>;
  hide_session_guests?: Maybe<Scalars['Boolean']['output']>;
  hide_speakers?: Maybe<Scalars['Boolean']['output']>;
  hide_stories_action?: Maybe<Scalars['Boolean']['output']>;
  highlight?: Maybe<Scalars['Boolean']['output']>;
  host: Scalars['MongoID']['output'];
  inherited_cohosts?: Maybe<Array<Scalars['MongoID']['output']>>;
  insider_enabled?: Maybe<Scalars['Boolean']['output']>;
  insider_token?: Maybe<Scalars['String']['output']>;
  invited?: Maybe<Array<Scalars['MongoID']['output']>>;
  invited_count?: Maybe<Scalars['Float']['output']>;
  invited_email_map?: Maybe<Scalars['JSON']['output']>;
  invited_emails?: Maybe<Array<Scalars['String']['output']>>;
  invited_phone_map?: Maybe<Scalars['JSON']['output']>;
  invited_user_map?: Maybe<Scalars['JSON']['output']>;
  inviter_email_map?: Maybe<Scalars['JSON']['output']>;
  inviter_phone_map?: Maybe<Scalars['JSON']['output']>;
  inviter_user_map?: Maybe<Scalars['JSON']['output']>;
  inviters?: Maybe<Array<Scalars['MongoID']['output']>>;
  latitude?: Maybe<Scalars['Float']['output']>;
  layout_sections?: Maybe<Array<LayoutSection>>;
  light_theme_image?: Maybe<Scalars['MongoID']['output']>;
  listing_spaces?: Maybe<Array<Scalars['MongoID']['output']>>;
  location?: Maybe<Point>;
  longitude?: Maybe<Scalars['Float']['output']>;
  matrix_event_room_id?: Maybe<Scalars['String']['output']>;
  new_new_photos?: Maybe<Array<Scalars['MongoID']['output']>>;
  new_photos?: Maybe<Array<FileInline>>;
  offers?: Maybe<Array<EventOffer>>;
  payment_accounts_new?: Maybe<Array<Scalars['MongoID']['output']>>;
  payment_donation?: Maybe<Scalars['Boolean']['output']>;
  payment_donation_amount_includes_tickets?: Maybe<Scalars['Boolean']['output']>;
  payment_donation_amount_increment?: Maybe<Scalars['Float']['output']>;
  payment_donation_message?: Maybe<Scalars['String']['output']>;
  payment_donation_target?: Maybe<Scalars['Float']['output']>;
  payment_enabled?: Maybe<Scalars['Boolean']['output']>;
  payment_fee: Scalars['Float']['output'];
  payment_optional?: Maybe<Scalars['Boolean']['output']>;
  payment_ticket_count?: Maybe<Scalars['Float']['output']>;
  payment_ticket_external_message?: Maybe<Scalars['String']['output']>;
  payment_ticket_external_url?: Maybe<Scalars['String']['output']>;
  payment_ticket_purchase_title?: Maybe<Scalars['String']['output']>;
  payment_ticket_unassigned_count?: Maybe<Scalars['Float']['output']>;
  pending?: Maybe<Array<Scalars['MongoID']['output']>>;
  photos?: Maybe<Array<Scalars['String']['output']>>;
  private?: Maybe<Scalars['Boolean']['output']>;
  published?: Maybe<Scalars['Boolean']['output']>;
  registration_disabled?: Maybe<Scalars['Boolean']['output']>;
  reward_uses?: Maybe<Scalars['JSON']['output']>;
  rewards?: Maybe<Array<EventReward>>;
  rsvp_wallet_platforms?: Maybe<Array<ApplicationBlokchainPlatform>>;
  self_verification?: Maybe<SelfVerification>;
  session_guests?: Maybe<Scalars['JSON']['output']>;
  sessions?: Maybe<Array<EventSessionBase>>;
  shortid: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  space?: Maybe<Scalars['MongoID']['output']>;
  speaker_emails?: Maybe<Array<Scalars['String']['output']>>;
  speaker_users?: Maybe<Array<Scalars['MongoID']['output']>>;
  stamp: Scalars['DateTimeISO']['output'];
  start: Scalars['DateTimeISO']['output'];
  state: EventState;
  stores?: Maybe<Array<Scalars['MongoID']['output']>>;
  stories?: Maybe<Array<Scalars['MongoID']['output']>>;
  stories_eponym?: Maybe<Scalars['Boolean']['output']>;
  subevent_enabled?: Maybe<Scalars['Boolean']['output']>;
  subevent_parent?: Maybe<Scalars['MongoID']['output']>;
  subevent_settings?: Maybe<SubeventSettings>;
  tags?: Maybe<Array<Scalars['String']['output']>>;
  telegram_channels?: Maybe<Array<TelegramChannel>>;
  terms_accepted?: Maybe<Array<Scalars['MongoID']['output']>>;
  terms_accepted_with_email_permission?: Maybe<Array<Scalars['MongoID']['output']>>;
  terms_email_permission_text?: Maybe<Scalars['Boolean']['output']>;
  terms_link?: Maybe<Scalars['String']['output']>;
  terms_text?: Maybe<Scalars['String']['output']>;
  theme_data?: Maybe<Scalars['JSON']['output']>;
  /** The number of tickets available per user for this event */
  ticket_limit_per?: Maybe<Scalars['Float']['output']>;
  timezone?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  unlisted?: Maybe<Scalars['Boolean']['output']>;
  unsure?: Maybe<Array<Scalars['MongoID']['output']>>;
  url?: Maybe<Scalars['String']['output']>;
  url_go?: Maybe<Scalars['String']['output']>;
  videos?: Maybe<Array<Video>>;
  virtual?: Maybe<Scalars['Boolean']['output']>;
  virtual_url?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use data from event cohost requests table */
  visible_cohosts?: Maybe<Array<Scalars['MongoID']['output']>>;
  welcome_text?: Maybe<Scalars['String']['output']>;
  welcome_video?: Maybe<Video>;
  zones_menu_text?: Maybe<Scalars['String']['output']>;
};

export type EventCalendarLinks = {
  __typename?: 'EventCalendarLinks';
  google: Scalars['String']['output'];
  ical: Scalars['String']['output'];
  outlook: Scalars['String']['output'];
  yahoo: Scalars['String']['output'];
};

export type EventCheckin = {
  __typename?: 'EventCheckin';
  _id: Scalars['MongoID']['output'];
  active: Scalars['Boolean']['output'];
  created_at: Scalars['DateTimeISO']['output'];
  email?: Maybe<Scalars['String']['output']>;
  event: Scalars['MongoID']['output'];
  login_user?: Maybe<UserWithEmail>;
  non_login_user?: Maybe<NonloginUser>;
  ticket: Scalars['MongoID']['output'];
  updated_by_expanded?: Maybe<User>;
  user?: Maybe<Scalars['MongoID']['output']>;
};

export type EventCheckinChartData = {
  __typename?: 'EventCheckinChartData';
  items: Array<EventCheckinItem>;
};

export type EventCheckinItem = {
  __typename?: 'EventCheckinItem';
  created_at: Scalars['DateTimeISO']['output'];
};

export type EventCohostRequest = {
  __typename?: 'EventCohostRequest';
  _id: Scalars['MongoID']['output'];
  event: Scalars['MongoID']['output'];
  event_role?: Maybe<EventRole>;
  from: Scalars['MongoID']['output'];
  from_expanded?: Maybe<User>;
  profile_image_avatar?: Maybe<Scalars['String']['output']>;
  profile_name?: Maybe<Scalars['String']['output']>;
  stamp: Scalars['DateTimeISO']['output'];
  /** @deprecated Requests are auto accepted */
  state: EventCohostRequestState;
  to?: Maybe<Scalars['MongoID']['output']>;
  to_email?: Maybe<Scalars['String']['output']>;
  to_expanded?: Maybe<User>;
  visible?: Maybe<Scalars['Boolean']['output']>;
};

export enum EventCohostRequestState {
  Accepted = 'ACCEPTED',
  Declined = 'DECLINED',
  Pending = 'PENDING'
}

export type EventCurrency = {
  __typename?: 'EventCurrency';
  currency: Scalars['String']['output'];
  decimals: Scalars['Float']['output'];
  network?: Maybe<Scalars['String']['output']>;
};

export type EventFeedback = {
  __typename?: 'EventFeedback';
  comment?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['DateTimeISO']['output'];
  email?: Maybe<Scalars['String']['output']>;
  event: Scalars['MongoID']['output'];
  rate_value: Scalars['Float']['output'];
  user?: Maybe<Scalars['MongoID']['output']>;
  user_info?: Maybe<User>;
};

export type EventFeedbackSummary = {
  __typename?: 'EventFeedbackSummary';
  rates: Array<RateSummary>;
};

export type EventGuestDetail = {
  __typename?: 'EventGuestDetail';
  application?: Maybe<Array<EventApplicationQuestionAndAnswer>>;
  join_request?: Maybe<EventJoinRequest>;
  payment?: Maybe<EventGuestPayment>;
  ticket?: Maybe<Ticket>;
  user: EventGuestUser;
};

export type EventGuestDetailedInfo = {
  __typename?: 'EventGuestDetailedInfo';
  application?: Maybe<Array<EventApplicationQuestionAndAnswer>>;
  cancelled_tickets?: Maybe<Array<Ticket>>;
  checkin_count?: Maybe<Scalars['Int']['output']>;
  invitation?: Maybe<EventInvitation>;
  join_request?: Maybe<EventJoinRequest>;
  payments?: Maybe<Array<EventGuestPayment>>;
  purchased_tickets?: Maybe<Array<Ticket>>;
  rsvp_count?: Maybe<Scalars['Int']['output']>;
  ticket?: Maybe<Ticket>;
  user: EventGuestUser;
};

export type EventGuestPayment = {
  __typename?: 'EventGuestPayment';
  _id: Scalars['MongoID']['output'];
  account: Scalars['MongoID']['output'];
  account_expanded?: Maybe<NewPaymentAccount>;
  amount: Scalars['String']['output'];
  attempting_refund?: Maybe<Scalars['Boolean']['output']>;
  billing_info?: Maybe<BillingInfo>;
  buyer_info?: Maybe<BuyerInfo>;
  buyer_user?: Maybe<UserWithEmail>;
  crypto_payment_info?: Maybe<CryptoPaymentInfo>;
  currency: Scalars['String']['output'];
  due_amount?: Maybe<Scalars['String']['output']>;
  failure_reason?: Maybe<Scalars['String']['output']>;
  fee?: Maybe<Scalars['String']['output']>;
  formatted_discount_amount?: Maybe<Scalars['String']['output']>;
  formatted_due_amount?: Maybe<Scalars['String']['output']>;
  formatted_fee_amount?: Maybe<Scalars['String']['output']>;
  formatted_total_amount?: Maybe<Scalars['String']['output']>;
  ref_data?: Maybe<Scalars['JSON']['output']>;
  stamps: Scalars['JSON']['output'];
  state: NewPaymentState;
  stripe_payment_info?: Maybe<StripePaymentInfo>;
  transfer_metadata?: Maybe<Scalars['JSON']['output']>;
  transfer_params?: Maybe<Scalars['JSON']['output']>;
  user?: Maybe<Scalars['MongoID']['output']>;
};

export type EventGuestUser = {
  __typename?: 'EventGuestUser';
  _id?: Maybe<Scalars['MongoID']['output']>;
  /** This is the biography of the user */
  description?: Maybe<Scalars['String']['output']>;
  display_name?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  image_avatar?: Maybe<Scalars['String']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
  wallets_new?: Maybe<Scalars['JSON']['output']>;
};

export type EventHost = {
  __typename?: 'EventHost';
  _id?: Maybe<Scalars['MongoID']['output']>;
  events_count?: Maybe<Scalars['Float']['output']>;
  image_avatar?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type EventInput = {
  accepted_store_promotion?: InputMaybe<Scalars['MongoID']['input']>;
  accepted_user_fields_required?: InputMaybe<Array<Scalars['String']['input']>>;
  access_pass?: InputMaybe<AccessPassInput>;
  address?: InputMaybe<AddressInput>;
  address_directions?: InputMaybe<Array<Scalars['String']['input']>>;
  application_form_url?: InputMaybe<Scalars['String']['input']>;
  application_profile_fields?: InputMaybe<Array<ApplicationProfileFieldInput>>;
  application_required?: InputMaybe<Scalars['Boolean']['input']>;
  application_self_verification?: InputMaybe<Scalars['Boolean']['input']>;
  application_self_verification_required?: InputMaybe<Scalars['Boolean']['input']>;
  approval_required?: InputMaybe<Scalars['Boolean']['input']>;
  broadcast_rooms?: InputMaybe<Array<BroadcastRoomInput>>;
  checkin_menu_text?: InputMaybe<Scalars['String']['input']>;
  comments?: InputMaybe<Scalars['String']['input']>;
  cost?: InputMaybe<Scalars['Float']['input']>;
  cover?: InputMaybe<Scalars['String']['input']>;
  cta_button_text?: InputMaybe<Scalars['String']['input']>;
  /** Show secondary CTA button text */
  cta_secondary_visible?: InputMaybe<Scalars['Boolean']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  dark_theme_image?: InputMaybe<Scalars['MongoID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  description_plain_text?: InputMaybe<Scalars['String']['input']>;
  donation_enabled?: InputMaybe<Scalars['Boolean']['input']>;
  donation_show_history?: InputMaybe<Scalars['Boolean']['input']>;
  donation_vaults?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  end?: InputMaybe<Scalars['DateTimeISO']['input']>;
  events?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  external_hostname?: InputMaybe<Scalars['String']['input']>;
  external_url?: InputMaybe<Scalars['String']['input']>;
  frequent_questions?: InputMaybe<Array<FrequentQuestionInput>>;
  guest_directory_enabled?: InputMaybe<Scalars['Boolean']['input']>;
  guest_limit?: InputMaybe<Scalars['Float']['input']>;
  guest_limit_per?: InputMaybe<Scalars['Float']['input']>;
  hide_attending?: InputMaybe<Scalars['Boolean']['input']>;
  hide_chat_action?: InputMaybe<Scalars['Boolean']['input']>;
  hide_cohosts?: InputMaybe<Scalars['Boolean']['input']>;
  hide_creators?: InputMaybe<Scalars['Boolean']['input']>;
  hide_invite_action?: InputMaybe<Scalars['Boolean']['input']>;
  hide_lounge?: InputMaybe<Scalars['Boolean']['input']>;
  hide_question_box?: InputMaybe<Scalars['Boolean']['input']>;
  hide_rooms_action?: InputMaybe<Scalars['Boolean']['input']>;
  hide_session_guests?: InputMaybe<Scalars['Boolean']['input']>;
  hide_speakers?: InputMaybe<Scalars['Boolean']['input']>;
  hide_stories_action?: InputMaybe<Scalars['Boolean']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  layout_sections?: InputMaybe<Array<LayoutSectionInput>>;
  light_theme_image?: InputMaybe<Scalars['MongoID']['input']>;
  listing_spaces?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  new_new_photos?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  new_photos?: InputMaybe<Array<FileInlineInput>>;
  offers?: InputMaybe<Array<EventOfferInput>>;
  payment_accounts_new?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  payment_donation?: InputMaybe<Scalars['Boolean']['input']>;
  payment_donation_amount_includes_tickets?: InputMaybe<Scalars['Boolean']['input']>;
  payment_donation_message?: InputMaybe<Scalars['String']['input']>;
  payment_donation_target?: InputMaybe<Scalars['Float']['input']>;
  payment_optional?: InputMaybe<Scalars['Boolean']['input']>;
  payment_ticket_purchase_title?: InputMaybe<Scalars['String']['input']>;
  photos?: InputMaybe<Array<Scalars['String']['input']>>;
  private?: InputMaybe<Scalars['Boolean']['input']>;
  published?: InputMaybe<Scalars['Boolean']['input']>;
  registration_disabled?: InputMaybe<Scalars['Boolean']['input']>;
  rewards?: InputMaybe<Array<EventRewardInput>>;
  rsvp_wallet_platforms?: InputMaybe<Array<ApplicationBlokchainPlatformInput>>;
  self_verification?: InputMaybe<SelfVerificationInput>;
  sessions?: InputMaybe<Array<EventSessionInput>>;
  shortid?: InputMaybe<Scalars['String']['input']>;
  space?: InputMaybe<Scalars['MongoID']['input']>;
  speaker_emails?: InputMaybe<Array<Scalars['String']['input']>>;
  speaker_users?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  start?: InputMaybe<Scalars['DateTimeISO']['input']>;
  stores?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  stories?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  subevent_enabled?: InputMaybe<Scalars['Boolean']['input']>;
  subevent_parent?: InputMaybe<Scalars['MongoID']['input']>;
  subevent_settings?: InputMaybe<SubeventSettingsInput>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  telegram_channels?: InputMaybe<Array<TelegramChannelInput>>;
  terms_email_permission_text?: InputMaybe<Scalars['Boolean']['input']>;
  terms_link?: InputMaybe<Scalars['String']['input']>;
  terms_text?: InputMaybe<Scalars['String']['input']>;
  theme_data?: InputMaybe<Scalars['JSON']['input']>;
  /** The number of tickets available per user for this event */
  ticket_limit_per?: InputMaybe<Scalars['Float']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  virtual?: InputMaybe<Scalars['Boolean']['input']>;
  virtual_url?: InputMaybe<Scalars['String']['input']>;
  visible_cohosts?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  welcome_text?: InputMaybe<Scalars['String']['input']>;
  welcome_video?: InputMaybe<VideoInput>;
  zones_menu_text?: InputMaybe<Scalars['String']['input']>;
};

export type EventInvitation = {
  __typename?: 'EventInvitation';
  _id: Scalars['MongoID']['output'];
  cancelled_by?: Maybe<Scalars['MongoID']['output']>;
  created_at: Scalars['DateTimeISO']['output'];
  email?: Maybe<Scalars['String']['output']>;
  event: Scalars['MongoID']['output'];
  inviters: Array<Scalars['MongoID']['output']>;
  inviters_expanded?: Maybe<Array<User>>;
  phone?: Maybe<Scalars['String']['output']>;
  status: InvitationResponse;
  user?: Maybe<Scalars['MongoID']['output']>;
};

export type EventInvitationUrl = {
  __typename?: 'EventInvitationUrl';
  event: Scalars['MongoID']['output'];
  user: Scalars['MongoID']['output'];
};

export type EventInvite = {
  __typename?: 'EventInvite';
  event: Scalars['MongoID']['output'];
  event_expanded?: Maybe<Event>;
  inviter: Scalars['MongoID']['output'];
  inviter_expanded?: Maybe<User>;
};

export type EventInviter = {
  __typename?: 'EventInviter';
  count: Scalars['Int']['output'];
  inviter: BasicUserInfo;
};

export type EventJoinRequest = {
  __typename?: 'EventJoinRequest';
  _id: Scalars['MongoID']['output'];
  created_at: Scalars['DateTimeISO']['output'];
  decided_at?: Maybe<Scalars['DateTimeISO']['output']>;
  decided_by?: Maybe<Scalars['MongoID']['output']>;
  decided_by_expanded?: Maybe<User>;
  email?: Maybe<Scalars['String']['output']>;
  event: Scalars['MongoID']['output'];
  event_expanded?: Maybe<Event>;
  metadata?: Maybe<Scalars['JSON']['output']>;
  non_login_user?: Maybe<NonloginUser>;
  payment?: Maybe<JoinRequestPayment>;
  payment_id?: Maybe<Scalars['MongoID']['output']>;
  requested_tickets?: Maybe<Array<RequestedTicket>>;
  state: EventJoinRequestState;
  ticket_types_expanded?: Maybe<Array<Maybe<EventTicketType>>>;
  user?: Maybe<Scalars['MongoID']['output']>;
  user_expanded?: Maybe<UserWithEmail>;
};

export type EventJoinRequestBase = {
  __typename?: 'EventJoinRequestBase';
  _id: Scalars['MongoID']['output'];
  created_at: Scalars['DateTimeISO']['output'];
  decided_at?: Maybe<Scalars['DateTimeISO']['output']>;
  decided_by?: Maybe<Scalars['MongoID']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  event: Scalars['MongoID']['output'];
  metadata?: Maybe<Scalars['JSON']['output']>;
  payment_id?: Maybe<Scalars['MongoID']['output']>;
  requested_tickets?: Maybe<Array<RequestedTicket>>;
  state: EventJoinRequestState;
  user?: Maybe<Scalars['MongoID']['output']>;
};

export enum EventJoinRequestState {
  Approved = 'approved',
  Declined = 'declined',
  Pending = 'pending'
}

export type EventLatestViews = {
  __typename?: 'EventLatestViews';
  views: Array<Track>;
};

export type EventOffer = {
  __typename?: 'EventOffer';
  _id?: Maybe<Scalars['MongoID']['output']>;
  auto?: Maybe<Scalars['Boolean']['output']>;
  broadcast_rooms?: Maybe<Array<Scalars['MongoID']['output']>>;
  position?: Maybe<Scalars['Float']['output']>;
  provider: OfferProvider;
  provider_id: Scalars['String']['output'];
  provider_network: Scalars['String']['output'];
};

export type EventOfferInput = {
  _id?: InputMaybe<Scalars['MongoID']['input']>;
  auto?: InputMaybe<Scalars['Boolean']['input']>;
  broadcast_rooms?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  position?: InputMaybe<Scalars['Float']['input']>;
  provider: OfferProvider;
  provider_id: Scalars['String']['input'];
  provider_network: Scalars['String']['input'];
};

export type EventPaymentStatistics = {
  __typename?: 'EventPaymentStatistics';
  crypto_payments: CryptoPaymentStatistics;
  stripe_payments: PaymentStatistics;
  total_payments: Scalars['Int']['output'];
};

export type EventPaymentSummary = {
  __typename?: 'EventPaymentSummary';
  amount: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  decimals: Scalars['Float']['output'];
  pending_transfer_amount: Scalars['String']['output'];
  transfer_amount: Scalars['String']['output'];
};

export type EventPaymentTicketDiscount = {
  __typename?: 'EventPaymentTicketDiscount';
  active: Scalars['Boolean']['output'];
  code: Scalars['String']['output'];
  ratio: Scalars['Float']['output'];
  stamp: Scalars['DateTimeISO']['output'];
  ticket_count?: Maybe<Scalars['Float']['output']>;
  ticket_count_map?: Maybe<Scalars['JSON']['output']>;
  ticket_limit?: Maybe<Scalars['Float']['output']>;
  ticket_limit_per?: Maybe<Scalars['Float']['output']>;
  ticket_types?: Maybe<Array<Scalars['MongoID']['output']>>;
  use_count?: Maybe<Scalars['Float']['output']>;
  use_count_map?: Maybe<Scalars['JSON']['output']>;
  use_limit?: Maybe<Scalars['Float']['output']>;
  use_limit_per?: Maybe<Scalars['Float']['output']>;
  users?: Maybe<Array<Scalars['MongoID']['output']>>;
  users_expanded?: Maybe<Array<Maybe<User>>>;
};


export type EventPaymentTicketDiscountUsers_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};

export type EventPaymentTicketDiscountInput = {
  code: Scalars['String']['input'];
  ratio: Scalars['Float']['input'];
  ticket_limit?: InputMaybe<Scalars['Float']['input']>;
  ticket_limit_per?: InputMaybe<Scalars['Float']['input']>;
  ticket_types?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  use_limit?: InputMaybe<Scalars['Float']['input']>;
  use_limit_per?: InputMaybe<Scalars['Float']['input']>;
};

export type EventQuestion = {
  __typename?: 'EventQuestion';
  _id: Scalars['MongoID']['output'];
  event: Scalars['MongoID']['output'];
  liked?: Maybe<Scalars['Boolean']['output']>;
  likes: Scalars['Int']['output'];
  question: Scalars['String']['output'];
  session?: Maybe<Scalars['MongoID']['output']>;
  stamp: Scalars['DateTimeISO']['output'];
  user: Scalars['MongoID']['output'];
  user_expanded?: Maybe<User>;
};

export type EventRequestStateStatistic = {
  __typename?: 'EventRequestStateStatistic';
  state: EventJoinRequestState;
  total: Scalars['Float']['output'];
};

export type EventReward = {
  __typename?: 'EventReward';
  _id?: Maybe<Scalars['MongoID']['output']>;
  active: Scalars['Boolean']['output'];
  icon_color?: Maybe<Scalars['String']['output']>;
  icon_url?: Maybe<Scalars['String']['output']>;
  limit?: Maybe<Scalars['Float']['output']>;
  limit_per: Scalars['Float']['output'];
  payment_ticket_types?: Maybe<Array<Scalars['MongoID']['output']>>;
  title: Scalars['String']['output'];
};

export type EventRewardInput = {
  _id?: InputMaybe<Scalars['MongoID']['input']>;
  active: Scalars['Boolean']['input'];
  icon_color?: InputMaybe<Scalars['String']['input']>;
  icon_url?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Float']['input']>;
  limit_per: Scalars['Float']['input'];
  payment_ticket_types?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  title: Scalars['String']['input'];
};

export type EventRewardUse = {
  __typename?: 'EventRewardUse';
  _id: Scalars['MongoID']['output'];
  active: Scalars['Boolean']['output'];
  event: Scalars['MongoID']['output'];
  reward_id: Scalars['MongoID']['output'];
  reward_number: Scalars['Float']['output'];
  user: Scalars['MongoID']['output'];
  user_expanded?: Maybe<User>;
};

export enum EventRole {
  Cohost = 'cohost',
  Gatekeeper = 'gatekeeper',
  Representative = 'representative'
}

export type EventRsvp = {
  __typename?: 'EventRsvp';
  messages?: Maybe<EventRsvpMessages>;
  payment?: Maybe<EventRsvpPayment>;
  state: EventRsvpState;
};

export type EventRsvpMessages = {
  __typename?: 'EventRsvpMessages';
  primary: Scalars['String']['output'];
  secondary?: Maybe<Scalars['String']['output']>;
};

export type EventRsvpPayment = {
  __typename?: 'EventRsvpPayment';
  amount: Scalars['Float']['output'];
  currency: Scalars['String']['output'];
  provider: Scalars['String']['output'];
};

export enum EventRsvpState {
  Accepted = 'accepted',
  Declined = 'declined',
  Payment = 'payment',
  Pending = 'pending'
}

export type EventSession = {
  __typename?: 'EventSession';
  _id?: Maybe<Scalars['MongoID']['output']>;
  broadcast?: Maybe<Scalars['MongoID']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  end: Scalars['DateTimeISO']['output'];
  photos?: Maybe<Array<Scalars['MongoID']['output']>>;
  photos_expanded?: Maybe<Array<Maybe<File>>>;
  speaker_users?: Maybe<Array<Scalars['MongoID']['output']>>;
  speaker_users_expanded?: Maybe<Array<Maybe<User>>>;
  start: Scalars['DateTimeISO']['output'];
  title: Scalars['String']['output'];
  votings?: Maybe<Array<Scalars['MongoID']['output']>>;
};


export type EventSessionPhotos_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type EventSessionSpeaker_Users_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};

export type EventSessionBase = {
  __typename?: 'EventSessionBase';
  _id?: Maybe<Scalars['MongoID']['output']>;
  broadcast?: Maybe<Scalars['MongoID']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  end: Scalars['DateTimeISO']['output'];
  photos?: Maybe<Array<Scalars['MongoID']['output']>>;
  speaker_users?: Maybe<Array<Scalars['MongoID']['output']>>;
  start: Scalars['DateTimeISO']['output'];
  title: Scalars['String']['output'];
  votings?: Maybe<Array<Scalars['MongoID']['output']>>;
};

export type EventSessionInput = {
  _id?: InputMaybe<Scalars['MongoID']['input']>;
  broadcast?: InputMaybe<Scalars['MongoID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  end: Scalars['DateTimeISO']['input'];
  photos?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  speaker_users?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  start: Scalars['DateTimeISO']['input'];
  title: Scalars['String']['input'];
  votings?: InputMaybe<Array<Scalars['MongoID']['input']>>;
};

export type EventSessionReservation = {
  __typename?: 'EventSessionReservation';
  event: Scalars['MongoID']['output'];
  session: Scalars['MongoID']['output'];
  ticket_type?: Maybe<Scalars['MongoID']['output']>;
  user: Scalars['MongoID']['output'];
  user_expanded?: Maybe<User>;
};

export type EventSessionReservationInput = {
  event: Scalars['MongoID']['input'];
  session: Scalars['MongoID']['input'];
};

export type EventSessionReservationSummary = {
  __typename?: 'EventSessionReservationSummary';
  count: Scalars['Float']['output'];
  session: Scalars['MongoID']['output'];
  ticket_type?: Maybe<Scalars['MongoID']['output']>;
};

export type EventSortInput = {
  end?: InputMaybe<SortOrder>;
  start?: InputMaybe<SortOrder>;
};

export type EventStakePayment = {
  __typename?: 'EventStakePayment';
  _id: Scalars['MongoID']['output'];
  currency: Scalars['String']['output'];
  formatted_stake_amount: Scalars['String']['output'];
  network: Scalars['String']['output'];
  refund_requirements_met?: Maybe<Scalars['Boolean']['output']>;
  staker: StakeUser;
  state: StakeState;
  ticket_count: Scalars['Float']['output'];
};

export enum EventState {
  Cancelled = 'cancelled',
  Created = 'created',
  Ended = 'ended',
  Started = 'started'
}

export type EventStoryInput = {
  event: Scalars['MongoID']['input'];
  file: Scalars['MongoID']['input'];
};

export enum EventTense {
  Current = 'Current',
  Future = 'Future',
  Past = 'Past'
}

export type EventTicketCategory = {
  __typename?: 'EventTicketCategory';
  _id: Scalars['MongoID']['output'];
  description?: Maybe<Scalars['String']['output']>;
  event: Scalars['MongoID']['output'];
  position?: Maybe<Scalars['Int']['output']>;
  title: Scalars['String']['output'];
};

export type EventTicketPrice = {
  __typename?: 'EventTicketPrice';
  cost: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  default?: Maybe<Scalars['Boolean']['output']>;
  payment_accounts?: Maybe<Array<Scalars['MongoID']['output']>>;
  payment_accounts_expanded?: Maybe<Array<NewPaymentAccount>>;
};

export type EventTicketPriceInput = {
  cost: Scalars['String']['input'];
  currency: Scalars['String']['input'];
  default?: InputMaybe<Scalars['Boolean']['input']>;
  payment_accounts?: InputMaybe<Array<Scalars['MongoID']['input']>>;
};

export type EventTicketSaleResponse = {
  __typename?: 'EventTicketSaleResponse';
  last_update: Scalars['DateTimeISO']['output'];
  sales: Array<SaleAmountResponse>;
};

export type EventTicketType = {
  __typename?: 'EventTicketType';
  _id: Scalars['MongoID']['output'];
  active?: Maybe<Scalars['Boolean']['output']>;
  address_required?: Maybe<Scalars['Boolean']['output']>;
  approval_required?: Maybe<Scalars['Boolean']['output']>;
  category?: Maybe<Scalars['MongoID']['output']>;
  category_expanded?: Maybe<EventTicketCategory>;
  default?: Maybe<Scalars['Boolean']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  description_line?: Maybe<Scalars['String']['output']>;
  event: Scalars['MongoID']['output'];
  external_ids?: Maybe<Array<Scalars['String']['output']>>;
  limited?: Maybe<Scalars['Boolean']['output']>;
  limited_whitelist_users?: Maybe<Array<WhitelistUserInfo>>;
  offers?: Maybe<Array<EventOffer>>;
  passcode_enabled?: Maybe<Scalars['Boolean']['output']>;
  photos?: Maybe<Array<Scalars['MongoID']['output']>>;
  photos_expanded?: Maybe<Array<Maybe<File>>>;
  position?: Maybe<Scalars['Int']['output']>;
  prices: Array<EventTicketPrice>;
  private?: Maybe<Scalars['Boolean']['output']>;
  recommended_upgrade_ticket_types?: Maybe<Array<Scalars['MongoID']['output']>>;
  self_verification?: Maybe<SelfVerification>;
  ticket_count?: Maybe<Scalars['Float']['output']>;
  ticket_limit?: Maybe<Scalars['Float']['output']>;
  ticket_limit_per?: Maybe<Scalars['Float']['output']>;
  title: Scalars['String']['output'];
};


export type EventTicketTypePhotos_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};

export type EventTicketTypeInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  added_whitelist_emails?: InputMaybe<Array<Scalars['String']['input']>>;
  address_required?: InputMaybe<Scalars['Boolean']['input']>;
  approval_required?: InputMaybe<Scalars['Boolean']['input']>;
  category?: InputMaybe<Scalars['MongoID']['input']>;
  default?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  description_line?: InputMaybe<Scalars['String']['input']>;
  event?: InputMaybe<Scalars['MongoID']['input']>;
  external_ids?: InputMaybe<Array<Scalars['String']['input']>>;
  limited?: InputMaybe<Scalars['Boolean']['input']>;
  limited_whitelist_emails?: InputMaybe<Array<Scalars['String']['input']>>;
  limited_whitelist_ids?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  offers?: InputMaybe<Array<EventTicketTypeOffersInput>>;
  passcode?: InputMaybe<Scalars['String']['input']>;
  passcode_enabled?: InputMaybe<Scalars['Boolean']['input']>;
  photos?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  position?: InputMaybe<Scalars['Int']['input']>;
  prices?: InputMaybe<Array<EventTicketPriceInput>>;
  private?: InputMaybe<Scalars['Boolean']['input']>;
  recommended_upgrade_ticket_types?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  removed_whitelist_emails?: InputMaybe<Array<Scalars['String']['input']>>;
  self_verification?: InputMaybe<SelfVerificationInput>;
  ticket_limit?: InputMaybe<Scalars['Float']['input']>;
  ticket_limit_per?: InputMaybe<Scalars['Float']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type EventTicketTypeOffersInput = {
  _id?: InputMaybe<Scalars['MongoID']['input']>;
  auto?: InputMaybe<Scalars['Boolean']['input']>;
  broadcast_rooms?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  position?: InputMaybe<Scalars['Float']['input']>;
  provider?: InputMaybe<OfferProvider>;
  provider_id?: InputMaybe<Scalars['String']['input']>;
  provider_network?: InputMaybe<Scalars['String']['input']>;
};

export type EventTokenGate = {
  __typename?: 'EventTokenGate';
  _id: Scalars['MongoID']['output'];
  /** Decimal places of this token, for display purpose only */
  decimals: Scalars['Float']['output'];
  event: Scalars['MongoID']['output'];
  gated_ticket_types?: Maybe<Array<Scalars['MongoID']['output']>>;
  /** ERC721 if true, else ERC20 */
  is_nft?: Maybe<Scalars['Boolean']['output']>;
  max_value?: Maybe<Scalars['String']['output']>;
  min_value?: Maybe<Scalars['String']['output']>;
  /** Display name of the token */
  name: Scalars['String']['output'];
  network: Scalars['String']['output'];
  ticket_types_expanded?: Maybe<Array<EventTicketType>>;
  token_address: Scalars['String']['output'];
};

export type EventTokenGateInput = {
  _id?: InputMaybe<Scalars['MongoID']['input']>;
  /** Decimal places of this token, for display purpose only */
  decimals?: InputMaybe<Scalars['Float']['input']>;
  event?: InputMaybe<Scalars['MongoID']['input']>;
  gated_ticket_types?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  /** ERC721 if true, else ERC20 */
  is_nft?: InputMaybe<Scalars['Boolean']['input']>;
  max_value?: InputMaybe<Scalars['String']['input']>;
  min_value?: InputMaybe<Scalars['String']['input']>;
  /** Display name of the token */
  name?: InputMaybe<Scalars['String']['input']>;
  network?: InputMaybe<Scalars['String']['input']>;
  token_address?: InputMaybe<Scalars['String']['input']>;
};

export type EventTopViewsByCity = {
  __typename?: 'EventTopViewsByCity';
  count: Scalars['Int']['output'];
  geoip_city?: Maybe<Scalars['String']['output']>;
  geoip_country?: Maybe<Scalars['String']['output']>;
  geoip_region?: Maybe<Scalars['String']['output']>;
};

export type EventTopViewsBySource = {
  __typename?: 'EventTopViewsBySource';
  count: Scalars['Int']['output'];
  utm_source?: Maybe<Scalars['String']['output']>;
};

export type EventViewChartData = {
  __typename?: 'EventViewChartData';
  items: Array<EventViewItem>;
};

export type EventViewItem = {
  __typename?: 'EventViewItem';
  date: Scalars['DateTimeISO']['output'];
};

export type EventViewStats = {
  __typename?: 'EventViewStats';
  counts: Array<Scalars['Int']['output']>;
};

export type EventVoting = {
  __typename?: 'EventVoting';
  _id: Scalars['MongoID']['output'];
  description?: Maybe<Scalars['String']['output']>;
  end: Scalars['DateTimeISO']['output'];
  hidden?: Maybe<Scalars['Boolean']['output']>;
  selected_option?: Maybe<Scalars['String']['output']>;
  speakers: Array<User>;
  stage?: Maybe<Scalars['String']['output']>;
  start: Scalars['DateTimeISO']['output'];
  state: EventVotingState;
  timezone?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  voting_options: Array<VotingOption>;
};

export enum EventVotingState {
  Closed = 'closed',
  NotStarted = 'not_started',
  Paused = 'paused',
  Starting = 'starting'
}

export type EventbriteEvent = {
  __typename?: 'EventbriteEvent';
  description?: Maybe<Scalars['String']['output']>;
  end: Scalars['DateTimeISO']['output'];
  id: Scalars['String']['output'];
  logo_url?: Maybe<Scalars['String']['output']>;
  stamp: Scalars['DateTimeISO']['output'];
  start: Scalars['DateTimeISO']['output'];
  status: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export enum EventbriteEventOrder {
  CreatedAsc = 'CREATED_ASC',
  CreatedDesc = 'CREATED_DESC'
}

export enum EventbriteEventStatus {
  Canceled = 'CANCELED',
  Draft = 'DRAFT',
  Ended = 'ENDED',
  Live = 'LIVE',
  Started = 'STARTED'
}

export type ExportedTickets = {
  __typename?: 'ExportedTickets';
  count: Scalars['Float']['output'];
  tickets: Array<TicketExport>;
};

export type FarcasterUserInfo = {
  __typename?: 'FarcasterUserInfo';
  account_key_request?: Maybe<AccountKeyRequest>;
  fid?: Maybe<Scalars['Float']['output']>;
};

export type Feature = {
  __typename?: 'Feature';
  code: FeatureCode;
  title: Scalars['String']['output'];
};

export enum FeatureCode {
  CsvGuestList = 'CSVGuestList',
  Checkin = 'Checkin',
  CollectibleData = 'CollectibleData',
  DataDashboard = 'DataDashboard',
  EmailManager = 'EmailManager',
  EventInvitation = 'EventInvitation',
  EventSettings = 'EventSettings',
  GuestListDashboard = 'GuestListDashboard',
  ManageSpace = 'ManageSpace',
  ManageSpaceEvent = 'ManageSpaceEvent',
  ManageSpaceEventRequest = 'ManageSpaceEventRequest',
  ManageSpaceMembership = 'ManageSpaceMembership',
  ManageSpaceNewsletter = 'ManageSpaceNewsletter',
  ManageSpaceTag = 'ManageSpaceTag',
  ManageSpaceTokenGate = 'ManageSpaceTokenGate',
  Poap = 'Poap',
  PromotionCodes = 'PromotionCodes',
  SpaceStatistic = 'SpaceStatistic',
  Ticket = 'Ticket',
  TicketingSettings = 'TicketingSettings',
  ViewSpace = 'ViewSpace',
  ViewSpaceEvent = 'ViewSpaceEvent',
  ViewSpaceMembership = 'ViewSpaceMembership',
  ViewSpaceNewsletter = 'ViewSpaceNewsletter',
  ViewSpaceTag = 'ViewSpaceTag'
}

export type FiatCurrency = {
  __typename?: 'FiatCurrency';
  code: Scalars['String']['output'];
  decimals: Scalars['Float']['output'];
};

export type File = {
  __typename?: 'File';
  _id?: Maybe<Scalars['MongoID']['output']>;
  bucket: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  key: Scalars['String']['output'];
  liked?: Maybe<Scalars['Boolean']['output']>;
  likers?: Maybe<Array<Scalars['MongoID']['output']>>;
  likes: Scalars['Float']['output'];
  link_events_expanded?: Maybe<Array<Maybe<Event>>>;
  link_store_products_expanded?: Maybe<Array<Maybe<StoreProduct>>>;
  link_stores_expanded?: Maybe<Array<Maybe<Store>>>;
  link_users_expanded?: Maybe<Array<Maybe<User>>>;
  links?: Maybe<Array<FileLink>>;
  owner: Scalars['MongoID']['output'];
  owner_expanded?: Maybe<User>;
  size?: Maybe<Scalars['Float']['output']>;
  stamp: Scalars['DateTimeISO']['output'];
  state: FileState;
  type: Scalars['String']['output'];
  url: Scalars['String']['output'];
};


export type FileLink_Events_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type FileLink_Store_Products_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type FileLink_Stores_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type FileLink_Users_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};

export enum FileCategory {
  EventDarkTheme = 'event_dark_theme',
  EventLightTheme = 'event_light_theme',
  LemonheadLayer = 'lemonhead_layer',
  OtherAsset = 'other_asset',
  SpaceDarkTheme = 'space_dark_theme',
  SpaceLightTheme = 'space_light_theme'
}

export type FileInline = {
  __typename?: 'FileInline';
  fa_file?: Maybe<Scalars['MongoID']['output']>;
  fa_index?: Maybe<Scalars['Float']['output']>;
  id: Scalars['MongoID']['output'];
  key: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type FileInlineInput = {
  fa_file?: InputMaybe<Scalars['MongoID']['input']>;
  fa_index?: InputMaybe<Scalars['Float']['input']>;
  id: Scalars['MongoID']['input'];
  key: Scalars['String']['input'];
  url: Scalars['String']['input'];
};

export type FileInput = {
  description?: InputMaybe<Scalars['String']['input']>;
};

export type FileLink = {
  __typename?: 'FileLink';
  id: Scalars['MongoID']['output'];
  model: Scalars['String']['output'];
  path: Scalars['String']['output'];
  type: FileLinkType;
};

export type FileLinkInput = {
  id: Scalars['MongoID']['input'];
  model: Scalars['String']['input'];
  path?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<FileLinkType>;
};

export enum FileLinkType {
  FileInline = 'file_inline',
  ObjectId = 'object_id'
}

export enum FileState {
  Done = 'done',
  Error = 'error',
  Started = 'started'
}

export type FileUploadInfo = {
  description?: InputMaybe<Scalars['String']['input']>;
  extension: Scalars['String']['input'];
};

export type FileWithPresignedUrl = {
  __typename?: 'FileWithPresignedUrl';
  _id?: Maybe<Scalars['MongoID']['output']>;
  bucket: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  key: Scalars['String']['output'];
  liked?: Maybe<Scalars['Boolean']['output']>;
  likers?: Maybe<Array<Scalars['MongoID']['output']>>;
  likes: Scalars['Float']['output'];
  link_events_expanded?: Maybe<Array<Maybe<Event>>>;
  link_store_products_expanded?: Maybe<Array<Maybe<StoreProduct>>>;
  link_stores_expanded?: Maybe<Array<Maybe<Store>>>;
  link_users_expanded?: Maybe<Array<Maybe<User>>>;
  links?: Maybe<Array<FileLink>>;
  owner: Scalars['MongoID']['output'];
  owner_expanded?: Maybe<User>;
  presigned_url: Scalars['String']['output'];
  size?: Maybe<Scalars['Float']['output']>;
  stamp: Scalars['DateTimeISO']['output'];
  state: FileState;
  type: Scalars['String']['output'];
  url: Scalars['String']['output'];
};


export type FileWithPresignedUrlLink_Events_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type FileWithPresignedUrlLink_Store_Products_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type FileWithPresignedUrlLink_Stores_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type FileWithPresignedUrlLink_Users_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};

export type FilterEventInput = {
  eq?: InputMaybe<EventState>;
  in?: InputMaybe<Array<EventState>>;
  nin?: InputMaybe<Array<EventState>>;
};

export type FilterPaymentStateInput = {
  eq?: InputMaybe<NewPaymentState>;
  in?: InputMaybe<Array<NewPaymentState>>;
  nin?: InputMaybe<Array<NewPaymentState>>;
};

export type FreeSafeInitInfo = {
  __typename?: 'FreeSafeInitInfo';
  current: Scalars['Int']['output'];
  max: Scalars['Int']['output'];
};

export type FrequentQuestion = {
  __typename?: 'FrequentQuestion';
  _id?: Maybe<Scalars['MongoID']['output']>;
  answer: Scalars['String']['output'];
  position?: Maybe<Scalars['Float']['output']>;
  question: Scalars['String']['output'];
  tag?: Maybe<Scalars['String']['output']>;
  type: Array<FrequentQuestionType>;
};

export type FrequentQuestionInput = {
  _id?: InputMaybe<Scalars['MongoID']['input']>;
  answer: Scalars['String']['input'];
  position?: InputMaybe<Scalars['Float']['input']>;
  question: Scalars['String']['input'];
  tag?: InputMaybe<Scalars['String']['input']>;
  type: Array<FrequentQuestionType>;
};

export enum FrequentQuestionType {
  Event = 'event',
  Poap = 'poap',
  User = 'user'
}

export type GenerateEventInvitationUrlResponse = {
  __typename?: 'GenerateEventInvitationUrlResponse';
  shortid: Scalars['String']['output'];
  tk?: Maybe<Scalars['String']['output']>;
};

export type GenerateRecurringDatesInput = {
  count?: InputMaybe<Scalars['Float']['input']>;
  dayOfWeeks?: InputMaybe<Array<Scalars['Int']['input']>>;
  end?: InputMaybe<Scalars['DateTimeISO']['input']>;
  repeat: RecurringRepeat;
  start: Scalars['DateTimeISO']['input'];
  utcOffsetMinutes: Scalars['Float']['input'];
};

export type GenerateStripeAccountLinkResponse = {
  __typename?: 'GenerateStripeAccountLinkResponse';
  url: Scalars['String']['output'];
};

export type GeoCity = {
  __typename?: 'GeoCity';
  _id: Scalars['MongoID']['output'];
  hidden?: Maybe<Scalars['Boolean']['output']>;
  icon_url?: Maybe<Scalars['String']['output']>;
  listed_events_count?: Maybe<Scalars['Float']['output']>;
  /** Name of the city, unique within region */
  name: Scalars['String']['output'];
  region: Scalars['MongoID']['output'];
  space: Scalars['MongoID']['output'];
  space_expanded?: Maybe<Space>;
};

export type GeoRegion = {
  __typename?: 'GeoRegion';
  _id: Scalars['MongoID']['output'];
  cities: Array<GeoCity>;
  title: Scalars['String']['output'];
};

export type GetCommentsArgs = {
  comment?: InputMaybe<Scalars['MongoID']['input']>;
  post: Scalars['MongoID']['input'];
};

export type GetEventCheckinsInput = {
  emails?: InputMaybe<Array<Scalars['String']['input']>>;
  event: Scalars['MongoID']['input'];
  users?: InputMaybe<Array<Scalars['MongoID']['input']>>;
};

export type GetEventCohostRequestsInput = {
  event: Scalars['MongoID']['input'];
  state?: InputMaybe<EventCohostRequestState>;
};

export type GetEventGuestsStatisticsResponse = {
  __typename?: 'GetEventGuestsStatisticsResponse';
  checked_in: Scalars['Int']['output'];
  declined: Scalars['Int']['output'];
  going: Scalars['Int']['output'];
  pending_approval: Scalars['Int']['output'];
  pending_invite: Scalars['Int']['output'];
  ticket_types: Array<GetEventGuestsTicketTypeStatistics>;
};

export type GetEventGuestsTicketTypeStatistics = {
  __typename?: 'GetEventGuestsTicketTypeStatistics';
  guests_count: Scalars['Float']['output'];
  ticket_type: Scalars['MongoID']['output'];
  ticket_type_title: Scalars['String']['output'];
};

export type GetEventInvitedStatisticsResponse = {
  __typename?: 'GetEventInvitedStatisticsResponse';
  emails_opened: Scalars['Int']['output'];
  guests: Array<Guest>;
  top_inviter?: Maybe<Scalars['MongoID']['output']>;
  top_inviter_expanded?: Maybe<User>;
  total: Scalars['Int']['output'];
  total_declined: Scalars['Int']['output'];
  total_joined: Scalars['Int']['output'];
};

export type GetEventJoinRequestsResponse = {
  __typename?: 'GetEventJoinRequestsResponse';
  records: Array<EventJoinRequest>;
  total: Scalars['Int']['output'];
};

export type GetEventPendingInvitesResponse = {
  __typename?: 'GetEventPendingInvitesResponse';
  cohost_requests?: Maybe<Array<EventInvite>>;
  event_invites?: Maybe<Array<EventInvite>>;
};

export enum GetEventQuestionInputSort {
  Id = '_id',
  Likes = 'likes'
}

export type GetEventQuestionsInput = {
  event: Scalars['MongoID']['input'];
  id_lt?: InputMaybe<Scalars['MongoID']['input']>;
  limit?: Scalars['Int']['input'];
  sort?: GetEventQuestionInputSort;
};

export type GetEventRewardUsesInput = {
  event: Scalars['MongoID']['input'];
  user: Scalars['MongoID']['input'];
};

export type GetEventSessionReservationSummaryInput = {
  event: Scalars['MongoID']['input'];
  session?: InputMaybe<Scalars['MongoID']['input']>;
};

export type GetEventSessionReservationsInput = {
  event?: InputMaybe<Scalars['MongoID']['input']>;
};

export type GetEventTicketTypesInput = {
  discount?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  event: Scalars['MongoID']['input'];
};

export type GetEventTicketTypesResponse = {
  __typename?: 'GetEventTicketTypesResponse';
  discount?: Maybe<TicketDiscount>;
  limit: Scalars['Float']['output'];
  ticket_types: Array<PurchasableTicketType>;
};

export type GetEventTopViewsResponse = {
  __typename?: 'GetEventTopViewsResponse';
  by_city: Array<EventTopViewsByCity>;
  by_source: Array<EventTopViewsBySource>;
  total: Scalars['Int']['output'];
};

export type GetEventbriteEventsInput = {
  order?: InputMaybe<EventbriteEventOrder>;
  status?: InputMaybe<EventbriteEventStatus>;
};

export enum GetEventsState {
  Accepted = 'ACCEPTED',
  Declined = 'DECLINED',
  Invited = 'INVITED',
  Pending = 'PENDING'
}

export type GetFrequentQuestionsInput = {
  type: Array<FrequentQuestionType>;
};

export type GetInitSafeTransactionInput = {
  network: Scalars['String']['input'];
  owners: Array<Scalars['String']['input']>;
  threshold: Scalars['Int']['input'];
};

export type GetMyLemonheadInvitationRankResponse = {
  __typename?: 'GetMyLemonheadInvitationRankResponse';
  items: Array<LemonheadInvitationRank>;
  total: Scalars['Int']['output'];
};

export type GetMyTicketsResponse = {
  __typename?: 'GetMyTicketsResponse';
  payments?: Maybe<Array<PaymentRefundInfo>>;
  tickets: Array<Ticket>;
};

export type GetPostsCreatedAtInput = {
  gte?: InputMaybe<Scalars['DateTimeISO']['input']>;
  lte?: InputMaybe<Scalars['DateTimeISO']['input']>;
};

export type GetPostsInput = {
  _id?: InputMaybe<Scalars['MongoID']['input']>;
  created_at?: InputMaybe<GetPostsCreatedAtInput>;
  published?: InputMaybe<Scalars['Boolean']['input']>;
  user?: InputMaybe<Scalars['MongoID']['input']>;
};

export type GetRoomCredentialsInput = {
  _id: Scalars['MongoID']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
  role: GetRoomCredentialsInputRole;
};

export enum GetRoomCredentialsInputRole {
  Publisher = 'PUBLISHER',
  Subscriber = 'SUBSCRIBER'
}

export type GetRoomsInput = {
  creator?: InputMaybe<Scalars['MongoID']['input']>;
  event?: InputMaybe<Scalars['MongoID']['input']>;
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
  state?: InputMaybe<GetRoomsInputState>;
};

export type GetRoomsInputState = {
  eq?: InputMaybe<RoomState>;
  in?: InputMaybe<Array<RoomState>>;
  nin?: InputMaybe<Array<RoomState>>;
};

export type GetSpaceEventRequestsResponse = {
  __typename?: 'GetSpaceEventRequestsResponse';
  records: Array<SpaceEventRequest>;
  total: Scalars['Int']['output'];
};

export type GetTopInvitersResponse = {
  __typename?: 'GetTopInvitersResponse';
  items: Array<EventInviter>;
  total: Scalars['Int']['output'];
};

export type GetUserContactsInput = {
  invited_at_gt?: InputMaybe<Scalars['DateTimeISO']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type GetUserContactsResponse = {
  __typename?: 'GetUserContactsResponse';
  counts?: Maybe<Scalars['JSON']['output']>;
  items: Array<UserContact>;
  total: Scalars['Int']['output'];
};

export type GetUserFollowsInput = {
  followee?: InputMaybe<Scalars['MongoID']['input']>;
  followee_search?: InputMaybe<Scalars['String']['input']>;
  follower?: InputMaybe<Scalars['MongoID']['input']>;
  follower_search?: InputMaybe<Scalars['String']['input']>;
};

export type GetUserFriendshipsInput = {
  other?: InputMaybe<Scalars['MongoID']['input']>;
  other_search?: InputMaybe<Scalars['String']['input']>;
  other_wallets?: InputMaybe<Scalars['Boolean']['input']>;
  state?: InputMaybe<UserFriendshipState>;
  type?: InputMaybe<UserFriendshipType>;
  user?: InputMaybe<Scalars['MongoID']['input']>;
  user1?: InputMaybe<Scalars['MongoID']['input']>;
  user2?: InputMaybe<Scalars['MongoID']['input']>;
};

export type GetUserFriendshipsResponse = {
  __typename?: 'GetUserFriendshipsResponse';
  items: Array<UserFriendship>;
  total: Scalars['Int']['output'];
};

export type Group = {
  __typename?: 'Group';
  _id: Scalars['MongoID']['output'];
  position: Scalars['Float']['output'];
  sub_title_1?: Maybe<Scalars['String']['output']>;
  sub_title_2?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type Guest = {
  __typename?: 'Guest';
  cancelled_by?: Maybe<Scalars['MongoID']['output']>;
  cancelled_by_expanded?: Maybe<User>;
  declined?: Maybe<Scalars['Boolean']['output']>;
  /** Exists only if invited via email but has not joined to be a user */
  email?: Maybe<Scalars['String']['output']>;
  invitation: Scalars['MongoID']['output'];
  invited_by: Scalars['MongoID']['output'];
  invited_by_expanded?: Maybe<User>;
  joined?: Maybe<Scalars['Boolean']['output']>;
  pending?: Maybe<Scalars['Boolean']['output']>;
  /** Exists only if joined from email */
  user?: Maybe<Scalars['MongoID']['output']>;
  user_expanded?: Maybe<User>;
};

export type GuildRoom = {
  __typename?: 'GuildRoom';
  _id: Scalars['MongoID']['output'];
  created_at: Scalars['DateTimeISO']['output'];
  created_by: Scalars['MongoID']['output'];
  created_by_expanded?: Maybe<User>;
  guild_id: Scalars['Float']['output'];
  guild_role_ids?: Maybe<Array<Scalars['Int']['output']>>;
  guild_role_require_all?: Maybe<Scalars['Boolean']['output']>;
  joins?: Maybe<Scalars['Float']['output']>;
  matrix_room_id: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type GuildRoomInput = {
  guild_id: Scalars['Float']['input'];
  guild_role_ids?: InputMaybe<Array<Scalars['Int']['input']>>;
  guild_role_require_all?: InputMaybe<Scalars['Boolean']['input']>;
  matrix_room_id: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type HostFilter = {
  hosts?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  include_cohost_events?: InputMaybe<Scalars['Boolean']['input']>;
  include_owned_events?: InputMaybe<Scalars['Boolean']['input']>;
  include_subevents?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ImportPoapInput = {
  /** Requested poap amount */
  amount: Scalars['Int']['input'];
  claim_mode: PoapClaimMode;
  event?: InputMaybe<Scalars['MongoID']['input']>;
  ticket_types?: InputMaybe<Array<Scalars['MongoID']['input']>>;
};

export enum InvitationResponse {
  Accepted = 'ACCEPTED',
  Cancelled = 'CANCELLED',
  Declined = 'DECLINED',
  Pending = 'PENDING',
  Unsure = 'UNSURE'
}

export enum InvitationState {
  Declined = 'DECLINED'
}

export type InviteEventInput = {
  _id: Scalars['MongoID']['input'];
  custom_body_html?: InputMaybe<Scalars['String']['input']>;
  emails?: InputMaybe<Array<Scalars['String']['input']>>;
  phones?: InputMaybe<Array<Scalars['String']['input']>>;
  users?: InputMaybe<Array<Scalars['MongoID']['input']>>;
};

export type JoinRequestPayment = {
  __typename?: 'JoinRequestPayment';
  _id: Scalars['MongoID']['output'];
  buyer_info?: Maybe<BuyerInfo>;
  ref_data?: Maybe<Scalars['JSON']['output']>;
  state: NewPaymentState;
  transfer_metadata?: Maybe<Scalars['JSON']['output']>;
};

export type JoinRequestStatistic = {
  __typename?: 'JoinRequestStatistic';
  count: Scalars['Float']['output'];
  state: EventJoinRequestState;
};

export type LaunchpadCoin = {
  __typename?: 'LaunchpadCoin';
  /** Contract address of the ERC20 memecoin */
  address: Scalars['String']['output'];
  chain_id: Scalars['Float']['output'];
  handle_discord?: Maybe<Scalars['String']['output']>;
  handle_farcaster?: Maybe<Scalars['String']['output']>;
  handle_telegram?: Maybe<Scalars['String']['output']>;
  handle_twitter?: Maybe<Scalars['String']['output']>;
  owner: Scalars['MongoID']['output'];
  website?: Maybe<Scalars['String']['output']>;
};

export type LaunchpadCoinInput = {
  /** Contract address of the ERC20 memecoin */
  address?: InputMaybe<Scalars['String']['input']>;
  chain_id?: InputMaybe<Scalars['Float']['input']>;
  handle_discord?: InputMaybe<Scalars['String']['input']>;
  handle_farcaster?: InputMaybe<Scalars['String']['input']>;
  handle_telegram?: InputMaybe<Scalars['String']['input']>;
  handle_twitter?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type LaunchpadGroup = {
  __typename?: 'LaunchpadGroup';
  /** Contract address of the group */
  address: Scalars['String']['output'];
  chain_id: Scalars['Float']['output'];
  cover_photo?: Maybe<Scalars['MongoID']['output']>;
  cover_photo_expanded?: Maybe<File>;
  /** URL of the cover photo, this can be useful in non login mode */
  cover_photo_url?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  handle_discord?: Maybe<Scalars['String']['output']>;
  handle_farcaster?: Maybe<Scalars['String']['output']>;
  handle_telegram?: Maybe<Scalars['String']['output']>;
  handle_twitter?: Maybe<Scalars['String']['output']>;
  /** Implementation address of the StakingManager contract that used to create the group */
  implementation_address: Scalars['String']['output'];
  /** Name of the group */
  name: Scalars['String']['output'];
  space?: Maybe<Scalars['MongoID']['output']>;
  space_expanded?: Maybe<Space>;
  website?: Maybe<Scalars['String']['output']>;
};

export type LayoutSection = {
  __typename?: 'LayoutSection';
  hidden?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['String']['output']>;
};

export type LayoutSectionInput = {
  hidden?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
};

export type LemonheadInvitation = {
  __typename?: 'LemonheadInvitation';
  created_at?: Maybe<Scalars['DateTimeISO']['output']>;
  invitee_wallet?: Maybe<Scalars['String']['output']>;
  minted_at?: Maybe<Scalars['DateTimeISO']['output']>;
  user?: Maybe<LemonheadUserInfo>;
};

export type LemonheadInvitationRank = {
  __typename?: 'LemonheadInvitationRank';
  invitations_count: Scalars['Float']['output'];
  rank: Scalars['Float']['output'];
  user: LemonheadUserInfo;
};

export type LemonheadMintingInfo = {
  __typename?: 'LemonheadMintingInfo';
  can_mint: Scalars['Boolean']['output'];
  inviter?: Maybe<LemonheadUserInfo>;
  price: Scalars['String']['output'];
  token_gated: Scalars['Boolean']['output'];
  white_list_enabled: Scalars['Boolean']['output'];
};

export type LemonheadSponsor = {
  __typename?: 'LemonheadSponsor';
  _id: Scalars['MongoID']['output'];
  image_url: Scalars['String']['output'];
  message: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type LemonheadSponsorDetail = {
  __typename?: 'LemonheadSponsorDetail';
  limit?: Maybe<Scalars['Float']['output']>;
  remaining?: Maybe<Scalars['Float']['output']>;
  sponsor: LemonheadSponsor;
};

export type LemonheadSupportData = {
  __typename?: 'LemonheadSupportData';
  name: Scalars['String']['output'];
  value?: Maybe<Scalars['JSON']['output']>;
};

export enum LemonheadSupportDataType {
  Color = 'color'
}

export type LemonheadUserInfo = {
  __typename?: 'LemonheadUserInfo';
  _id: Scalars['MongoID']['output'];
  company_name?: Maybe<Scalars['String']['output']>;
  display_name?: Maybe<Scalars['String']['output']>;
  image_avatar?: Maybe<Scalars['String']['output']>;
  job_title?: Maybe<Scalars['String']['output']>;
  kratos_unicorn_wallet_address?: Maybe<Scalars['String']['output']>;
  kratos_wallet_address?: Maybe<Scalars['String']['output']>;
  lemonhead_inviter_wallet?: Maybe<Scalars['String']['output']>;
  matrix_localpart?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  username?: Maybe<Scalars['String']['output']>;
};

export type ListDonationsResponse = {
  __typename?: 'ListDonationsResponse';
  items: Array<Donation>;
  total: Scalars['Int']['output'];
};

export type ListEventFeedbacksResponse = {
  __typename?: 'ListEventFeedbacksResponse';
  items: Array<EventFeedback>;
  total: Scalars['Int']['output'];
};

export type ListEventGuestsResponse = {
  __typename?: 'ListEventGuestsResponse';
  items: Array<EventGuestDetail>;
  total: Scalars['Int']['output'];
};

export enum ListEventGuestsSortBy {
  ApprovalStatus = 'approval_status',
  Email = 'email',
  Name = 'name',
  RegisterTime = 'register_time'
}

export type ListEventHostsResponse = {
  __typename?: 'ListEventHostsResponse';
  hosts: Array<EventHost>;
  total: Scalars['Float']['output'];
};

export type ListEventPaymentsResponse = {
  __typename?: 'ListEventPaymentsResponse';
  records: Array<NewPayment>;
  total: Scalars['Int']['output'];
};

export type ListEventStakePaymentsResponse = {
  __typename?: 'ListEventStakePaymentsResponse';
  items: Array<EventStakePayment>;
  total: Scalars['Int']['output'];
};

export type ListLaunchpadCoinsResponse = {
  __typename?: 'ListLaunchpadCoinsResponse';
  items: Array<LaunchpadCoin>;
  total: Scalars['Int']['output'];
};

export type ListLaunchpadGroupsResponse = {
  __typename?: 'ListLaunchpadGroupsResponse';
  items: Array<LaunchpadGroup>;
  total: Scalars['Int']['output'];
};

export type ListLemonheadSponsorsResponse = {
  __typename?: 'ListLemonheadSponsorsResponse';
  sponsors: Array<LemonheadSponsorDetail>;
};

export type ListMyLemonheadInvitationsResponse = {
  __typename?: 'ListMyLemonheadInvitationsResponse';
  invitations: Array<LemonheadInvitation>;
};

export type ListSpaceMembersResponse = {
  __typename?: 'ListSpaceMembersResponse';
  items: Array<SpaceMember>;
  total: Scalars['Int']['output'];
};

export type ListSpaceNfTsResponse = {
  __typename?: 'ListSpaceNFTsResponse';
  items: Array<SpaceNft>;
  total: Scalars['Int']['output'];
};

export type ListSpaceRoleFeaturesResponse = {
  __typename?: 'ListSpaceRoleFeaturesResponse';
  codes: Array<FeatureCode>;
  features: Array<Feature>;
};

export type ListSpaceTokenRewardClaimsSortInput = {
  claim_date?: InputMaybe<Scalars['Int']['input']>;
};

export type ManageEventCohostRequestsInput = {
  decision: Scalars['Boolean']['input'];
  event: Scalars['MongoID']['input'];
  event_role?: InputMaybe<EventRole>;
  profile_image_avatar?: InputMaybe<Scalars['String']['input']>;
  profile_name?: InputMaybe<Scalars['String']['input']>;
  to?: InputMaybe<Scalars['MongoID']['input']>;
  to_email?: InputMaybe<Scalars['String']['input']>;
  visible?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ModifyRoomStageInput = {
  _id: Scalars['MongoID']['input'];
  staged: Scalars['Boolean']['input'];
  user: Scalars['MongoID']['input'];
};

export type ModifyRoomStagePayload = {
  __typename?: 'ModifyRoomStagePayload';
  credentials?: Maybe<RoomCredentials>;
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptEvent: EventRsvp;
  acceptEventTerms: Scalars['Boolean']['output'];
  acceptUserDiscovery: AcceptUserDiscoveryResponse;
  activatePersonalSpace: ActivatePersonalSpace;
  addLaunchpadCoin: LaunchpadCoin;
  addLaunchpadGroup: LaunchpadGroup;
  addSpaceMembers: Scalars['Boolean']['output'];
  addUserFcmToken: Scalars['Boolean']['output'];
  assignTickets: Scalars['Boolean']['output'];
  attachSubSpaces: Scalars['Boolean']['output'];
  buyTickets: BuyTicketsResponse;
  cancelEvent: Event;
  cancelEventInvitations: Scalars['Boolean']['output'];
  cancelMyTicket: Scalars['Boolean']['output'];
  /** @deprecated Payment cancelling is already handled by backend */
  cancelPayment: Scalars['Boolean']['output'];
  cancelSubscription: Scalars['Boolean']['output'];
  cancelTickets: Scalars['Boolean']['output'];
  castVote: Scalars['Boolean']['output'];
  checkinUser: EventRsvp;
  claimPoap: Scalars['Boolean']['output'];
  cloneEvent: Array<Scalars['MongoID']['output']>;
  confirmFileUploads: Scalars['Boolean']['output'];
  createBadge: Badge;
  createBadgeList: BadgeList;
  createCast: Scalars['Boolean']['output'];
  createCastReaction: Scalars['Boolean']['output'];
  createCheckinTokenRewardSetting: CheckinTokenRewardSetting;
  createComment: Comment;
  createDonation: Donation;
  createDonationVault: DonationVault;
  createEvent: Event;
  createEventBroadcast: Scalars['Boolean']['output'];
  createEventCast: Scalars['Boolean']['output'];
  createEventEmailSetting?: Maybe<EmailSetting>;
  createEventFromEventbrite: Event;
  createEventQuestion: EventQuestion;
  createEventSessionReservation: Scalars['Boolean']['output'];
  createEventStory: Scalars['Boolean']['output'];
  createEventTicketCategory: EventTicketCategory;
  createEventTicketDiscounts: Event;
  createEventTicketType: EventTicketType;
  createEventTokenGate: EventTokenGate;
  createEventbriteWebhookForEvent: Scalars['Boolean']['output'];
  createFarcasterAccountKey: CreateFarcasterAccountKeyResponse;
  createFile: File;
  createFileUploads: Array<FileWithPresignedUrl>;
  createGuildRoom: GuildRoom;
  createNewPaymentAccount: NewPaymentAccount;
  createOauth2Client: OAuth2Client;
  createPoapDrop: PoapDrop;
  createPost: Post;
  createRegistration: Scalars['Boolean']['output'];
  createRewardVault: TokenRewardVault;
  createRoom: Room;
  createSelfVerificationRequest: UserSelfRequest;
  createSite: Site;
  createSpace: Space;
  createSpaceNewsletter: EmailSetting;
  createSpaceTokenGate: SpaceTokenGate;
  createSpaceVerificationSubmission?: Maybe<SpaceVerificationSubmission>;
  createStore: Store;
  createStoreBucketItem: StoreBucketItem;
  createStoreCategory: StoreCategory;
  createStoreOrder: StoreOrder;
  createStoreProduct: StoreProduct;
  createStoreProductVariant: StoreProductVariant;
  createStorePromotion: StorePromotion;
  createStripeCard: StripeCard;
  createStripeOnrampSession: StripeOnrampSession;
  createSubscription: SubscriptionResponse;
  createTicketTokenRewardSetting: TicketTokenRewardSetting;
  createTickets: Array<Ticket>;
  createUserExpertise: UserExpertise;
  createUserFollow: Scalars['Boolean']['output'];
  createUserFriendship: UserFriendship;
  createUserService: UserServiceOffer;
  /** @deprecated Requests are auto accepted */
  decideEventCohostRequest: Scalars['Boolean']['output'];
  decideRoomAccessRequest: Scalars['Boolean']['output'];
  decideRoomStageRequest: Scalars['Boolean']['output'];
  decideSpaceEventRequests: Scalars['Boolean']['output'];
  decideUserJoinRequests: Array<DecidedJoinRequest>;
  declineEvent: EventRsvp;
  declineUserDiscovery: Scalars['Boolean']['output'];
  deleteBadge: Scalars['Boolean']['output'];
  deleteBadgeList: Scalars['Boolean']['output'];
  deleteCastReaction: Scalars['Boolean']['output'];
  deleteComment: Scalars['Boolean']['output'];
  deleteEventApplicationQuestions: Scalars['Boolean']['output'];
  deleteEventBroadcast: Scalars['Boolean']['output'];
  deleteEventEmailSetting: Scalars['Boolean']['output'];
  deleteEventQuestion: Scalars['Boolean']['output'];
  deleteEventSessionReservation: Scalars['Boolean']['output'];
  deleteEventStory: Scalars['Boolean']['output'];
  deleteEventTicketCategory: Scalars['Boolean']['output'];
  deleteEventTicketDiscounts: Event;
  deleteEventTicketType: Scalars['Boolean']['output'];
  deleteEventTokenGate: Scalars['Boolean']['output'];
  deleteGuildRoom: Scalars['Boolean']['output'];
  deleteNotifications: Scalars['Boolean']['output'];
  deleteOauth2Client: Scalars['Boolean']['output'];
  deletePost: Scalars['Boolean']['output'];
  deleteSite: Scalars['Boolean']['output'];
  deleteSpace: Scalars['Boolean']['output'];
  deleteSpaceMembers: Array<SpaceMember>;
  deleteSpaceNewsletter: Scalars['Boolean']['output'];
  deleteSpaceTag: Scalars['Boolean']['output'];
  deleteSpaceTokenGate: Scalars['Boolean']['output'];
  deleteStore: Scalars['Boolean']['output'];
  deleteStoreBucketItem: Scalars['Boolean']['output'];
  deleteStoreCategory: Scalars['Boolean']['output'];
  deleteStoreProduct: Scalars['Boolean']['output'];
  deleteStoreProductVariant: Scalars['Boolean']['output'];
  deleteStorePromotion: Scalars['Boolean']['output'];
  deleteStripeCard: StripeCard;
  deleteUser: Scalars['Boolean']['output'];
  deleteUserDiscoverySwipe: Scalars['Boolean']['output'];
  deleteUserFollow: Scalars['Boolean']['output'];
  deleteUserFriendship: Scalars['Boolean']['output'];
  disconnectStripeAccount: Scalars['Boolean']['output'];
  flagEvent: Scalars['Boolean']['output'];
  flagPost: Scalars['Boolean']['output'];
  flagUser: Scalars['Boolean']['output'];
  followSpace: Scalars['Boolean']['output'];
  generateCubejsToken: Scalars['String']['output'];
  generateMatrixToken: Scalars['String']['output'];
  generateStripeAccountLink: GenerateStripeAccountLinkResponse;
  importPoapDrop: PoapDrop;
  insertSpaceTag: SpaceTag;
  inviteEvent: Event;
  inviteUserContacts: Scalars['Boolean']['output'];
  joinGuildRoom: Scalars['Boolean']['output'];
  mailEventTicket: Scalars['Boolean']['output'];
  mailTicketPaymentReceipt: Scalars['Boolean']['output'];
  manageEventCohostRequests: Scalars['Boolean']['output'];
  manageSpaceTag: Scalars['Boolean']['output'];
  modifyRoomStage: ModifyRoomStagePayload;
  pinEventsToSpace: PinEventsToSpaceResponse;
  readNotifications: Scalars['Boolean']['output'];
  redeemTickets: RedeemTicketsResponse;
  removeSubSpaces: Scalars['Boolean']['output'];
  removeUserFcmToken: Scalars['Boolean']['output'];
  reorderTicketTypeCategories: Scalars['Boolean']['output'];
  reorderTicketTypes: Scalars['Boolean']['output'];
  reportUser: Scalars['Boolean']['output'];
  requestRoomStage: Scalars['Boolean']['output'];
  respondInvitation: Scalars['Boolean']['output'];
  /** @deprecated Use the `respondInvitation` instead. This function will be removed in the next release. */
  responseInvitation: Scalars['Boolean']['output'];
  retryPoapDropCheck: Scalars['Boolean']['output'];
  revokeFarcasterAccountKey: Scalars['Boolean']['output'];
  revokeOauth2: Scalars['String']['output'];
  revokeTwitter: Scalars['String']['output'];
  rewindUserDiscovery: RewindUserDiscoveryResponse;
  sendEventEmailSettingTestEmails: Scalars['Boolean']['output'];
  sendRoomInvite: Scalars['Boolean']['output'];
  sendSpaceNewsletterTestEmails: Scalars['Boolean']['output'];
  setDefaultLensProfile: Scalars['Boolean']['output'];
  setUserWallet: Scalars['Boolean']['output'];
  submitEventApplicationAnswers: Scalars['Boolean']['output'];
  submitEventApplicationQuestions: Array<EventApplicationQuestion>;
  submitEventFeedback: Scalars['Boolean']['output'];
  syncEventAttestation: Scalars['Boolean']['output'];
  syncFarcasterConnectionStatus: SyncFarcasterConnectionStatusResponse;
  syncSpaceTokenGateAccess: SyncSpaceTokenGateAccessResponse;
  syncUserUnicornWallet: Scalars['Boolean']['output'];
  tgSendCode: Scalars['String']['output'];
  tgUnlinkAccount: Scalars['Boolean']['output'];
  tgVerify: Scalars['Boolean']['output'];
  toggleBlockUser: Scalars['Boolean']['output'];
  toggleEventEmailSettings: Scalars['Boolean']['output'];
  toggleEventQuestionLike: Scalars['Boolean']['output'];
  toggleFileLike: File;
  toggleReaction: Scalars['Boolean']['output'];
  /** @deprecated Use unsubscribeSpace instead */
  unfollowSpace: Scalars['Boolean']['output'];
  unpinEventsFromSpace: Scalars['Boolean']['output'];
  unsubscribeSpace: Scalars['Boolean']['output'];
  updateBadge: Badge;
  updateBadgeList: BadgeList;
  updateCheckinTokenRewardSetting: CheckinTokenRewardSetting;
  updateDonation: Scalars['Boolean']['output'];
  updateDonationVault?: Maybe<DonationVault>;
  updateEvent: Event;
  updateEventBroadcast: Scalars['Boolean']['output'];
  /**
   * @deprecated
   * prefer using updateEventCheckins instead,
   * this mutation will be removed after this new checkin apis,
   * after making sure FE/mobile has no longer using this mutation anymore
   *
   */
  updateEventCheckin: EventCheckin;
  updateEventCheckins: Array<EventCheckin>;
  updateEventEmailSetting: EmailSetting;
  updateEventRewardUse: Scalars['Boolean']['output'];
  updateEventTicketCategory: Scalars['Boolean']['output'];
  updateEventTicketDiscount: Event;
  updateEventTicketType: EventTicketType;
  updateEventTokenGate: EventTokenGate;
  updateFile: File;
  updateLaunchpadCoin?: Maybe<LaunchpadCoin>;
  updateMyLemonheadInvitations: UpdateMyLemonheadInvitationsResponse;
  updateNewPaymentAccount: NewPaymentAccount;
  updateOauth2Client: OAuth2Client;
  updatePayment: NewPayment;
  updatePoapDrop: PoapDrop;
  updatePost: Post;
  updateRewardVault?: Maybe<TokenRewardVault>;
  updateRoom: Room;
  updateSite?: Maybe<Site>;
  updateSpace?: Maybe<Space>;
  /** @deprecated This logic may not behave as expected. Use addSpaceMembers instead. */
  updateSpaceMember?: Maybe<SpaceMember>;
  updateSpaceNewsletter: EmailSetting;
  updateSpaceRoleFeatures: Scalars['Boolean']['output'];
  updateSpaceTokenGate: SpaceTokenGate;
  updateStore: Store;
  updateStoreBucketItem?: Maybe<StoreBucketItem>;
  updateStoreCategory: StoreCategory;
  updateStoreOrder: StoreOrder;
  updateStoreProduct: StoreProduct;
  updateStoreProductVariant: StoreProductVariant;
  updateStripeConnectedAccountCapability: StripeAccountCapability;
  updateSubSpaceOrder: Scalars['Boolean']['output'];
  updateSubscription: SubscriptionResponse;
  updateTicketTokenRewardSetting: TicketTokenRewardSetting;
  updateTokenRewardClaim: Scalars['Boolean']['output'];
  updateUser: User;
  upgradeTicket: Scalars['Boolean']['output'];
};


export type MutationAcceptEventArgs = {
  _id: Scalars['MongoID']['input'];
  email?: InputMaybe<Scalars['String']['input']>;
};


export type MutationAcceptEventTermsArgs = {
  input: AcceptEventTermsInput;
};


export type MutationAcceptUserDiscoveryArgs = {
  event?: InputMaybe<Scalars['MongoID']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  swipee: Scalars['MongoID']['input'];
};


export type MutationActivatePersonalSpaceArgs = {
  input: SpaceInput;
};


export type MutationAddLaunchpadCoinArgs = {
  input: LaunchpadCoinInput;
};


export type MutationAddLaunchpadGroupArgs = {
  input: AddLaunchpadGroupInput;
};


export type MutationAddSpaceMembersArgs = {
  input: AddSpaceMemberInput;
};


export type MutationAddUserFcmTokenArgs = {
  token: Scalars['String']['input'];
};


export type MutationAssignTicketsArgs = {
  input: AssignTicketsInput;
};


export type MutationAttachSubSpacesArgs = {
  _id: Scalars['MongoID']['input'];
  sub_spaces: Array<Scalars['String']['input']>;
};


export type MutationBuyTicketsArgs = {
  input: BuyTicketsInput;
};


export type MutationCancelEventArgs = {
  _id: Scalars['MongoID']['input'];
};


export type MutationCancelEventInvitationsArgs = {
  input: CancelEventInvitationsInput;
};


export type MutationCancelMyTicketArgs = {
  input: CancelMyTicketInput;
};


export type MutationCancelPaymentArgs = {
  input: CancelPaymentInput;
};


export type MutationCancelSubscriptionArgs = {
  _id: Scalars['MongoID']['input'];
};


export type MutationCancelTicketsArgs = {
  input: CancelTicketsInput;
};


export type MutationCastVoteArgs = {
  input: CastVoteInput;
};


export type MutationCheckinUserArgs = {
  event: Scalars['MongoID']['input'];
  user: Scalars['MongoID']['input'];
};


export type MutationClaimPoapArgs = {
  drop: Scalars['MongoID']['input'];
  wallet: Scalars['String']['input'];
};


export type MutationCloneEventArgs = {
  input: CloneEventInput;
};


export type MutationConfirmFileUploadsArgs = {
  ids: Array<Scalars['MongoID']['input']>;
};


export type MutationCreateBadgeArgs = {
  input: CreateBadgeInput;
};


export type MutationCreateBadgeListArgs = {
  input: CreateBadgeListInput;
};


export type MutationCreateCastArgs = {
  embeds?: InputMaybe<Array<Scalars['String']['input']>>;
  mentions?: InputMaybe<Array<Scalars['Int']['input']>>;
  mentionsPositions?: InputMaybe<Array<Scalars['Int']['input']>>;
  parent_cast?: InputMaybe<ParentCastInput>;
  parent_url?: InputMaybe<Scalars['String']['input']>;
  text: Scalars['String']['input'];
};


export type MutationCreateCastReactionArgs = {
  target_cast_id?: InputMaybe<ParentCastInput>;
  target_url?: InputMaybe<Scalars['String']['input']>;
  type: ReactionType;
};


export type MutationCreateCheckinTokenRewardSettingArgs = {
  input: CheckinTokenRewardSettingInput;
};


export type MutationCreateCommentArgs = {
  input: CommentInput;
};


export type MutationCreateDonationArgs = {
  input: CreateDonationInput;
};


export type MutationCreateDonationVaultArgs = {
  input: DonationVaultInput;
};


export type MutationCreateEventArgs = {
  input: EventInput;
};


export type MutationCreateEventBroadcastArgs = {
  event: Scalars['MongoID']['input'];
  input: CreateEventBroadcastInput;
};


export type MutationCreateEventCastArgs = {
  event: Scalars['MongoID']['input'];
};


export type MutationCreateEventEmailSettingArgs = {
  input: CreateEventEmailSettingInput;
};


export type MutationCreateEventFromEventbriteArgs = {
  id: Scalars['String']['input'];
  input: CreateEventFromEventbriteInput;
};


export type MutationCreateEventQuestionArgs = {
  input: CreateEventQuestionsInput;
};


export type MutationCreateEventSessionReservationArgs = {
  input: EventSessionReservationInput;
};


export type MutationCreateEventStoryArgs = {
  input: EventStoryInput;
};


export type MutationCreateEventTicketCategoryArgs = {
  input: CreateEventTicketCategoryInput;
};


export type MutationCreateEventTicketDiscountsArgs = {
  event: Scalars['MongoID']['input'];
  inputs: Array<EventPaymentTicketDiscountInput>;
};


export type MutationCreateEventTicketTypeArgs = {
  input: EventTicketTypeInput;
};


export type MutationCreateEventTokenGateArgs = {
  input: EventTokenGateInput;
};


export type MutationCreateEventbriteWebhookForEventArgs = {
  _id: Scalars['MongoID']['input'];
  eventbrite_event: Scalars['String']['input'];
};


export type MutationCreateFileArgs = {
  input?: InputMaybe<FileInput>;
  url: Scalars['String']['input'];
};


export type MutationCreateFileUploadsArgs = {
  directory: Scalars['String']['input'];
  upload_infos: Array<FileUploadInfo>;
};


export type MutationCreateGuildRoomArgs = {
  input: GuildRoomInput;
};


export type MutationCreateNewPaymentAccountArgs = {
  input: CreateNewPaymentAccountInput;
};


export type MutationCreateOauth2ClientArgs = {
  input: Oauth2ClientInput;
};


export type MutationCreatePoapDropArgs = {
  input: CreatePoapInput;
};


export type MutationCreatePostArgs = {
  input: PostInput;
};


export type MutationCreateRegistrationArgs = {
  input: Registration;
};


export type MutationCreateRewardVaultArgs = {
  input: TokenRewardVaultInput;
};


export type MutationCreateRoomArgs = {
  input: RoomInput;
};


export type MutationCreateSelfVerificationRequestArgs = {
  config: SelfVerificationConfigInput;
};


export type MutationCreateSiteArgs = {
  input: CreateSiteInput;
};


export type MutationCreateSpaceArgs = {
  input: SpaceInput;
};


export type MutationCreateSpaceNewsletterArgs = {
  input: CreateSpaceNewsletterInput;
};


export type MutationCreateSpaceTokenGateArgs = {
  input: SpaceTokenGateInput;
};


export type MutationCreateSpaceVerificationSubmissionArgs = {
  input: SpaceVerificationSubmissionInput;
};


export type MutationCreateStoreArgs = {
  input: StoreInput;
};


export type MutationCreateStoreBucketItemArgs = {
  input: StoreBucketItemInput;
};


export type MutationCreateStoreCategoryArgs = {
  input: StoreCategoryInput;
  store: Scalars['MongoID']['input'];
};


export type MutationCreateStoreOrderArgs = {
  address: Scalars['MongoID']['input'];
  bucket_items?: InputMaybe<Array<StoreBucketItemInput>>;
  delivery_option?: InputMaybe<Scalars['MongoID']['input']>;
  delivery_option_pickup_address?: InputMaybe<Scalars['MongoID']['input']>;
  dry_run?: InputMaybe<Scalars['Boolean']['input']>;
  easyship_courier_id?: InputMaybe<Scalars['String']['input']>;
  place_reservation?: InputMaybe<Scalars['MongoID']['input']>;
  promotion?: InputMaybe<Scalars['MongoID']['input']>;
  store: Scalars['MongoID']['input'];
};


export type MutationCreateStoreProductArgs = {
  input: StoreProductInput;
  store: Scalars['MongoID']['input'];
};


export type MutationCreateStoreProductVariantArgs = {
  input: StoreProductVariantInput;
  product: Scalars['MongoID']['input'];
  store: Scalars['MongoID']['input'];
};


export type MutationCreateStorePromotionArgs = {
  input: StorePromotionInput;
  store: Scalars['MongoID']['input'];
};


export type MutationCreateStripeCardArgs = {
  payment_method: Scalars['String']['input'];
};


export type MutationCreateStripeOnrampSessionArgs = {
  input: CreateStripeOnrampSessionInput;
};


export type MutationCreateSubscriptionArgs = {
  input: CreateSubscriptionInput;
};


export type MutationCreateTicketTokenRewardSettingArgs = {
  input: TicketTokenRewardSettingInput;
};


export type MutationCreateTicketsArgs = {
  ticket_assignments: Array<TicketAssignment>;
  ticket_type: Scalars['MongoID']['input'];
};


export type MutationCreateUserExpertiseArgs = {
  title: Scalars['String']['input'];
};


export type MutationCreateUserFollowArgs = {
  followee: Scalars['MongoID']['input'];
};


export type MutationCreateUserFriendshipArgs = {
  input: CreateUserFriendshipInput;
};


export type MutationCreateUserServiceArgs = {
  title: Scalars['String']['input'];
};


export type MutationDecideEventCohostRequestArgs = {
  input: DecideEventCohostRequestInput;
};


export type MutationDecideRoomAccessRequestArgs = {
  input: DecideRoomAccessRequestInput;
};


export type MutationDecideRoomStageRequestArgs = {
  input: DecideRoomStageRequestInput;
};


export type MutationDecideSpaceEventRequestsArgs = {
  input: DecideSpaceEventRequestsInput;
};


export type MutationDecideUserJoinRequestsArgs = {
  input: DecideUserJoinRequestsInput;
};


export type MutationDeclineEventArgs = {
  _id: Scalars['MongoID']['input'];
  message?: InputMaybe<Scalars['String']['input']>;
};


export type MutationDeclineUserDiscoveryArgs = {
  event?: InputMaybe<Scalars['MongoID']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  swipee: Scalars['MongoID']['input'];
};


export type MutationDeleteBadgeArgs = {
  _id: Scalars['MongoID']['input'];
};


export type MutationDeleteBadgeListArgs = {
  _id: Scalars['MongoID']['input'];
};


export type MutationDeleteCastReactionArgs = {
  target_cast_id?: InputMaybe<ParentCastInput>;
  target_url?: InputMaybe<Scalars['String']['input']>;
  type: ReactionType;
};


export type MutationDeleteCommentArgs = {
  _id: Scalars['MongoID']['input'];
};


export type MutationDeleteEventApplicationQuestionsArgs = {
  event: Scalars['MongoID']['input'];
  questions: Array<Scalars['MongoID']['input']>;
};


export type MutationDeleteEventBroadcastArgs = {
  _id: Scalars['MongoID']['input'];
  event: Scalars['MongoID']['input'];
};


export type MutationDeleteEventEmailSettingArgs = {
  _id: Scalars['MongoID']['input'];
};


export type MutationDeleteEventQuestionArgs = {
  _id: Scalars['MongoID']['input'];
};


export type MutationDeleteEventSessionReservationArgs = {
  input: EventSessionReservationInput;
};


export type MutationDeleteEventStoryArgs = {
  input: EventStoryInput;
};


export type MutationDeleteEventTicketCategoryArgs = {
  categories: Array<Scalars['MongoID']['input']>;
  event: Scalars['MongoID']['input'];
};


export type MutationDeleteEventTicketDiscountsArgs = {
  discounts: Array<Scalars['String']['input']>;
  event: Scalars['MongoID']['input'];
};


export type MutationDeleteEventTicketTypeArgs = {
  _id: Scalars['MongoID']['input'];
  event: Scalars['MongoID']['input'];
};


export type MutationDeleteEventTokenGateArgs = {
  _id: Scalars['MongoID']['input'];
  event: Scalars['MongoID']['input'];
};


export type MutationDeleteGuildRoomArgs = {
  _id: Scalars['MongoID']['input'];
};


export type MutationDeleteNotificationsArgs = {
  _id?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  type?: InputMaybe<NotificationTypeFilterInput>;
};


export type MutationDeleteOauth2ClientArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeletePostArgs = {
  _id: Scalars['MongoID']['input'];
};


export type MutationDeleteSiteArgs = {
  _id: Scalars['MongoID']['input'];
};


export type MutationDeleteSpaceArgs = {
  _id: Scalars['MongoID']['input'];
};


export type MutationDeleteSpaceMembersArgs = {
  input: DeleteSpaceMemberInput;
};


export type MutationDeleteSpaceNewsletterArgs = {
  _id: Scalars['MongoID']['input'];
};


export type MutationDeleteSpaceTagArgs = {
  _id: Scalars['MongoID']['input'];
  space: Scalars['MongoID']['input'];
};


export type MutationDeleteSpaceTokenGateArgs = {
  _id: Scalars['MongoID']['input'];
  space: Scalars['MongoID']['input'];
};


export type MutationDeleteStoreArgs = {
  _id: Scalars['MongoID']['input'];
};


export type MutationDeleteStoreBucketItemArgs = {
  _id: Scalars['MongoID']['input'];
};


export type MutationDeleteStoreCategoryArgs = {
  _id: Scalars['MongoID']['input'];
  store: Scalars['MongoID']['input'];
};


export type MutationDeleteStoreProductArgs = {
  _id: Scalars['MongoID']['input'];
  store: Scalars['MongoID']['input'];
};


export type MutationDeleteStoreProductVariantArgs = {
  _id: Scalars['MongoID']['input'];
  product: Scalars['MongoID']['input'];
  store: Scalars['MongoID']['input'];
};


export type MutationDeleteStorePromotionArgs = {
  _id: Scalars['MongoID']['input'];
  store: Scalars['MongoID']['input'];
};


export type MutationDeleteStripeCardArgs = {
  _id: Scalars['MongoID']['input'];
};


export type MutationDeleteUserDiscoverySwipeArgs = {
  swipee: Scalars['MongoID']['input'];
};


export type MutationDeleteUserFollowArgs = {
  followee: Scalars['MongoID']['input'];
};


export type MutationDeleteUserFriendshipArgs = {
  input: DeleteUserFriendshipInput;
};


export type MutationFlagEventArgs = {
  _id: Scalars['MongoID']['input'];
  reason: Scalars['String']['input'];
};


export type MutationFlagPostArgs = {
  _id: Scalars['MongoID']['input'];
  reason: Scalars['String']['input'];
};


export type MutationFlagUserArgs = {
  _id: Scalars['MongoID']['input'];
  reason: Scalars['String']['input'];
};


export type MutationFollowSpaceArgs = {
  space: Scalars['MongoID']['input'];
};


export type MutationGenerateCubejsTokenArgs = {
  events?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  site?: InputMaybe<Scalars['MongoID']['input']>;
  user?: InputMaybe<Scalars['MongoID']['input']>;
};


export type MutationGenerateStripeAccountLinkArgs = {
  refresh_url: Scalars['String']['input'];
  return_url: Scalars['String']['input'];
};


export type MutationImportPoapDropArgs = {
  code: Scalars['String']['input'];
  id: Scalars['Float']['input'];
  input: ImportPoapInput;
};


export type MutationInsertSpaceTagArgs = {
  input: SpaceTagInput;
};


export type MutationInviteEventArgs = {
  input: InviteEventInput;
};


export type MutationInviteUserContactsArgs = {
  _id?: InputMaybe<Scalars['MongoID']['input']>;
};


export type MutationJoinGuildRoomArgs = {
  _id: Scalars['MongoID']['input'];
};


export type MutationMailEventTicketArgs = {
  emails: Array<Scalars['String']['input']>;
  event: Scalars['MongoID']['input'];
  payment?: InputMaybe<Scalars['MongoID']['input']>;
};


export type MutationMailTicketPaymentReceiptArgs = {
  ticket: Scalars['MongoID']['input'];
};


export type MutationManageEventCohostRequestsArgs = {
  input: ManageEventCohostRequestsInput;
};


export type MutationManageSpaceTagArgs = {
  _id: Scalars['MongoID']['input'];
  space: Scalars['MongoID']['input'];
  tagged: Scalars['Boolean']['input'];
  target: Scalars['String']['input'];
};


export type MutationModifyRoomStageArgs = {
  input: ModifyRoomStageInput;
};


export type MutationPinEventsToSpaceArgs = {
  events: Array<Scalars['MongoID']['input']>;
  space: Scalars['MongoID']['input'];
  tags?: InputMaybe<Array<Scalars['MongoID']['input']>>;
};


export type MutationReadNotificationsArgs = {
  _id?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  type?: InputMaybe<NotificationTypeFilterInput>;
};


export type MutationRedeemTicketsArgs = {
  input: RedeemTicketsInput;
};


export type MutationRemoveSubSpacesArgs = {
  _id: Scalars['MongoID']['input'];
  sub_spaces: Array<Scalars['MongoID']['input']>;
};


export type MutationRemoveUserFcmTokenArgs = {
  token: Scalars['String']['input'];
};


export type MutationReorderTicketTypeCategoriesArgs = {
  categories: Array<ReorderTicketTypeCategoryInput>;
  event: Scalars['MongoID']['input'];
};


export type MutationReorderTicketTypesArgs = {
  event: Scalars['MongoID']['input'];
  types: Array<ReorderTicketTypeInput>;
};


export type MutationReportUserArgs = {
  input: ReportUserInput;
};


export type MutationRequestRoomStageArgs = {
  input: RequestRoomStageInput;
};


export type MutationRespondInvitationArgs = {
  input: RespondInvitationInput;
};


export type MutationResponseInvitationArgs = {
  input: ResponseInvitationInput;
};


export type MutationRetryPoapDropCheckArgs = {
  drop: Scalars['MongoID']['input'];
};


export type MutationRevokeOauth2Args = {
  name: Scalars['String']['input'];
};


export type MutationRewindUserDiscoveryArgs = {
  event?: InputMaybe<Scalars['MongoID']['input']>;
};


export type MutationSendEventEmailSettingTestEmailsArgs = {
  input: SendEventEmailSettingTestEmailsInput;
};


export type MutationSendRoomInviteArgs = {
  input: SendRoomInviteInput;
};


export type MutationSendSpaceNewsletterTestEmailsArgs = {
  input: SendSpaceNewsletterTestEmailsInput;
};


export type MutationSetDefaultLensProfileArgs = {
  input: SelectDefaultLensProfileInput;
};


export type MutationSetUserWalletArgs = {
  signature: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type MutationSubmitEventApplicationAnswersArgs = {
  answers: Array<EventApplicationAnswerInput>;
  email?: InputMaybe<Scalars['String']['input']>;
  event: Scalars['MongoID']['input'];
};


export type MutationSubmitEventApplicationQuestionsArgs = {
  event: Scalars['MongoID']['input'];
  questions: Array<QuestionInput>;
};


export type MutationSubmitEventFeedbackArgs = {
  input: SubmitEventFeedbackInput;
};


export type MutationSyncEventAttestationArgs = {
  chain_id: Scalars['String']['input'];
  event: Scalars['MongoID']['input'];
};


export type MutationSyncSpaceTokenGateAccessArgs = {
  space: Scalars['MongoID']['input'];
};


export type MutationTgSendCodeArgs = {
  input: SendCodeInput;
};


export type MutationTgVerifyArgs = {
  input: VerifyCodeInput;
};


export type MutationToggleBlockUserArgs = {
  input: ToggleBlockUserInput;
};


export type MutationToggleEventEmailSettingsArgs = {
  disabled: Scalars['Boolean']['input'];
  event: Scalars['MongoID']['input'];
  ids: Array<Scalars['MongoID']['input']>;
};


export type MutationToggleEventQuestionLikeArgs = {
  _id: Scalars['MongoID']['input'];
};


export type MutationToggleFileLikeArgs = {
  _id: Scalars['MongoID']['input'];
};


export type MutationToggleReactionArgs = {
  input: ReactionInput;
};


export type MutationUnfollowSpaceArgs = {
  space: Scalars['MongoID']['input'];
};


export type MutationUnpinEventsFromSpaceArgs = {
  events: Array<Scalars['MongoID']['input']>;
  space: Scalars['MongoID']['input'];
};


export type MutationUnsubscribeSpaceArgs = {
  input: UnsubscribeSpaceInput;
};


export type MutationUpdateBadgeArgs = {
  _id: Scalars['MongoID']['input'];
  input: UpdateBadgeInput;
};


export type MutationUpdateBadgeListArgs = {
  _id: Scalars['MongoID']['input'];
  input: UpdateBadgeListInput;
};


export type MutationUpdateCheckinTokenRewardSettingArgs = {
  _id: Scalars['MongoID']['input'];
  input: CheckinTokenRewardSettingInput;
};


export type MutationUpdateDonationArgs = {
  input: UpdateDonationInput;
};


export type MutationUpdateDonationVaultArgs = {
  _id: Scalars['MongoID']['input'];
  input: DonationVaultInput;
};


export type MutationUpdateEventArgs = {
  _id: Scalars['MongoID']['input'];
  input: EventInput;
};


export type MutationUpdateEventBroadcastArgs = {
  _id: Scalars['MongoID']['input'];
  event: Scalars['MongoID']['input'];
  input: UpdateEventBroadcastInput;
};


export type MutationUpdateEventCheckinArgs = {
  input: UpdateEventCheckinInput;
};


export type MutationUpdateEventCheckinsArgs = {
  input: UpdateEventCheckinInput;
};


export type MutationUpdateEventEmailSettingArgs = {
  input: UpdateEventEmailSettingInput;
};


export type MutationUpdateEventRewardUseArgs = {
  input: UpdateEventRewardUseInput;
};


export type MutationUpdateEventTicketCategoryArgs = {
  input: UpdateTicketTypeCategoryInput;
};


export type MutationUpdateEventTicketDiscountArgs = {
  event: Scalars['MongoID']['input'];
  input: UpdateEventTicketDiscountInput;
};


export type MutationUpdateEventTicketTypeArgs = {
  _id: Scalars['MongoID']['input'];
  input: EventTicketTypeInput;
};


export type MutationUpdateEventTokenGateArgs = {
  input: EventTokenGateInput;
};


export type MutationUpdateFileArgs = {
  _id: Scalars['MongoID']['input'];
  input: FileInput;
};


export type MutationUpdateLaunchpadCoinArgs = {
  input: LaunchpadCoinInput;
};


export type MutationUpdateMyLemonheadInvitationsArgs = {
  invitations: Array<Scalars['String']['input']>;
};


export type MutationUpdateNewPaymentAccountArgs = {
  input: UpdateNewPaymentAccountInput;
};


export type MutationUpdateOauth2ClientArgs = {
  id: Scalars['String']['input'];
  input: Oauth2ClientInput;
};


export type MutationUpdatePaymentArgs = {
  input: UpdatePaymentInput;
};


export type MutationUpdatePoapDropArgs = {
  drop: Scalars['MongoID']['input'];
  input: UpdatePoapInput;
};


export type MutationUpdatePostArgs = {
  _id: Scalars['MongoID']['input'];
  input: UpdatePostInput;
};


export type MutationUpdateRewardVaultArgs = {
  _id: Scalars['MongoID']['input'];
  input: TokenRewardVaultInput;
};


export type MutationUpdateRoomArgs = {
  _id: Scalars['MongoID']['input'];
  input: RoomInput;
};


export type MutationUpdateSiteArgs = {
  _id: Scalars['MongoID']['input'];
  input: UpdateSiteInput;
};


export type MutationUpdateSpaceArgs = {
  _id: Scalars['MongoID']['input'];
  input: SpaceInput;
  set_hostname?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationUpdateSpaceMemberArgs = {
  input: UpdateSpaceMemberInput;
};


export type MutationUpdateSpaceNewsletterArgs = {
  input: UpdateSpaceNewsletterInput;
};


export type MutationUpdateSpaceRoleFeaturesArgs = {
  input: UpdateSpaceRoleFeaturesInput;
};


export type MutationUpdateSpaceTokenGateArgs = {
  input: SpaceTokenGateInput;
};


export type MutationUpdateStoreArgs = {
  _id: Scalars['MongoID']['input'];
  input: StoreInput;
};


export type MutationUpdateStoreBucketItemArgs = {
  _id: Scalars['MongoID']['input'];
  input: UpdateStoreBucketItemInput;
};


export type MutationUpdateStoreCategoryArgs = {
  _id: Scalars['MongoID']['input'];
  input: StoreCategoryInput;
  store: Scalars['MongoID']['input'];
};


export type MutationUpdateStoreOrderArgs = {
  _id: Scalars['MongoID']['input'];
  input: StoreOrderInput;
};


export type MutationUpdateStoreProductArgs = {
  _id: Scalars['MongoID']['input'];
  input: StoreProductInput;
  store: Scalars['MongoID']['input'];
};


export type MutationUpdateStoreProductVariantArgs = {
  _id: Scalars['MongoID']['input'];
  input: StoreProductVariantInput;
  product: Scalars['MongoID']['input'];
  store: Scalars['MongoID']['input'];
};


export type MutationUpdateStripeConnectedAccountCapabilityArgs = {
  input: UpdateStripeConnectedAccountCapabilityInput;
};


export type MutationUpdateSubSpaceOrderArgs = {
  _id: Scalars['MongoID']['input'];
  sub_spaces: Array<Scalars['MongoID']['input']>;
};


export type MutationUpdateSubscriptionArgs = {
  _id: Scalars['MongoID']['input'];
  input: UpdateSubscriptionInput;
};


export type MutationUpdateTicketTokenRewardSettingArgs = {
  _id: Scalars['MongoID']['input'];
  input: TicketTokenRewardSettingInput;
};


export type MutationUpdateTokenRewardClaimArgs = {
  input: UpdateTokenRewardClaimInput;
};


export type MutationUpdateUserArgs = {
  input: UserInput;
};


export type MutationUpgradeTicketArgs = {
  input: UpgradeTicketInput;
};

export type NewPayment = {
  __typename?: 'NewPayment';
  _id: Scalars['MongoID']['output'];
  account: Scalars['MongoID']['output'];
  account_expanded?: Maybe<NewPaymentAccount>;
  amount: Scalars['String']['output'];
  application?: Maybe<Array<EventApplicationQuestionAndAnswer>>;
  attempting_refund?: Maybe<Scalars['Boolean']['output']>;
  billing_info?: Maybe<BillingInfo>;
  buyer_info?: Maybe<BuyerInfo>;
  buyer_user?: Maybe<UserWithEmail>;
  crypto_payment_info?: Maybe<CryptoPaymentInfo>;
  currency: Scalars['String']['output'];
  due_amount?: Maybe<Scalars['String']['output']>;
  failure_reason?: Maybe<Scalars['String']['output']>;
  fee?: Maybe<Scalars['String']['output']>;
  formatted_discount_amount?: Maybe<Scalars['String']['output']>;
  formatted_due_amount?: Maybe<Scalars['String']['output']>;
  formatted_fee_amount?: Maybe<Scalars['String']['output']>;
  formatted_total_amount?: Maybe<Scalars['String']['output']>;
  is_latest?: Maybe<Scalars['Boolean']['output']>;
  join_request?: Maybe<EventJoinRequestBase>;
  ref_data?: Maybe<Scalars['JSON']['output']>;
  stamps: Scalars['JSON']['output'];
  state: NewPaymentState;
  stripe_payment_info?: Maybe<StripePaymentInfo>;
  ticket_types_expanded?: Maybe<Array<Maybe<EventTicketType>>>;
  tickets?: Maybe<Array<TicketBase>>;
  transfer_metadata?: Maybe<Scalars['JSON']['output']>;
  transfer_params?: Maybe<Scalars['JSON']['output']>;
  user?: Maybe<Scalars['MongoID']['output']>;
};

export type NewPaymentAccount = {
  __typename?: 'NewPaymentAccount';
  _id: Scalars['MongoID']['output'];
  account_info: AccountInfo;
  active: Scalars['Boolean']['output'];
  created_at: Scalars['DateTimeISO']['output'];
  provider?: Maybe<NewPaymentProvider>;
  title?: Maybe<Scalars['String']['output']>;
  type: PaymentAccountType;
  user: Scalars['MongoID']['output'];
};

export enum NewPaymentProvider {
  Safe = 'safe',
  Stripe = 'stripe'
}

export enum NewPaymentState {
  AwaitCapture = 'await_capture',
  Cancelled = 'cancelled',
  Created = 'created',
  Failed = 'failed',
  Initialized = 'initialized',
  Refunded = 'refunded',
  Succeeded = 'succeeded'
}

export type Newsfeed = {
  __typename?: 'Newsfeed';
  offset: Scalars['Float']['output'];
  posts: Array<Post>;
};

export type NonloginUser = {
  __typename?: 'NonloginUser';
  _id?: Maybe<Scalars['MongoID']['output']>;
  active?: Maybe<Scalars['Boolean']['output']>;
  addresses?: Maybe<Array<Address>>;
  age?: Maybe<Scalars['Float']['output']>;
  attended?: Maybe<Scalars['Float']['output']>;
  blocked?: Maybe<Array<Scalars['MongoID']['output']>>;
  blocked_expanded?: Maybe<Array<User>>;
  calendly_url?: Maybe<Scalars['String']['output']>;
  company_address?: Maybe<Address>;
  company_name?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  cover?: Maybe<Scalars['MongoID']['output']>;
  cover_expanded?: Maybe<File>;
  created_at?: Maybe<Scalars['DateTimeISO']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  daos?: Maybe<Array<UserDao>>;
  data?: Maybe<Scalars['JSON']['output']>;
  date_of_birth?: Maybe<Scalars['DateTimeISO']['output']>;
  /** This is the biography of the user */
  description?: Maybe<Scalars['String']['output']>;
  discord_user_info?: Maybe<Scalars['JSON']['output']>;
  discovery?: Maybe<UserDiscoverySettings>;
  display_name?: Maybe<Scalars['String']['output']>;
  education_title?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  email_marketing?: Maybe<Scalars['Boolean']['output']>;
  email_verified?: Maybe<Scalars['Boolean']['output']>;
  ethnicity?: Maybe<Scalars['String']['output']>;
  eventbrite_user_info?: Maybe<Scalars['JSON']['output']>;
  events?: Maybe<Array<Scalars['MongoID']['output']>>;
  events_expanded?: Maybe<Array<Event>>;
  expertise?: Maybe<Array<Scalars['MongoID']['output']>>;
  expertise_expanded?: Maybe<Array<UserExpertise>>;
  farcaster_fid?: Maybe<Scalars['Float']['output']>;
  farcaster_user_info?: Maybe<FarcasterUserInfo>;
  fcm_tokens?: Maybe<Array<Scalars['String']['output']>>;
  first_name?: Maybe<Scalars['String']['output']>;
  followers?: Maybe<Scalars['Float']['output']>;
  following?: Maybe<Scalars['Float']['output']>;
  frequent_questions?: Maybe<Array<FrequentQuestion>>;
  friends?: Maybe<Scalars['Float']['output']>;
  google_user_info?: Maybe<Scalars['JSON']['output']>;
  handle_facebook?: Maybe<Scalars['String']['output']>;
  handle_farcaster?: Maybe<Scalars['String']['output']>;
  handle_github?: Maybe<Scalars['String']['output']>;
  handle_instagram?: Maybe<Scalars['String']['output']>;
  handle_lens?: Maybe<Scalars['String']['output']>;
  handle_linkedin?: Maybe<Scalars['String']['output']>;
  handle_mirror?: Maybe<Scalars['String']['output']>;
  handle_twitter?: Maybe<Scalars['String']['output']>;
  hosted?: Maybe<Scalars['Float']['output']>;
  icebreakers?: Maybe<Array<UserIcebreaker>>;
  image_avatar?: Maybe<Scalars['String']['output']>;
  industry?: Maybe<Scalars['String']['output']>;
  interests?: Maybe<Array<Scalars['String']['output']>>;
  job_title?: Maybe<Scalars['String']['output']>;
  kratos_farcaster_fid?: Maybe<Scalars['String']['output']>;
  kratos_unicorn_wallet_address?: Maybe<Scalars['String']['output']>;
  kratos_wallet_address?: Maybe<Scalars['String']['output']>;
  languages?: Maybe<Array<Scalars['String']['output']>>;
  last_name?: Maybe<Scalars['String']['output']>;
  layout_sections?: Maybe<Array<LayoutSection>>;
  lemon_amount?: Maybe<Scalars['Float']['output']>;
  lemon_cap?: Maybe<Scalars['Float']['output']>;
  lemon_refresh_at?: Maybe<Scalars['DateTimeISO']['output']>;
  lemonhead_inviter_wallet?: Maybe<Scalars['String']['output']>;
  lens_profile_id?: Maybe<Scalars['String']['output']>;
  lens_profile_synced?: Maybe<Scalars['Boolean']['output']>;
  location_line?: Maybe<Scalars['String']['output']>;
  matrix_localpart?: Maybe<Scalars['String']['output']>;
  music?: Maybe<Array<Scalars['String']['output']>>;
  name?: Maybe<Scalars['String']['output']>;
  new_gender?: Maybe<Scalars['String']['output']>;
  new_photos?: Maybe<Array<Scalars['MongoID']['output']>>;
  new_photos_expanded?: Maybe<Array<File>>;
  notification_filters?: Maybe<Array<Scalars['JSON']['output']>>;
  oauth2_allow_creation?: Maybe<Scalars['Boolean']['output']>;
  oauth2_clients?: Maybe<Array<Scalars['String']['output']>>;
  oauth2_max_clients?: Maybe<Scalars['Int']['output']>;
  offers?: Maybe<Array<UserOffer>>;
  payment_verification?: Maybe<UserPaymentVerification>;
  phone?: Maybe<Scalars['String']['output']>;
  phone_verified?: Maybe<Scalars['Boolean']['output']>;
  posts?: Maybe<Scalars['Float']['output']>;
  preferred_network?: Maybe<Scalars['String']['output']>;
  pronoun?: Maybe<Scalars['String']['output']>;
  quest_points?: Maybe<Scalars['Float']['output']>;
  razorpay_customer?: Maybe<Scalars['String']['output']>;
  search_range?: Maybe<Scalars['Float']['output']>;
  service_offers?: Maybe<Array<Scalars['MongoID']['output']>>;
  service_offers_expanded?: Maybe<Array<UserServiceOffer>>;
  settings?: Maybe<Scalars['JSON']['output']>;
  shopify_user_info?: Maybe<Scalars['JSON']['output']>;
  stripe_connected_account?: Maybe<StripeConnectedAccount>;
  stripe_user_info?: Maybe<Scalars['JSON']['output']>;
  tag_recommended?: Maybe<Scalars['Boolean']['output']>;
  tag_site?: Maybe<Scalars['Boolean']['output']>;
  tag_timeline?: Maybe<Scalars['Boolean']['output']>;
  tag_verified?: Maybe<Scalars['Boolean']['output']>;
  tagline?: Maybe<Scalars['String']['output']>;
  telegram_user_info?: Maybe<Scalars['JSON']['output']>;
  terms_accepted_adult?: Maybe<Scalars['Boolean']['output']>;
  terms_accepted_conditions?: Maybe<Scalars['Boolean']['output']>;
  timezone?: Maybe<Scalars['String']['output']>;
  twitch_user_info?: Maybe<Scalars['JSON']['output']>;
  twitter2_user_info?: Maybe<Scalars['JSON']['output']>;
  twitter_user_info?: Maybe<Scalars['JSON']['output']>;
  type?: Maybe<UserType>;
  updated_at?: Maybe<Scalars['DateTimeISO']['output']>;
  url?: Maybe<Scalars['String']['output']>;
  url_go?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
  verified?: Maybe<Scalars['Boolean']['output']>;
  wallet_custodial?: Maybe<Scalars['String']['output']>;
  wallets?: Maybe<Array<Scalars['String']['output']>>;
  wallets_new?: Maybe<Scalars['JSON']['output']>;
  website?: Maybe<Scalars['String']['output']>;
  zoom_user_info?: Maybe<Scalars['JSON']['output']>;
};

export type Notification = {
  __typename?: 'Notification';
  _id: Scalars['MongoID']['output'];
  created_at: Scalars['DateTimeISO']['output'];
  data?: Maybe<Scalars['JSON']['output']>;
  from?: Maybe<Scalars['MongoID']['output']>;
  from_expanded?: Maybe<User>;
  image_url?: Maybe<Scalars['String']['output']>;
  is_seen?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  ref_event?: Maybe<Scalars['MongoID']['output']>;
  ref_event_expanded?: Maybe<Event>;
  ref_room?: Maybe<Scalars['MongoID']['output']>;
  ref_room_expanded?: Maybe<Room>;
  ref_space?: Maybe<Scalars['MongoID']['output']>;
  ref_space_expanded?: Maybe<Space>;
  ref_store_order?: Maybe<Scalars['MongoID']['output']>;
  ref_store_order_expanded?: Maybe<StoreOrder>;
  ref_user?: Maybe<Scalars['MongoID']['output']>;
  ref_user_expanded?: Maybe<User>;
  title?: Maybe<Scalars['String']['output']>;
  type: NotificationType;
};

export enum NotificationType {
  AdminPaymentVerification = 'admin_payment_verification',
  ChatMessage = 'chat_message',
  EmailSendFailed = 'email_send_failed',
  EventAnnounce = 'event_announce',
  EventApprove = 'event_approve',
  EventAttestationSyncCompleted = 'event_attestation_sync_completed',
  EventBroadcastCreated = 'event_broadcast_created',
  EventBroadcastDeactivated = 'event_broadcast_deactivated',
  EventBroadcastDeleted = 'event_broadcast_deleted',
  EventBroadcastEnded = 'event_broadcast_ended',
  EventBroadcastRescheduled = 'event_broadcast_rescheduled',
  EventBroadcastStarted = 'event_broadcast_started',
  EventCancellation = 'event_cancellation',
  EventChatAnnounce = 'event_chat_announce',
  EventCohostRequest = 'event_cohost_request',
  EventCohostRequestAnnounce = 'event_cohost_request_announce',
  EventDeclined = 'event_declined',
  EventDonation = 'event_donation',
  EventInvite = 'event_invite',
  EventInviteAttending = 'event_invite_attending',
  EventInviteVerifyAcceptRequest = 'event_invite_verify_accept_request',
  EventInviteVerifyRequest = 'event_invite_verify_request',
  EventRequestApproved = 'event_request_approved',
  EventRequestCreated = 'event_request_created',
  EventRequestDeclined = 'event_request_declined',
  EventUnlockVerifyAcceptRequest = 'event_unlock_verify_accept_request',
  EventUnlockVerifyRequest = 'event_unlock_verify_request',
  EventUpdate = 'event_update',
  PaymentAuthorized = 'payment_authorized',
  PaymentFailed = 'payment_failed',
  PaymentRefunded = 'payment_refunded',
  PaymentSucceeded = 'payment_succeeded',
  PaymentsCapturedSummary = 'payments_captured_summary',
  PaymentsWiredSummary = 'payments_wired_summary',
  PlaceReservationDelete = 'place_reservation_delete',
  PlaceReservationRequest = 'place_reservation_request',
  PlaceReservationRequestAccept = 'place_reservation_request_accept',
  PlaceReservationRequestDecline = 'place_reservation_request_decline',
  ReservationAccept = 'reservation_accept',
  RoomInvite = 'room_invite',
  RoomStarted = 'room_started',
  SafeVaultInitFailed = 'safe_vault_init_failed',
  SafeVaultInitSuccess = 'safe_vault_init_success',
  SpaceEventPinRequest = 'space_event_pin_request',
  SpaceMemberAdded = 'space_member_added',
  SpaceVerificationApproved = 'space_verification_approved',
  SpaceVerificationRejected = 'space_verification_rejected',
  StoreOrderAccepted = 'store_order_accepted',
  StoreOrderAwaitingPickup = 'store_order_awaiting_pickup',
  StoreOrderCancelled = 'store_order_cancelled',
  StoreOrderDeclined = 'store_order_declined',
  StoreOrderDelivered = 'store_order_delivered',
  StoreOrderDeliveryConfirmed = 'store_order_delivery_confirmed',
  StoreOrderInTransit = 'store_order_in_transit',
  StoreOrderPending = 'store_order_pending',
  StoreOrderPreparing = 'store_order_preparing',
  StripeConnected = 'stripe_connected',
  TicketAssigned = 'ticket_assigned',
  TicketCancelled = 'ticket_cancelled',
  UserContactSignup = 'user_contact_signup',
  UserDiscoveryMatch = 'user_discovery_match',
  UserFriendshipRequest = 'user_friendship_request',
  UserFriendshipRequestAccept = 'user_friendship_request_accept'
}

export type NotificationTypeFilterInput = {
  eq?: InputMaybe<NotificationType>;
  in?: InputMaybe<Array<NotificationType>>;
  nin?: InputMaybe<Array<NotificationType>>;
};

export type OAuth2Client = {
  __typename?: 'OAuth2Client';
  allowed_cors_origins: Array<Scalars['String']['output']>;
  audience: Array<Scalars['String']['output']>;
  authorization_code_grant_access_token_lifespan?: Maybe<Scalars['String']['output']>;
  authorization_code_grant_id_token_lifespan?: Maybe<Scalars['String']['output']>;
  authorization_code_grant_refresh_token_lifespan?: Maybe<Scalars['String']['output']>;
  client_credentials_grant_access_token_lifespan?: Maybe<Scalars['String']['output']>;
  client_id: Scalars['String']['output'];
  client_name: Scalars['String']['output'];
  client_secret?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['DateTimeISO']['output'];
  grant_types: Array<Scalars['String']['output']>;
  implicit_grant_access_token_lifespan?: Maybe<Scalars['String']['output']>;
  implicit_grant_id_token_lifespan?: Maybe<Scalars['String']['output']>;
  jwt_bearer_grant_access_token_lifespan?: Maybe<Scalars['String']['output']>;
  logo_uri?: Maybe<Scalars['String']['output']>;
  metadata?: Maybe<Scalars['JSON']['output']>;
  post_logout_redirect_uris?: Maybe<Array<Scalars['String']['output']>>;
  redirect_uris?: Maybe<Array<Scalars['String']['output']>>;
  refresh_token_grant_access_token_lifespan?: Maybe<Scalars['String']['output']>;
  refresh_token_grant_id_token_lifespan?: Maybe<Scalars['String']['output']>;
  refresh_token_grant_refresh_token_lifespan?: Maybe<Scalars['String']['output']>;
  response_types?: Maybe<Array<Scalars['String']['output']>>;
  scope: Scalars['String']['output'];
  skip_consent?: Maybe<Scalars['Boolean']['output']>;
  token_endpoint_auth_method?: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['DateTimeISO']['output'];
};

export type Oauth2ClientInput = {
  allowed_cors_origins?: InputMaybe<Array<Scalars['String']['input']>>;
  authorization_code_grant_access_token_lifespan?: InputMaybe<Scalars['String']['input']>;
  authorization_code_grant_id_token_lifespan?: InputMaybe<Scalars['String']['input']>;
  authorization_code_grant_refresh_token_lifespan?: InputMaybe<Scalars['String']['input']>;
  client_credentials_grant_access_token_lifespan?: InputMaybe<Scalars['String']['input']>;
  client_name?: InputMaybe<Scalars['String']['input']>;
  implicit_grant_access_token_lifespan?: InputMaybe<Scalars['String']['input']>;
  implicit_grant_id_token_lifespan?: InputMaybe<Scalars['String']['input']>;
  jwt_bearer_grant_access_token_lifespan?: InputMaybe<Scalars['String']['input']>;
  logo_uri?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  post_logout_redirect_uris?: InputMaybe<Array<Scalars['String']['input']>>;
  redirect_uris?: InputMaybe<Array<Scalars['String']['input']>>;
  refresh_token_grant_access_token_lifespan?: InputMaybe<Scalars['String']['input']>;
  refresh_token_grant_id_token_lifespan?: InputMaybe<Scalars['String']['input']>;
  refresh_token_grant_refresh_token_lifespan?: InputMaybe<Scalars['String']['input']>;
  skip_consent?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Offer = {
  __typename?: 'Offer';
  _id?: Maybe<Scalars['MongoID']['output']>;
  color?: Maybe<Scalars['String']['output']>;
  position?: Maybe<Scalars['Float']['output']>;
  provider: OfferProvider;
  provider_id: Scalars['String']['output'];
  provider_network: Scalars['String']['output'];
};

export enum OfferProvider {
  Claimable = 'claimable',
  FestivalHeads = 'festival_heads',
  Metaverse = 'metaverse',
  Order = 'order',
  Poap = 'poap',
  Token = 'token'
}

export enum OfferType {
  Home = 'HOME',
  Poap = 'POAP'
}

export type PaginationInput = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};

export type ParentCastInput = {
  fid: Scalars['Float']['input'];
  /** Hash of the parent cast without 0x prefix */
  hash: Scalars['String']['input'];
};

export type PassportMintingInfo = {
  __typename?: 'PassportMintingInfo';
  can_mint: Scalars['Boolean']['output'];
  price: Scalars['String']['output'];
  white_list_enabled: Scalars['Boolean']['output'];
};

export enum PassportProvider {
  DripNation = 'drip_nation',
  FestivalNation = 'festival_nation',
  Lemonade = 'lemonade',
  VinylNation = 'vinyl_nation',
  Zugrama = 'zugrama'
}

export type PaymentAccountInfo = {
  __typename?: 'PaymentAccountInfo';
  _id: Scalars['MongoID']['output'];
  account_info: AccountInfo;
  active: Scalars['Boolean']['output'];
  created_at: Scalars['DateTimeISO']['output'];
  escrow?: Maybe<EscrowDepositInfo>;
  fee?: Maybe<Scalars['String']['output']>;
  provider?: Maybe<NewPaymentProvider>;
  relay?: Maybe<RelayPaymentInfo>;
  title?: Maybe<Scalars['String']['output']>;
  type: PaymentAccountType;
  user: Scalars['MongoID']['output'];
};

export enum PaymentAccountType {
  Digital = 'digital',
  Ethereum = 'ethereum',
  EthereumEscrow = 'ethereum_escrow',
  EthereumRelay = 'ethereum_relay',
  EthereumStake = 'ethereum_stake',
  Solana = 'solana'
}

export type PaymentRefundInfo = {
  __typename?: 'PaymentRefundInfo';
  _id: Scalars['MongoID']['output'];
  amount: Scalars['String']['output'];
  attempting_refund?: Maybe<Scalars['Boolean']['output']>;
  currency: Scalars['String']['output'];
  payment_account: NewPaymentAccount;
  refund_info?: Maybe<RefundInfo>;
  /** If null is returned then this payment does not support refund */
  refund_policy?: Maybe<PaymentRefundPolicy>;
  /** Null for undeterminated, true if requirement met, otherwise false */
  refund_requirements_met?: Maybe<Scalars['Boolean']['output']>;
  state: NewPaymentState;
};

export type PaymentRefundPolicy = {
  __typename?: 'PaymentRefundPolicy';
  percent: Scalars['Float']['output'];
  requirements?: Maybe<RefundRequirements>;
  /** Whether all requirements must be met */
  satisfy_all?: Maybe<Scalars['Boolean']['output']>;
};

export type PaymentRefundSignature = {
  __typename?: 'PaymentRefundSignature';
  /** The args that will be supplied to the contract refund function */
  args: Array<Scalars['JSON']['output']>;
  signature: Scalars['String']['output'];
};

export type PaymentRevenue = {
  __typename?: 'PaymentRevenue';
  currency: Scalars['String']['output'];
  formatted_total_amount: Scalars['String']['output'];
};

export type PaymentStatistics = {
  __typename?: 'PaymentStatistics';
  count: Scalars['Int']['output'];
  revenue: Array<PaymentRevenue>;
};

export type PeekEventGuestsResponse = {
  __typename?: 'PeekEventGuestsResponse';
  items: Array<EventGuestUser>;
  total: Scalars['Int']['output'];
};

export type PinEventsToSpaceResponse = {
  __typename?: 'PinEventsToSpaceResponse';
  requests?: Maybe<Array<SpaceEventRequest>>;
};

export type PoapClaim = {
  __typename?: 'PoapClaim';
  beneficiary?: Maybe<Scalars['String']['output']>;
  claimed_date?: Maybe<Scalars['DateTimeISO']['output']>;
  drop: PoapDrop;
};

export enum PoapClaimMode {
  CheckIn = 'check_in',
  Registration = 'registration'
}

export type PoapDrop = {
  __typename?: 'PoapDrop';
  _id: Scalars['MongoID']['output'];
  /** Requested poap amount */
  amount: Scalars['Int']['output'];
  claim_count?: Maybe<Scalars['Int']['output']>;
  claim_mode: PoapClaimMode;
  current_amount: Scalars['Int']['output'];
  description: Scalars['String']['output'];
  event?: Maybe<Scalars['MongoID']['output']>;
  image?: Maybe<Scalars['MongoID']['output']>;
  image_expanded?: Maybe<File>;
  image_url?: Maybe<Scalars['String']['output']>;
  minting_network: Scalars['String']['output'];
  name: Scalars['String']['output'];
  private?: Maybe<Scalars['Boolean']['output']>;
  status: PoapDropStatus;
  ticket_types?: Maybe<Array<Scalars['MongoID']['output']>>;
  ticket_types_expanded?: Maybe<Array<EventTicketType>>;
};

export type PoapDropInfo = {
  __typename?: 'PoapDropInfo';
  description: Scalars['String']['output'];
  image_url: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export enum PoapDropStatus {
  Failed = 'failed',
  Pending = 'pending',
  Ready = 'ready'
}

export type Point = {
  __typename?: 'Point';
  coordinates: Array<Scalars['Float']['output']>;
  type: Scalars['String']['output'];
};

export type PointConfigInfo = {
  __typename?: 'PointConfigInfo';
  _id: Scalars['MongoID']['output'];
  first_level_group?: Maybe<Scalars['MongoID']['output']>;
  first_time_only?: Maybe<Scalars['Boolean']['output']>;
  points: Scalars['Float']['output'];
  second_level_group?: Maybe<Scalars['MongoID']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  trackings: Array<PointTrackingInfo>;
  type: PointType;
};

export type PointGroup = {
  __typename?: 'PointGroup';
  completed?: Maybe<Scalars['Float']['output']>;
  count?: Maybe<Scalars['Float']['output']>;
  first_level_group?: Maybe<Group>;
  points?: Maybe<Scalars['Float']['output']>;
  second_level_groups: Array<Maybe<Group>>;
};

export type PointTrackingInfo = {
  __typename?: 'PointTrackingInfo';
  _id: Scalars['MongoID']['output'];
  config: Scalars['MongoID']['output'];
  created_at: Scalars['DateTimeISO']['output'];
  points: Scalars['Float']['output'];
};

export enum PointType {
  ConfigBio = 'config_bio',
  ConfigDisplayName = 'config_display_name',
  ConfigProfilePhoto = 'config_profile_photo',
  ConfigUsername = 'config_username',
  ConnectEventbrite = 'connect_eventbrite',
  ConnectFarcaster = 'connect_farcaster',
  ConnectStripe = 'connect_stripe',
  ConnectWallet = 'connect_wallet',
  CreatePost = 'create_post',
  EventAttestation = 'event_attestation',
  EveryNthRsvp = 'every_nth_rsvp',
  InviteeRsvpEvent = 'invitee_rsvp_event',
  PerEventCheckin = 'per_event_checkin',
  PerEventRsvp = 'per_event_rsvp',
  PerGuestCheckin = 'per_guest_checkin',
  PerPaidTicketTierCreated = 'per_paid_ticket_tier_created',
  PerPostHasMoreThanNLikes = 'per_post_has_more_than_n_likes',
  PerPublishedEvent = 'per_published_event',
  PerTicketSold = 'per_ticket_sold',
  SignupOnMobileApp = 'signup_on_mobile_app',
  UpdateEventAttestation = 'update_event_attestation',
  VerifyEmail = 'verify_email'
}

export type PossibleUserWithEmail = {
  __typename?: 'PossibleUserWithEmail';
  _id?: Maybe<Scalars['MongoID']['output']>;
  /** This is the biography of the user */
  description?: Maybe<Scalars['String']['output']>;
  display_name?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  image_avatar?: Maybe<Scalars['String']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export type Post = {
  __typename?: 'Post';
  _id: Scalars['MongoID']['output'];
  comments?: Maybe<Scalars['Float']['output']>;
  created_at: Scalars['DateTimeISO']['output'];
  has_reaction?: Maybe<Scalars['Boolean']['output']>;
  published?: Maybe<Scalars['Boolean']['output']>;
  reactions?: Maybe<Scalars['Float']['output']>;
  ref_event?: Maybe<Event>;
  ref_file?: Maybe<File>;
  ref_id?: Maybe<Scalars['String']['output']>;
  ref_type?: Maybe<PostRefType>;
  text?: Maybe<Scalars['String']['output']>;
  user: Scalars['MongoID']['output'];
  user_expanded?: Maybe<User>;
  visibility: PostVisibility;
};

export type PostInput = {
  ref_id?: InputMaybe<Scalars['String']['input']>;
  ref_type?: InputMaybe<PostRefType>;
  text?: InputMaybe<Scalars['String']['input']>;
  visibility: PostVisibility;
};

export enum PostRefType {
  Event = 'EVENT',
  File = 'FILE'
}

export enum PostVisibility {
  Followers = 'FOLLOWERS',
  Friends = 'FRIENDS',
  Mentions = 'MENTIONS',
  Public = 'PUBLIC'
}

export type PricingInfo = {
  __typename?: 'PricingInfo';
  deposit_infos?: Maybe<Array<EscrowDepositInfo>>;
  discount: Scalars['String']['output'];
  event_token_gates?: Maybe<Array<EventTokenGate>>;
  payment_accounts: Array<PaymentAccountInfo>;
  subtotal: Scalars['String']['output'];
  total: Scalars['String']['output'];
};

export type PublicSpace = {
  __typename?: 'PublicSpace';
  _id: Scalars['MongoID']['output'];
  admins?: Maybe<Array<User>>;
  creator_expanded?: Maybe<User>;
  description?: Maybe<Scalars['String']['output']>;
  followed?: Maybe<Scalars['Boolean']['output']>;
  followers_count?: Maybe<Scalars['Float']['output']>;
  image_avatar_expanded?: Maybe<File>;
  image_cover_expanded?: Maybe<File>;
  is_admin?: Maybe<Scalars['Boolean']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type PurchasableItem = {
  count: Scalars['Int']['input'];
  id: Scalars['MongoID']['input'];
};

export type PurchasableTicketType = {
  __typename?: 'PurchasableTicketType';
  _id: Scalars['MongoID']['output'];
  active?: Maybe<Scalars['Boolean']['output']>;
  address_required?: Maybe<Scalars['Boolean']['output']>;
  approval_required?: Maybe<Scalars['Boolean']['output']>;
  category?: Maybe<Scalars['MongoID']['output']>;
  category_expanded?: Maybe<EventTicketCategory>;
  default?: Maybe<Scalars['Boolean']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  description_line?: Maybe<Scalars['String']['output']>;
  discountable: Scalars['Boolean']['output'];
  event: Scalars['MongoID']['output'];
  external_ids?: Maybe<Array<Scalars['String']['output']>>;
  limit: Scalars['Float']['output'];
  limited?: Maybe<Scalars['Boolean']['output']>;
  offers?: Maybe<Array<EventOffer>>;
  passcode_enabled?: Maybe<Scalars['Boolean']['output']>;
  photos?: Maybe<Array<Scalars['MongoID']['output']>>;
  photos_expanded?: Maybe<Array<Maybe<File>>>;
  position?: Maybe<Scalars['Int']['output']>;
  prices: Array<EventTicketPrice>;
  private?: Maybe<Scalars['Boolean']['output']>;
  recommended_upgrade_ticket_types?: Maybe<Array<Scalars['MongoID']['output']>>;
  self_verification?: Maybe<SelfVerification>;
  title: Scalars['String']['output'];
  whitelisted?: Maybe<Scalars['Boolean']['output']>;
};


export type PurchasableTicketTypePhotos_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};

export type Query = {
  __typename?: 'Query';
  calculateTicketsPricing: PricingInfo;
  canMintLemonhead: LemonheadMintingInfo;
  canMintPassport: PassportMintingInfo;
  canUseSpaceSlug: Scalars['Boolean']['output'];
  checkPoapDropEditCode: Scalars['Boolean']['output'];
  checkTicketTypePasscode: Scalars['Boolean']['output'];
  exportEventApplications: Array<EventApplicationExport>;
  exportEventTickets: ExportedTickets;
  generateClaimCheckinRewardSignature?: Maybe<ClaimCheckinRewardSignatureResponse>;
  generateClaimTicketRewardSignature?: Maybe<ClaimTicketRewardSignatureResponse>;
  generateEventInvitationUrl?: Maybe<GenerateEventInvitationUrlResponse>;
  generateRecurringDates: Array<Scalars['DateTimeISO']['output']>;
  generateSlashPaymentSignature: PaymentRefundSignature;
  getApplicantsInfo: Array<Applicant>;
  getBadgeCities: Array<BadgeCity>;
  getBadgeLists: Array<BadgeList>;
  getBadges: Array<Badge>;
  getBroadcasts: Array<Broadcast>;
  getComments: Array<Comment>;
  getConfigs: Scalars['JSON']['output'];
  getCurrentSubscription?: Maybe<SubscriptionResponse>;
  getDefaultLensProfile?: Maybe<Scalars['String']['output']>;
  getEvent?: Maybe<Event>;
  getEventApplicationAnswers: Array<EventApplicationAnswer>;
  getEventAttestation?: Maybe<EventAttestation>;
  getEventAttestationDiff?: Maybe<EventAttestationDiff>;
  getEventCheckinChartData: EventCheckinChartData;
  getEventCheckins: Array<EventCheckin>;
  /** @deprecated Requests are auto accepted */
  getEventCohostInvites: Array<EventCohostRequest>;
  getEventCohostRequests: Array<EventCohostRequest>;
  getEventCurrencies: Array<EventCurrency>;
  getEventEmailSetting: EmailSetting;
  getEventFeedbackSummary: EventFeedbackSummary;
  getEventGuestDetail?: Maybe<EventGuestDetail>;
  getEventGuestDetailedInfo?: Maybe<EventGuestDetailedInfo>;
  /**
   * For guests, return attending guests basic information of an event
   * @deprecated Will be removed in next release
   */
  getEventGuestDirectory: Array<BasicUserInfo>;
  getEventGuestsStatistics: GetEventGuestsStatisticsResponse;
  getEventInvitation?: Maybe<EventInvitation>;
  getEventInvitationUrl?: Maybe<EventInvitationUrl>;
  getEventInvitedStatistics: GetEventInvitedStatisticsResponse;
  getEventJoinRequest: EventJoinRequest;
  getEventJoinRequestStateStatistic: Array<EventRequestStateStatistic>;
  getEventJoinRequests: GetEventJoinRequestsResponse;
  getEventLatestViews: EventLatestViews;
  getEventPayment?: Maybe<NewPayment>;
  getEventPaymentStatistics: EventPaymentStatistics;
  getEventPaymentSummary: Array<EventPaymentSummary>;
  /** @deprecated Cohost invites are auto accepted */
  getEventPendingInvites: GetEventPendingInvitesResponse;
  getEventQuestions: Array<EventQuestion>;
  getEventRewardUses: Array<EventRewardUse>;
  getEventSessionReservationSummary: Array<EventSessionReservationSummary>;
  getEventSessionReservations: Array<EventSessionReservation>;
  getEventTags: Array<Scalars['String']['output']>;
  getEventTicketCategories: Array<EventTicketCategory>;
  getEventTicketSales: EventTicketSaleResponse;
  getEventTicketSoldChartData: TicketSoldChartData;
  getEventTicketTypes: GetEventTicketTypesResponse;
  getEventTopInviters: GetTopInvitersResponse;
  getEventTopViews: GetEventTopViewsResponse;
  getEventViewChartData: EventViewChartData;
  getEventViewStats: EventViewStats;
  getEventbriteEvents: Array<EventbriteEvent>;
  getEvents: Array<Event>;
  getFiles: Array<File>;
  getFrequentQuestions: Array<FrequentQuestion>;
  getGuildRooms: Array<GuildRoom>;
  getHomeEvents: Array<Event>;
  getHostingEvents: Array<Event>;
  getInitSafeTransaction: RawTransaction;
  getLemonheadInvitationRank: GetMyLemonheadInvitationRankResponse;
  getLemonheadSupportData: Array<LemonheadSupportData>;
  getMe: User;
  getMyEventJoinRequest?: Maybe<EventJoinRequest>;
  getMyEvents: Array<Event>;
  /** Return zero if the user has no rank */
  getMyLemonheadInvitationRank: LemonheadInvitationRank;
  getMyPayments: Array<NewPayment>;
  getMyPoints: Array<PointConfigInfo>;
  getMySpaceEventRequests: GetSpaceEventRequestsResponse;
  getMyTickets: GetMyTicketsResponse;
  getNewPayment?: Maybe<NewPayment>;
  getNewsfeed?: Maybe<Newsfeed>;
  getNotifications: Array<Notification>;
  getOffers: Array<Offer>;
  getPastEvents: Array<Event>;
  getPaymentRefundSignature: PaymentRefundSignature;
  getPoapDropInfoById: PoapDropInfo;
  getPointGroups: Array<PointGroup>;
  getPosts: Array<Post>;
  getProfileEvents: Array<Event>;
  getRecommendedUsers: Array<User>;
  getRoom?: Maybe<Room>;
  getRoomCredentials: RoomCredentials;
  getRooms: Array<Room>;
  getSafeFreeLimit: FreeSafeInitInfo;
  getSelfVerificationStatus: SelfVerificationStatus;
  getSites: Array<Site>;
  getSpace?: Maybe<Space>;
  getSpaceEventLocationsLeaderboard: Array<SpaceEventLocationLeaderboard>;
  getSpaceEventRequests: GetSpaceEventRequestsResponse;
  getSpaceEventSummary: SpaceEventSummary;
  getSpaceEventsInsight: SpaceEventInsightResponse;
  getSpaceMember: SpaceMember;
  getSpaceMemberAmountByDate: Array<SpaceMemberAmountByDate>;
  getSpaceMemberAttendedEvents: Array<Event>;
  getSpaceMemberHostedEvents: Array<Event>;
  getSpaceMemberSubmittedEvents: Array<Event>;
  getSpaceMembersLeaderboard: SpaceMembersLeaderboardResponse;
  getSpaceNewsletter?: Maybe<EmailSetting>;
  getSpaceNewsletterStatistics: SpaceNewsletterStatistics;
  getSpaceRewardSettingClaims: Array<SpaceTokenRewardClaim>;
  getSpaceRewardStatistics: SpaceRewardStatistics;
  getSpaceSendingQuota: SpaceSendingQuota;
  getSpaceStatistics: SpaceStatisticResponse;
  getSpaceVerificationSubmission?: Maybe<SpaceVerificationSubmission>;
  getStakePaymentStatistics: StakePaymentStatistics;
  getStore?: Maybe<Store>;
  getStoreBucketItems: Array<StoreBucketItem>;
  getStoreCategories: Array<StoreCategory>;
  getStoreCategory?: Maybe<StoreCategory>;
  getStoreDeliveryOptions: Array<DeliveryOption>;
  getStoreOrder?: Maybe<StoreOrder>;
  getStoreOrders: Array<StoreOrder>;
  getStoreProduct: StoreProduct;
  getStoreProducts: Array<StoreProduct>;
  getStoreSalesTax: SalesTax;
  getStores: Array<Store>;
  getStripeCards: Array<StripeCard>;
  getStripeConnectedAccountCapability?: Maybe<StripeAccountCapability>;
  getStripeTransferDetail: Scalars['JSON']['output'];
  getSubSpaces?: Maybe<Array<PublicSpace>>;
  getSystemFiles: Array<SystemFile>;
  getTicket?: Maybe<Ticket>;
  getTicketStatistics: TicketStatistics;
  getTickets: Array<Ticket>;
  getTopSpaceEventAttendees: Array<SpaceEventAttendee>;
  getTopSpaceHosts: Array<SpaceEventHost>;
  getUpcomingEvents: Array<Event>;
  getUser?: Maybe<User>;
  getUserContacts: GetUserContactsResponse;
  getUserDiscovery: UserDiscovery;
  getUserDiscoverySwipes: Array<UserDiscoverySwipe>;
  getUserFollows: Array<UserFollow>;
  getUserFriendships: GetUserFriendshipsResponse;
  getUserFromUserMigration?: Maybe<NonloginUser>;
  getUserIcebreakerQuestions: Array<UserIcebreakerQuestion>;
  getUserPaymentVerification: UserPaymentVerificationInfo;
  getUserWalletRequest: UserWalletRequest;
  getUsers: Array<User>;
  getUsersSpotlight: Array<User>;
  getVaultSalt: Scalars['String']['output'];
  isUsernameAvailable: Scalars['Boolean']['output'];
  joinChannel: Scalars['Boolean']['output'];
  listAllCurrencies: Array<Currency>;
  listChains: Array<Chain>;
  listCheckinTokenRewardSettings: Array<CheckinTokenRewardSetting>;
  listDonationRecommendations: Array<DonationRecommendation>;
  listDonationVaults: Array<DonationVault>;
  listDonations: ListDonationsResponse;
  listEventEmailSettings: Array<EmailSetting>;
  listEventFeedBacks: Array<EventFeedback>;
  listEventFeedbacksNew: ListEventFeedbacksResponse;
  listEventGuests: ListEventGuestsResponse;
  listEventHosts: ListEventHostsResponse;
  listEventPayments: ListEventPaymentsResponse;
  listEventStakePayments: ListEventStakePaymentsResponse;
  listEventTicketTypes: Array<EventTicketType>;
  listEventTokenGates: Array<EventTokenGate>;
  listEventVotings: Array<EventVoting>;
  listFiatCurrencies: Array<FiatCurrency>;
  listGeoRegions: Array<GeoRegion>;
  listLaunchpadCoins: ListLaunchpadCoinsResponse;
  listLaunchpadGroups: ListLaunchpadGroupsResponse;
  listLemonheadSponsors: ListLemonheadSponsorsResponse;
  listMyLemonheadInvitations: ListMyLemonheadInvitationsResponse;
  listMyPoapClaims: Array<PoapClaim>;
  listMySpaces: SearchSpacesResponse;
  listNewPaymentAccounts: Array<NewPaymentAccount>;
  listNewPayments: Array<NewPayment>;
  listOauth2Clients: Array<OAuth2Client>;
  listPassportSponsors: ListLemonheadSponsorsResponse;
  listPoapDrops: Array<PoapDrop>;
  listRewardVaults: Array<TokenRewardVault>;
  listSpaceCategories: Array<SpaceCategory>;
  listSpaceMembers: ListSpaceMembersResponse;
  listSpaceNFTs: ListSpaceNfTsResponse;
  listSpaceNewsletters: Array<EmailSetting>;
  listSpaceRewardSettings: SpaceRewardSettings;
  listSpaceRewardVaults: Array<TokenRewardVault>;
  listSpaceRoleFeatures: ListSpaceRoleFeaturesResponse;
  listSpaceTags: Array<SpaceTag>;
  listSpaceTokenGates: Array<SpaceTokenGate>;
  listSpaceTokenRewardClaims: SpaceTokenRewardClaims;
  /** @deprecated Use searchSpaces instead */
  listSpaces: Array<Space>;
  listSubscriptionItems: Array<SubscriptionItem>;
  listTicketTokenRewardSettings: Array<TicketTokenRewardSetting>;
  listUserExpertises: Array<UserExpertise>;
  listUserServices: Array<UserServiceOffer>;
  peekEventGuests: PeekEventGuestsResponse;
  previewUpdateSubscription?: Maybe<SubscriptionPricing>;
  searchSpaces: SearchSpacesResponse;
  searchUsers: Array<UserWithEmail>;
  tgGetMyChannels: ScanChannelsResult;
};


export type QueryCalculateTicketsPricingArgs = {
  input: CalculateTicketsPricingInput;
};


export type QueryCanMintLemonheadArgs = {
  wallet: Scalars['String']['input'];
};


export type QueryCanMintPassportArgs = {
  provider: PassportProvider;
  sponsor?: InputMaybe<Scalars['MongoID']['input']>;
  wallet: Scalars['String']['input'];
};


export type QueryCanUseSpaceSlugArgs = {
  slug: Scalars['String']['input'];
};


export type QueryCheckPoapDropEditCodeArgs = {
  code: Scalars['String']['input'];
  id: Scalars['Int']['input'];
};


export type QueryCheckTicketTypePasscodeArgs = {
  passcode: Scalars['String']['input'];
  type: Scalars['MongoID']['input'];
};


export type QueryExportEventApplicationsArgs = {
  event: Scalars['MongoID']['input'];
};


export type QueryExportEventTicketsArgs = {
  _id: Scalars['MongoID']['input'];
  checked_in?: InputMaybe<Scalars['Boolean']['input']>;
  pagination?: InputMaybe<PaginationInput>;
  search_text?: InputMaybe<Scalars['String']['input']>;
  ticket_type_ids?: InputMaybe<Array<Scalars['MongoID']['input']>>;
};


export type QueryGenerateClaimCheckinRewardSignatureArgs = {
  event: Scalars['MongoID']['input'];
};


export type QueryGenerateClaimTicketRewardSignatureArgs = {
  event: Scalars['MongoID']['input'];
  payment?: InputMaybe<Scalars['MongoID']['input']>;
};


export type QueryGenerateEventInvitationUrlArgs = {
  event: Scalars['MongoID']['input'];
};


export type QueryGenerateRecurringDatesArgs = {
  input: GenerateRecurringDatesInput;
};


export type QueryGenerateSlashPaymentSignatureArgs = {
  event: Scalars['MongoID']['input'];
  paymentIds: Array<Scalars['MongoID']['input']>;
};


export type QueryGetApplicantsInfoArgs = {
  emails?: InputMaybe<Array<Scalars['String']['input']>>;
  event: Scalars['MongoID']['input'];
  users?: InputMaybe<Array<Scalars['MongoID']['input']>>;
};


export type QueryGetBadgeCitiesArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type QueryGetBadgeListsArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<Scalars['MongoID']['input']>;
};


export type QueryGetBadgesArgs = {
  _id?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  distance?: InputMaybe<Scalars['Float']['input']>;
  limit?: Scalars['Int']['input'];
  list?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  skip?: Scalars['Int']['input'];
};


export type QueryGetBroadcastsArgs = {
  provider: BroadcastProvider;
};


export type QueryGetCommentsArgs = {
  input: GetCommentsArgs;
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type QueryGetConfigsArgs = {
  keys: Array<Scalars['String']['input']>;
};


export type QueryGetEventArgs = {
  _id?: InputMaybe<Scalars['MongoID']['input']>;
  shortid?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetEventApplicationAnswersArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  event: Scalars['MongoID']['input'];
  user?: InputMaybe<Scalars['MongoID']['input']>;
};


export type QueryGetEventAttestationArgs = {
  chain_id: Scalars['String']['input'];
  event: Scalars['MongoID']['input'];
};


export type QueryGetEventAttestationDiffArgs = {
  chain_id: Scalars['String']['input'];
  event: Scalars['MongoID']['input'];
};


export type QueryGetEventCheckinChartDataArgs = {
  end: Scalars['DateTimeISO']['input'];
  event: Scalars['MongoID']['input'];
  start: Scalars['DateTimeISO']['input'];
};


export type QueryGetEventCheckinsArgs = {
  input: GetEventCheckinsInput;
};


export type QueryGetEventCohostInvitesArgs = {
  input: GetEventCohostRequestsInput;
};


export type QueryGetEventCohostRequestsArgs = {
  input: GetEventCohostRequestsInput;
};


export type QueryGetEventCurrenciesArgs = {
  _id: Scalars['MongoID']['input'];
  used?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryGetEventEmailSettingArgs = {
  _id: Scalars['MongoID']['input'];
};


export type QueryGetEventFeedbackSummaryArgs = {
  event: Scalars['MongoID']['input'];
};


export type QueryGetEventGuestDetailArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  event: Scalars['MongoID']['input'];
  user?: InputMaybe<Scalars['MongoID']['input']>;
};


export type QueryGetEventGuestDetailedInfoArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  event: Scalars['MongoID']['input'];
  user?: InputMaybe<Scalars['MongoID']['input']>;
};


export type QueryGetEventGuestDirectoryArgs = {
  _id: Scalars['MongoID']['input'];
};


export type QueryGetEventGuestsStatisticsArgs = {
  event: Scalars['MongoID']['input'];
};


export type QueryGetEventInvitationArgs = {
  event: Scalars['MongoID']['input'];
};


export type QueryGetEventInvitationUrlArgs = {
  shortid: Scalars['String']['input'];
  tk?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetEventInvitedStatisticsArgs = {
  _id: Scalars['MongoID']['input'];
  limit?: InputMaybe<Scalars['Float']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  statuses?: InputMaybe<Array<InvitationResponse>>;
};


export type QueryGetEventJoinRequestArgs = {
  _id: Scalars['MongoID']['input'];
  event: Scalars['MongoID']['input'];
};


export type QueryGetEventJoinRequestStateStatisticArgs = {
  event: Scalars['MongoID']['input'];
};


export type QueryGetEventJoinRequestsArgs = {
  event: Scalars['MongoID']['input'];
  limit?: Scalars['Int']['input'];
  payment_expired?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  skip?: Scalars['Int']['input'];
  state?: InputMaybe<EventJoinRequestState>;
};


export type QueryGetEventLatestViewsArgs = {
  event: Scalars['MongoID']['input'];
  limit: Scalars['Int']['input'];
};


export type QueryGetEventPaymentArgs = {
  _id: Scalars['MongoID']['input'];
  event: Scalars['MongoID']['input'];
};


export type QueryGetEventPaymentStatisticsArgs = {
  event: Scalars['MongoID']['input'];
};


export type QueryGetEventPaymentSummaryArgs = {
  event: Scalars['MongoID']['input'];
};


export type QueryGetEventQuestionsArgs = {
  input: GetEventQuestionsInput;
};


export type QueryGetEventRewardUsesArgs = {
  input: GetEventRewardUsesInput;
};


export type QueryGetEventSessionReservationSummaryArgs = {
  input: GetEventSessionReservationSummaryInput;
};


export type QueryGetEventSessionReservationsArgs = {
  input?: InputMaybe<GetEventSessionReservationsInput>;
};


export type QueryGetEventTagsArgs = {
  all?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryGetEventTicketCategoriesArgs = {
  event: Scalars['MongoID']['input'];
};


export type QueryGetEventTicketSalesArgs = {
  event: Scalars['MongoID']['input'];
};


export type QueryGetEventTicketSoldChartDataArgs = {
  end: Scalars['DateTimeISO']['input'];
  event: Scalars['MongoID']['input'];
  start: Scalars['DateTimeISO']['input'];
  types?: InputMaybe<Array<Scalars['MongoID']['input']>>;
};


export type QueryGetEventTicketTypesArgs = {
  input: GetEventTicketTypesInput;
};


export type QueryGetEventTopInvitersArgs = {
  event: Scalars['MongoID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetEventTopViewsArgs = {
  city_limit: Scalars['Int']['input'];
  event: Scalars['MongoID']['input'];
  source_limit: Scalars['Int']['input'];
};


export type QueryGetEventViewChartDataArgs = {
  end: Scalars['DateTimeISO']['input'];
  event: Scalars['MongoID']['input'];
  start: Scalars['DateTimeISO']['input'];
};


export type QueryGetEventViewStatsArgs = {
  event: Scalars['MongoID']['input'];
  ranges: Array<DateRangeInput>;
};


export type QueryGetEventbriteEventsArgs = {
  input?: InputMaybe<GetEventbriteEventsInput>;
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type QueryGetEventsArgs = {
  _id?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  accepted?: InputMaybe<Scalars['MongoID']['input']>;
  end_from?: InputMaybe<Scalars['DateTimeISO']['input']>;
  end_to?: InputMaybe<Scalars['DateTimeISO']['input']>;
  highlight?: InputMaybe<Scalars['Boolean']['input']>;
  host_filter?: InputMaybe<HostFilter>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  site?: InputMaybe<Scalars['MongoID']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<EventSortInput>;
  space?: InputMaybe<Scalars['MongoID']['input']>;
  space_tags?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  start_from?: InputMaybe<Scalars['DateTimeISO']['input']>;
  start_to?: InputMaybe<Scalars['DateTimeISO']['input']>;
  subevent_parent?: InputMaybe<Scalars['MongoID']['input']>;
  unpublished?: InputMaybe<Scalars['Boolean']['input']>;
  with_unpublished?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryGetFilesArgs = {
  id_lt?: InputMaybe<Scalars['MongoID']['input']>;
  limit?: Scalars['Int']['input'];
  links?: InputMaybe<FileLinkInput>;
  skip?: Scalars['Int']['input'];
  user?: InputMaybe<Scalars['MongoID']['input']>;
};


export type QueryGetFrequentQuestionsArgs = {
  input: GetFrequentQuestionsInput;
};


export type QueryGetHomeEventsArgs = {
  latitude?: InputMaybe<Scalars['Float']['input']>;
  limit?: Scalars['Int']['input'];
  longitude?: InputMaybe<Scalars['Float']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  search_range?: InputMaybe<Scalars['Float']['input']>;
  skip?: Scalars['Int']['input'];
  tense?: InputMaybe<EventTense>;
};


export type QueryGetHostingEventsArgs = {
  draft?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: Scalars['Int']['input'];
  site?: InputMaybe<Scalars['MongoID']['input']>;
  skip?: Scalars['Int']['input'];
  sort?: InputMaybe<Scalars['JSON']['input']>;
  state?: InputMaybe<FilterEventInput>;
  user?: InputMaybe<Scalars['MongoID']['input']>;
};


export type QueryGetInitSafeTransactionArgs = {
  input: GetInitSafeTransactionInput;
};


export type QueryGetLemonheadInvitationRankArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type QueryGetLemonheadSupportDataArgs = {
  type: LemonheadSupportDataType;
};


export type QueryGetMyEventJoinRequestArgs = {
  event: Scalars['MongoID']['input'];
};


export type QueryGetMyEventsArgs = {
  draft?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
  state?: InputMaybe<GetEventsState>;
  subevent_parent?: InputMaybe<Scalars['MongoID']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryGetMyPaymentsArgs = {
  event?: InputMaybe<Scalars['MongoID']['input']>;
  state?: InputMaybe<FilterPaymentStateInput>;
};


export type QueryGetMyPointsArgs = {
  first_level_group?: InputMaybe<Scalars['MongoID']['input']>;
  second_level_group?: InputMaybe<Scalars['MongoID']['input']>;
};


export type QueryGetMySpaceEventRequestsArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
  space: Scalars['MongoID']['input'];
  state?: InputMaybe<EventJoinRequestState>;
};


export type QueryGetMyTicketsArgs = {
  event: Scalars['MongoID']['input'];
  with_payment_info?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryGetNewPaymentArgs = {
  _id: Scalars['MongoID']['input'];
  payment_secret?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetNewsfeedArgs = {
  offset?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryGetNotificationsArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
  type?: InputMaybe<NotificationTypeFilterInput>;
};


export type QueryGetOffersArgs = {
  type: OfferType;
};


export type QueryGetPastEventsArgs = {
  host?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: Scalars['Int']['input'];
  site?: InputMaybe<Scalars['MongoID']['input']>;
  skip?: Scalars['Int']['input'];
  sort?: InputMaybe<Scalars['JSON']['input']>;
  space?: InputMaybe<Scalars['MongoID']['input']>;
  unpublished?: InputMaybe<Scalars['Boolean']['input']>;
  user?: InputMaybe<Scalars['MongoID']['input']>;
};


export type QueryGetPaymentRefundSignatureArgs = {
  _id: Scalars['MongoID']['input'];
};


export type QueryGetPoapDropInfoByIdArgs = {
  id: Scalars['Float']['input'];
};


export type QueryGetPointGroupsArgs = {
  with_count?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryGetPostsArgs = {
  input?: InputMaybe<GetPostsInput>;
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type QueryGetProfileEventsArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
  user?: InputMaybe<Scalars['MongoID']['input']>;
};


export type QueryGetRecommendedUsersArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type QueryGetRoomArgs = {
  _id: Scalars['MongoID']['input'];
};


export type QueryGetRoomCredentialsArgs = {
  input: GetRoomCredentialsInput;
};


export type QueryGetRoomsArgs = {
  input: GetRoomsInput;
};


export type QueryGetSafeFreeLimitArgs = {
  network: Scalars['String']['input'];
};


export type QueryGetSelfVerificationStatusArgs = {
  config: SelfVerificationConfigInput;
};


export type QueryGetSitesArgs = {
  _id?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  active?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type QueryGetSpaceArgs = {
  _id?: InputMaybe<Scalars['MongoID']['input']>;
  hostname?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetSpaceEventLocationsLeaderboardArgs = {
  city?: InputMaybe<Scalars['Boolean']['input']>;
  limit: Scalars['Float']['input'];
  space: Scalars['MongoID']['input'];
};


export type QueryGetSpaceEventRequestsArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
  space: Scalars['MongoID']['input'];
  state?: InputMaybe<EventJoinRequestState>;
};


export type QueryGetSpaceEventSummaryArgs = {
  space: Scalars['MongoID']['input'];
};


export type QueryGetSpaceEventsInsightArgs = {
  event_tense?: InputMaybe<EventTense>;
  irl_event?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  skip?: Scalars['Int']['input'];
  sort?: InputMaybe<SortInput>;
  space: Scalars['MongoID']['input'];
  virtual_event?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryGetSpaceMemberArgs = {
  _id?: InputMaybe<Scalars['MongoID']['input']>;
  space: Scalars['MongoID']['input'];
  user?: InputMaybe<Scalars['MongoID']['input']>;
};


export type QueryGetSpaceMemberAmountByDateArgs = {
  end: Scalars['DateTimeISO']['input'];
  role: SpaceRole;
  space: Scalars['MongoID']['input'];
  start: Scalars['DateTimeISO']['input'];
};


export type QueryGetSpaceMemberAttendedEventsArgs = {
  _id: Scalars['MongoID']['input'];
  space: Scalars['MongoID']['input'];
};


export type QueryGetSpaceMemberHostedEventsArgs = {
  _id: Scalars['MongoID']['input'];
  space: Scalars['MongoID']['input'];
};


export type QueryGetSpaceMemberSubmittedEventsArgs = {
  _id: Scalars['MongoID']['input'];
  space: Scalars['MongoID']['input'];
};


export type QueryGetSpaceMembersLeaderboardArgs = {
  limit?: Scalars['Int']['input'];
  roles?: InputMaybe<Array<SpaceRole>>;
  search?: InputMaybe<Scalars['String']['input']>;
  skip?: Scalars['Int']['input'];
  sort?: InputMaybe<SortInput>;
  space: Scalars['MongoID']['input'];
};


export type QueryGetSpaceNewsletterArgs = {
  _id: Scalars['MongoID']['input'];
  space: Scalars['MongoID']['input'];
};


export type QueryGetSpaceNewsletterStatisticsArgs = {
  space: Scalars['MongoID']['input'];
};


export type QueryGetSpaceRewardSettingClaimsArgs = {
  setting: Scalars['MongoID']['input'];
  space: Scalars['MongoID']['input'];
  type: ClaimType;
};


export type QueryGetSpaceRewardStatisticsArgs = {
  space: Scalars['MongoID']['input'];
};


export type QueryGetSpaceSendingQuotaArgs = {
  space: Scalars['MongoID']['input'];
};


export type QueryGetSpaceStatisticsArgs = {
  space: Scalars['MongoID']['input'];
};


export type QueryGetSpaceVerificationSubmissionArgs = {
  space: Scalars['MongoID']['input'];
};


export type QueryGetStakePaymentStatisticsArgs = {
  event: Scalars['MongoID']['input'];
};


export type QueryGetStoreArgs = {
  _id?: InputMaybe<Scalars['MongoID']['input']>;
  promotion?: InputMaybe<Scalars['MongoID']['input']>;
};


export type QueryGetStoreBucketItemsArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type QueryGetStoreCategoriesArgs = {
  limit?: Scalars['Int']['input'];
  parents?: InputMaybe<Scalars['MongoID']['input']>;
  skip?: Scalars['Int']['input'];
  store?: InputMaybe<Scalars['MongoID']['input']>;
};


export type QueryGetStoreCategoryArgs = {
  _id: Scalars['MongoID']['input'];
};


export type QueryGetStoreDeliveryOptionsArgs = {
  address: AddressInput;
  store: Scalars['MongoID']['input'];
};


export type QueryGetStoreOrderArgs = {
  _id: Scalars['MongoID']['input'];
};


export type QueryGetStoreOrdersArgs = {
  limit?: Scalars['Int']['input'];
  place_reservation?: InputMaybe<Scalars['MongoID']['input']>;
  skip?: Scalars['Int']['input'];
  state?: InputMaybe<StoreOrderStateFilterInput>;
  store?: InputMaybe<Scalars['MongoID']['input']>;
};


export type QueryGetStoreProductArgs = {
  _id: Scalars['MongoID']['input'];
};


export type QueryGetStoreProductsArgs = {
  categories?: InputMaybe<Scalars['MongoID']['input']>;
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
  store?: InputMaybe<Scalars['MongoID']['input']>;
};


export type QueryGetStoreSalesTaxArgs = {
  address: AddressInput;
  store: Scalars['MongoID']['input'];
};


export type QueryGetStoresArgs = {
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  limit?: Scalars['Int']['input'];
  longitude?: InputMaybe<Scalars['Float']['input']>;
  postal?: InputMaybe<Scalars['String']['input']>;
  region?: InputMaybe<Scalars['String']['input']>;
  skip?: Scalars['Int']['input'];
  tags?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<Scalars['MongoID']['input']>;
};


export type QueryGetStripeCardsArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type QueryGetStripeTransferDetailArgs = {
  _id: Scalars['MongoID']['input'];
};


export type QueryGetSubSpacesArgs = {
  _id: Scalars['MongoID']['input'];
};


export type QueryGetSystemFilesArgs = {
  categories?: InputMaybe<Array<FileCategory>>;
};


export type QueryGetTicketArgs = {
  shortid: Scalars['String']['input'];
};


export type QueryGetTicketStatisticsArgs = {
  id: Scalars['MongoID']['input'];
};


export type QueryGetTicketsArgs = {
  _id?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  email?: InputMaybe<Scalars['String']['input']>;
  event?: InputMaybe<Scalars['MongoID']['input']>;
  limit?: Scalars['Int']['input'];
  payment?: InputMaybe<Scalars['MongoID']['input']>;
  skip?: Scalars['Int']['input'];
  ticket_types?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  user?: InputMaybe<Scalars['MongoID']['input']>;
};


export type QueryGetTopSpaceEventAttendeesArgs = {
  limit: Scalars['Float']['input'];
  space: Scalars['MongoID']['input'];
};


export type QueryGetTopSpaceHostsArgs = {
  limit: Scalars['Float']['input'];
  space: Scalars['MongoID']['input'];
};


export type QueryGetUpcomingEventsArgs = {
  host?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  site?: InputMaybe<Scalars['MongoID']['input']>;
  skip?: Scalars['Int']['input'];
  sort?: InputMaybe<Scalars['JSON']['input']>;
  space?: InputMaybe<Scalars['MongoID']['input']>;
  unpublished?: InputMaybe<Scalars['Boolean']['input']>;
  user?: InputMaybe<Scalars['MongoID']['input']>;
};


export type QueryGetUserArgs = {
  _id?: InputMaybe<Scalars['MongoID']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  lens_profile_id?: InputMaybe<Scalars['String']['input']>;
  matrix_localpart?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetUserContactsArgs = {
  input?: InputMaybe<GetUserContactsInput>;
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type QueryGetUserDiscoveryArgs = {
  event?: InputMaybe<Scalars['MongoID']['input']>;
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  offerings?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  search_range?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryGetUserDiscoverySwipesArgs = {
  incoming?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: Scalars['Int']['input'];
  other_wallets?: InputMaybe<Scalars['Boolean']['input']>;
  skip?: Scalars['Int']['input'];
  state?: InputMaybe<UserDiscoverySwipeState>;
};


export type QueryGetUserFollowsArgs = {
  input: GetUserFollowsInput;
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type QueryGetUserFriendshipsArgs = {
  input?: InputMaybe<GetUserFriendshipsInput>;
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type QueryGetUserFromUserMigrationArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetUserWalletRequestArgs = {
  wallet: Scalars['String']['input'];
};


export type QueryGetUsersArgs = {
  _id?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  limit?: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  skip?: Scalars['Int']['input'];
  tag_recommended?: InputMaybe<Scalars['Boolean']['input']>;
  wallets?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryGetVaultSaltArgs = {
  name: Scalars['String']['input'];
  type: Scalars['String']['input'];
};


export type QueryIsUsernameAvailableArgs = {
  username: Scalars['String']['input'];
  wallet: Scalars['String']['input'];
};


export type QueryJoinChannelArgs = {
  event_ids: Scalars['MongoID']['input'];
};


export type QueryListCheckinTokenRewardSettingsArgs = {
  event: Scalars['MongoID']['input'];
  ticket_types?: InputMaybe<Array<Scalars['MongoID']['input']>>;
};


export type QueryListDonationsArgs = {
  event: Scalars['MongoID']['input'];
  from_emails?: InputMaybe<Array<Scalars['String']['input']>>;
  from_users?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  networks?: InputMaybe<Array<Scalars['String']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortOrder>;
  vaults?: InputMaybe<Array<Scalars['MongoID']['input']>>;
};


export type QueryListEventEmailSettingsArgs = {
  event: Scalars['MongoID']['input'];
  scheduled?: InputMaybe<Scalars['Boolean']['input']>;
  sent?: InputMaybe<Scalars['Boolean']['input']>;
  system?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryListEventFeedBacksArgs = {
  event: Scalars['MongoID']['input'];
  limit?: Scalars['Int']['input'];
  rate_value?: InputMaybe<Scalars['Float']['input']>;
  skip?: Scalars['Int']['input'];
};


export type QueryListEventFeedbacksNewArgs = {
  event: Scalars['MongoID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  rate_value?: InputMaybe<Scalars['Float']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryListEventGuestsArgs = {
  checked_in?: InputMaybe<Scalars['Boolean']['input']>;
  declined?: InputMaybe<Scalars['Boolean']['input']>;
  event: Scalars['MongoID']['input'];
  going?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  pending_approval?: InputMaybe<Scalars['Boolean']['input']>;
  pending_invite?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort_by?: InputMaybe<ListEventGuestsSortBy>;
  sort_order?: InputMaybe<SortOrder>;
  ticket_types?: InputMaybe<Array<Scalars['MongoID']['input']>>;
};


export type QueryListEventHostsArgs = {
  limit?: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  skip?: Scalars['Int']['input'];
};


export type QueryListEventPaymentsArgs = {
  checked_in?: InputMaybe<Scalars['Boolean']['input']>;
  event: Scalars['MongoID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  networks?: InputMaybe<Array<Scalars['String']['input']>>;
  provider?: InputMaybe<NewPaymentProvider>;
  search?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  ticket_types?: InputMaybe<Array<Scalars['MongoID']['input']>>;
};


export type QueryListEventStakePaymentsArgs = {
  event: Scalars['MongoID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  networks?: InputMaybe<Array<Scalars['String']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryListEventTicketTypesArgs = {
  event: Scalars['MongoID']['input'];
};


export type QueryListEventTokenGatesArgs = {
  event: Scalars['MongoID']['input'];
  networks?: InputMaybe<Array<Scalars['String']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
  ticket_types?: InputMaybe<Array<Scalars['MongoID']['input']>>;
};


export type QueryListEventVotingsArgs = {
  event: Scalars['MongoID']['input'];
  hidden?: InputMaybe<Scalars['Boolean']['input']>;
  votings?: InputMaybe<Array<Scalars['MongoID']['input']>>;
};


export type QueryListLaunchpadCoinsArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryListLaunchpadGroupsArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  space?: InputMaybe<Scalars['MongoID']['input']>;
};


export type QueryListLemonheadSponsorsArgs = {
  wallet: Scalars['String']['input'];
};


export type QueryListMyPoapClaimsArgs = {
  event?: InputMaybe<Scalars['MongoID']['input']>;
};


export type QueryListMySpacesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryListNewPaymentAccountsArgs = {
  _id?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  limit?: Scalars['Int']['input'];
  provider?: InputMaybe<NewPaymentProvider>;
  skip?: Scalars['Int']['input'];
  type?: InputMaybe<PaymentAccountType>;
};


export type QueryListNewPaymentsArgs = {
  event: Scalars['MongoID']['input'];
  ids?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
  users?: InputMaybe<Array<Scalars['MongoID']['input']>>;
};


export type QueryListOauth2ClientsArgs = {
  ids?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryListPassportSponsorsArgs = {
  provider: PassportProvider;
  wallet: Scalars['String']['input'];
};


export type QueryListPoapDropsArgs = {
  event: Scalars['MongoID']['input'];
};


export type QueryListSpaceMembersArgs = {
  deletion?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  roles?: InputMaybe<Array<SpaceRole>>;
  search?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortInput>;
  space: Scalars['MongoID']['input'];
  state?: InputMaybe<SpaceMembershipState>;
  tags?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  visible?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryListSpaceNfTsArgs = {
  kind?: InputMaybe<SpaceNftKind>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  space?: InputMaybe<Scalars['MongoID']['input']>;
};


export type QueryListSpaceNewslettersArgs = {
  draft?: InputMaybe<Scalars['Boolean']['input']>;
  scheduled?: InputMaybe<Scalars['Boolean']['input']>;
  sent?: InputMaybe<Scalars['Boolean']['input']>;
  space: Scalars['MongoID']['input'];
};


export type QueryListSpaceRewardSettingsArgs = {
  space: Scalars['MongoID']['input'];
  vaults?: InputMaybe<Array<Scalars['MongoID']['input']>>;
};


export type QueryListSpaceRewardVaultsArgs = {
  space: Scalars['MongoID']['input'];
};


export type QueryListSpaceRoleFeaturesArgs = {
  role: SpaceRole;
  space: Scalars['MongoID']['input'];
};


export type QueryListSpaceTagsArgs = {
  space: Scalars['MongoID']['input'];
  type?: InputMaybe<SpaceTagType>;
};


export type QueryListSpaceTokenGatesArgs = {
  space: Scalars['MongoID']['input'];
};


export type QueryListSpaceTokenRewardClaimsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<ListSpaceTokenRewardClaimsSortInput>;
  space: Scalars['MongoID']['input'];
  vaults?: InputMaybe<Array<Scalars['MongoID']['input']>>;
};


export type QueryListSpacesArgs = {
  featured?: InputMaybe<Scalars['Boolean']['input']>;
  roles?: InputMaybe<Array<SpaceRole>>;
  with_my_spaces?: InputMaybe<Scalars['Boolean']['input']>;
  with_public_spaces?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryListTicketTokenRewardSettingsArgs = {
  event: Scalars['MongoID']['input'];
  ticket_types?: InputMaybe<Array<Scalars['MongoID']['input']>>;
};


export type QueryPeekEventGuestsArgs = {
  _id: Scalars['MongoID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPreviewUpdateSubscriptionArgs = {
  _id: Scalars['MongoID']['input'];
  input: UpdateSubscriptionInput;
};


export type QuerySearchSpacesArgs = {
  input?: InputMaybe<SearchSpaceInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySearchUsersArgs = {
  query: Scalars['String']['input'];
};


export type QueryTgGetMyChannelsArgs = {
  input: ScanChannelsInput;
};

export type QuestionInput = {
  _id?: InputMaybe<Scalars['MongoID']['input']>;
  options?: InputMaybe<Array<Scalars['String']['input']>>;
  position?: InputMaybe<Scalars['Int']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
  questions?: InputMaybe<Array<Scalars['String']['input']>>;
  required?: InputMaybe<Scalars['Boolean']['input']>;
  select_type?: InputMaybe<SelectType>;
  type: QuestionType;
};

/** The type of the question in the event application question */
export enum QuestionType {
  Checkbox = 'checkbox',
  Company = 'company',
  Options = 'options',
  Text = 'text',
  Website = 'website'
}

export type RateSummary = {
  __typename?: 'RateSummary';
  count: Scalars['Int']['output'];
  rate_value: Scalars['Int']['output'];
};

export type RawTransaction = {
  __typename?: 'RawTransaction';
  data: Scalars['String']['output'];
  to: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type ReactionInput = {
  active: Scalars['Boolean']['input'];
  post: Scalars['MongoID']['input'];
};

export enum ReactionType {
  Like = 'LIKE',
  None = 'NONE',
  Recast = 'RECAST'
}

export type RecipientDetail = {
  __typename?: 'RecipientDetail';
  _id?: Maybe<Scalars['MongoID']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  image_avatar?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export enum RecurringRepeat {
  Daily = 'daily',
  Monthly = 'monthly',
  Weekly = 'weekly'
}

export type RedeemTicketsInput = {
  buyer_info?: InputMaybe<BuyerInfoInput>;
  /** The wallet address to check for token gating. The wallet must be one of the connected walets. */
  buyer_wallet?: InputMaybe<Scalars['String']['input']>;
  connect_wallets?: InputMaybe<Array<ConnectWalletInput>>;
  event: Scalars['MongoID']['input'];
  inviter?: InputMaybe<Scalars['MongoID']['input']>;
  items: Array<PurchasableItem>;
  /** Array of passcodes to verify against the ticket types */
  passcodes?: InputMaybe<Array<Scalars['String']['input']>>;
  /** In case the event requires application profile fields, this is used to call updateUser */
  user_info?: InputMaybe<UserInput>;
};

export type RedeemTicketsResponse = {
  __typename?: 'RedeemTicketsResponse';
  join_request?: Maybe<EventJoinRequest>;
  tickets?: Maybe<Array<Ticket>>;
};

export type RefundInfo = {
  __typename?: 'RefundInfo';
  available_amount: Scalars['String']['output'];
  refunded?: Maybe<Scalars['Boolean']['output']>;
};

export type RefundPolicy = {
  __typename?: 'RefundPolicy';
  percent: Scalars['Float']['output'];
  timestamp: Scalars['Float']['output'];
};

export type RefundRequirements = {
  __typename?: 'RefundRequirements';
  checkin_before?: Maybe<Scalars['DateTimeISO']['output']>;
};

export type Registration = {
  client: Scalars['String']['input'];
  consent_communications?: InputMaybe<Scalars['Boolean']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  first_name: Scalars['String']['input'];
  last_name: Scalars['String']['input'];
  organization?: InputMaybe<Scalars['String']['input']>;
  postal_code?: InputMaybe<Scalars['String']['input']>;
};

export type RelayPaymentInfo = {
  __typename?: 'RelayPaymentInfo';
  payment_splitter_contract: Scalars['String']['output'];
};

export type ReorderTicketTypeCategoryInput = {
  _id: Scalars['MongoID']['input'];
  position?: InputMaybe<Scalars['Int']['input']>;
};

export type ReorderTicketTypeInput = {
  _id: Scalars['MongoID']['input'];
  position?: InputMaybe<Scalars['Int']['input']>;
};

export type ReportUserInput = {
  block?: InputMaybe<Scalars['Boolean']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
  user: Scalars['MongoID']['input'];
};

export type RequestRoomStageInput = {
  _id: Scalars['MongoID']['input'];
  user: Scalars['MongoID']['input'];
};

export type RequestedTicket = {
  __typename?: 'RequestedTicket';
  count: Scalars['Float']['output'];
  ticket_type: Scalars['MongoID']['output'];
};

export type RespondInvitationInput = {
  _id: Scalars['MongoID']['input'];
  response: InvitationResponse;
};

export type ResponseInvitationInput = {
  _id: Scalars['MongoID']['input'];
  action: InvitationState;
};

export type RewardToken = {
  __typename?: 'RewardToken';
  address: Scalars['String']['output'];
  decimals: Scalars['Int']['output'];
  icon?: Maybe<Scalars['MongoID']['output']>;
  icon_expanded?: Maybe<File>;
  icon_url?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  symbol: Scalars['String']['output'];
};

export type RewardTokenInput = {
  address: Scalars['String']['input'];
  decimals: Scalars['Int']['input'];
  icon?: InputMaybe<Scalars['MongoID']['input']>;
  icon_url?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  symbol: Scalars['String']['input'];
};

export type RewindUserDiscoveryResponse = {
  __typename?: 'RewindUserDiscoveryResponse';
  decision: UserDiscoverySwipeDecision;
  user?: Maybe<User>;
};

export type Room = {
  __typename?: 'Room';
  _id: Scalars['MongoID']['output'];
  access_requesters?: Maybe<Array<Scalars['MongoID']['output']>>;
  access_requesters_expanded?: Maybe<Array<User>>;
  access_users?: Maybe<Array<Scalars['MongoID']['output']>>;
  access_users_expanded?: Maybe<Array<User>>;
  active: Scalars['Boolean']['output'];
  attending_users?: Maybe<Array<Scalars['MongoID']['output']>>;
  attending_users_expanded?: Maybe<Array<User>>;
  audience_size?: Maybe<Scalars['Float']['output']>;
  audience_total?: Maybe<Scalars['Float']['output']>;
  broadcasters_count?: Maybe<Scalars['Float']['output']>;
  cohosts?: Maybe<Array<Scalars['MongoID']['output']>>;
  cohosts_expanded?: Maybe<Array<Maybe<User>>>;
  creator_last_seen_at?: Maybe<Scalars['DateTimeISO']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  event?: Maybe<Scalars['MongoID']['output']>;
  event_expanded?: Maybe<Event>;
  has_access?: Maybe<Scalars['Boolean']['output']>;
  highlight_events?: Maybe<Array<Scalars['MongoID']['output']>>;
  highlight_events_expanded?: Maybe<Array<Event>>;
  highlight_rooms?: Maybe<Array<Scalars['MongoID']['output']>>;
  highlight_rooms_expanded?: Maybe<Array<Room>>;
  highlight_stores?: Maybe<Array<Scalars['MongoID']['output']>>;
  highlight_stores_expanded?: Maybe<Array<Store>>;
  highlight_users?: Maybe<Array<Scalars['MongoID']['output']>>;
  highlight_users_expanded?: Maybe<Array<User>>;
  host: Scalars['MongoID']['output'];
  host_expanded?: Maybe<User>;
  offers?: Maybe<Array<RoomOffer>>;
  payment_direct?: Maybe<Scalars['Boolean']['output']>;
  photos?: Maybe<Array<Scalars['MongoID']['output']>>;
  photos_expanded?: Maybe<Array<File>>;
  private?: Maybe<Scalars['Boolean']['output']>;
  shortid: Scalars['String']['output'];
  stage_invitees?: Maybe<Array<Scalars['MongoID']['output']>>;
  stage_invitees_expanded?: Maybe<Array<User>>;
  stage_open?: Maybe<Scalars['Boolean']['output']>;
  stage_requesters?: Maybe<Array<Scalars['MongoID']['output']>>;
  stage_requesters_expanded?: Maybe<Array<User>>;
  staged_size?: Maybe<Scalars['Float']['output']>;
  staged_uids?: Maybe<Array<Scalars['Float']['output']>>;
  staged_users?: Maybe<Array<Scalars['MongoID']['output']>>;
  staged_users_expanded?: Maybe<Array<User>>;
  stamp: Scalars['DateTimeISO']['output'];
  start: Scalars['DateTimeISO']['output'];
  state: RoomState;
  theme_background_photo?: Maybe<Scalars['MongoID']['output']>;
  theme_background_photo_expanded?: Maybe<File>;
  theme_color?: Maybe<Scalars['String']['output']>;
  theme_layout?: Maybe<Scalars['Float']['output']>;
  title: Scalars['String']['output'];
  url: Scalars['String']['output'];
  url_go: Scalars['String']['output'];
  used?: Maybe<Scalars['Boolean']['output']>;
  verify?: Maybe<Scalars['Boolean']['output']>;
  video?: Maybe<Video>;
};


export type RoomAccess_Requesters_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type RoomAccess_Users_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type RoomAttending_Users_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type RoomCohosts_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type RoomHighlight_Events_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type RoomHighlight_Rooms_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type RoomHighlight_Stores_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type RoomHighlight_Users_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type RoomPhotos_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type RoomStage_Invitees_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type RoomStage_Requesters_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type RoomStaged_Users_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};

export type RoomActionPayload = RoomActionPayload_AccessRequestDecided | RoomActionPayload_AccessRequested | RoomActionPayload_AttendingUsersModified | RoomActionPayload_Notify | RoomActionPayload_Renew | RoomActionPayload_StageInvited | RoomActionPayload_StageModified | RoomActionPayload_StageRequestDecided | RoomActionPayload_StageRequested;

export type RoomActionPayload_AccessRequestDecided = {
  __typename?: 'RoomActionPayload_AccessRequestDecided';
  user: Scalars['MongoID']['output'];
};

export type RoomActionPayload_AccessRequested = {
  __typename?: 'RoomActionPayload_AccessRequested';
  message: Scalars['String']['output'];
  user: Scalars['MongoID']['output'];
  user_expanded: RoomUser;
};

export type RoomActionPayload_AttendingUsersModified = {
  __typename?: 'RoomActionPayload_AttendingUsersModified';
  attending: Scalars['Boolean']['output'];
  user: Scalars['MongoID']['output'];
  user_expanded: RoomUser;
};

export type RoomActionPayload_Notify = {
  __typename?: 'RoomActionPayload_Notify';
  message: Scalars['String']['output'];
};

export type RoomActionPayload_Renew = {
  __typename?: 'RoomActionPayload_Renew';
  credentials: RoomCredentials;
};

export type RoomActionPayload_StageInvited = {
  __typename?: 'RoomActionPayload_StageInvited';
  message: Scalars['String']['output'];
  requested?: Maybe<Scalars['Boolean']['output']>;
  user: Scalars['MongoID']['output'];
  user_expanded: RoomUser;
};

export type RoomActionPayload_StageModified = {
  __typename?: 'RoomActionPayload_StageModified';
  staged: Scalars['Boolean']['output'];
  uid: Scalars['Float']['output'];
  user: Scalars['MongoID']['output'];
};

export type RoomActionPayload_StageRequestDecided = {
  __typename?: 'RoomActionPayload_StageRequestDecided';
  user: Scalars['MongoID']['output'];
};

export type RoomActionPayload_StageRequested = {
  __typename?: 'RoomActionPayload_StageRequested';
  message: Scalars['String']['output'];
  user: Scalars['MongoID']['output'];
  user_expanded: RoomUser;
};

export type RoomCredentials = {
  __typename?: 'RoomCredentials';
  token: Scalars['String']['output'];
  uid: Scalars['Float']['output'];
};

export type RoomInput = {
  access_users?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  active?: InputMaybe<Scalars['Boolean']['input']>;
  cohosts?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  event?: InputMaybe<Scalars['MongoID']['input']>;
  highlight_events?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  highlight_rooms?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  highlight_stores?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  highlight_users?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  offers?: InputMaybe<Array<RoomOfferInput>>;
  payment_direct?: InputMaybe<Scalars['Boolean']['input']>;
  photos?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  private?: InputMaybe<Scalars['Boolean']['input']>;
  stage_open?: InputMaybe<Scalars['Boolean']['input']>;
  start?: InputMaybe<Scalars['DateTimeISO']['input']>;
  state?: InputMaybe<RoomState>;
  theme_background_photo?: InputMaybe<Scalars['MongoID']['input']>;
  theme_color?: InputMaybe<Scalars['String']['input']>;
  theme_layout?: InputMaybe<Scalars['Float']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  verify?: InputMaybe<Scalars['Boolean']['input']>;
  video?: InputMaybe<VideoInput>;
};

export type RoomOffer = {
  __typename?: 'RoomOffer';
  _id?: Maybe<Scalars['MongoID']['output']>;
  position?: Maybe<Scalars['Float']['output']>;
  provider: OfferProvider;
  provider_id: Scalars['String']['output'];
  provider_network: Scalars['String']['output'];
};

export type RoomOfferInput = {
  _id?: InputMaybe<Scalars['MongoID']['input']>;
  position?: InputMaybe<Scalars['Float']['input']>;
  provider?: InputMaybe<OfferProvider>;
  provider_id?: InputMaybe<Scalars['String']['input']>;
  provider_network?: InputMaybe<Scalars['String']['input']>;
};

export enum RoomState {
  Ended = 'ended',
  Scheduled = 'scheduled',
  Started = 'started'
}

export type RoomUser = {
  __typename?: 'RoomUser';
  _id: Scalars['MongoID']['output'];
  image_avatar?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export type SafeAccount = {
  __typename?: 'SafeAccount';
  address: Scalars['String']['output'];
  currencies: Array<Scalars['String']['output']>;
  currency_map?: Maybe<Scalars['JSON']['output']>;
  network: Scalars['String']['output'];
  owners: Array<Scalars['String']['output']>;
  pending?: Maybe<Scalars['Boolean']['output']>;
  threshold: Scalars['Float']['output'];
};

export type SaleAmountResponse = {
  __typename?: 'SaleAmountResponse';
  amount: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  decimals: Scalars['Int']['output'];
};

export type SalesTax = {
  __typename?: 'SalesTax';
  _id: Scalars['MongoID']['output'];
  countries?: Maybe<Array<Scalars['String']['output']>>;
  flat_map?: Maybe<Scalars['JSON']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  ratio_map?: Maybe<Scalars['JSON']['output']>;
  regions?: Maybe<Array<Scalars['String']['output']>>;
  type: SalesTaxType;
};

export type SalesTaxInput = {
  _id: Scalars['MongoID']['input'];
  countries?: InputMaybe<Array<Scalars['String']['input']>>;
  flat_map?: InputMaybe<Scalars['JSON']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  ratio_map?: InputMaybe<Scalars['JSON']['input']>;
  regions?: InputMaybe<Array<Scalars['String']['input']>>;
  type: SalesTaxType;
};

export enum SalesTaxType {
  Country = 'country',
  Region = 'region',
  Worldwide = 'worldwide'
}

export type ScanChannelsInput = {
  offset_date: Scalars['Float']['input'];
  offset_id: Scalars['Float']['input'];
};

export type ScanChannelsResult = {
  __typename?: 'ScanChannelsResult';
  channels?: Maybe<Array<TelegramChannel>>;
  offset_date: Scalars['Float']['output'];
  offset_id: Scalars['Float']['output'];
  user?: Maybe<TgUser>;
};

export type SearchSpaceInput = {
  featured?: InputMaybe<Scalars['Boolean']['input']>;
  roles?: InputMaybe<Array<SpaceRole>>;
  user?: InputMaybe<Scalars['MongoID']['input']>;
  with_my_spaces?: InputMaybe<Scalars['Boolean']['input']>;
  with_public_spaces?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SearchSpacesResponse = {
  __typename?: 'SearchSpacesResponse';
  items: Array<Space>;
  total: Scalars['Int']['output'];
};

export type SelectDefaultLensProfileInput = {
  lens_profile_id: Scalars['String']['input'];
};

/** Select type for the question of type "options" */
export enum SelectType {
  Multi = 'multi',
  Single = 'single'
}

export type SelfDisclosureStatus = {
  __typename?: 'SelfDisclosureStatus';
  type: Scalars['String']['output'];
  verified: Scalars['Boolean']['output'];
};

export type SelfVerification = {
  __typename?: 'SelfVerification';
  config?: Maybe<SelfVerificationConfig>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
};

export type SelfVerificationConfig = {
  __typename?: 'SelfVerificationConfig';
  date_of_birth?: Maybe<Scalars['Boolean']['output']>;
  excludedCountries?: Maybe<Array<Scalars['String']['output']>>;
  expiry_date?: Maybe<Scalars['Boolean']['output']>;
  gender?: Maybe<Scalars['Boolean']['output']>;
  issuing_state?: Maybe<Scalars['Boolean']['output']>;
  minimumAge?: Maybe<Scalars['Float']['output']>;
  name?: Maybe<Scalars['Boolean']['output']>;
  nationality?: Maybe<Scalars['Boolean']['output']>;
  ofac?: Maybe<Scalars['Boolean']['output']>;
  passport_number?: Maybe<Scalars['Boolean']['output']>;
};

export type SelfVerificationConfigInput = {
  date_of_birth?: InputMaybe<Scalars['Boolean']['input']>;
  excludedCountries?: InputMaybe<Array<Scalars['String']['input']>>;
  expiry_date?: InputMaybe<Scalars['Boolean']['input']>;
  gender?: InputMaybe<Scalars['Boolean']['input']>;
  issuing_state?: InputMaybe<Scalars['Boolean']['input']>;
  minimumAge?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['Boolean']['input']>;
  nationality?: InputMaybe<Scalars['Boolean']['input']>;
  ofac?: InputMaybe<Scalars['Boolean']['input']>;
  passport_number?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SelfVerificationInput = {
  config?: InputMaybe<SelfVerificationConfigInput>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SelfVerificationStatus = {
  __typename?: 'SelfVerificationStatus';
  disclosures: Array<SelfDisclosureStatus>;
};

export type SendCodeInput = {
  phone_number: Scalars['String']['input'];
};

export type SendEventEmailSettingTestEmailsInput = {
  _id?: InputMaybe<Scalars['MongoID']['input']>;
  custom_body_html?: InputMaybe<Scalars['String']['input']>;
  custom_subject_html?: InputMaybe<Scalars['String']['input']>;
  event?: InputMaybe<Scalars['MongoID']['input']>;
  recipient_filters?: InputMaybe<EmailRecipientFiltersInput>;
  test_recipients: Array<Scalars['String']['input']>;
  type?: InputMaybe<EmailTemplateType>;
};

export type SendRoomInviteInput = {
  _id: Scalars['MongoID']['input'];
  users: Array<Scalars['MongoID']['input']>;
};

export type SendSpaceNewsletterTestEmailsInput = {
  _id?: InputMaybe<Scalars['MongoID']['input']>;
  custom_body_html?: InputMaybe<Scalars['String']['input']>;
  custom_subject_html?: InputMaybe<Scalars['String']['input']>;
  recipient_filters?: InputMaybe<EmailRecipientFiltersInput>;
  space?: InputMaybe<Scalars['MongoID']['input']>;
  test_recipients: Array<Scalars['String']['input']>;
};

export enum SendgridCreditResetFrequency {
  Daily = 'daily',
  Monthly = 'monthly',
  Weekly = 'weekly'
}

export enum SendgridCreditType {
  Nonrecurring = 'nonrecurring',
  Recurring = 'recurring',
  Unlimited = 'unlimited'
}

export type Site = {
  __typename?: 'Site';
  _id: Scalars['MongoID']['output'];
  access_pass?: Maybe<AccessPass>;
  active: Scalars['Boolean']['output'];
  ai_config?: Maybe<Scalars['MongoID']['output']>;
  client: Scalars['String']['output'];
  daos?: Maybe<Array<SiteDao>>;
  description?: Maybe<Scalars['String']['output']>;
  event?: Maybe<Scalars['MongoID']['output']>;
  farcaster_channel_url?: Maybe<Scalars['String']['output']>;
  favicon_url?: Maybe<Scalars['String']['output']>;
  footer_scripts?: Maybe<Array<SiteFooterScript>>;
  header_links?: Maybe<Array<SiteHeaderLink>>;
  header_metas?: Maybe<Array<SiteHeaderMeta>>;
  hostnames?: Maybe<Array<Scalars['String']['output']>>;
  logo_mobile_url?: Maybe<Scalars['String']['output']>;
  logo_url?: Maybe<Scalars['String']['output']>;
  onboarding_steps?: Maybe<Array<SiteOnboardingStep>>;
  owners?: Maybe<Array<Scalars['MongoID']['output']>>;
  partners?: Maybe<Array<Scalars['MongoID']['output']>>;
  passports?: Maybe<Array<SitePassport>>;
  privacy_url?: Maybe<Scalars['String']['output']>;
  share_url?: Maybe<Scalars['JSON']['output']>;
  text?: Maybe<Scalars['JSON']['output']>;
  theme_data?: Maybe<Scalars['JSON']['output']>;
  theme_type?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  user?: Maybe<Scalars['MongoID']['output']>;
  user_expanded?: Maybe<User>;
  visibility?: Maybe<Scalars['JSON']['output']>;
};

export type SiteDao = {
  __typename?: 'SiteDao';
  address: Scalars['String']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  network: Scalars['String']['output'];
};

export type SiteFooterScript = {
  __typename?: 'SiteFooterScript';
  children?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  src?: Maybe<Scalars['String']['output']>;
  strategy?: Maybe<SiteFooterScriptStrategy>;
};

export type SiteFooterScriptInput = {
  children?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  src?: InputMaybe<Scalars['String']['input']>;
  strategy?: InputMaybe<SiteFooterScriptStrategy>;
};

export enum SiteFooterScriptStrategy {
  AfterInteractive = 'AfterInteractive',
  BeforeInteractive = 'BeforeInteractive',
  LazyOnload = 'LazyOnload'
}

export type SiteHeaderLink = {
  __typename?: 'SiteHeaderLink';
  href?: Maybe<Scalars['String']['output']>;
  rel?: Maybe<SiteHeaderLinkRel>;
};

export type SiteHeaderLinkInput = {
  href?: InputMaybe<Scalars['String']['input']>;
  rel?: InputMaybe<SiteHeaderLinkRel>;
};

export enum SiteHeaderLinkRel {
  Icon = 'Icon',
  Stylesheet = 'Stylesheet'
}

export type SiteHeaderMeta = {
  __typename?: 'SiteHeaderMeta';
  content?: Maybe<Scalars['String']['output']>;
  key?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  property?: Maybe<Scalars['String']['output']>;
};

export type SiteHeaderMetaInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  property?: InputMaybe<Scalars['String']['input']>;
};

export type SiteOnboardingStep = {
  __typename?: 'SiteOnboardingStep';
  data?: Maybe<Scalars['JSON']['output']>;
  name: SiteOnboardingStepName;
};

export type SiteOnboardingStepInput = {
  data?: InputMaybe<Scalars['JSON']['input']>;
  name: SiteOnboardingStepName;
};

export enum SiteOnboardingStepName {
  About = 'About',
  AdultCheck = 'AdultCheck',
  Biography = 'Biography',
  ConditionsCheck = 'ConditionsCheck',
  Custom = 'Custom',
  DisplayName = 'DisplayName',
  Done = 'Done',
  Feeds = 'Feeds',
  Interests = 'Interests',
  Job = 'Job',
  Photo = 'Photo',
  SocialHandles = 'SocialHandles',
  Username = 'Username',
  Wallet = 'Wallet',
  WalletInput = 'WalletInput'
}

export type SitePassport = {
  __typename?: 'SitePassport';
  baseV1Address: Scalars['String']['output'];
  baseV1ChainId: Scalars['Float']['output'];
  crowdfundAddress?: Maybe<Scalars['JSON']['output']>;
  image: Scalars['String']['output'];
  logo: Scalars['String']['output'];
  name: Scalars['String']['output'];
  passportV1AxelarAddress?: Maybe<Scalars['JSON']['output']>;
  passportV1CallAddress: Scalars['String']['output'];
  ssiGroup: Scalars['String']['output'];
};

export type SitePassportInput = {
  baseV1Address: Scalars['String']['input'];
  baseV1ChainId: Scalars['Float']['input'];
  crowdfundAddress?: InputMaybe<Scalars['JSON']['input']>;
  image: Scalars['String']['input'];
  logo: Scalars['String']['input'];
  name: Scalars['String']['input'];
  passportV1AxelarAddress?: InputMaybe<Scalars['JSON']['input']>;
  passportV1CallAddress: Scalars['String']['input'];
  ssiGroup: Scalars['String']['input'];
};

export type SlashInfo = {
  __typename?: 'SlashInfo';
  account_info?: Maybe<NewPaymentAccount>;
  payouts: Array<SlashPayout>;
  slashable_payments: Array<Scalars['MongoID']['output']>;
  vault: Scalars['String']['output'];
};

export type SlashPayout = {
  __typename?: 'SlashPayout';
  currency: Scalars['String']['output'];
  formatted_amount: Scalars['String']['output'];
};

export type SolanaAccount = {
  __typename?: 'SolanaAccount';
  address: Scalars['String']['output'];
  currencies: Array<Scalars['String']['output']>;
  currency_map?: Maybe<Scalars['JSON']['output']>;
  network: Scalars['String']['output'];
};

export type SortInput = {
  field: Scalars['String']['input'];
  /**
   *
   *     - 1 for increasing
   *     - -1 for descreasing
   */
  order?: Scalars['Int']['input'];
};

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc'
}

export type Space = {
  __typename?: 'Space';
  _id: Scalars['MongoID']['output'];
  address?: Maybe<Address>;
  admins?: Maybe<Array<User>>;
  council_members?: Maybe<Array<SpaceCouncilMember>>;
  creator: Scalars['MongoID']['output'];
  creator_expanded?: Maybe<User>;
  daos?: Maybe<SpaceDao>;
  dark_theme_image?: Maybe<Scalars['MongoID']['output']>;
  dark_theme_image_expanded?: Maybe<File>;
  description?: Maybe<Scalars['String']['output']>;
  featured?: Maybe<Scalars['Boolean']['output']>;
  followed?: Maybe<Scalars['Boolean']['output']>;
  /** List of registered account followers */
  followers?: Maybe<Array<Scalars['MongoID']['output']>>;
  followers_count?: Maybe<Scalars['Float']['output']>;
  handle_instagram?: Maybe<Scalars['String']['output']>;
  handle_linkedin?: Maybe<Scalars['String']['output']>;
  handle_tiktok?: Maybe<Scalars['String']['output']>;
  handle_twitter?: Maybe<Scalars['String']['output']>;
  handle_youtube?: Maybe<Scalars['String']['output']>;
  hostnames?: Maybe<Array<Scalars['String']['output']>>;
  image_avatar?: Maybe<Scalars['MongoID']['output']>;
  image_avatar_expanded?: Maybe<File>;
  image_cover?: Maybe<Scalars['MongoID']['output']>;
  image_cover_expanded?: Maybe<File>;
  is_ambassador?: Maybe<Scalars['Boolean']['output']>;
  lens_feed_id?: Maybe<Scalars['String']['output']>;
  light_theme_image?: Maybe<Scalars['MongoID']['output']>;
  light_theme_image_expanded?: Maybe<File>;
  /** External events are listed on this space */
  listed_events?: Maybe<Array<Scalars['MongoID']['output']>>;
  nft_enabled?: Maybe<Scalars['Boolean']['output']>;
  personal?: Maybe<Scalars['Boolean']['output']>;
  /** Private space requires moderation for membership */
  private?: Maybe<Scalars['Boolean']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  state: SpaceState;
  sub_spaces?: Maybe<Array<Scalars['MongoID']['output']>>;
  sub_spaces_expanded?: Maybe<Array<Space>>;
  theme_data?: Maybe<Scalars['JSON']['output']>;
  theme_name?: Maybe<Scalars['String']['output']>;
  tint_color?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  website?: Maybe<Scalars['String']['output']>;
};


export type SpaceSub_Spaces_ExpandedArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
};

export type SpaceCategory = {
  __typename?: 'SpaceCategory';
  description?: Maybe<Scalars['String']['output']>;
  image_url?: Maybe<Scalars['String']['output']>;
  listed_events_count?: Maybe<Scalars['Int']['output']>;
  space: Scalars['MongoID']['output'];
  space_expanded?: Maybe<Space>;
  title: Scalars['String']['output'];
};

export type SpaceCouncilMember = {
  __typename?: 'SpaceCouncilMember';
  user?: Maybe<BasicUserInfo>;
  wallet: Scalars['String']['output'];
};

export type SpaceDao = {
  __typename?: 'SpaceDao';
  address: Scalars['String']['output'];
  name: Scalars['String']['output'];
  network: Scalars['String']['output'];
};

export type SpaceEventAttendee = {
  __typename?: 'SpaceEventAttendee';
  attended_event_count: Scalars['Float']['output'];
  non_login_user?: Maybe<UserWithEmail>;
  user_expanded?: Maybe<UserWithEmail>;
};

export type SpaceEventHost = {
  __typename?: 'SpaceEventHost';
  hosted_event_count: Scalars['Float']['output'];
  space_member?: Maybe<SpaceMemberBase>;
  user_expanded: UserWithEmail;
};

export type SpaceEventInsight = {
  __typename?: 'SpaceEventInsight';
  _id?: Maybe<Scalars['MongoID']['output']>;
  accepted?: Maybe<Array<Scalars['MongoID']['output']>>;
  accepted_store_promotion?: Maybe<Scalars['MongoID']['output']>;
  accepted_user_fields_required?: Maybe<Array<Scalars['String']['output']>>;
  access_pass?: Maybe<AccessPass>;
  active: Scalars['Boolean']['output'];
  address?: Maybe<Address>;
  address_directions?: Maybe<Array<Scalars['String']['output']>>;
  alert_payments?: Maybe<Array<Scalars['MongoID']['output']>>;
  alert_tickets?: Maybe<Scalars['JSON']['output']>;
  application_form_url?: Maybe<Scalars['String']['output']>;
  application_profile_fields?: Maybe<Array<ApplicationProfileField>>;
  application_required?: Maybe<Scalars['Boolean']['output']>;
  /** @deprecated To be removed */
  application_self_verification?: Maybe<Scalars['Boolean']['output']>;
  application_self_verification_required?: Maybe<Scalars['Boolean']['output']>;
  approval_required?: Maybe<Scalars['Boolean']['output']>;
  approved?: Maybe<Scalars['Boolean']['output']>;
  /** Number of users who have tickets */
  attending_count?: Maybe<Scalars['Float']['output']>;
  broadcast_rooms?: Maybe<Array<BroadcastRoomBase>>;
  button_icon?: Maybe<Scalars['String']['output']>;
  button_text?: Maybe<Scalars['String']['output']>;
  button_url?: Maybe<Scalars['String']['output']>;
  /** @deprecated No longer in use and will be removed in a future release. */
  checkin_count?: Maybe<Scalars['Float']['output']>;
  checkin_menu_text?: Maybe<Scalars['String']['output']>;
  checkins: Scalars['Float']['output'];
  cohosts?: Maybe<Array<Scalars['MongoID']['output']>>;
  comments?: Maybe<Scalars['String']['output']>;
  cost?: Maybe<Scalars['Float']['output']>;
  cover?: Maybe<Scalars['String']['output']>;
  cta_button_text?: Maybe<Scalars['String']['output']>;
  /** Show secondary CTA button text */
  cta_secondary_visible?: Maybe<Scalars['Boolean']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  dark_theme_image?: Maybe<Scalars['MongoID']['output']>;
  declined?: Maybe<Array<Scalars['MongoID']['output']>>;
  description?: Maybe<Scalars['String']['output']>;
  description_plain_text?: Maybe<Scalars['String']['output']>;
  donation_enabled?: Maybe<Scalars['Boolean']['output']>;
  donation_show_history?: Maybe<Scalars['Boolean']['output']>;
  donation_vaults?: Maybe<Array<Scalars['MongoID']['output']>>;
  end: Scalars['DateTimeISO']['output'];
  eventbrite_enabled?: Maybe<Scalars['Boolean']['output']>;
  eventbrite_event_id?: Maybe<Scalars['String']['output']>;
  eventbrite_tickets_imported?: Maybe<Scalars['Boolean']['output']>;
  eventbrite_token?: Maybe<Scalars['String']['output']>;
  events?: Maybe<Array<Scalars['MongoID']['output']>>;
  external_hostname?: Maybe<Scalars['String']['output']>;
  external_url?: Maybe<Scalars['String']['output']>;
  frequent_questions?: Maybe<Array<FrequentQuestion>>;
  guest_directory_enabled?: Maybe<Scalars['Boolean']['output']>;
  guest_limit?: Maybe<Scalars['Float']['output']>;
  guest_limit_per?: Maybe<Scalars['Float']['output']>;
  guests?: Maybe<Scalars['Int']['output']>;
  hide_attending?: Maybe<Scalars['Boolean']['output']>;
  hide_chat_action?: Maybe<Scalars['Boolean']['output']>;
  hide_cohosts?: Maybe<Scalars['Boolean']['output']>;
  hide_creators?: Maybe<Scalars['Boolean']['output']>;
  hide_invite_action?: Maybe<Scalars['Boolean']['output']>;
  hide_lounge?: Maybe<Scalars['Boolean']['output']>;
  hide_question_box?: Maybe<Scalars['Boolean']['output']>;
  hide_rooms_action?: Maybe<Scalars['Boolean']['output']>;
  hide_session_guests?: Maybe<Scalars['Boolean']['output']>;
  hide_speakers?: Maybe<Scalars['Boolean']['output']>;
  hide_stories_action?: Maybe<Scalars['Boolean']['output']>;
  highlight?: Maybe<Scalars['Boolean']['output']>;
  host: Scalars['MongoID']['output'];
  inherited_cohosts?: Maybe<Array<Scalars['MongoID']['output']>>;
  insider_enabled?: Maybe<Scalars['Boolean']['output']>;
  insider_token?: Maybe<Scalars['String']['output']>;
  invited?: Maybe<Array<Scalars['MongoID']['output']>>;
  invited_count?: Maybe<Scalars['Float']['output']>;
  invited_email_map?: Maybe<Scalars['JSON']['output']>;
  invited_emails?: Maybe<Array<Scalars['String']['output']>>;
  invited_phone_map?: Maybe<Scalars['JSON']['output']>;
  invited_user_map?: Maybe<Scalars['JSON']['output']>;
  inviter_email_map?: Maybe<Scalars['JSON']['output']>;
  inviter_phone_map?: Maybe<Scalars['JSON']['output']>;
  inviter_user_map?: Maybe<Scalars['JSON']['output']>;
  inviters?: Maybe<Array<Scalars['MongoID']['output']>>;
  latitude?: Maybe<Scalars['Float']['output']>;
  layout_sections?: Maybe<Array<LayoutSection>>;
  light_theme_image?: Maybe<Scalars['MongoID']['output']>;
  listing_spaces?: Maybe<Array<Scalars['MongoID']['output']>>;
  location?: Maybe<Point>;
  longitude?: Maybe<Scalars['Float']['output']>;
  matrix_event_room_id?: Maybe<Scalars['String']['output']>;
  new_new_photos?: Maybe<Array<Scalars['MongoID']['output']>>;
  new_photos?: Maybe<Array<FileInline>>;
  offers?: Maybe<Array<EventOffer>>;
  payment_accounts_new?: Maybe<Array<Scalars['MongoID']['output']>>;
  payment_donation?: Maybe<Scalars['Boolean']['output']>;
  payment_donation_amount_includes_tickets?: Maybe<Scalars['Boolean']['output']>;
  payment_donation_amount_increment?: Maybe<Scalars['Float']['output']>;
  payment_donation_message?: Maybe<Scalars['String']['output']>;
  payment_donation_target?: Maybe<Scalars['Float']['output']>;
  payment_enabled?: Maybe<Scalars['Boolean']['output']>;
  payment_fee: Scalars['Float']['output'];
  payment_optional?: Maybe<Scalars['Boolean']['output']>;
  payment_ticket_count?: Maybe<Scalars['Float']['output']>;
  payment_ticket_external_message?: Maybe<Scalars['String']['output']>;
  payment_ticket_external_url?: Maybe<Scalars['String']['output']>;
  payment_ticket_purchase_title?: Maybe<Scalars['String']['output']>;
  payment_ticket_unassigned_count?: Maybe<Scalars['Float']['output']>;
  pending?: Maybe<Array<Scalars['MongoID']['output']>>;
  photos?: Maybe<Array<Scalars['String']['output']>>;
  private?: Maybe<Scalars['Boolean']['output']>;
  published?: Maybe<Scalars['Boolean']['output']>;
  rating?: Maybe<Scalars['Float']['output']>;
  registration_disabled?: Maybe<Scalars['Boolean']['output']>;
  reviews?: Maybe<Scalars['Float']['output']>;
  reward_uses?: Maybe<Scalars['JSON']['output']>;
  rewards?: Maybe<Array<EventReward>>;
  rsvp_wallet_platforms?: Maybe<Array<ApplicationBlokchainPlatform>>;
  self_verification?: Maybe<SelfVerification>;
  session_guests?: Maybe<Scalars['JSON']['output']>;
  sessions?: Maybe<Array<EventSessionBase>>;
  shortid: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  space?: Maybe<Scalars['MongoID']['output']>;
  speaker_emails?: Maybe<Array<Scalars['String']['output']>>;
  speaker_users?: Maybe<Array<Scalars['MongoID']['output']>>;
  stamp: Scalars['DateTimeISO']['output'];
  start: Scalars['DateTimeISO']['output'];
  state: EventState;
  stores?: Maybe<Array<Scalars['MongoID']['output']>>;
  stories?: Maybe<Array<Scalars['MongoID']['output']>>;
  stories_eponym?: Maybe<Scalars['Boolean']['output']>;
  subevent_enabled?: Maybe<Scalars['Boolean']['output']>;
  subevent_parent?: Maybe<Scalars['MongoID']['output']>;
  subevent_settings?: Maybe<SubeventSettings>;
  tags?: Maybe<Array<Scalars['String']['output']>>;
  telegram_channels?: Maybe<Array<TelegramChannel>>;
  terms_accepted?: Maybe<Array<Scalars['MongoID']['output']>>;
  terms_accepted_with_email_permission?: Maybe<Array<Scalars['MongoID']['output']>>;
  terms_email_permission_text?: Maybe<Scalars['Boolean']['output']>;
  terms_link?: Maybe<Scalars['String']['output']>;
  terms_text?: Maybe<Scalars['String']['output']>;
  theme_data?: Maybe<Scalars['JSON']['output']>;
  /** The number of tickets available per user for this event */
  ticket_limit_per?: Maybe<Scalars['Float']['output']>;
  tickets_count: Scalars['Float']['output'];
  timezone?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  unlisted?: Maybe<Scalars['Boolean']['output']>;
  unsure?: Maybe<Array<Scalars['MongoID']['output']>>;
  url?: Maybe<Scalars['String']['output']>;
  url_go?: Maybe<Scalars['String']['output']>;
  videos?: Maybe<Array<Video>>;
  virtual?: Maybe<Scalars['Boolean']['output']>;
  virtual_url?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use data from event cohost requests table */
  visible_cohosts?: Maybe<Array<Scalars['MongoID']['output']>>;
  welcome_text?: Maybe<Scalars['String']['output']>;
  welcome_video?: Maybe<Video>;
  zones_menu_text?: Maybe<Scalars['String']['output']>;
};

export type SpaceEventInsightResponse = {
  __typename?: 'SpaceEventInsightResponse';
  items: Array<SpaceEventInsight>;
  total: Scalars['Int']['output'];
};

export type SpaceEventLocationLeaderboard = {
  __typename?: 'SpaceEventLocationLeaderboard';
  city?: Maybe<Scalars['String']['output']>;
  country: Scalars['String']['output'];
  total: Scalars['Float']['output'];
};

export type SpaceEventRequest = {
  __typename?: 'SpaceEventRequest';
  _id: Scalars['MongoID']['output'];
  created_at: Scalars['DateTimeISO']['output'];
  created_by?: Maybe<Scalars['MongoID']['output']>;
  created_by_expanded?: Maybe<User>;
  decided_at?: Maybe<Scalars['DateTimeISO']['output']>;
  decided_by?: Maybe<Scalars['MongoID']['output']>;
  decided_by_expanded?: Maybe<User>;
  event: Scalars['MongoID']['output'];
  event_expanded?: Maybe<Event>;
  space: Scalars['MongoID']['output'];
  state: SpaceEventRequestState;
  tags?: Maybe<Array<Scalars['MongoID']['output']>>;
};

export enum SpaceEventRequestState {
  Approved = 'approved',
  Declined = 'declined',
  Pending = 'pending'
}

export type SpaceEventSummary = {
  __typename?: 'SpaceEventSummary';
  all_events?: Maybe<Scalars['Float']['output']>;
  irl_events?: Maybe<Scalars['Float']['output']>;
  live_events?: Maybe<Scalars['Float']['output']>;
  past_events?: Maybe<Scalars['Float']['output']>;
  upcoming_events?: Maybe<Scalars['Float']['output']>;
  virtual_events?: Maybe<Scalars['Float']['output']>;
};

export type SpaceInput = {
  address?: InputMaybe<AddressInput>;
  dark_theme_image?: InputMaybe<Scalars['MongoID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  handle_instagram?: InputMaybe<Scalars['String']['input']>;
  handle_linkedin?: InputMaybe<Scalars['String']['input']>;
  handle_tiktok?: InputMaybe<Scalars['String']['input']>;
  handle_twitter?: InputMaybe<Scalars['String']['input']>;
  handle_youtube?: InputMaybe<Scalars['String']['input']>;
  hostnames?: InputMaybe<Array<Scalars['String']['input']>>;
  image_avatar?: InputMaybe<Scalars['MongoID']['input']>;
  image_cover?: InputMaybe<Scalars['MongoID']['input']>;
  lens_feed_id?: InputMaybe<Scalars['String']['input']>;
  light_theme_image?: InputMaybe<Scalars['MongoID']['input']>;
  nft_enabled?: InputMaybe<Scalars['Boolean']['input']>;
  /** Private space requires moderation for membership */
  private?: InputMaybe<Scalars['Boolean']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<SpaceState>;
  theme_data?: InputMaybe<Scalars['JSON']['input']>;
  theme_name?: InputMaybe<Scalars['String']['input']>;
  tint_color?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type SpaceMember = {
  __typename?: 'SpaceMember';
  _id?: Maybe<Scalars['MongoID']['output']>;
  checkin_count?: Maybe<Scalars['Float']['output']>;
  deleted_at?: Maybe<Scalars['DateTimeISO']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  event_count?: Maybe<Scalars['Float']['output']>;
  role?: Maybe<SpaceRole>;
  role_changed_at?: Maybe<Scalars['DateTimeISO']['output']>;
  space?: Maybe<Scalars['MongoID']['output']>;
  state?: Maybe<SpaceMembershipState>;
  tags?: Maybe<Array<SpaceTag>>;
  user?: Maybe<Scalars['MongoID']['output']>;
  user_expanded?: Maybe<UserWithEmail>;
  user_name?: Maybe<Scalars['String']['output']>;
  visible?: Maybe<Scalars['Boolean']['output']>;
};

export type SpaceMemberAmountByDate = {
  __typename?: 'SpaceMemberAmountByDate';
  _id: Scalars['String']['output'];
  total: Scalars['Float']['output'];
};

export type SpaceMemberBase = {
  __typename?: 'SpaceMemberBase';
  _id: Scalars['MongoID']['output'];
  decided_by?: Maybe<Scalars['MongoID']['output']>;
  deleted_at?: Maybe<Scalars['DateTimeISO']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  role: SpaceRole;
  role_changed_at?: Maybe<Scalars['DateTimeISO']['output']>;
  space: Scalars['MongoID']['output'];
  state: SpaceMembershipState;
  user?: Maybe<Scalars['MongoID']['output']>;
  user_name?: Maybe<Scalars['String']['output']>;
  visible?: Maybe<Scalars['Boolean']['output']>;
};

export type SpaceMemberLeaderboard = {
  __typename?: 'SpaceMemberLeaderboard';
  _id: Scalars['MongoID']['output'];
  attended_count: Scalars['Float']['output'];
  decided_by?: Maybe<Scalars['MongoID']['output']>;
  deleted_at?: Maybe<Scalars['DateTimeISO']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  hosted_event_count: Scalars['Float']['output'];
  non_user_login?: Maybe<UserWithEmail>;
  role: SpaceRole;
  role_changed_at?: Maybe<Scalars['DateTimeISO']['output']>;
  space: Scalars['MongoID']['output'];
  state: SpaceMembershipState;
  submitted_event_count: Scalars['Float']['output'];
  user?: Maybe<Scalars['MongoID']['output']>;
  user_expanded?: Maybe<UserWithEmail>;
  user_name?: Maybe<Scalars['String']['output']>;
  visible?: Maybe<Scalars['Boolean']['output']>;
};

export type SpaceMemberRecipientFilter = {
  __typename?: 'SpaceMemberRecipientFilter';
  include_untagged?: Maybe<Scalars['Boolean']['output']>;
  space_tags?: Maybe<Array<Scalars['MongoID']['output']>>;
};

export type SpaceMemberRecipientFilterInput = {
  include_untagged?: InputMaybe<Scalars['Boolean']['input']>;
  space_tags?: InputMaybe<Array<Scalars['MongoID']['input']>>;
};

export type SpaceMembersLeaderboardResponse = {
  __typename?: 'SpaceMembersLeaderboardResponse';
  items: Array<SpaceMemberLeaderboard>;
  total: Scalars['Int']['output'];
};

export enum SpaceMembershipState {
  Invited = 'invited',
  Joined = 'joined',
  Rejected = 'rejected',
  Requested = 'requested'
}

export type SpaceNft = {
  __typename?: 'SpaceNFT';
  _id: Scalars['MongoID']['output'];
  content_url?: Maybe<Scalars['String']['output']>;
  contracts: Array<SpaceNftContract>;
  cover_image_url: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  kind: Scalars['String']['output'];
  name: Scalars['String']['output'];
  space: Scalars['MongoID']['output'];
  symbol: Scalars['String']['output'];
  /** Zero for no limit */
  token_limit: Scalars['Float']['output'];
};

export type SpaceNftContract = {
  __typename?: 'SpaceNFTContract';
  _id: Scalars['MongoID']['output'];
  currency_address?: Maybe<Scalars['String']['output']>;
  deployed_contract_address?: Maybe<Scalars['String']['output']>;
  /** Zero for free mint */
  mint_price?: Maybe<Scalars['String']['output']>;
  network_id: Scalars['String']['output'];
  space_nft: Scalars['MongoID']['output'];
};

export enum SpaceNftKind {
  MusicTrack = 'music_track'
}

export type SpaceNewsletterStatistics = {
  __typename?: 'SpaceNewsletterStatistics';
  delivered_count: Scalars['Int']['output'];
  open_count: Scalars['Int']['output'];
  sent_count: Scalars['Int']['output'];
};

export type SpaceRewardSetting = {
  __typename?: 'SpaceRewardSetting';
  claims_count?: Maybe<Scalars['Int']['output']>;
  event?: Maybe<EventBase>;
  recipients_count?: Maybe<Scalars['Int']['output']>;
  setting: BaseTokenRewardSetting;
  type: ClaimType;
};

export type SpaceRewardSettings = {
  __typename?: 'SpaceRewardSettings';
  settings: Array<SpaceRewardSetting>;
};

export type SpaceRewardStatistics = {
  __typename?: 'SpaceRewardStatistics';
  checkin_settings_count: Scalars['Float']['output'];
  events_count: Scalars['Float']['output'];
  ticket_settings_count: Scalars['Float']['output'];
  unique_recipients_count: Scalars['Float']['output'];
};

export enum SpaceRole {
  Admin = 'admin',
  Ambassador = 'ambassador',
  Creator = 'creator',
  Subscriber = 'subscriber',
  Unsubscriber = 'unsubscriber'
}

export type SpaceSendingQuota = {
  __typename?: 'SpaceSendingQuota';
  remain?: Maybe<Scalars['Int']['output']>;
  reset_frequency?: Maybe<SendgridCreditResetFrequency>;
  total?: Maybe<Scalars['Int']['output']>;
  type: SendgridCreditType;
  used?: Maybe<Scalars['Int']['output']>;
};

export enum SpaceState {
  Active = 'active',
  Archived = 'archived'
}

export type SpaceStatisticResponse = {
  __typename?: 'SpaceStatisticResponse';
  admins: Scalars['Float']['output'];
  ambassadors: Scalars['Float']['output'];
  avg_event_rating?: Maybe<Scalars['Float']['output']>;
  created_events: Scalars['Float']['output'];
  event_attendees: Scalars['Float']['output'];
  submitted_events: Scalars['Float']['output'];
  subscribers: Scalars['Float']['output'];
};

export type SpaceTag = {
  __typename?: 'SpaceTag';
  _id: Scalars['MongoID']['output'];
  color: Scalars['String']['output'];
  space: Scalars['MongoID']['output'];
  tag: Scalars['String']['output'];
  targets?: Maybe<Array<Scalars['String']['output']>>;
  targets_count?: Maybe<Scalars['Float']['output']>;
  type: SpaceTagType;
};

export type SpaceTagInput = {
  _id?: InputMaybe<Scalars['MongoID']['input']>;
  color: Scalars['String']['input'];
  space: Scalars['MongoID']['input'];
  tag: Scalars['String']['input'];
  type: SpaceTagType;
};

export enum SpaceTagType {
  Event = 'event',
  Member = 'member'
}

export type SpaceTokenGate = {
  __typename?: 'SpaceTokenGate';
  _id: Scalars['MongoID']['output'];
  /** Decimal places of this token, for display purpose only */
  decimals: Scalars['Float']['output'];
  /** ERC721 if true, else ERC20 */
  is_nft?: Maybe<Scalars['Boolean']['output']>;
  max_value?: Maybe<Scalars['String']['output']>;
  min_value?: Maybe<Scalars['String']['output']>;
  /** Display name of the token */
  name: Scalars['String']['output'];
  network: Scalars['String']['output'];
  passed?: Maybe<Scalars['Boolean']['output']>;
  roles?: Maybe<Array<SpaceRole>>;
  space: Scalars['MongoID']['output'];
  token_address: Scalars['String']['output'];
};

export type SpaceTokenGateInput = {
  _id?: InputMaybe<Scalars['MongoID']['input']>;
  /** Decimal places of this token, for display purpose only */
  decimals?: InputMaybe<Scalars['Float']['input']>;
  /** ERC721 if true, else ERC20 */
  is_nft?: InputMaybe<Scalars['Boolean']['input']>;
  max_value?: InputMaybe<Scalars['String']['input']>;
  min_value?: InputMaybe<Scalars['String']['input']>;
  /** Display name of the token */
  name?: InputMaybe<Scalars['String']['input']>;
  network?: InputMaybe<Scalars['String']['input']>;
  roles?: InputMaybe<Array<SpaceRole>>;
  space?: InputMaybe<Scalars['MongoID']['input']>;
  token_address?: InputMaybe<Scalars['String']['input']>;
};

export type SpaceTokenRewardClaim = {
  __typename?: 'SpaceTokenRewardClaim';
  _id: Scalars['MongoID']['output'];
  claimed_tokens: Array<ClaimedToken>;
  created_at: Scalars['DateTimeISO']['output'];
  event?: Maybe<EventBase>;
  user_expanded?: Maybe<User>;
  wallet_id?: Maybe<Scalars['String']['output']>;
};

export type SpaceTokenRewardClaims = {
  __typename?: 'SpaceTokenRewardClaims';
  items: Array<SpaceTokenRewardClaim>;
  total: Scalars['Int']['output'];
};

export enum SpaceVerificationState {
  Approved = 'APPROVED',
  Pending = 'PENDING',
  Rejected = 'REJECTED'
}

export type SpaceVerificationSubmission = {
  __typename?: 'SpaceVerificationSubmission';
  confirmation_1?: Maybe<Scalars['Boolean']['output']>;
  confirmation_2?: Maybe<Scalars['Boolean']['output']>;
  created_at: Scalars['DateTimeISO']['output'];
  event_info: Scalars['String']['output'];
  guests_info: Scalars['String']['output'];
  number_of_recipients: Scalars['Float']['output'];
  space: Scalars['MongoID']['output'];
  space_expanded?: Maybe<Space>;
  state: SpaceVerificationState;
  updated_at: Scalars['DateTimeISO']['output'];
};

export type SpaceVerificationSubmissionInput = {
  confirmation_1?: InputMaybe<Scalars['Boolean']['input']>;
  confirmation_2?: InputMaybe<Scalars['Boolean']['input']>;
  event_info?: InputMaybe<Scalars['String']['input']>;
  guests_info?: InputMaybe<Scalars['String']['input']>;
  number_of_recipients?: InputMaybe<Scalars['Float']['input']>;
  space?: InputMaybe<Scalars['MongoID']['input']>;
};

export type StakePaymentStateStatistic = {
  __typename?: 'StakePaymentStateStatistic';
  count: Scalars['Int']['output'];
  state: StakeState;
};

export type StakePaymentStatistics = {
  __typename?: 'StakePaymentStatistics';
  slash_infos: Array<SlashInfo>;
  slash_states: Array<StakePaymentStateStatistic>;
  total: Scalars['Int']['output'];
};

export enum StakeState {
  Defaulted = 'defaulted',
  Locked = 'locked',
  Slashed = 'slashed',
  Unlocked = 'unlocked',
  Unstaked = 'unstaked'
}

export type StakeUser = {
  __typename?: 'StakeUser';
  _id?: Maybe<Scalars['MongoID']['output']>;
  display_name?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  image_avatar?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  wallet: Scalars['String']['output'];
};

export type Store = {
  __typename?: 'Store';
  _id: Scalars['MongoID']['output'];
  active: Scalars['Boolean']['output'];
  address?: Maybe<Address>;
  age_restriction_min?: Maybe<Scalars['Float']['output']>;
  age_restriction_reason?: Maybe<Scalars['String']['output']>;
  api_secret?: Maybe<Scalars['String']['output']>;
  approved?: Maybe<Scalars['Boolean']['output']>;
  currency: Scalars['String']['output'];
  delivery_options?: Maybe<Array<DeliveryOption>>;
  easyship_company_id?: Maybe<Scalars['String']['output']>;
  easyship_enabled?: Maybe<Scalars['Boolean']['output']>;
  easyship_secret_key?: Maybe<Scalars['String']['output']>;
  easyship_token?: Maybe<Scalars['String']['output']>;
  fulfillment_addresses: Array<Address>;
  managers: Array<Scalars['MongoID']['output']>;
  managers_expanded?: Maybe<Array<Maybe<User>>>;
  new_photos: Array<Scalars['MongoID']['output']>;
  new_photos_expanded?: Maybe<Array<Maybe<File>>>;
  order_count?: Maybe<Scalars['Float']['output']>;
  payment_fee_store: Scalars['Float']['output'];
  payment_fee_user: Scalars['Float']['output'];
  photos?: Maybe<Array<FileInline>>;
  pickup_addresses?: Maybe<Array<Address>>;
  promotions?: Maybe<Array<Maybe<StorePromotion>>>;
  sales_taxes?: Maybe<Array<SalesTax>>;
  stamp: Scalars['DateTimeISO']['output'];
  tags?: Maybe<Array<Scalars['String']['output']>>;
  title: Scalars['String']['output'];
  user: Scalars['MongoID']['output'];
  user_expanded?: Maybe<User>;
};


export type StoreManagers_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type StoreNew_Photos_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};

export type StoreBucketItem = {
  __typename?: 'StoreBucketItem';
  _id: Scalars['MongoID']['output'];
  active: Scalars['Boolean']['output'];
  count: Scalars['Float']['output'];
  product: Scalars['MongoID']['output'];
  product_expanded?: Maybe<StoreProduct>;
  product_groups: Scalars['JSON']['output'];
  product_variant: Scalars['MongoID']['output'];
  stamp: Scalars['DateTimeISO']['output'];
  store: Scalars['MongoID']['output'];
  store_expanded?: Maybe<Store>;
  user: Scalars['MongoID']['output'];
};

export type StoreBucketItemInput = {
  count: Scalars['Float']['input'];
  product: Scalars['MongoID']['input'];
  product_groups: Scalars['JSON']['input'];
  product_variant: Scalars['MongoID']['input'];
};

export type StoreCategory = {
  __typename?: 'StoreCategory';
  _id: Scalars['MongoID']['output'];
  active: Scalars['Boolean']['output'];
  description?: Maybe<Scalars['String']['output']>;
  parents?: Maybe<Array<Scalars['MongoID']['output']>>;
  stamp: Scalars['DateTimeISO']['output'];
  store: Scalars['MongoID']['output'];
  title: Scalars['String']['output'];
};

export type StoreCategoryInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  parents?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type StoreInput = {
  _id?: InputMaybe<Scalars['MongoID']['input']>;
  age_restriction_min?: InputMaybe<Scalars['Float']['input']>;
  age_restriction_reason?: InputMaybe<Scalars['String']['input']>;
  api_secret?: InputMaybe<Scalars['String']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  delivery_options?: InputMaybe<Array<DeliveryOptionInput>>;
  easyship_company_id?: InputMaybe<Scalars['String']['input']>;
  easyship_enabled?: InputMaybe<Scalars['Boolean']['input']>;
  easyship_secret_key?: InputMaybe<Scalars['String']['input']>;
  easyship_token?: InputMaybe<Scalars['String']['input']>;
  managers?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  new_photos?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  photos?: InputMaybe<Array<FileInlineInput>>;
  sales_taxes?: InputMaybe<Array<SalesTaxInput>>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type StoreOrder = {
  __typename?: 'StoreOrder';
  _id?: Maybe<Scalars['MongoID']['output']>;
  active: Scalars['Boolean']['output'];
  address: Address;
  amount: Scalars['Float']['output'];
  currency: Scalars['String']['output'];
  delivery_cost: Scalars['Float']['output'];
  delivery_option: DeliveryOption;
  delivery_option_cost_waived?: Maybe<Scalars['Boolean']['output']>;
  easyship_courier_id?: Maybe<Scalars['String']['output']>;
  easyship_rates?: Maybe<Array<Scalars['JSON']['output']>>;
  easyship_selected_courier?: Maybe<Scalars['JSON']['output']>;
  easyship_shipment_id?: Maybe<Scalars['String']['output']>;
  fulfillment_address?: Maybe<Address>;
  history?: Maybe<Array<StoreOrderHistoryItem>>;
  items: Array<StoreOrderItem>;
  label_error?: Maybe<Scalars['String']['output']>;
  label_state?: Maybe<Scalars['String']['output']>;
  label_url?: Maybe<Scalars['String']['output']>;
  order_nr: Scalars['Float']['output'];
  pickup_address?: Maybe<Address>;
  promotion?: Maybe<Scalars['MongoID']['output']>;
  sales_tax?: Maybe<SalesTax>;
  stamp: Scalars['DateTimeISO']['output'];
  stamp_created: Scalars['DateTimeISO']['output'];
  state: StoreOrderState;
  store: Scalars['MongoID']['output'];
  store_expanded?: Maybe<Store>;
  tracking_url?: Maybe<Scalars['String']['output']>;
  user: Scalars['MongoID']['output'];
  user_expanded?: Maybe<User>;
  value: Scalars['Float']['output'];
};

export type StoreOrderHistoryItem = {
  __typename?: 'StoreOrderHistoryItem';
  stamp: Scalars['DateTimeISO']['output'];
  state: Scalars['String']['output'];
  user?: Maybe<Scalars['MongoID']['output']>;
  user_expanded?: Maybe<User>;
};

export type StoreOrderInput = {
  items: Array<StoreOrderItemInput>;
  state: StoreOrderState;
};

export type StoreOrderItem = {
  __typename?: 'StoreOrderItem';
  _id: Scalars['MongoID']['output'];
  amount: Scalars['Float']['output'];
  count: Scalars['Float']['output'];
  delivery_cost?: Maybe<Scalars['Float']['output']>;
  delivery_option?: Maybe<DeliveryOption>;
  delivery_option_cost_waived?: Maybe<Scalars['Boolean']['output']>;
  fee?: Maybe<Scalars['Float']['output']>;
  inventory?: Maybe<Scalars['Float']['output']>;
  product: StoreProduct;
  product_groups: Scalars['JSON']['output'];
  product_variant: Scalars['MongoID']['output'];
  promotion?: Maybe<Scalars['Float']['output']>;
  promotion_amount?: Maybe<Scalars['Float']['output']>;
  state: StoreOrderItemState;
  tax?: Maybe<Scalars['Float']['output']>;
  tracking_url?: Maybe<Scalars['String']['output']>;
  value: Scalars['Float']['output'];
};

export type StoreOrderItemInput = {
  _id: Scalars['MongoID']['input'];
  amount: Scalars['Float']['input'];
  delivery_cost?: InputMaybe<Scalars['Float']['input']>;
  delivery_option?: InputMaybe<DeliveryOptionInput>;
  delivery_option_cost_waived?: InputMaybe<Scalars['Boolean']['input']>;
  inventory?: InputMaybe<Scalars['Float']['input']>;
  state: StoreOrderItemState;
  tax?: InputMaybe<Scalars['Float']['input']>;
  tracking_url?: InputMaybe<Scalars['String']['input']>;
};

export enum StoreOrderItemState {
  Accepted = 'accepted',
  Declined = 'declined',
  Pending = 'pending'
}

export enum StoreOrderState {
  Accepted = 'accepted',
  AwaitingPickup = 'awaiting_pickup',
  Cancelled = 'cancelled',
  Created = 'created',
  Declined = 'declined',
  Delivered = 'delivered',
  DeliveryConfirmed = 'delivery_confirmed',
  InTransit = 'in_transit',
  Pending = 'pending',
  Preparing = 'preparing'
}

export type StoreOrderStateFilterInput = {
  eq?: InputMaybe<StoreOrderState>;
  in?: InputMaybe<Array<StoreOrderState>>;
  nin?: InputMaybe<Array<StoreOrderState>>;
};

export type StoreProduct = {
  __typename?: 'StoreProduct';
  _id: Scalars['MongoID']['output'];
  active: Scalars['Boolean']['output'];
  categories?: Maybe<Array<Scalars['MongoID']['output']>>;
  delivery_options?: Maybe<Array<DeliveryOption>>;
  description: Scalars['String']['output'];
  easyship_category?: Maybe<EasyshipCategory>;
  groups?: Maybe<Scalars['JSON']['output']>;
  highlight?: Maybe<Scalars['Boolean']['output']>;
  order: Scalars['Float']['output'];
  primary_group?: Maybe<Scalars['String']['output']>;
  sales_tax_tag?: Maybe<Scalars['String']['output']>;
  stamp: Scalars['DateTimeISO']['output'];
  store: Scalars['MongoID']['output'];
  store_expanded?: Maybe<Store>;
  title: Scalars['String']['output'];
  variants: Array<StoreProductVariant>;
};

export type StoreProductInput = {
  _id?: InputMaybe<Scalars['MongoID']['input']>;
  categories?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  delivery_options?: InputMaybe<Array<DeliveryOptionInput>>;
  description?: InputMaybe<Scalars['String']['input']>;
  easyship_category?: InputMaybe<EasyshipCategory>;
  highlight?: InputMaybe<Scalars['Boolean']['input']>;
  order?: InputMaybe<Scalars['Float']['input']>;
  primary_group?: InputMaybe<Scalars['String']['input']>;
  sales_tax_tag?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type StoreProductVariant = {
  __typename?: 'StoreProductVariant';
  _id: Scalars['MongoID']['output'];
  cost: Scalars['Float']['output'];
  groups: Scalars['JSON']['output'];
  height: Scalars['Float']['output'];
  inventory?: Maybe<Scalars['Float']['output']>;
  length: Scalars['Float']['output'];
  new_photos?: Maybe<Array<Scalars['MongoID']['output']>>;
  new_photos_expanded?: Maybe<Array<Maybe<File>>>;
  photos?: Maybe<Array<FileInline>>;
  title: Scalars['String']['output'];
  weight: Scalars['Float']['output'];
  width: Scalars['Float']['output'];
};


export type StoreProductVariantNew_Photos_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};

export type StoreProductVariantInput = {
  _id?: InputMaybe<Scalars['MongoID']['input']>;
  cost?: InputMaybe<Scalars['Float']['input']>;
  groups?: InputMaybe<Scalars['JSON']['input']>;
  height?: InputMaybe<Scalars['Float']['input']>;
  inventory?: InputMaybe<Scalars['Float']['input']>;
  length?: InputMaybe<Scalars['Float']['input']>;
  new_photos?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  photos?: InputMaybe<Array<FileInlineInput>>;
  title?: InputMaybe<Scalars['String']['input']>;
  weight?: InputMaybe<Scalars['Float']['input']>;
  width?: InputMaybe<Scalars['Float']['input']>;
};

export type StorePromotion = {
  __typename?: 'StorePromotion';
  _id: Scalars['MongoID']['output'];
  active: Scalars['Boolean']['output'];
  event?: Maybe<Scalars['MongoID']['output']>;
  products?: Maybe<Array<Scalars['MongoID']['output']>>;
  products_expanded?: Maybe<Array<Maybe<StoreProduct>>>;
  ratio: Scalars['Float']['output'];
  title: Scalars['String']['output'];
  type: StorePromotionType;
  use_count?: Maybe<Scalars['Float']['output']>;
  use_count_map?: Maybe<Scalars['JSON']['output']>;
  use_limit?: Maybe<Scalars['Float']['output']>;
  use_limit_per?: Maybe<Scalars['Float']['output']>;
  waive_delivery_option_cost?: Maybe<Scalars['Boolean']['output']>;
};


export type StorePromotionProducts_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};

export type StorePromotionInput = {
  event?: InputMaybe<Scalars['MongoID']['input']>;
  products?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  ratio?: InputMaybe<Scalars['Float']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<StorePromotionType>;
  use_limit?: InputMaybe<Scalars['Float']['input']>;
  use_limit_per?: InputMaybe<Scalars['Float']['input']>;
};

export enum StorePromotionType {
  Event = 'event'
}

export type StripeAccount = {
  __typename?: 'StripeAccount';
  account_id: Scalars['String']['output'];
  currencies: Array<Scalars['String']['output']>;
  currency_map?: Maybe<Scalars['JSON']['output']>;
  publishable_key: Scalars['String']['output'];
};

export type StripeAccountCapability = {
  __typename?: 'StripeAccountCapability';
  capabilities: Array<Capability>;
  id: Scalars['String']['output'];
};

export enum StripeAccountCapabilityDisplayPreferencePreference {
  None = 'none',
  Off = 'off',
  On = 'on'
}

export enum StripeAccountCapabilityDisplayPreferenceValue {
  Off = 'off',
  On = 'on'
}

export enum StripeCapabilityType {
  ApplePay = 'apple_pay',
  Card = 'card',
  GooglePay = 'google_pay'
}

export type StripeCard = {
  __typename?: 'StripeCard';
  _id: Scalars['MongoID']['output'];
  active: Scalars['Boolean']['output'];
  brand: Scalars['String']['output'];
  last4: Scalars['String']['output'];
  name: Scalars['String']['output'];
  provider_id: Scalars['String']['output'];
  stamp: Scalars['DateTimeISO']['output'];
  user: Scalars['MongoID']['output'];
};

export type StripeCardInfo = {
  __typename?: 'StripeCardInfo';
  brand?: Maybe<Scalars['String']['output']>;
  last4?: Maybe<Scalars['String']['output']>;
};

export type StripeConnectedAccount = {
  __typename?: 'StripeConnectedAccount';
  account_id: Scalars['String']['output'];
  connected?: Maybe<Scalars['Boolean']['output']>;
};

export type StripeOnrampSession = {
  __typename?: 'StripeOnrampSession';
  client_secret: Scalars['String']['output'];
  publishable_key: Scalars['String']['output'];
};

export type StripePaymentInfo = {
  __typename?: 'StripePaymentInfo';
  card?: Maybe<StripeCardInfo>;
  payment_intent: Scalars['String']['output'];
};

export type SubeventSettings = {
  __typename?: 'SubeventSettings';
  ticket_required_for_creation?: Maybe<Scalars['Boolean']['output']>;
  ticket_required_for_purchase?: Maybe<Scalars['Boolean']['output']>;
};

export type SubeventSettingsInput = {
  ticket_required_for_creation?: InputMaybe<Scalars['Boolean']['input']>;
  ticket_required_for_purchase?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SubmitEventFeedbackInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  rate_value: Scalars['Float']['input'];
  token: Scalars['String']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  notificationCreated: Notification;
  poapDropReady: PoapDrop;
  postCreated: Post;
  roomAccess: Scalars['Boolean']['output'];
  roomAction: RoomActionPayload;
  roomStarted: Room;
  roomUpdated: Room;
  subscribeEventLatestViews: Track;
  votingUpdated: Scalars['MongoID']['output'];
};


export type SubscriptionPoapDropReadyArgs = {
  _id: Scalars['MongoID']['input'];
};


export type SubscriptionRoomAccessArgs = {
  _id: Scalars['MongoID']['input'];
};


export type SubscriptionRoomActionArgs = {
  _id: Scalars['MongoID']['input'];
};


export type SubscriptionRoomStartedArgs = {
  event?: InputMaybe<Scalars['MongoID']['input']>;
};


export type SubscriptionRoomUpdatedArgs = {
  _id: Scalars['MongoID']['input'];
};


export type SubscriptionSubscribeEventLatestViewsArgs = {
  event: Scalars['MongoID']['input'];
};


export type SubscriptionVotingUpdatedArgs = {
  _id: Scalars['MongoID']['input'];
};

export type SubscriptionDetail = {
  __typename?: 'SubscriptionDetail';
  active?: Maybe<Scalars['Boolean']['output']>;
  type: SubscriptionItemType;
};

export type SubscriptionItem = {
  __typename?: 'SubscriptionItem';
  pricing?: Maybe<SubscriptionPricing>;
  title: Scalars['String']['output'];
  type: SubscriptionItemType;
  weekly_email_limit?: Maybe<Scalars['Int']['output']>;
};

export enum SubscriptionItemType {
  FreePlan = 'free_plan',
  PaidPlan_1 = 'paid_plan_1',
  PaidPlan_2 = 'paid_plan_2',
  PaidPlan_3 = 'paid_plan_3',
  PaidPlan_4 = 'paid_plan_4'
}

export type SubscriptionPayment = {
  __typename?: 'SubscriptionPayment';
  client_secret: Scalars['String']['output'];
  publishable_key: Scalars['String']['output'];
};

export type SubscriptionPricing = {
  __typename?: 'SubscriptionPricing';
  currency: Scalars['String']['output'];
  decimals: Scalars['Float']['output'];
  price: Scalars['String']['output'];
};

export type SubscriptionRecord = {
  __typename?: 'SubscriptionRecord';
  _id: Scalars['MongoID']['output'];
  cancel_at_period_end?: Maybe<Scalars['Boolean']['output']>;
  created_at: Scalars['DateTimeISO']['output'];
  current_period_end: Scalars['DateTimeISO']['output'];
  current_period_start: Scalars['DateTimeISO']['output'];
  status: SubscriptionStatus;
  user: Scalars['MongoID']['output'];
};

export type SubscriptionResponse = {
  __typename?: 'SubscriptionResponse';
  items: Array<SubscriptionDetail>;
  payment?: Maybe<SubscriptionPayment>;
  subscription: SubscriptionRecord;
};

export enum SubscriptionStatus {
  Active = 'active',
  Incomplete = 'incomplete',
  PastDue = 'past_due'
}

export type SyncFarcasterConnectionStatusResponse = {
  __typename?: 'SyncFarcasterConnectionStatusResponse';
  accepted: Scalars['Boolean']['output'];
  userFid: Scalars['Float']['output'];
};

export type SyncSpaceTokenGateAccessResponse = {
  __typename?: 'SyncSpaceTokenGateAccessResponse';
  roles: Array<SpaceRole>;
};

export type SystemFile = {
  __typename?: 'SystemFile';
  _id?: Maybe<Scalars['MongoID']['output']>;
  bucket: Scalars['String']['output'];
  category: FileCategory;
  description?: Maybe<Scalars['String']['output']>;
  key: Scalars['String']['output'];
  name: Scalars['String']['output'];
  size?: Maybe<Scalars['Float']['output']>;
  stamp: Scalars['DateTimeISO']['output'];
  type: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type TelegramChannel = {
  __typename?: 'TelegramChannel';
  accessHash?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  inviteLink?: Maybe<Scalars['String']['output']>;
  joined?: Maybe<Array<Scalars['MongoID']['output']>>;
  photo?: Maybe<Scalars['MongoID']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export type TelegramChannelInput = {
  accessHash?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  inviteLink?: InputMaybe<Scalars['String']['input']>;
  joined?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  photo?: InputMaybe<Scalars['MongoID']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type TgUser = {
  __typename?: 'TgUser';
  accessHash: Scalars['String']['output'];
  applyMinPhoto?: Maybe<Scalars['Boolean']['output']>;
  attachMenuEnabled?: Maybe<Scalars['Boolean']['output']>;
  contact?: Maybe<Scalars['Boolean']['output']>;
  deleted?: Maybe<Scalars['Boolean']['output']>;
  fake?: Maybe<Scalars['Boolean']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  langCode?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  min?: Maybe<Scalars['Boolean']['output']>;
  mutualContact?: Maybe<Scalars['Boolean']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  restricted?: Maybe<Scalars['Boolean']['output']>;
  scam?: Maybe<Scalars['Boolean']['output']>;
  self?: Maybe<Scalars['Boolean']['output']>;
  support?: Maybe<Scalars['Boolean']['output']>;
  username?: Maybe<Scalars['String']['output']>;
  verified?: Maybe<Scalars['Boolean']['output']>;
};

export type Ticket = {
  __typename?: 'Ticket';
  _id: Scalars['MongoID']['output'];
  accepted?: Maybe<Scalars['Boolean']['output']>;
  acquired_by?: Maybe<Scalars['MongoID']['output']>;
  acquired_by_email?: Maybe<Scalars['String']['output']>;
  acquired_expanded?: Maybe<UserWithEmail>;
  acquired_tickets?: Maybe<Array<Ticket>>;
  assigned_email?: Maybe<Scalars['String']['output']>;
  assigned_to?: Maybe<Scalars['MongoID']['output']>;
  assigned_to_expanded?: Maybe<User>;
  assigned_to_info?: Maybe<ConfidentialUserInfo>;
  /** This object includes the email when compared to the `assigned_to_expanded` field. */
  assignee_expanded?: Maybe<UserWithEmail>;
  cancelled_at?: Maybe<Scalars['DateTimeISO']['output']>;
  cancelled_by?: Maybe<Scalars['MongoID']['output']>;
  cancelled_by_expanded?: Maybe<User>;
  checkin?: Maybe<EventCheckin>;
  created_at: Scalars['DateTimeISO']['output'];
  event: Scalars['MongoID']['output'];
  event_expanded?: Maybe<Event>;
  invited_by?: Maybe<Scalars['MongoID']['output']>;
  metadata?: Maybe<Scalars['JSON']['output']>;
  payment_id?: Maybe<Scalars['MongoID']['output']>;
  shortid: Scalars['String']['output'];
  type: Scalars['MongoID']['output'];
  type_expanded?: Maybe<EventTicketType>;
  upgrade_history?: Maybe<Array<TicketUpgradeHistory>>;
};

export type TicketAssignee = {
  email?: InputMaybe<Scalars['String']['input']>;
  ticket: Scalars['MongoID']['input'];
  user?: InputMaybe<Scalars['MongoID']['input']>;
};

export type TicketAssignment = {
  count: Scalars['Float']['input'];
  email: Scalars['String']['input'];
};

export type TicketBase = {
  __typename?: 'TicketBase';
  _id: Scalars['MongoID']['output'];
  accepted?: Maybe<Scalars['Boolean']['output']>;
  acquired_by?: Maybe<Scalars['MongoID']['output']>;
  acquired_by_email?: Maybe<Scalars['String']['output']>;
  assigned_email?: Maybe<Scalars['String']['output']>;
  assigned_to?: Maybe<Scalars['MongoID']['output']>;
  assigned_to_info?: Maybe<ConfidentialUserInfo>;
  cancelled_at?: Maybe<Scalars['DateTimeISO']['output']>;
  cancelled_by?: Maybe<Scalars['MongoID']['output']>;
  created_at: Scalars['DateTimeISO']['output'];
  event: Scalars['MongoID']['output'];
  invited_by?: Maybe<Scalars['MongoID']['output']>;
  metadata?: Maybe<Scalars['JSON']['output']>;
  payment_id?: Maybe<Scalars['MongoID']['output']>;
  shortid: Scalars['String']['output'];
  type: Scalars['MongoID']['output'];
};

export type TicketDiscount = {
  __typename?: 'TicketDiscount';
  discount: Scalars['String']['output'];
  limit: Scalars['Float']['output'];
  ratio: Scalars['Float']['output'];
};

export type TicketExport = {
  __typename?: 'TicketExport';
  _id: Scalars['MongoID']['output'];
  active?: Maybe<Scalars['Boolean']['output']>;
  assigned_email?: Maybe<Scalars['String']['output']>;
  assigned_to?: Maybe<Scalars['MongoID']['output']>;
  assignee_email?: Maybe<Scalars['String']['output']>;
  buyer_avatar?: Maybe<Scalars['String']['output']>;
  buyer_email?: Maybe<Scalars['String']['output']>;
  buyer_first_name?: Maybe<Scalars['String']['output']>;
  buyer_id?: Maybe<Scalars['MongoID']['output']>;
  buyer_last_name?: Maybe<Scalars['String']['output']>;
  buyer_name?: Maybe<Scalars['String']['output']>;
  buyer_username?: Maybe<Scalars['String']['output']>;
  buyer_wallet?: Maybe<Scalars['String']['output']>;
  cancelled_by?: Maybe<Scalars['String']['output']>;
  checkin_date?: Maybe<Scalars['DateTimeISO']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  discount_amount?: Maybe<Scalars['String']['output']>;
  discount_code?: Maybe<Scalars['String']['output']>;
  is_assigned?: Maybe<Scalars['Boolean']['output']>;
  is_claimed?: Maybe<Scalars['Boolean']['output']>;
  is_issued?: Maybe<Scalars['Boolean']['output']>;
  issued_by?: Maybe<Scalars['String']['output']>;
  payment_amount?: Maybe<Scalars['String']['output']>;
  payment_id?: Maybe<Scalars['MongoID']['output']>;
  payment_provider?: Maybe<Scalars['String']['output']>;
  purchase_date: Scalars['DateTimeISO']['output'];
  quantity: Scalars['Float']['output'];
  shortid: Scalars['String']['output'];
  ticket_category?: Maybe<Scalars['String']['output']>;
  ticket_type?: Maybe<Scalars['String']['output']>;
  ticket_type_id?: Maybe<Scalars['MongoID']['output']>;
};

export type TicketSoldChartData = {
  __typename?: 'TicketSoldChartData';
  items: Array<TicketSoldItem>;
};

export type TicketSoldItem = {
  __typename?: 'TicketSoldItem';
  created_at: Scalars['DateTimeISO']['output'];
  type: Scalars['MongoID']['output'];
};

export type TicketStatisticPerTier = {
  __typename?: 'TicketStatisticPerTier';
  count: Scalars['Float']['output'];
  ticket_type: Scalars['MongoID']['output'];
  ticket_type_title: Scalars['String']['output'];
};

export type TicketStatistics = {
  __typename?: 'TicketStatistics';
  all: Scalars['Float']['output'];
  applicants: Array<JoinRequestStatistic>;
  cancelled: Scalars['Float']['output'];
  checked_in: Scalars['Float']['output'];
  invited: Scalars['Float']['output'];
  issued: Scalars['Float']['output'];
  not_checked_in: Scalars['Float']['output'];
  ticket_types: Array<TicketStatisticPerTier>;
};

export type TicketTokenRewardSetting = {
  __typename?: 'TicketTokenRewardSetting';
  _id: Scalars['MongoID']['output'];
  currency_address: Scalars['String']['output'];
  event: Scalars['MongoID']['output'];
  photo?: Maybe<Scalars['MongoID']['output']>;
  photo_expanded?: Maybe<File>;
  rewards: Array<TicketTypeReward>;
  title: Scalars['String']['output'];
  user: Scalars['MongoID']['output'];
  vault: Scalars['MongoID']['output'];
  vault_expanded?: Maybe<TokenRewardVault>;
};

export type TicketTokenRewardSettingInput = {
  currency_address?: InputMaybe<Scalars['String']['input']>;
  event?: InputMaybe<Scalars['MongoID']['input']>;
  photo?: InputMaybe<Scalars['MongoID']['input']>;
  rewards?: InputMaybe<Array<TicketTypeRewardInput>>;
  title?: InputMaybe<Scalars['String']['input']>;
  vault?: InputMaybe<Scalars['MongoID']['input']>;
};

export type TicketTypeReward = {
  __typename?: 'TicketTypeReward';
  reward_id: Scalars['String']['output'];
  reward_per_ticket: Scalars['String']['output'];
  ticket_type: Scalars['MongoID']['output'];
  ticket_type_expanded?: Maybe<EventTicketType>;
};

export type TicketTypeRewardInput = {
  reward_per_ticket: Scalars['String']['input'];
  ticket_type: Scalars['MongoID']['input'];
};

export type TicketUpgradeHistory = {
  __typename?: 'TicketUpgradeHistory';
  from_type: Scalars['MongoID']['output'];
  from_type_expanded?: Maybe<EventTicketType>;
  to_type: Scalars['MongoID']['output'];
  to_type_expanded?: Maybe<EventTicketType>;
  updated_at: Scalars['DateTimeISO']['output'];
  updated_by: Scalars['MongoID']['output'];
  updated_by_expanded?: Maybe<User>;
};

export type ToggleBlockUserInput = {
  block: Scalars['Boolean']['input'];
  user: Scalars['MongoID']['input'];
};

export type Token = {
  __typename?: 'Token';
  active?: Maybe<Scalars['Boolean']['output']>;
  contract: Scalars['String']['output'];
  decimals: Scalars['Float']['output'];
  is_native?: Maybe<Scalars['Boolean']['output']>;
  logo_url?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
};

export type TokenRewardClaim = {
  __typename?: 'TokenRewardClaim';
  _id: Scalars['MongoID']['output'];
  created_at: Scalars['DateTimeISO']['output'];
};

export type TokenRewardSignature = {
  __typename?: 'TokenRewardSignature';
  /** The args that will be supplied to the contract */
  args: Array<Scalars['JSON']['output']>;
  claimId: Scalars['String']['output'];
  signature: Scalars['String']['output'];
};

export type TokenRewardVault = {
  __typename?: 'TokenRewardVault';
  _id: Scalars['MongoID']['output'];
  address: Scalars['String']['output'];
  network: Scalars['String']['output'];
  settings_count?: Maybe<Scalars['Float']['output']>;
  title: Scalars['String']['output'];
  tokens?: Maybe<Array<RewardToken>>;
  user: Scalars['MongoID']['output'];
};

export type TokenRewardVaultInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  network?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  tokens?: InputMaybe<Array<RewardTokenInput>>;
};

export type Track = {
  __typename?: 'Track';
  date: Scalars['DateTimeISO']['output'];
  geoip_city?: Maybe<Scalars['String']['output']>;
  geoip_country?: Maybe<Scalars['String']['output']>;
  geoip_region?: Maybe<Scalars['String']['output']>;
  user_agent?: Maybe<Scalars['String']['output']>;
};

export type UnsubscribeSpaceInput = {
  reason?: InputMaybe<Scalars['String']['input']>;
  space: Scalars['MongoID']['input'];
  /** The unsubscribe token from the email */
  token: Scalars['String']['input'];
};

export type UpdateBadgeInput = {
  contract?: InputMaybe<Scalars['String']['input']>;
  network?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateBadgeListInput = {
  image_url?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateDonationInput = {
  _id: Scalars['MongoID']['input'];
  from_wallet?: InputMaybe<Scalars['String']['input']>;
  tx_hash?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateEventBroadcastInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  position?: InputMaybe<Scalars['Float']['input']>;
  rooms?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  thumbnail?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateEventCheckinInput = {
  active: Scalars['Boolean']['input'];
  shortids?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UpdateEventEmailSettingInput = {
  _id: Scalars['MongoID']['input'];
  cc?: InputMaybe<Array<Scalars['String']['input']>>;
  custom_body_html?: InputMaybe<Scalars['String']['input']>;
  custom_subject_html?: InputMaybe<Scalars['String']['input']>;
  disabled?: InputMaybe<Scalars['Boolean']['input']>;
  draft?: InputMaybe<Scalars['Boolean']['input']>;
  recipient_filters?: InputMaybe<EmailRecipientFiltersInput>;
  recipient_types?: InputMaybe<Array<EmailRecipientType>>;
  scheduled_at?: InputMaybe<Scalars['DateTimeISO']['input']>;
};

export type UpdateEventRewardUseInput = {
  active: Scalars['Boolean']['input'];
  event: Scalars['MongoID']['input'];
  reward_id: Scalars['MongoID']['input'];
  reward_number: Scalars['Float']['input'];
  user: Scalars['MongoID']['input'];
};

export type UpdateEventTicketDiscountInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  ticket_limit?: InputMaybe<Scalars['Float']['input']>;
  ticket_limit_per?: InputMaybe<Scalars['Float']['input']>;
  ticket_types?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  use_limit?: InputMaybe<Scalars['Float']['input']>;
  use_limit_per?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateMyLemonheadInvitationsResponse = {
  __typename?: 'UpdateMyLemonheadInvitationsResponse';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  /** Wallets that are already invited */
  wallets?: Maybe<Array<Scalars['String']['output']>>;
};

export type UpdateNewPaymentAccountInput = {
  _id: Scalars['MongoID']['input'];
  account_info: Scalars['JSON']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePaymentInput = {
  _id: Scalars['MongoID']['input'];
  payment_secret?: InputMaybe<Scalars['String']['input']>;
  transfer_params?: InputMaybe<Scalars['JSON']['input']>;
};

export type UpdatePoapInput = {
  /** Requested poap amount */
  amount?: InputMaybe<Scalars['Int']['input']>;
  claim_mode?: InputMaybe<PoapClaimMode>;
  description?: InputMaybe<Scalars['String']['input']>;
  event?: InputMaybe<Scalars['MongoID']['input']>;
  minting_network?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  ticket_types?: InputMaybe<Array<Scalars['MongoID']['input']>>;
};

export type UpdatePostInput = {
  published?: InputMaybe<Scalars['Boolean']['input']>;
  visibility?: InputMaybe<PostVisibility>;
};

export type UpdateSiteInput = {
  access_pass?: InputMaybe<AccessPassInput>;
  active?: InputMaybe<Scalars['Boolean']['input']>;
  ai_config?: InputMaybe<Scalars['MongoID']['input']>;
  client?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  event?: InputMaybe<Scalars['MongoID']['input']>;
  favicon_url?: InputMaybe<Scalars['String']['input']>;
  footer_scripts?: InputMaybe<Array<SiteFooterScriptInput>>;
  header_links?: InputMaybe<Array<SiteHeaderLinkInput>>;
  header_metas?: InputMaybe<Array<SiteHeaderMetaInput>>;
  hostnames?: InputMaybe<Array<Scalars['String']['input']>>;
  logo_mobile_url?: InputMaybe<Scalars['String']['input']>;
  logo_url?: InputMaybe<Scalars['String']['input']>;
  onboarding_steps?: InputMaybe<Array<SiteOnboardingStepInput>>;
  owners?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  partners?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  passports?: InputMaybe<Array<SitePassportInput>>;
  privacy_url?: InputMaybe<Scalars['String']['input']>;
  share_url?: InputMaybe<Scalars['JSON']['input']>;
  text?: InputMaybe<Scalars['JSON']['input']>;
  theme_data?: InputMaybe<Scalars['JSON']['input']>;
  theme_type?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  visibility?: InputMaybe<Scalars['JSON']['input']>;
};

export type UpdateSpaceMemberInput = {
  _id?: InputMaybe<Scalars['MongoID']['input']>;
  role?: InputMaybe<SpaceRole>;
  visible?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateSpaceNewsletterInput = {
  _id: Scalars['MongoID']['input'];
  cc?: InputMaybe<Array<Scalars['String']['input']>>;
  custom_body_html?: InputMaybe<Scalars['String']['input']>;
  custom_subject_html?: InputMaybe<Scalars['String']['input']>;
  disabled?: InputMaybe<Scalars['Boolean']['input']>;
  draft?: InputMaybe<Scalars['Boolean']['input']>;
  recipient_filters?: InputMaybe<EmailRecipientFiltersInput>;
  recipient_types?: InputMaybe<Array<EmailRecipientType>>;
  scheduled_at?: InputMaybe<Scalars['DateTimeISO']['input']>;
};

export type UpdateSpaceRoleFeaturesInput = {
  codes: Array<FeatureCode>;
  role: Scalars['String']['input'];
  space: Scalars['MongoID']['input'];
};

export type UpdateStoreBucketItemInput = {
  count: Scalars['Float']['input'];
};

export type UpdateStripeConnectedAccountCapabilityInput = {
  capabilities: Array<CapabilityInput>;
  id: Scalars['String']['input'];
};

export type UpdateSubscriptionInput = {
  items?: InputMaybe<Array<SubscriptionItemType>>;
  payment_method_id?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTicketTypeCategoryInput = {
  _id: Scalars['MongoID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  event: Scalars['MongoID']['input'];
  position?: InputMaybe<Scalars['Int']['input']>;
  ticket_types?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  title: Scalars['String']['input'];
};

export type UpdateTokenRewardClaimInput = {
  _id: Scalars['MongoID']['input'];
  from_wallet: Scalars['String']['input'];
  network: Scalars['String']['input'];
  tx_hash: Scalars['String']['input'];
};

export type UpgradeTicketInput = {
  event: Scalars['MongoID']['input'];
  ticket: Scalars['MongoID']['input'];
  to_type: Scalars['MongoID']['input'];
};

export type User = {
  __typename?: 'User';
  _id?: Maybe<Scalars['MongoID']['output']>;
  active: Scalars['Boolean']['output'];
  addresses?: Maybe<Array<Address>>;
  age?: Maybe<Scalars['Float']['output']>;
  attended?: Maybe<Scalars['Float']['output']>;
  blocked?: Maybe<Array<Scalars['MongoID']['output']>>;
  blocked_expanded?: Maybe<Array<Maybe<User>>>;
  calendly_url?: Maybe<Scalars['String']['output']>;
  company_address?: Maybe<Address>;
  company_name?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  cover?: Maybe<Scalars['MongoID']['output']>;
  cover_expanded?: Maybe<File>;
  created_at: Scalars['DateTimeISO']['output'];
  currency?: Maybe<Scalars['String']['output']>;
  daos?: Maybe<Array<UserDao>>;
  data?: Maybe<Scalars['JSON']['output']>;
  date_of_birth?: Maybe<Scalars['DateTimeISO']['output']>;
  /** This is the biography of the user */
  description?: Maybe<Scalars['String']['output']>;
  discord_user_info?: Maybe<Scalars['JSON']['output']>;
  discovery?: Maybe<UserDiscoverySettings>;
  display_name?: Maybe<Scalars['String']['output']>;
  education_title?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  email_marketing?: Maybe<Scalars['Boolean']['output']>;
  email_verified?: Maybe<Scalars['Boolean']['output']>;
  ethnicity?: Maybe<Scalars['String']['output']>;
  eventbrite_user_info?: Maybe<Scalars['JSON']['output']>;
  events?: Maybe<Array<Scalars['MongoID']['output']>>;
  events_expanded?: Maybe<Array<Maybe<Event>>>;
  expertise?: Maybe<Array<Scalars['MongoID']['output']>>;
  expertise_expanded?: Maybe<Array<Maybe<UserExpertise>>>;
  farcaster_fid?: Maybe<Scalars['Float']['output']>;
  farcaster_user_info?: Maybe<FarcasterUserInfo>;
  fcm_tokens?: Maybe<Array<Scalars['String']['output']>>;
  first_name?: Maybe<Scalars['String']['output']>;
  followers?: Maybe<Scalars['Float']['output']>;
  following?: Maybe<Scalars['Float']['output']>;
  frequent_questions?: Maybe<Array<FrequentQuestion>>;
  friends?: Maybe<Scalars['Float']['output']>;
  google_user_info?: Maybe<Scalars['JSON']['output']>;
  handle_facebook?: Maybe<Scalars['String']['output']>;
  handle_farcaster?: Maybe<Scalars['String']['output']>;
  handle_github?: Maybe<Scalars['String']['output']>;
  handle_instagram?: Maybe<Scalars['String']['output']>;
  handle_lens?: Maybe<Scalars['String']['output']>;
  handle_linkedin?: Maybe<Scalars['String']['output']>;
  handle_mirror?: Maybe<Scalars['String']['output']>;
  handle_twitter?: Maybe<Scalars['String']['output']>;
  hosted?: Maybe<Scalars['Float']['output']>;
  icebreakers?: Maybe<Array<UserIcebreaker>>;
  image_avatar?: Maybe<Scalars['String']['output']>;
  industry?: Maybe<Scalars['String']['output']>;
  interests?: Maybe<Array<Scalars['String']['output']>>;
  job_title?: Maybe<Scalars['String']['output']>;
  kratos_farcaster_fid?: Maybe<Scalars['String']['output']>;
  kratos_unicorn_wallet_address?: Maybe<Scalars['String']['output']>;
  kratos_wallet_address?: Maybe<Scalars['String']['output']>;
  languages?: Maybe<Array<Scalars['String']['output']>>;
  last_name?: Maybe<Scalars['String']['output']>;
  layout_sections?: Maybe<Array<LayoutSection>>;
  lemon_amount: Scalars['Float']['output'];
  lemon_cap: Scalars['Float']['output'];
  lemon_refresh_at?: Maybe<Scalars['DateTimeISO']['output']>;
  lemonhead_inviter_wallet?: Maybe<Scalars['String']['output']>;
  lens_profile_id?: Maybe<Scalars['String']['output']>;
  lens_profile_synced?: Maybe<Scalars['Boolean']['output']>;
  location_line?: Maybe<Scalars['String']['output']>;
  matrix_localpart?: Maybe<Scalars['String']['output']>;
  music?: Maybe<Array<Scalars['String']['output']>>;
  name: Scalars['String']['output'];
  new_gender?: Maybe<Scalars['String']['output']>;
  new_photos?: Maybe<Array<Scalars['MongoID']['output']>>;
  new_photos_expanded?: Maybe<Array<Maybe<File>>>;
  notification_filters?: Maybe<Array<Scalars['JSON']['output']>>;
  oauth2_allow_creation?: Maybe<Scalars['Boolean']['output']>;
  oauth2_clients?: Maybe<Array<Scalars['String']['output']>>;
  oauth2_max_clients?: Maybe<Scalars['Int']['output']>;
  offers?: Maybe<Array<UserOffer>>;
  payment_verification?: Maybe<UserPaymentVerification>;
  phone?: Maybe<Scalars['String']['output']>;
  phone_verified?: Maybe<Scalars['Boolean']['output']>;
  posts?: Maybe<Scalars['Float']['output']>;
  preferred_network?: Maybe<Scalars['String']['output']>;
  pronoun?: Maybe<Scalars['String']['output']>;
  quest_points?: Maybe<Scalars['Float']['output']>;
  razorpay_customer?: Maybe<Scalars['String']['output']>;
  search_range?: Maybe<Scalars['Float']['output']>;
  service_offers?: Maybe<Array<Scalars['MongoID']['output']>>;
  service_offers_expanded?: Maybe<Array<Maybe<UserServiceOffer>>>;
  settings?: Maybe<Scalars['JSON']['output']>;
  shopify_user_info?: Maybe<Scalars['JSON']['output']>;
  stripe_connected_account?: Maybe<StripeConnectedAccount>;
  stripe_user_info?: Maybe<Scalars['JSON']['output']>;
  tag_recommended?: Maybe<Scalars['Boolean']['output']>;
  tag_site?: Maybe<Scalars['Boolean']['output']>;
  tag_timeline?: Maybe<Scalars['Boolean']['output']>;
  tag_verified?: Maybe<Scalars['Boolean']['output']>;
  tagline?: Maybe<Scalars['String']['output']>;
  telegram_user_info?: Maybe<Scalars['JSON']['output']>;
  terms_accepted_adult?: Maybe<Scalars['Boolean']['output']>;
  terms_accepted_conditions?: Maybe<Scalars['Boolean']['output']>;
  timezone?: Maybe<Scalars['String']['output']>;
  twitch_user_info?: Maybe<Scalars['JSON']['output']>;
  twitter2_user_info?: Maybe<Scalars['JSON']['output']>;
  twitter_user_info?: Maybe<Scalars['JSON']['output']>;
  type?: Maybe<UserType>;
  updated_at: Scalars['DateTimeISO']['output'];
  url?: Maybe<Scalars['String']['output']>;
  url_go?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
  verified?: Maybe<Scalars['Boolean']['output']>;
  wallet_custodial?: Maybe<Scalars['String']['output']>;
  wallets?: Maybe<Array<Scalars['String']['output']>>;
  wallets_new?: Maybe<Scalars['JSON']['output']>;
  website?: Maybe<Scalars['String']['output']>;
  zoom_user_info?: Maybe<Scalars['JSON']['output']>;
};


export type UserEvents_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type UserNew_Photos_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};

export type UserContact = {
  __typename?: 'UserContact';
  _id: Scalars['MongoID']['output'];
  contact?: Maybe<Scalars['MongoID']['output']>;
  contact_expanded?: Maybe<User>;
  converted_at?: Maybe<Scalars['DateTimeISO']['output']>;
  created_at: Scalars['DateTimeISO']['output'];
  email?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  invited_at?: Maybe<Scalars['DateTimeISO']['output']>;
  invited_count?: Maybe<Scalars['Float']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  tags?: Maybe<Array<Scalars['String']['output']>>;
  user: Scalars['MongoID']['output'];
};

export type UserDao = {
  __typename?: 'UserDao';
  address: Scalars['String']['output'];
  network: Scalars['String']['output'];
};

export type UserDaoInput = {
  address: Scalars['String']['input'];
  network: Scalars['String']['input'];
};

export type UserDiscovery = {
  __typename?: 'UserDiscovery';
  _id: Scalars['MongoID']['output'];
  event?: Maybe<Scalars['MongoID']['output']>;
  max_age: Scalars['Float']['output'];
  min_age: Scalars['Float']['output'];
  search_range: Scalars['Float']['output'];
  selected: Array<Scalars['MongoID']['output']>;
  selected_expanded?: Maybe<Array<Maybe<User>>>;
  stamp: Scalars['DateTimeISO']['output'];
  user: Scalars['MongoID']['output'];
};

export type UserDiscoverySettings = {
  __typename?: 'UserDiscoverySettings';
  enabled: Scalars['Boolean']['output'];
  max_age: Scalars['Float']['output'];
  min_age: Scalars['Float']['output'];
};

export type UserDiscoverySettingsInput = {
  enabled: Scalars['Boolean']['input'];
  max_age: Scalars['Float']['input'];
  min_age: Scalars['Float']['input'];
};

export type UserDiscoverySwipe = {
  __typename?: 'UserDiscoverySwipe';
  _id: Scalars['MongoID']['output'];
  decision1?: Maybe<UserDiscoverySwipeDecision>;
  decision2?: Maybe<UserDiscoverySwipeDecision>;
  message?: Maybe<Scalars['String']['output']>;
  other?: Maybe<Scalars['MongoID']['output']>;
  other_expanded?: Maybe<User>;
  source: UserDiscoverySwipeSource;
  stamp: Scalars['DateTimeISO']['output'];
  state: UserDiscoverySwipeState;
  user1: Scalars['MongoID']['output'];
  user2: Scalars['MongoID']['output'];
};

export enum UserDiscoverySwipeDecision {
  Accept = 'accept',
  Decline = 'decline'
}

export enum UserDiscoverySwipeSource {
  Discovery = 'discovery',
  Live = 'live'
}

export enum UserDiscoverySwipeState {
  Declined = 'declined',
  Matched = 'matched',
  Pending = 'pending',
  Undecided = 'undecided'
}

export type UserExpertise = {
  __typename?: 'UserExpertise';
  _id: Scalars['MongoID']['output'];
  title: Scalars['String']['output'];
};

export type UserFollow = {
  __typename?: 'UserFollow';
  _id: Scalars['MongoID']['output'];
  created_at: Scalars['DateTimeISO']['output'];
  followee: Scalars['MongoID']['output'];
  followee_expanded?: Maybe<User>;
  follower: Scalars['MongoID']['output'];
  follower_expanded?: Maybe<User>;
};

export type UserFriendship = {
  __typename?: 'UserFriendship';
  _id: Scalars['MongoID']['output'];
  created_at: Scalars['DateTimeISO']['output'];
  other?: Maybe<Scalars['MongoID']['output']>;
  other_expanded?: Maybe<User>;
  state: UserFriendshipState;
  type?: Maybe<UserFriendshipType>;
  types?: Maybe<Scalars['JSON']['output']>;
  user1: Scalars['MongoID']['output'];
  user2: Scalars['MongoID']['output'];
};

export enum UserFriendshipState {
  Accepted = 'accepted',
  Pending = 'pending'
}

export enum UserFriendshipType {
  Crew = 'crew',
  Tribe = 'tribe'
}

export type UserIcebreaker = {
  __typename?: 'UserIcebreaker';
  _id?: Maybe<Scalars['MongoID']['output']>;
  question: Scalars['MongoID']['output'];
  question_expanded?: Maybe<UserIcebreakerQuestion>;
  value: Scalars['String']['output'];
};

export type UserIcebreakerInput = {
  _id?: InputMaybe<Scalars['MongoID']['input']>;
  question: Scalars['MongoID']['input'];
  value: Scalars['String']['input'];
};

export type UserIcebreakerQuestion = {
  __typename?: 'UserIcebreakerQuestion';
  _id: Scalars['MongoID']['output'];
  description?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type UserInput = {
  addresses?: InputMaybe<Array<AddressInput>>;
  calendly_url?: InputMaybe<Scalars['String']['input']>;
  company_address?: InputMaybe<AddressInput>;
  company_name?: InputMaybe<Scalars['String']['input']>;
  cover?: InputMaybe<Scalars['MongoID']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  daos?: InputMaybe<Array<UserDaoInput>>;
  data?: InputMaybe<Scalars['JSON']['input']>;
  date_of_birth?: InputMaybe<Scalars['DateTimeISO']['input']>;
  /** This is the biography of the user */
  description?: InputMaybe<Scalars['String']['input']>;
  discovery?: InputMaybe<UserDiscoverySettingsInput>;
  display_name?: InputMaybe<Scalars['String']['input']>;
  education_title?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  email_marketing?: InputMaybe<Scalars['Boolean']['input']>;
  ethnicity?: InputMaybe<Scalars['String']['input']>;
  events?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  expertise?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  frequent_questions?: InputMaybe<Array<FrequentQuestionInput>>;
  handle_facebook?: InputMaybe<Scalars['String']['input']>;
  handle_farcaster?: InputMaybe<Scalars['String']['input']>;
  handle_github?: InputMaybe<Scalars['String']['input']>;
  handle_instagram?: InputMaybe<Scalars['String']['input']>;
  handle_lens?: InputMaybe<Scalars['String']['input']>;
  handle_linkedin?: InputMaybe<Scalars['String']['input']>;
  handle_mirror?: InputMaybe<Scalars['String']['input']>;
  handle_twitter?: InputMaybe<Scalars['String']['input']>;
  icebreakers?: InputMaybe<Array<UserIcebreakerInput>>;
  image_avatar?: InputMaybe<Scalars['String']['input']>;
  industry?: InputMaybe<Scalars['String']['input']>;
  interests?: InputMaybe<Array<Scalars['String']['input']>>;
  job_title?: InputMaybe<Scalars['String']['input']>;
  languages?: InputMaybe<Array<Scalars['String']['input']>>;
  layout_sections?: InputMaybe<Array<LayoutSectionInput>>;
  lens_profile_synced?: InputMaybe<Scalars['Boolean']['input']>;
  music?: InputMaybe<Array<Scalars['String']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  new_gender?: InputMaybe<Scalars['String']['input']>;
  new_photos?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  notification_filters?: InputMaybe<Array<Scalars['JSON']['input']>>;
  offers?: InputMaybe<Array<UserOfferInput>>;
  phone?: InputMaybe<Scalars['String']['input']>;
  preferred_network?: InputMaybe<Scalars['String']['input']>;
  pronoun?: InputMaybe<Scalars['String']['input']>;
  search_range?: InputMaybe<Scalars['Float']['input']>;
  service_offers?: InputMaybe<Array<Scalars['MongoID']['input']>>;
  settings?: InputMaybe<Scalars['JSON']['input']>;
  tagline?: InputMaybe<Scalars['String']['input']>;
  terms_accepted_adult?: InputMaybe<Scalars['Boolean']['input']>;
  terms_accepted_conditions?: InputMaybe<Scalars['Boolean']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type UserOffer = {
  __typename?: 'UserOffer';
  _id?: Maybe<Scalars['MongoID']['output']>;
  auto?: Maybe<Scalars['Boolean']['output']>;
  position?: Maybe<Scalars['Float']['output']>;
  provider: OfferProvider;
  provider_id: Scalars['String']['output'];
  provider_network: Scalars['String']['output'];
};

export type UserOfferInput = {
  _id?: InputMaybe<Scalars['MongoID']['input']>;
  auto?: InputMaybe<Scalars['Boolean']['input']>;
  position?: InputMaybe<Scalars['Float']['input']>;
  provider: OfferProvider;
  provider_id: Scalars['String']['input'];
  provider_network: Scalars['String']['input'];
};

export type UserPaymentVerification = {
  __typename?: 'UserPaymentVerification';
  reason?: Maybe<Scalars['String']['output']>;
  stamp: Scalars['DateTimeISO']['output'];
  state: UserPaymentVerificationState;
  verified_by?: Maybe<Scalars['MongoID']['output']>;
};

export type UserPaymentVerificationCondition = {
  __typename?: 'UserPaymentVerificationCondition';
  prop: Scalars['String']['output'];
  satisfied: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
};

export type UserPaymentVerificationInfo = {
  __typename?: 'UserPaymentVerificationInfo';
  conditions: Array<UserPaymentVerificationCondition>;
  eligible: Scalars['Boolean']['output'];
  verified: Scalars['Boolean']['output'];
};

export enum UserPaymentVerificationState {
  Completed = 'completed',
  Declined = 'declined',
  Pending = 'pending'
}

export type UserSelfRequest = {
  __typename?: 'UserSelfRequest';
  endpoint: Scalars['String']['output'];
  endpoint_type: Scalars['String']['output'];
  scope: Scalars['String']['output'];
  uuid: Scalars['String']['output'];
};

export type UserServiceOffer = {
  __typename?: 'UserServiceOffer';
  _id: Scalars['MongoID']['output'];
  title: Scalars['String']['output'];
};

export enum UserType {
  Admin = 'Admin'
}

export type UserWalletRequest = {
  __typename?: 'UserWalletRequest';
  message: Scalars['String']['output'];
  token: Scalars['String']['output'];
};

export type UserWithEmail = {
  __typename?: 'UserWithEmail';
  _id?: Maybe<Scalars['MongoID']['output']>;
  active: Scalars['Boolean']['output'];
  addresses?: Maybe<Array<Address>>;
  age?: Maybe<Scalars['Float']['output']>;
  attended?: Maybe<Scalars['Float']['output']>;
  blocked?: Maybe<Array<Scalars['MongoID']['output']>>;
  blocked_expanded?: Maybe<Array<Maybe<User>>>;
  calendly_url?: Maybe<Scalars['String']['output']>;
  company_address?: Maybe<Address>;
  company_name?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  cover?: Maybe<Scalars['MongoID']['output']>;
  cover_expanded?: Maybe<File>;
  created_at: Scalars['DateTimeISO']['output'];
  currency?: Maybe<Scalars['String']['output']>;
  daos?: Maybe<Array<UserDao>>;
  data?: Maybe<Scalars['JSON']['output']>;
  date_of_birth?: Maybe<Scalars['DateTimeISO']['output']>;
  /** This is the biography of the user */
  description?: Maybe<Scalars['String']['output']>;
  discord_user_info?: Maybe<Scalars['JSON']['output']>;
  discovery?: Maybe<UserDiscoverySettings>;
  display_name?: Maybe<Scalars['String']['output']>;
  education_title?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  email_marketing?: Maybe<Scalars['Boolean']['output']>;
  email_verified?: Maybe<Scalars['Boolean']['output']>;
  ethnicity?: Maybe<Scalars['String']['output']>;
  eventbrite_user_info?: Maybe<Scalars['JSON']['output']>;
  events?: Maybe<Array<Scalars['MongoID']['output']>>;
  events_expanded?: Maybe<Array<Maybe<Event>>>;
  expertise?: Maybe<Array<Scalars['MongoID']['output']>>;
  expertise_expanded?: Maybe<Array<Maybe<UserExpertise>>>;
  farcaster_fid?: Maybe<Scalars['Float']['output']>;
  farcaster_user_info?: Maybe<FarcasterUserInfo>;
  fcm_tokens?: Maybe<Array<Scalars['String']['output']>>;
  first_name?: Maybe<Scalars['String']['output']>;
  followers?: Maybe<Scalars['Float']['output']>;
  following?: Maybe<Scalars['Float']['output']>;
  frequent_questions?: Maybe<Array<FrequentQuestion>>;
  friends?: Maybe<Scalars['Float']['output']>;
  google_user_info?: Maybe<Scalars['JSON']['output']>;
  handle_facebook?: Maybe<Scalars['String']['output']>;
  handle_farcaster?: Maybe<Scalars['String']['output']>;
  handle_github?: Maybe<Scalars['String']['output']>;
  handle_instagram?: Maybe<Scalars['String']['output']>;
  handle_lens?: Maybe<Scalars['String']['output']>;
  handle_linkedin?: Maybe<Scalars['String']['output']>;
  handle_mirror?: Maybe<Scalars['String']['output']>;
  handle_twitter?: Maybe<Scalars['String']['output']>;
  hosted?: Maybe<Scalars['Float']['output']>;
  icebreakers?: Maybe<Array<UserIcebreaker>>;
  image_avatar?: Maybe<Scalars['String']['output']>;
  industry?: Maybe<Scalars['String']['output']>;
  interests?: Maybe<Array<Scalars['String']['output']>>;
  job_title?: Maybe<Scalars['String']['output']>;
  kratos_farcaster_fid?: Maybe<Scalars['String']['output']>;
  kratos_unicorn_wallet_address?: Maybe<Scalars['String']['output']>;
  kratos_wallet_address?: Maybe<Scalars['String']['output']>;
  languages?: Maybe<Array<Scalars['String']['output']>>;
  last_name?: Maybe<Scalars['String']['output']>;
  layout_sections?: Maybe<Array<LayoutSection>>;
  lemon_amount: Scalars['Float']['output'];
  lemon_cap: Scalars['Float']['output'];
  lemon_refresh_at?: Maybe<Scalars['DateTimeISO']['output']>;
  lemonhead_inviter_wallet?: Maybe<Scalars['String']['output']>;
  lens_profile_id?: Maybe<Scalars['String']['output']>;
  lens_profile_synced?: Maybe<Scalars['Boolean']['output']>;
  location_line?: Maybe<Scalars['String']['output']>;
  matrix_localpart?: Maybe<Scalars['String']['output']>;
  music?: Maybe<Array<Scalars['String']['output']>>;
  name: Scalars['String']['output'];
  new_gender?: Maybe<Scalars['String']['output']>;
  new_photos?: Maybe<Array<Scalars['MongoID']['output']>>;
  new_photos_expanded?: Maybe<Array<Maybe<File>>>;
  notification_filters?: Maybe<Array<Scalars['JSON']['output']>>;
  oauth2_allow_creation?: Maybe<Scalars['Boolean']['output']>;
  oauth2_clients?: Maybe<Array<Scalars['String']['output']>>;
  oauth2_max_clients?: Maybe<Scalars['Int']['output']>;
  offers?: Maybe<Array<UserOffer>>;
  payment_verification?: Maybe<UserPaymentVerification>;
  phone?: Maybe<Scalars['String']['output']>;
  phone_verified?: Maybe<Scalars['Boolean']['output']>;
  posts?: Maybe<Scalars['Float']['output']>;
  preferred_network?: Maybe<Scalars['String']['output']>;
  pronoun?: Maybe<Scalars['String']['output']>;
  quest_points?: Maybe<Scalars['Float']['output']>;
  razorpay_customer?: Maybe<Scalars['String']['output']>;
  search_range?: Maybe<Scalars['Float']['output']>;
  service_offers?: Maybe<Array<Scalars['MongoID']['output']>>;
  service_offers_expanded?: Maybe<Array<Maybe<UserServiceOffer>>>;
  settings?: Maybe<Scalars['JSON']['output']>;
  shopify_user_info?: Maybe<Scalars['JSON']['output']>;
  stripe_connected_account?: Maybe<StripeConnectedAccount>;
  stripe_user_info?: Maybe<Scalars['JSON']['output']>;
  tag_recommended?: Maybe<Scalars['Boolean']['output']>;
  tag_site?: Maybe<Scalars['Boolean']['output']>;
  tag_timeline?: Maybe<Scalars['Boolean']['output']>;
  tag_verified?: Maybe<Scalars['Boolean']['output']>;
  tagline?: Maybe<Scalars['String']['output']>;
  telegram_user_info?: Maybe<Scalars['JSON']['output']>;
  terms_accepted_adult?: Maybe<Scalars['Boolean']['output']>;
  terms_accepted_conditions?: Maybe<Scalars['Boolean']['output']>;
  timezone?: Maybe<Scalars['String']['output']>;
  twitch_user_info?: Maybe<Scalars['JSON']['output']>;
  twitter2_user_info?: Maybe<Scalars['JSON']['output']>;
  twitter_user_info?: Maybe<Scalars['JSON']['output']>;
  type?: Maybe<UserType>;
  updated_at: Scalars['DateTimeISO']['output'];
  url?: Maybe<Scalars['String']['output']>;
  url_go?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
  verified?: Maybe<Scalars['Boolean']['output']>;
  wallet_custodial?: Maybe<Scalars['String']['output']>;
  wallets?: Maybe<Array<Scalars['String']['output']>>;
  wallets_new?: Maybe<Scalars['JSON']['output']>;
  website?: Maybe<Scalars['String']['output']>;
  zoom_user_info?: Maybe<Scalars['JSON']['output']>;
};


export type UserWithEmailEvents_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type UserWithEmailNew_Photos_ExpandedArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};

export type VerifyCodeInput = {
  password_2fa?: InputMaybe<Scalars['String']['input']>;
  phone_code: Scalars['String']['input'];
  phone_code_hash: Scalars['String']['input'];
  phone_number: Scalars['String']['input'];
};

export type Video = {
  __typename?: 'Video';
  provider: Scalars['String']['output'];
  provider_id: Scalars['String']['output'];
  thumbnail?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type VideoInput = {
  provider: Scalars['String']['input'];
  provider_id: Scalars['String']['input'];
  thumbnail?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type VotingOption = {
  __typename?: 'VotingOption';
  option_id: Scalars['String']['output'];
  voters: Array<User>;
};

export type WhitelistUserInfo = {
  __typename?: 'WhitelistUserInfo';
  _id?: Maybe<Scalars['MongoID']['output']>;
  email: Scalars['String']['output'];
};

export type GetEventQueryVariables = Exact<{
  id?: InputMaybe<Scalars['MongoID']['input']>;
  shortid?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetEventQuery = { __typename: 'Query', getEvent?: { __typename: 'Event', _id?: any | null, title: string, description?: string | null, approval_required?: boolean | null, start: any, end: any, shortid: string, host: any, cohosts?: Array<any> | null, accepted?: Array<any> | null, address_directions?: Array<string> | null, subevent_enabled?: boolean | null, space?: any | null, timezone?: string | null, guest_limit?: number | null, guest_limit_per?: number | null, terms_text?: string | null, virtual?: boolean | null, virtual_url?: string | null, theme_data?: any | null, url?: string | null, url_go?: string | null, external_url?: string | null, external_hostname?: string | null, published?: boolean | null, private?: boolean | null, payment_accounts_new?: Array<any> | null, hide_attending?: boolean | null, registration_disabled?: boolean | null, ticket_limit_per?: number | null, host_expanded_new?: { __typename: 'UserWithEmail', _id?: any | null, name: string, display_name?: string | null, email?: string | null, image_avatar?: string | null } | null, visible_cohosts_expanded_new?: Array<{ __typename: 'PossibleUserWithEmail', _id?: any | null, name?: string | null, display_name?: string | null, email?: string | null, image_avatar?: string | null } | null> | null, cohosts_expanded_new?: Array<{ __typename: 'PossibleUserWithEmail', _id?: any | null, name?: string | null, display_name?: string | null, email?: string | null, image_avatar?: string | null } | null> | null, new_new_photos_expanded?: Array<{ __typename: 'File', _id?: any | null, stamp: any, type: string, url: string, size?: number | null, bucket: string, key: string } | null> | null, address?: { __typename: 'Address', street_1?: string | null, city?: string | null, title?: string | null, region?: string | null, country?: string | null, additional_directions?: string | null, latitude?: number | null, longitude?: number | null } | null, sessions?: Array<{ __typename: 'EventSession', _id?: any | null, start: any, end: any, broadcast?: any | null, description?: string | null, title: string, speaker_users?: Array<any> | null, photos_expanded?: Array<{ __typename: 'File', _id?: any | null, key: string, bucket: string } | null> | null, speaker_users_expanded?: Array<(
        { __typename: 'User' }
        & { ' $fragmentRefs'?: { 'UserFragment': UserFragment } }
      ) | null> | null }> | null, space_expanded?: { __typename: 'Space', _id: any, title: string, image_avatar?: any | null, image_avatar_expanded?: { __typename: 'File', _id?: any | null, bucket: string, url: string, type: string, key: string } | null } | null, application_questions?: Array<{ __typename: 'EventApplicationQuestion', _id: any, question?: string | null, required?: boolean | null, position?: number | null, type?: QuestionType | null, options?: Array<string> | null, select_type?: SelectType | null }> | null, application_profile_fields?: Array<{ __typename: 'ApplicationProfileField', field: string, question?: string | null, required?: boolean | null }> | null, self_verification?: { __typename: 'SelfVerification', enabled?: boolean | null, config?: { __typename: 'SelfVerificationConfig', date_of_birth?: boolean | null, excludedCountries?: Array<string> | null, expiry_date?: boolean | null, gender?: boolean | null, issuing_state?: boolean | null, minimumAge?: number | null, name?: boolean | null, nationality?: boolean | null, ofac?: boolean | null, passport_number?: boolean | null } | null } | null, rsvp_wallet_platforms?: Array<{ __typename: 'ApplicationBlokchainPlatform', platform: BlockchainPlatform, required?: boolean | null }> | null, calendar_links?: { __typename: 'EventCalendarLinks', google: string, ical: string, outlook: string, yahoo: string } | null, offers?: Array<{ __typename: 'EventOffer', _id?: any | null, provider: OfferProvider, provider_id: string, provider_network: string }> | null, event_ticket_types?: Array<{ __typename: 'EventTicketType', _id: any, title: string, offers?: Array<{ __typename: 'EventOffer', _id?: any | null, provider_network: string, provider_id: string, provider: OfferProvider }> | null }> | null, payment_accounts_expanded?: Array<(
      { __typename: 'NewPaymentAccount' }
      & { ' $fragmentRefs'?: { 'PaymentAccountFragment': PaymentAccountFragment } }
    ) | null> | null, layout_sections?: Array<{ __typename: 'LayoutSection', id?: string | null, hidden?: boolean | null }> | null, payment_ticket_discounts?: Array<{ __typename: 'EventPaymentTicketDiscount', code: string, ratio: number, use_limit?: number | null, use_limit_per?: number | null, use_count?: number | null, active: boolean, ticket_types?: Array<any> | null }> | null } | null };

export type GetEventsQueryVariables = Exact<{
  subeventParent?: InputMaybe<Scalars['MongoID']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Array<Scalars['MongoID']['input']> | Scalars['MongoID']['input']>;
  site?: InputMaybe<Scalars['MongoID']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  accepted?: InputMaybe<Scalars['MongoID']['input']>;
  highlight?: InputMaybe<Scalars['Boolean']['input']>;
  unpublished?: InputMaybe<Scalars['Boolean']['input']>;
  startFrom?: InputMaybe<Scalars['DateTimeISO']['input']>;
  startTo?: InputMaybe<Scalars['DateTimeISO']['input']>;
  endFrom?: InputMaybe<Scalars['DateTimeISO']['input']>;
  hostFilter?: InputMaybe<HostFilter>;
  sort?: InputMaybe<EventSortInput>;
}>;


export type GetEventsQuery = { __typename: 'Query', getEvents: Array<{ __typename: 'Event', _id?: any | null, shortid: string, title: string, host: any, cohosts?: Array<any> | null, start: any, end: any, timezone?: string | null, accepted?: Array<any> | null, guests?: number | null, host_expanded_new?: { __typename: 'UserWithEmail', _id?: any | null, name: string, image_avatar?: string | null } | null, cohosts_expanded_new?: Array<{ __typename: 'PossibleUserWithEmail', _id?: any | null, name?: string | null, image_avatar?: string | null } | null> | null, new_new_photos_expanded?: Array<{ __typename: 'File', _id?: any | null, key: string, bucket: string, url: string, type: string } | null> | null, event_ticket_types?: Array<{ __typename: 'EventTicketType', _id: any, title: string, prices: Array<{ __typename: 'EventTicketPrice', cost: string, currency: string, default?: boolean | null, payment_accounts?: Array<any> | null, payment_accounts_expanded?: Array<(
          { __typename: 'NewPaymentAccount' }
          & { ' $fragmentRefs'?: { 'PaymentAccountFragment': PaymentAccountFragment } }
        )> | null }> }> | null, broadcasts?: Array<{ __typename: 'Broadcast', provider_id: string }> | null, address?: { __typename: 'Address', title?: string | null, city?: string | null, region?: string | null, additional_directions?: string | null } | null, sessions?: Array<{ __typename: 'EventSession', _id?: any | null, broadcast?: any | null, description?: string | null, end: any, speaker_users?: Array<any> | null, start: any, title: string, speaker_users_expanded?: Array<{ __typename: 'User', _id?: any | null, name: string, new_photos_expanded?: Array<{ __typename: 'File', _id?: any | null, key: string, bucket: string } | null> | null } | null> | null }> | null, subevent_parent_expanded?: { __typename: 'Event', _id?: any | null, shortid: string, title: string, slug: string, start: any, timezone?: string | null, new_new_photos_expanded?: Array<{ __typename: 'File', _id?: any | null, key: string, bucket: string, type: string, url: string } | null> | null, subevent_settings?: { __typename: 'SubeventSettings', ticket_required_for_creation?: boolean | null, ticket_required_for_purchase?: boolean | null } | null } | null, visible_cohosts_expanded_new?: Array<{ __typename: 'PossibleUserWithEmail', _id?: any | null, name?: string | null, display_name?: string | null, email?: string | null, image_avatar?: string | null } | null> | null }> };

export type GetUpcomingEventsQueryVariables = Exact<{
  user: Scalars['MongoID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  host?: InputMaybe<Scalars['Boolean']['input']>;
  sort?: InputMaybe<Scalars['JSON']['input']>;
  site?: InputMaybe<Scalars['MongoID']['input']>;
  unpublished?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetUpcomingEventsQuery = { __typename: 'Query', events: Array<{ __typename: 'Event', _id?: any | null, shortid: string, title: string, slug: string, host: any, cohosts?: Array<any> | null, start: any, end: any, timezone?: string | null, me_awaiting_approval?: boolean | null, published?: boolean | null, private?: boolean | null, guests?: number | null, host_expanded_new?: { __typename: 'UserWithEmail', _id?: any | null, name: string, new_photos_expanded?: Array<{ __typename: 'File', _id?: any | null, key: string, bucket: string } | null> | null } | null, new_new_photos_expanded?: Array<{ __typename: 'File', _id?: any | null, key: string, bucket: string, type: string, url: string } | null> | null, address?: { __typename: 'Address', street_1?: string | null, city?: string | null, title?: string | null, region?: string | null, country?: string | null, additional_directions?: string | null, latitude?: number | null, longitude?: number | null } | null, tickets?: Array<{ __typename: 'TicketBase', _id: any, accepted?: boolean | null, assigned_email?: string | null, assigned_to?: any | null, event: any, invited_by?: any | null, type: any }> | null, visible_cohosts_expanded_new?: Array<{ __typename: 'PossibleUserWithEmail', _id?: any | null, name?: string | null, display_name?: string | null, email?: string | null, image_avatar?: string | null } | null> | null }> };

export type GetPastEventsQueryVariables = Exact<{
  user: Scalars['MongoID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Scalars['JSON']['input']>;
  site?: InputMaybe<Scalars['MongoID']['input']>;
  host?: InputMaybe<Scalars['Boolean']['input']>;
  unpublished?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetPastEventsQuery = { __typename: 'Query', events: Array<{ __typename: 'Event', _id?: any | null, shortid: string, title: string, slug: string, host: any, cohosts?: Array<any> | null, start: any, end: any, timezone?: string | null, me_awaiting_approval?: boolean | null, published?: boolean | null, private?: boolean | null, guests?: number | null, host_expanded_new?: { __typename: 'UserWithEmail', _id?: any | null, name: string, new_photos_expanded?: Array<{ __typename: 'File', _id?: any | null, key: string, bucket: string } | null> | null } | null, new_new_photos_expanded?: Array<{ __typename: 'File', _id?: any | null, key: string, bucket: string, type: string, url: string } | null> | null, address?: { __typename: 'Address', street_1?: string | null, city?: string | null, title?: string | null, region?: string | null, country?: string | null, additional_directions?: string | null, latitude?: number | null, longitude?: number | null } | null, tickets?: Array<{ __typename: 'TicketBase', _id: any, accepted?: boolean | null, assigned_email?: string | null, assigned_to?: any | null, event: any, invited_by?: any | null, type: any }> | null, visible_cohosts_expanded_new?: Array<{ __typename: 'PossibleUserWithEmail', _id?: any | null, name?: string | null, display_name?: string | null, email?: string | null, image_avatar?: string | null } | null> | null }> };

export type GetEventInvitationQueryVariables = Exact<{
  event: Scalars['MongoID']['input'];
}>;


export type GetEventInvitationQuery = { __typename: 'Query', getEventInvitation?: { __typename: 'EventInvitation', _id: any, inviters: Array<any> } | null };

export type GetEventTicketTypesQueryVariables = Exact<{
  input: GetEventTicketTypesInput;
}>;


export type GetEventTicketTypesQuery = { __typename: 'Query', getEventTicketTypes: { __typename: 'GetEventTicketTypesResponse', ticket_types: Array<{ __typename: 'PurchasableTicketType', _id: any, title: string, default?: boolean | null, description?: string | null, event: any, limited?: boolean | null, limit: number, whitelisted?: boolean | null, category?: any | null, position?: number | null, passcode_enabled?: boolean | null, recommended_upgrade_ticket_types?: Array<any> | null, prices: Array<{ __typename: 'EventTicketPrice', cost: string, currency: string, default?: boolean | null, payment_accounts?: Array<any> | null, payment_accounts_expanded?: Array<(
          { __typename: 'NewPaymentAccount' }
          & { ' $fragmentRefs'?: { 'PaymentAccountFragment': PaymentAccountFragment } }
        )> | null }>, photos_expanded?: Array<{ __typename: 'File', _id?: any | null, key: string, type: string, bucket: string } | null> | null, category_expanded?: { __typename: 'EventTicketCategory', _id: any, description?: string | null, title: string, position?: number | null } | null }> } };

export type GetMyEventJoinRequestQueryVariables = Exact<{
  event: Scalars['MongoID']['input'];
}>;


export type GetMyEventJoinRequestQuery = { __typename: 'Query', getMyEventJoinRequest?: { __typename: 'EventJoinRequest', _id: any, created_at: any, decided_at?: any | null, decided_by?: any | null, state: EventJoinRequestState, decided_by_expanded?: { __typename: 'User', _id?: any | null, display_name?: string | null, image_avatar?: string | null, username?: string | null, wallets?: Array<string> | null } | null, payment?: { __typename: 'JoinRequestPayment', _id: any, state: NewPaymentState } | null, requested_tickets?: Array<{ __typename: 'RequestedTicket', count: number, ticket_type: any }> | null, ticket_types_expanded?: Array<{ __typename: 'EventTicketType', _id: any, title: string } | null> | null } | null };

export type AcceptEventMutationVariables = Exact<{
  id: Scalars['MongoID']['input'];
  email?: InputMaybe<Scalars['String']['input']>;
}>;


export type AcceptEventMutation = { __typename: 'Mutation', acceptEvent: { __typename: 'EventRsvp', state: EventRsvpState } };

export type SubmitEventApplicationAnswersMutationVariables = Exact<{
  answers: Array<EventApplicationAnswerInput> | EventApplicationAnswerInput;
  event: Scalars['MongoID']['input'];
  email?: InputMaybe<Scalars['String']['input']>;
}>;


export type SubmitEventApplicationAnswersMutation = { __typename: 'Mutation', submitEventApplicationAnswers: boolean };

export type PeekEventGuestsQueryVariables = Exact<{
  id: Scalars['MongoID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type PeekEventGuestsQuery = { __typename: 'Query', peekEventGuests: { __typename: 'PeekEventGuestsResponse', total: number, items: Array<{ __typename: 'EventGuestUser', _id?: any | null, image_avatar?: string | null, name?: string | null, display_name?: string | null, first_name?: string | null }> } };

export type UpdateEventThemeMutationVariables = Exact<{
  id: Scalars['MongoID']['input'];
  input: EventInput;
}>;


export type UpdateEventThemeMutation = { __typename: 'Mutation', updateEvent: { __typename: 'Event', _id?: any | null, theme_data?: any | null } };

export type GetEventCohostInvitesQueryVariables = Exact<{
  input: GetEventCohostRequestsInput;
}>;


export type GetEventCohostInvitesQuery = { __typename: 'Query', getEventCohostInvites: Array<{ __typename: 'EventCohostRequest', event: any, from_expanded?: { __typename: 'User', _id?: any | null, name: string } | null }> };

export type DecideEventCohostRequestMutationVariables = Exact<{
  input: DecideEventCohostRequestInput;
}>;


export type DecideEventCohostRequestMutation = { __typename: 'Mutation', decideEventCohostRequest: boolean };

export type CreateEventMutationVariables = Exact<{
  input: EventInput;
}>;


export type CreateEventMutation = { __typename: 'Mutation', createEvent: { __typename: 'Event', _id?: any | null, shortid: string } };

export type PublishEventMutationVariables = Exact<{
  event: Scalars['MongoID']['input'];
}>;


export type PublishEventMutation = { __typename: 'Mutation', updateEvent: { __typename: 'Event', _id?: any | null, published?: boolean | null } };

export type UpdateEventSettingsMutationVariables = Exact<{
  id: Scalars['MongoID']['input'];
  input: EventInput;
}>;


export type UpdateEventSettingsMutation = { __typename: 'Mutation', updateEvent: { __typename: 'Event', _id?: any | null, title: string, description?: string | null, start: any, end: any, timezone?: string | null, theme_data?: any | null, longitude?: number | null, latitude?: number | null, virtual_url?: string | null, registration_disabled?: boolean | null, guest_limit?: number | null, terms_text?: string | null, terms_link?: string | null, shortid: string, private?: boolean | null, address?: { __typename: 'Address', street_1?: string | null, city?: string | null, title?: string | null, region?: string | null, country?: string | null, additional_directions?: string | null, latitude?: number | null, longitude?: number | null } | null, layout_sections?: Array<{ __typename: 'LayoutSection', id?: string | null, hidden?: boolean | null }> | null } };

export type UpdateEventPhotosMutationVariables = Exact<{
  id: Scalars['MongoID']['input'];
  new_new_photos?: InputMaybe<Array<Scalars['MongoID']['input']> | Scalars['MongoID']['input']>;
}>;


export type UpdateEventPhotosMutation = { __typename: 'Mutation', updateEvent: { __typename: 'Event', new_new_photos?: Array<any> | null, new_new_photos_expanded?: Array<{ __typename: 'File', _id?: any | null, key: string, bucket: string } | null> | null } };

export type InviteEventMutationVariables = Exact<{
  event: Scalars['MongoID']['input'];
  users?: InputMaybe<Array<Scalars['MongoID']['input']> | Scalars['MongoID']['input']>;
  emails?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  custom_body_html?: InputMaybe<Scalars['String']['input']>;
}>;


export type InviteEventMutation = { __typename: 'Mutation', inviteEvent: { __typename: 'Event', _id?: any | null, invited?: Array<any> | null } };

export type AssignTicketsMutationVariables = Exact<{
  input: AssignTicketsInput;
}>;


export type AssignTicketsMutation = { __typename: 'Mutation', assignTickets: boolean };

export type GetEventTicketSalesQueryVariables = Exact<{
  event: Scalars['MongoID']['input'];
}>;


export type GetEventTicketSalesQuery = { __typename: 'Query', getEventTicketSales: { __typename: 'EventTicketSaleResponse', last_update: any, sales: Array<{ __typename: 'SaleAmountResponse', amount: string, currency: string, decimals: number }> } };

export type ListEventTicketTypesQueryVariables = Exact<{
  event: Scalars['MongoID']['input'];
}>;


export type ListEventTicketTypesQuery = { __typename: 'Query', listEventTicketTypes: Array<{ __typename: 'EventTicketType', _id: any, active?: boolean | null, address_required?: boolean | null, default?: boolean | null, description?: string | null, description_line?: string | null, event: any, external_ids?: Array<string> | null, limited?: boolean | null, photos?: Array<any> | null, private?: boolean | null, ticket_count?: number | null, ticket_limit?: number | null, title: string, ticket_limit_per?: number | null, category?: any | null, position?: number | null, limited_whitelist_users?: Array<{ __typename: 'WhitelistUserInfo', _id?: any | null, email: string }> | null, offers?: Array<{ __typename: 'EventOffer', _id?: any | null, auto?: boolean | null, broadcast_rooms?: Array<any> | null, position?: number | null, provider: OfferProvider, provider_id: string, provider_network: string }> | null, photos_expanded?: Array<{ __typename: 'File', _id?: any | null, bucket: string, key: string, type: string } | null> | null, prices: Array<{ __typename: 'EventTicketPrice', cost: string, currency: string, default?: boolean | null, payment_accounts?: Array<any> | null, payment_accounts_expanded?: Array<(
        { __typename: 'NewPaymentAccount' }
        & { ' $fragmentRefs'?: { 'PaymentAccountFragment': PaymentAccountFragment } }
      )> | null }>, category_expanded?: { __typename: 'EventTicketCategory', _id: any, description?: string | null, title: string, position?: number | null } | null }> };

export type ListEventTokenGatesQueryVariables = Exact<{
  event: Scalars['MongoID']['input'];
  ticketTypes?: InputMaybe<Array<Scalars['MongoID']['input']> | Scalars['MongoID']['input']>;
}>;


export type ListEventTokenGatesQuery = { __typename: 'Query', listEventTokenGates: Array<{ __typename: 'EventTokenGate', _id: any, decimals: number, event: any, gated_ticket_types?: Array<any> | null, is_nft?: boolean | null, max_value?: string | null, min_value?: string | null, name: string, network: string, token_address: string }> };

export type CreateEventTokenGateMutationVariables = Exact<{
  input: EventTokenGateInput;
}>;


export type CreateEventTokenGateMutation = { __typename: 'Mutation', createEventTokenGate: { __typename: 'EventTokenGate', _id: any } };

export type UpdateEventTokenGateMutationVariables = Exact<{
  input: EventTokenGateInput;
}>;


export type UpdateEventTokenGateMutation = { __typename: 'Mutation', updateEventTokenGate: { __typename: 'EventTokenGate', _id: any } };

export type ManageEventCohostRequestsMutationVariables = Exact<{
  input: ManageEventCohostRequestsInput;
}>;


export type ManageEventCohostRequestsMutation = { __typename: 'Mutation', manageEventCohostRequests: boolean };

export type GetEventInvitedStatisticsQueryVariables = Exact<{
  id: Scalars['MongoID']['input'];
  statuses?: InputMaybe<Array<InvitationResponse> | InvitationResponse>;
  limit?: InputMaybe<Scalars['Float']['input']>;
}>;


export type GetEventInvitedStatisticsQuery = { __typename: 'Query', getEventInvitedStatistics: { __typename: 'GetEventInvitedStatisticsResponse', emails_opened: number, total: number, total_declined: number, total_joined: number, guests: Array<{ __typename: 'Guest', user?: any | null, pending?: boolean | null, joined?: boolean | null, email?: string | null, declined?: boolean | null, user_expanded?: { __typename: 'User', _id?: any | null, display_name?: string | null, new_photos_expanded?: Array<{ __typename: 'File', _id?: any | null, key: string, bucket: string } | null> | null } | null }> } };

export type GetEventGuestsStatisticsQueryVariables = Exact<{
  event: Scalars['MongoID']['input'];
}>;


export type GetEventGuestsStatisticsQuery = { __typename: 'Query', getEventGuestsStatistics: { __typename: 'GetEventGuestsStatisticsResponse', going: number, pending_approval: number, pending_invite: number, declined: number, checked_in: number } };

export type UpdateEventRegistrationFormMutationVariables = Exact<{
  id: Scalars['MongoID']['input'];
  input: EventInput;
}>;


export type UpdateEventRegistrationFormMutation = { __typename: 'Mutation', updateEvent: { __typename: 'Event', rsvp_wallet_platforms?: Array<{ __typename: 'ApplicationBlokchainPlatform', platform: BlockchainPlatform, required?: boolean | null }> | null } };

export type ListEventGuestsQueryVariables = Exact<{
  ticketTypes?: InputMaybe<Array<Scalars['MongoID']['input']> | Scalars['MongoID']['input']>;
  going?: InputMaybe<Scalars['Boolean']['input']>;
  pendingApproval?: InputMaybe<Scalars['Boolean']['input']>;
  pendingInvite?: InputMaybe<Scalars['Boolean']['input']>;
  declined?: InputMaybe<Scalars['Boolean']['input']>;
  checkedIn?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<ListEventGuestsSortBy>;
  sortOrder?: InputMaybe<SortOrder>;
  event: Scalars['MongoID']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ListEventGuestsQuery = { __typename: 'Query', listEventGuests: { __typename: 'ListEventGuestsResponse', total: number, items: Array<{ __typename: 'EventGuestDetail', join_request?: { __typename: 'EventJoinRequest', _id: any, state: EventJoinRequestState, metadata?: any | null, non_login_user?: { __typename: 'NonloginUser', _id?: any | null, display_name?: string | null, email?: string | null, image_avatar?: string | null, name?: string | null } | null, user_expanded?: { __typename: 'UserWithEmail', _id?: any | null, display_name?: string | null, email?: string | null, image_avatar?: string | null, name: string } | null } | null, ticket?: { __typename: 'Ticket', _id: any, created_at: any, metadata?: any | null, type_expanded?: { __typename: 'EventTicketType', _id: any, title: string } | null } | null, user: { __typename: 'EventGuestUser', _id?: any | null, display_name?: string | null, email?: string | null, image_avatar?: string | null, name?: string | null } }> } };

export type GetEventGuestDetailedInfoQueryVariables = Exact<{
  event: Scalars['MongoID']['input'];
  email?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetEventGuestDetailedInfoQuery = { __typename: 'Query', getEventGuestDetailedInfo?: { __typename: 'EventGuestDetailedInfo', checkin_count?: number | null, purchased_tickets?: Array<{ __typename: 'Ticket', _id: any, cancelled_by?: any | null, cancelled_at?: any | null, type_expanded?: { __typename: 'EventTicketType', _id: any, title: string } | null, cancelled_by_expanded?: { __typename: 'User', _id?: any | null, display_name?: string | null, name: string } | null }> | null, ticket?: { __typename: 'Ticket', _id: any, created_at: any, type: any, type_expanded?: { __typename: 'EventTicketType', _id: any, title: string } | null, upgrade_history?: Array<{ __typename: 'TicketUpgradeHistory', from_type: any, to_type: any, updated_at: any, updated_by: any, from_type_expanded?: { __typename: 'EventTicketType', _id: any, title: string } | null, to_type_expanded?: { __typename: 'EventTicketType', _id: any, title: string } | null, updated_by_expanded?: { __typename: 'User', _id?: any | null, display_name?: string | null, name: string } | null }> | null } | null, user: { __typename: 'EventGuestUser', _id?: any | null, description?: string | null, display_name?: string | null, email?: string | null, first_name?: string | null, image_avatar?: string | null, last_name?: string | null, name?: string | null }, payments?: Array<{ __typename: 'EventGuestPayment', _id: any, amount: string, currency: string, transfer_params?: any | null, formatted_total_amount?: string | null, account_expanded?: (
        { __typename: 'NewPaymentAccount' }
        & { ' $fragmentRefs'?: { 'PaymentAccountFragment': PaymentAccountFragment } }
      ) | null, crypto_payment_info?: { __typename: 'CryptoPaymentInfo', network?: string | null, tx_hash?: string | null } | null, stripe_payment_info?: { __typename: 'StripePaymentInfo', payment_intent: string, card?: { __typename: 'StripeCardInfo', brand?: string | null, last4?: string | null } | null } | null }> | null, join_request?: { __typename: 'EventJoinRequest', _id: any, state: EventJoinRequestState, created_at: any, decided_at?: any | null, decided_by_expanded?: { __typename: 'User', _id?: any | null, display_name?: string | null, name: string } | null, requested_tickets?: Array<{ __typename: 'RequestedTicket', count: number, ticket_type: any }> | null } | null, application?: Array<{ __typename: 'EventApplicationQuestionAndAnswer', answer?: string | null, answers?: Array<string> | null, question?: string | null }> | null, invitation?: { __typename: 'EventInvitation', _id: any, created_at: any, inviters_expanded?: Array<{ __typename: 'User', _id?: any | null, display_name?: string | null, name: string }> | null } | null } | null };

export type SubmitEventApplicationQuestionsMutationVariables = Exact<{
  event: Scalars['MongoID']['input'];
  questions: Array<QuestionInput> | QuestionInput;
}>;


export type SubmitEventApplicationQuestionsMutation = { __typename: 'Mutation', submitEventApplicationQuestions: Array<{ __typename: 'EventApplicationQuestion', _id: any, question?: string | null, required?: boolean | null, position?: number | null, type?: QuestionType | null, options?: Array<string> | null, select_type?: SelectType | null }> };

export type UpdateEventApplicationProfilesMutationVariables = Exact<{
  fields?: InputMaybe<Array<ApplicationProfileFieldInput> | ApplicationProfileFieldInput>;
  id: Scalars['MongoID']['input'];
}>;


export type UpdateEventApplicationProfilesMutation = { __typename: 'Mutation', updateEvent: { __typename: 'Event', application_profile_fields?: Array<{ __typename: 'ApplicationProfileField', field: string, required?: boolean | null, question?: string | null }> | null } };

export type DecideUserJoinRequestsMutationVariables = Exact<{
  decision: EventJoinRequestState;
  event: Scalars['MongoID']['input'];
  requests: Array<Scalars['MongoID']['input']> | Scalars['MongoID']['input'];
}>;


export type DecideUserJoinRequestsMutation = { __typename: 'Mutation', decideUserJoinRequests: Array<{ __typename: 'DecidedJoinRequest', _id: any, processed: boolean }> };

export type GetEventJoinRequestsQueryVariables = Exact<{
  event: Scalars['MongoID']['input'];
  skip: Scalars['Int']['input'];
  limit: Scalars['Int']['input'];
  state?: InputMaybe<EventJoinRequestState>;
}>;


export type GetEventJoinRequestsQuery = { __typename: 'Query', getEventJoinRequests: { __typename: 'GetEventJoinRequestsResponse', total: number, records: Array<{ __typename: 'EventJoinRequest', _id: any, state: EventJoinRequestState, created_at: any, email?: string | null, user?: any | null, user_expanded?: { __typename: 'UserWithEmail', _id?: any | null, name: string, display_name?: string | null, new_photos_expanded?: Array<{ __typename: 'File', _id?: any | null, key: string, bucket: string } | null> | null } | null, non_login_user?: { __typename: 'NonloginUser', _id?: any | null, name?: string | null, email?: string | null, display_name?: string | null, username?: string | null } | null }> } };

export type GetListEventEmailSettingsQueryVariables = Exact<{
  event: Scalars['MongoID']['input'];
  system?: InputMaybe<Scalars['Boolean']['input']>;
  sent?: InputMaybe<Scalars['Boolean']['input']>;
  scheduled?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetListEventEmailSettingsQuery = { __typename: 'Query', listEventEmailSettings: Array<{ __typename: 'EmailSetting', body_preview?: string | null, _id: any, disabled?: boolean | null, is_system_email: boolean, recipient_types?: Array<EmailRecipientType> | null, recipients?: Array<string> | null, scheduled_at?: any | null, sent_at?: any | null, subject_preview?: string | null, type: EmailTemplateType, custom_body_html?: string | null, custom_subject_html?: string | null, recipients_details?: Array<{ __typename: 'RecipientDetail', email?: string | null, image_avatar?: string | null }> | null, owner_expanded?: { __typename: 'User', _id?: any | null, image_avatar?: string | null, new_photos_expanded?: Array<{ __typename: 'File', _id?: any | null, key: string, bucket: string } | null> | null } | null, recipient_filters?: { __typename: 'EmailRecipientFilters', join_request_states?: Array<EventJoinRequestState> | null, ticket_types?: Array<any> | null } | null, opened?: Array<{ __typename: 'EmailTracking', email: string, stamp: any }> | null }> };

export type UpdateEventEmailSettingMutationVariables = Exact<{
  input: UpdateEventEmailSettingInput;
}>;


export type UpdateEventEmailSettingMutation = { __typename: 'Mutation', updateEventEmailSetting: { __typename: 'EmailSetting', _id: any, body_preview?: string | null, is_system_email: boolean, disabled?: boolean | null, recipient_types?: Array<EmailRecipientType> | null, recipients?: Array<string> | null, scheduled_at?: any | null, sent_at?: any | null, subject_preview?: string | null, type: EmailTemplateType, custom_body_html?: string | null, custom_subject_html?: string | null, template: any, recipients_details?: Array<{ __typename: 'RecipientDetail', email?: string | null, image_avatar?: string | null }> | null, recipient_filters?: { __typename: 'EmailRecipientFilters', join_request_states?: Array<EventJoinRequestState> | null, ticket_types?: Array<any> | null } | null, owner_expanded?: { __typename: 'User', image_avatar?: string | null } | null } };

export type CreateEventEmailSettingMutationVariables = Exact<{
  input: CreateEventEmailSettingInput;
}>;


export type CreateEventEmailSettingMutation = { __typename: 'Mutation', createEventEmailSetting?: { __typename: 'EmailSetting', _id: any, body_preview?: string | null, cc?: Array<string> | null, custom_body_html?: string | null, context?: any | null, custom_subject_html?: string | null, disabled?: boolean | null, is_system_email: boolean, recipient_types?: Array<EmailRecipientType> | null, recipients?: Array<string> | null, scheduled_at?: any | null, sendgrid_template_id?: string | null, sent_at?: any | null, subject_preview?: string | null, template: any, type: EmailTemplateType, recipients_details?: Array<{ __typename: 'RecipientDetail', email?: string | null, image_avatar?: string | null }> | null, recipient_filters?: { __typename: 'EmailRecipientFilters', join_request_states?: Array<EventJoinRequestState> | null, ticket_types?: Array<any> | null } | null, owner_expanded?: { __typename: 'User', image_avatar?: string | null } | null, opened?: Array<{ __typename: 'EmailTracking', email: string, stamp: any }> | null } | null };

export type DeleteEventEmailSettingMutationVariables = Exact<{
  id: Scalars['MongoID']['input'];
}>;


export type DeleteEventEmailSettingMutation = { __typename: 'Mutation', deleteEventEmailSetting: boolean };

export type SendEventEmailSettingTestEmailsMutationVariables = Exact<{
  input: SendEventEmailSettingTestEmailsInput;
}>;


export type SendEventEmailSettingTestEmailsMutation = { __typename: 'Mutation', sendEventEmailSettingTestEmails: boolean };

export type ToggleEventEmailSettingsMutationVariables = Exact<{
  disabled: Scalars['Boolean']['input'];
  ids: Array<Scalars['MongoID']['input']> | Scalars['MongoID']['input'];
  event: Scalars['MongoID']['input'];
}>;


export type ToggleEventEmailSettingsMutation = { __typename: 'Mutation', toggleEventEmailSettings: boolean };

export type UpdateEventToggleAttendingMutationVariables = Exact<{
  id: Scalars['MongoID']['input'];
  input: EventInput;
}>;


export type UpdateEventToggleAttendingMutation = { __typename: 'Mutation', updateEvent: { __typename: 'Event', _id?: any | null, hide_attending?: boolean | null } };

export type GetTicketsQueryVariables = Exact<{
  event?: InputMaybe<Scalars['MongoID']['input']>;
  user?: InputMaybe<Scalars['MongoID']['input']>;
  ticket_types?: InputMaybe<Array<Scalars['MongoID']['input']> | Scalars['MongoID']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetTicketsQuery = { __typename: 'Query', getTickets: Array<{ __typename: 'Ticket', _id: any, accepted?: boolean | null, assigned_email?: string | null, assigned_to?: any | null, event: any, invited_by?: any | null, type: any, shortid: string, assigned_to_expanded?: { __typename: 'User', _id?: any | null, name: string, new_photos_expanded?: Array<{ __typename: 'File', _id?: any | null, key: string, bucket: string } | null> | null } | null }> };

export type CreatePoapDropMutationVariables = Exact<{
  input: CreatePoapInput;
}>;


export type CreatePoapDropMutation = { __typename: 'Mutation', createPoapDrop: { __typename: 'PoapDrop', _id: any, amount: number, claim_count?: number | null, claim_mode: PoapClaimMode, description: string, event?: any | null, image?: any | null, image_url?: string | null, name: string, private?: boolean | null, status: PoapDropStatus, ticket_types?: Array<any> | null, image_expanded?: { __typename: 'File', _id?: any | null, stamp: any, type: string, url: string, size?: number | null, bucket: string, key: string } | null, ticket_types_expanded?: Array<{ __typename: 'EventTicketType', _id: any, title: string }> | null } };

export type ListPoapDropsQueryVariables = Exact<{
  event: Scalars['MongoID']['input'];
}>;


export type ListPoapDropsQuery = { __typename: 'Query', listPoapDrops: Array<{ __typename: 'PoapDrop', _id: any, amount: number, claim_count?: number | null, claim_mode: PoapClaimMode, description: string, event?: any | null, image?: any | null, image_url?: string | null, name: string, private?: boolean | null, status: PoapDropStatus, ticket_types?: Array<any> | null, minting_network: string, image_expanded?: { __typename: 'File', _id?: any | null, stamp: any, type: string, url: string, size?: number | null, bucket: string, key: string } | null, ticket_types_expanded?: Array<{ __typename: 'EventTicketType', _id: any, title: string }> | null }> };

export type ListMyPoapClaimsQueryVariables = Exact<{
  event?: InputMaybe<Scalars['MongoID']['input']>;
}>;


export type ListMyPoapClaimsQuery = { __typename: 'Query', listMyPoapClaims: Array<{ __typename: 'PoapClaim', claimed_date?: any | null, drop: { __typename: 'PoapDrop', _id: any } }> };

export type GetEventCheckInStateQueryVariables = Exact<{
  id?: InputMaybe<Scalars['MongoID']['input']>;
}>;


export type GetEventCheckInStateQuery = { __typename: 'Query', getEvent?: { __typename: 'Event', checkedin?: boolean | null } | null };

export type ClaimPoapMutationVariables = Exact<{
  wallet: Scalars['String']['input'];
  drop: Scalars['MongoID']['input'];
}>;


export type ClaimPoapMutation = { __typename: 'Mutation', claimPoap: boolean };

export type UpdatePoapDropMutationVariables = Exact<{
  input: UpdatePoapInput;
  drop: Scalars['MongoID']['input'];
}>;


export type UpdatePoapDropMutation = { __typename: 'Mutation', updatePoapDrop: { __typename: 'PoapDrop', _id: any, amount: number, claim_count?: number | null, claim_mode: PoapClaimMode, description: string, event?: any | null, image?: any | null, image_url?: string | null, name: string, private?: boolean | null, status: PoapDropStatus, ticket_types?: Array<any> | null, image_expanded?: { __typename: 'File', _id?: any | null, stamp: any, type: string, url: string, size?: number | null, bucket: string, key: string } | null, ticket_types_expanded?: Array<{ __typename: 'EventTicketType', _id: any, title: string }> | null } };

export type GetPoapDropInfoByIdQueryVariables = Exact<{
  getPoapDropInfoByIdId: Scalars['Float']['input'];
}>;


export type GetPoapDropInfoByIdQuery = { __typename: 'Query', getPoapDropInfoById: { __typename: 'PoapDropInfo', description: string, image_url: string, name: string } };

export type CheckPoapDropEditCodeQueryVariables = Exact<{
  code: Scalars['String']['input'];
  checkPoapDropEditCodeId: Scalars['Int']['input'];
}>;


export type CheckPoapDropEditCodeQuery = { __typename: 'Query', checkPoapDropEditCode: boolean };

export type ImportPoapDropMutationVariables = Exact<{
  input: ImportPoapInput;
  code: Scalars['String']['input'];
  importPoapDropId: Scalars['Float']['input'];
}>;


export type ImportPoapDropMutation = { __typename: 'Mutation', importPoapDrop: { __typename: 'PoapDrop', _id: any, amount: number, claim_count?: number | null, claim_mode: PoapClaimMode, description: string, event?: any | null, image?: any | null, image_url?: string | null, name: string, private?: boolean | null, status: PoapDropStatus, ticket_types?: Array<any> | null, image_expanded?: { __typename: 'File', _id?: any | null, stamp: any, type: string, url: string, size?: number | null, bucket: string, key: string } | null, ticket_types_expanded?: Array<{ __typename: 'EventTicketType', _id: any, title: string }> | null } };

export type CancelEventMutationVariables = Exact<{
  event: Scalars['MongoID']['input'];
}>;


export type CancelEventMutation = { __typename: 'Mutation', cancelEvent: { __typename: 'Event', _id?: any | null } };

export type CloneEventMutationVariables = Exact<{
  input: CloneEventInput;
}>;


export type CloneEventMutation = { __typename: 'Mutation', cloneEvent: Array<any> };

export type GenerateRecurringDatesQueryVariables = Exact<{
  input: GenerateRecurringDatesInput;
}>;


export type GenerateRecurringDatesQuery = { __typename: 'Query', generateRecurringDates: Array<any> };

export type CreateEventTicketDiscountsMutationVariables = Exact<{
  event: Scalars['MongoID']['input'];
  inputs: Array<EventPaymentTicketDiscountInput> | EventPaymentTicketDiscountInput;
}>;


export type CreateEventTicketDiscountsMutation = { __typename: 'Mutation', createEventTicketDiscounts: { __typename: 'Event', _id?: any | null, payment_ticket_discounts?: Array<{ __typename: 'EventPaymentTicketDiscount', code: string, ratio: number, use_limit?: number | null, use_limit_per?: number | null, use_count?: number | null, active: boolean, ticket_types?: Array<any> | null }> | null } };

export type UpdateEventTicketDiscountMutationVariables = Exact<{
  event: Scalars['MongoID']['input'];
  input: UpdateEventTicketDiscountInput;
}>;


export type UpdateEventTicketDiscountMutation = { __typename: 'Mutation', updateEventTicketDiscount: { __typename: 'Event', _id?: any | null, payment_ticket_discounts?: Array<{ __typename: 'EventPaymentTicketDiscount', code: string, ratio: number, use_limit?: number | null, use_limit_per?: number | null, use_count?: number | null, active: boolean, ticket_types?: Array<any> | null }> | null } };

export type DeleteEventTicketDiscountsMutationVariables = Exact<{
  event: Scalars['MongoID']['input'];
  discounts: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type DeleteEventTicketDiscountsMutation = { __typename: 'Mutation', deleteEventTicketDiscounts: { __typename: 'Event', _id?: any | null, payment_ticket_discounts?: Array<{ __typename: 'EventPaymentTicketDiscount', code: string, ratio: number, use_limit?: number | null, use_limit_per?: number | null, use_count?: number | null, active: boolean, ticket_types?: Array<any> | null }> | null } };

export type UpdateEventSelfVerificationMutationVariables = Exact<{
  id: Scalars['MongoID']['input'];
  self_verification?: InputMaybe<SelfVerificationInput>;
}>;


export type UpdateEventSelfVerificationMutation = { __typename: 'Mutation', updateEvent: { __typename: 'Event', self_verification?: { __typename: 'SelfVerification', enabled?: boolean | null, config?: { __typename: 'SelfVerificationConfig', date_of_birth?: boolean | null, excludedCountries?: Array<string> | null, expiry_date?: boolean | null, gender?: boolean | null, issuing_state?: boolean | null, minimumAge?: number | null, name?: boolean | null, nationality?: boolean | null, ofac?: boolean | null, passport_number?: boolean | null } | null } | null } };

export type GetEventPaymentStatisticsQueryVariables = Exact<{
  event: Scalars['MongoID']['input'];
}>;


export type GetEventPaymentStatisticsQuery = { __typename: 'Query', getEventPaymentStatistics: { __typename: 'EventPaymentStatistics', total_payments: number, stripe_payments: { __typename: 'PaymentStatistics', count: number, revenue: Array<{ __typename: 'PaymentRevenue', currency: string, formatted_total_amount: string }> }, crypto_payments: { __typename: 'CryptoPaymentStatistics', count: number, revenue: Array<{ __typename: 'PaymentRevenue', currency: string, formatted_total_amount: string }>, networks: Array<{ __typename: 'CryptoPaymentNetworkStatistics', chain_id: string, count: number }> } } };

export type GetListEventPaymentsQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  event: Scalars['MongoID']['input'];
  provider?: InputMaybe<NewPaymentProvider>;
  networks?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  checked_in?: InputMaybe<Scalars['Boolean']['input']>;
  ticket_types?: InputMaybe<Array<Scalars['MongoID']['input']> | Scalars['MongoID']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetListEventPaymentsQuery = { __typename: 'Query', listEventPayments: { __typename: 'ListEventPaymentsResponse', total: number, records: Array<{ __typename: 'NewPayment', _id: any, amount: string, currency: string, due_amount?: string | null, fee?: string | null, formatted_total_amount?: string | null, formatted_discount_amount?: string | null, user?: any | null, stamps: any, state: NewPaymentState, ref_data?: any | null, transfer_params?: any | null, transfer_metadata?: any | null, account_expanded?: { __typename: 'NewPaymentAccount', provider?: NewPaymentProvider | null, _id: any, active: boolean, created_at: any, user: any, type: PaymentAccountType, title?: string | null } | null, stripe_payment_info?: { __typename: 'StripePaymentInfo', payment_intent: string, card?: { __typename: 'StripeCardInfo', last4?: string | null, brand?: string | null } | null } | null, application?: Array<{ __typename: 'EventApplicationQuestionAndAnswer', question?: string | null, answer?: string | null }> | null, buyer_info?: { __typename: 'BuyerInfo', email: string, name?: string | null } | null, buyer_user?: { __typename: 'UserWithEmail', email?: string | null, display_name?: string | null, name: string, image_avatar?: string | null } | null, ticket_types_expanded?: Array<{ __typename: 'EventTicketType', _id: any, category_expanded?: { __typename: 'EventTicketCategory', title: string } | null } | null> | null, crypto_payment_info?: { __typename: 'CryptoPaymentInfo', network?: string | null, tx_hash?: string | null } | null }> } };

export type GetTicketStatisticsQueryVariables = Exact<{
  id: Scalars['MongoID']['input'];
}>;


export type GetTicketStatisticsQuery = { __typename: 'Query', getTicketStatistics: { __typename: 'TicketStatistics', all: number, checked_in: number, invited: number, issued: number, cancelled: number, not_checked_in: number, applicants: Array<{ __typename: 'JoinRequestStatistic', state: EventJoinRequestState, count: number }>, ticket_types: Array<{ __typename: 'TicketStatisticPerTier', ticket_type: any, ticket_type_title: string, count: number }> } };

export type GetEventTicketSoldChartDataQueryVariables = Exact<{
  event: Scalars['MongoID']['input'];
  start: Scalars['DateTimeISO']['input'];
  end: Scalars['DateTimeISO']['input'];
  types?: InputMaybe<Array<Scalars['MongoID']['input']> | Scalars['MongoID']['input']>;
}>;


export type GetEventTicketSoldChartDataQuery = { __typename: 'Query', getEventTicketSoldChartData: { __typename: 'TicketSoldChartData', items: Array<{ __typename: 'TicketSoldItem', created_at: any, type: any }> } };

export type GetEventViewChartDataQueryVariables = Exact<{
  start: Scalars['DateTimeISO']['input'];
  end: Scalars['DateTimeISO']['input'];
  event: Scalars['MongoID']['input'];
}>;


export type GetEventViewChartDataQuery = { __typename: 'Query', getEventViewChartData: { __typename: 'EventViewChartData', items: Array<{ __typename: 'EventViewItem', date: any }> } };

export type GetEventViewStatsQueryVariables = Exact<{
  event: Scalars['MongoID']['input'];
  ranges: Array<DateRangeInput> | DateRangeInput;
}>;


export type GetEventViewStatsQuery = { __typename: 'Query', getEventViewStats: { __typename: 'EventViewStats', counts: Array<number> } };

export type ViewsQueryVariables = Exact<{
  event: Scalars['MongoID']['input'];
  limit: Scalars['Int']['input'];
}>;


export type ViewsQuery = { __typename: 'Query', getEventLatestViews: { __typename: 'EventLatestViews', views: Array<{ __typename: 'Track', date: any, geoip_country?: string | null, geoip_region?: string | null, geoip_city?: string | null, user_agent?: string | null }> } };

export type GetEventTopViewsQueryVariables = Exact<{
  event: Scalars['MongoID']['input'];
  cityLimit: Scalars['Int']['input'];
  sourceLimit: Scalars['Int']['input'];
}>;


export type GetEventTopViewsQuery = { __typename: 'Query', getEventTopViews: { __typename: 'GetEventTopViewsResponse', total: number, by_city: Array<{ __typename: 'EventTopViewsByCity', count: number, geoip_city?: string | null, geoip_country?: string | null, geoip_region?: string | null }>, by_source: Array<{ __typename: 'EventTopViewsBySource', count: number, utm_source?: string | null }> } };

export type SubscribeEventLatestViewsSubscriptionVariables = Exact<{
  event: Scalars['MongoID']['input'];
}>;


export type SubscribeEventLatestViewsSubscription = { __typename?: 'Subscription', subscribeEventLatestViews: { __typename: 'Track', date: any, geoip_city?: string | null, geoip_country?: string | null, geoip_region?: string | null, user_agent?: string | null } };

export type GetSystemFilesQueryVariables = Exact<{
  categories?: InputMaybe<Array<FileCategory> | FileCategory>;
}>;


export type GetSystemFilesQuery = { __typename: 'Query', getSystemFiles: Array<{ __typename: 'SystemFile', _id?: any | null, name: string, category: FileCategory, url: string, type: string, bucket: string, key: string }> };

export type CreateFileUploadsMutationVariables = Exact<{
  uploadInfos: Array<FileUploadInfo> | FileUploadInfo;
  directory: Scalars['String']['input'];
}>;


export type CreateFileUploadsMutation = { __typename: 'Mutation', createFileUploads: Array<{ __typename: 'FileWithPresignedUrl', _id?: any | null, stamp: any, state: FileState, owner: any, type: string, size?: number | null, url: string, bucket: string, key: string, presignedUrl: string }> };

export type ConfirmFileUploadsMutationVariables = Exact<{
  ids: Array<Scalars['MongoID']['input']> | Scalars['MongoID']['input'];
}>;


export type ConfirmFileUploadsMutation = { __typename: 'Mutation', confirmFileUploads: boolean };

export type UpdateFileDescriptionMutationMutationVariables = Exact<{
  input: FileInput;
  id: Scalars['MongoID']['input'];
}>;


export type UpdateFileDescriptionMutationMutation = { __typename: 'Mutation', updateFile: { __typename: 'File', _id?: any | null, stamp: any, state: FileState, owner: any, type: string, size?: number | null, url: string, bucket: string, key: string, description?: string | null } };

export type UserFragment = { __typename: 'User', _id?: any | null, name: string, display_name?: string | null, first_name?: string | null, last_name?: string | null, username?: string | null, description?: string | null, job_title?: string | null, company_name?: string | null, handle_facebook?: string | null, handle_instagram?: string | null, handle_linkedin?: string | null, handle_twitter?: string | null, handle_farcaster?: string | null, handle_github?: string | null, pronoun?: string | null, calendly_url?: string | null, website?: string | null, url?: string | null, url_go?: string | null, lens_profile_synced?: boolean | null, followers?: number | null, following?: number | null, hosted?: number | null, addresses?: Array<{ __typename: 'Address', _id?: any | null, street_1?: string | null, street_2?: string | null, city?: string | null, region?: string | null, postal?: string | null, country?: string | null, title?: string | null, phone?: string | null, longitude?: number | null, latitude?: number | null, additional_directions?: string | null }> | null, icebreakers?: Array<{ __typename: 'UserIcebreaker', _id?: any | null, value: string, question_expanded?: { __typename: 'UserIcebreakerQuestion', _id: any, title: string } | null }> | null, new_photos_expanded?: Array<{ __typename: 'File', _id?: any | null, key: string, bucket: string } | null> | null } & { ' $fragmentName'?: 'UserFragment' };

export type PaymentAccountFragment = { __typename: 'NewPaymentAccount', _id: any, provider?: NewPaymentProvider | null, type: PaymentAccountType, title?: string | null, account_info: { __typename: 'DigitalAccount', currencies: Array<string>, currency_map?: any | null, account_id: string } | { __typename: 'EthereumAccount', currencies: Array<string>, currency_map?: any | null, address: string, network: string } | { __typename: 'EthereumEscrowAccount', currencies: Array<string>, currency_map?: any | null, address: string, network: string, minimum_deposit_percent: number, host_refund_percent: number, refund_policies?: Array<{ __typename: 'RefundPolicy', percent: number, timestamp: number }> | null } | { __typename: 'EthereumRelayAccount', currencies: Array<string>, currency_map?: any | null, address: string, network: string, payment_splitter_contract?: string | null } | { __typename: 'EthereumStakeAccount', currencies: Array<string>, currency_map?: any | null, address: string, network: string, config_id: string, requirement_checkin_before?: any | null } | { __typename: 'SafeAccount', currencies: Array<string>, currency_map?: any | null, address: string, network: string, owners: Array<string>, threshold: number, pending?: boolean | null } | { __typename: 'SolanaAccount', currencies: Array<string>, currency_map?: any | null, address: string, network: string } | { __typename: 'StripeAccount', currencies: Array<string>, currency_map?: any | null, account_id: string, publishable_key: string } } & { ' $fragmentName'?: 'PaymentAccountFragment' };

type AccountInfoFragment_DigitalAccount_Fragment = { __typename: 'DigitalAccount', currencies: Array<string>, currency_map?: any | null, account_id: string } & { ' $fragmentName'?: 'AccountInfoFragment_DigitalAccount_Fragment' };

type AccountInfoFragment_EthereumAccount_Fragment = { __typename: 'EthereumAccount', currencies: Array<string>, currency_map?: any | null, address: string, network: string } & { ' $fragmentName'?: 'AccountInfoFragment_EthereumAccount_Fragment' };

type AccountInfoFragment_EthereumEscrowAccount_Fragment = { __typename: 'EthereumEscrowAccount', currencies: Array<string>, currency_map?: any | null, address: string, network: string, minimum_deposit_percent: number, host_refund_percent: number, refund_policies?: Array<{ __typename: 'RefundPolicy', percent: number, timestamp: number }> | null } & { ' $fragmentName'?: 'AccountInfoFragment_EthereumEscrowAccount_Fragment' };

type AccountInfoFragment_EthereumRelayAccount_Fragment = { __typename: 'EthereumRelayAccount', currencies: Array<string>, currency_map?: any | null, address: string, network: string, payment_splitter_contract?: string | null } & { ' $fragmentName'?: 'AccountInfoFragment_EthereumRelayAccount_Fragment' };

type AccountInfoFragment_EthereumStakeAccount_Fragment = { __typename: 'EthereumStakeAccount', currencies: Array<string>, currency_map?: any | null, address: string, network: string, config_id: string, requirement_checkin_before?: any | null } & { ' $fragmentName'?: 'AccountInfoFragment_EthereumStakeAccount_Fragment' };

type AccountInfoFragment_SafeAccount_Fragment = { __typename: 'SafeAccount', currencies: Array<string>, currency_map?: any | null, address: string, network: string, owners: Array<string>, threshold: number, pending?: boolean | null } & { ' $fragmentName'?: 'AccountInfoFragment_SafeAccount_Fragment' };

type AccountInfoFragment_SolanaAccount_Fragment = { __typename: 'SolanaAccount', currencies: Array<string>, currency_map?: any | null, address: string, network: string } & { ' $fragmentName'?: 'AccountInfoFragment_SolanaAccount_Fragment' };

type AccountInfoFragment_StripeAccount_Fragment = { __typename: 'StripeAccount', currencies: Array<string>, currency_map?: any | null, account_id: string, publishable_key: string } & { ' $fragmentName'?: 'AccountInfoFragment_StripeAccount_Fragment' };

export type AccountInfoFragmentFragment = AccountInfoFragment_DigitalAccount_Fragment | AccountInfoFragment_EthereumAccount_Fragment | AccountInfoFragment_EthereumEscrowAccount_Fragment | AccountInfoFragment_EthereumRelayAccount_Fragment | AccountInfoFragment_EthereumStakeAccount_Fragment | AccountInfoFragment_SafeAccount_Fragment | AccountInfoFragment_SolanaAccount_Fragment | AccountInfoFragment_StripeAccount_Fragment;

export type ListLaunchpadGroupsQueryVariables = Exact<{
  address?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  space?: InputMaybe<Scalars['MongoID']['input']>;
}>;


export type ListLaunchpadGroupsQuery = { __typename: 'Query', listLaunchpadGroups: { __typename: 'ListLaunchpadGroupsResponse', items: Array<{ __typename: 'LaunchpadGroup', chain_id: number, address: string, cover_photo?: any | null, cover_photo_url?: string | null, implementation_address: string, name: string, description?: string | null, cover_photo_expanded?: { __typename: 'File', _id?: any | null, key: string, bucket: string } | null }> } };

export type AddLaunchpadCoinMutationVariables = Exact<{
  input: LaunchpadCoinInput;
}>;


export type AddLaunchpadCoinMutation = { __typename: 'Mutation', addLaunchpadCoin: { __typename: 'LaunchpadCoin', address: string } };

export type AddLaunchpadGroupMutationVariables = Exact<{
  input: AddLaunchpadGroupInput;
}>;


export type AddLaunchpadGroupMutation = { __typename: 'Mutation', addLaunchpadGroup: { __typename: 'LaunchpadGroup', address: string } };

export type ItemsQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  address?: InputMaybe<Scalars['String']['input']>;
}>;


export type ItemsQuery = { __typename: 'Query', listLaunchpadCoins: { __typename: 'ListLaunchpadCoinsResponse', items: Array<{ __typename: 'LaunchpadCoin', handle_telegram?: string | null, handle_discord?: string | null, handle_farcaster?: string | null, handle_twitter?: string | null, address: string, owner: any, website?: string | null }> } };

export type GetListLemonheadSponsorsQueryVariables = Exact<{
  wallet: Scalars['String']['input'];
}>;


export type GetListLemonheadSponsorsQuery = { __typename: 'Query', listLemonheadSponsors: { __typename: 'ListLemonheadSponsorsResponse', sponsors: Array<{ __typename: 'LemonheadSponsorDetail', limit?: number | null, remaining?: number | null, sponsor: { __typename: 'LemonheadSponsor', _id: any, name: string, image_url: string, message: string } }> } };

export type CanMintLemonheadQueryVariables = Exact<{
  wallet: Scalars['String']['input'];
}>;


export type CanMintLemonheadQuery = { __typename: 'Query', canMintLemonhead: { __typename: 'LemonheadMintingInfo', can_mint: boolean, price: string, white_list_enabled: boolean } };

export type CanMintPassportQueryVariables = Exact<{
  wallet: Scalars['String']['input'];
  provider: PassportProvider;
}>;


export type CanMintPassportQuery = { __typename: 'Query', canMintPassport: { __typename: 'PassportMintingInfo', can_mint: boolean, price: string, white_list_enabled: boolean } };

export type GetListMyLemonheadInvitationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetListMyLemonheadInvitationsQuery = { __typename: 'Query', listMyLemonheadInvitations: { __typename: 'ListMyLemonheadInvitationsResponse', invitations: Array<{ __typename: 'LemonheadInvitation', invitee_wallet?: string | null, minted_at?: any | null, user?: { __typename: 'LemonheadUserInfo', _id: any, username?: string | null, image_avatar?: string | null } | null }> } };

export type GetMyLemonheadInvitationRankQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyLemonheadInvitationRankQuery = { __typename: 'Query', getMyLemonheadInvitationRank: { __typename: 'LemonheadInvitationRank', rank: number, invitations_count: number, user: { __typename: 'LemonheadUserInfo', _id: any, name: string, display_name?: string | null, username?: string | null, image_avatar?: string | null, lemonhead_inviter_wallet?: string | null, kratos_wallet_address?: string | null } } };

export type GetLemonheadInvitationRankQueryVariables = Exact<{
  skip: Scalars['Int']['input'];
  limit: Scalars['Int']['input'];
}>;


export type GetLemonheadInvitationRankQuery = { __typename: 'Query', getLemonheadInvitationRank: { __typename: 'GetMyLemonheadInvitationRankResponse', total: number, items: Array<{ __typename: 'LemonheadInvitationRank', rank: number, invitations_count: number, user: { __typename: 'LemonheadUserInfo', _id: any, name: string, display_name?: string | null, username?: string | null, image_avatar?: string | null, lemonhead_inviter_wallet?: string | null, kratos_wallet_address?: string | null } }> } };

export type SetUserWalletMutationVariables = Exact<{
  token: Scalars['String']['input'];
  signature: Scalars['String']['input'];
}>;


export type SetUserWalletMutation = { __typename: 'Mutation', setUserWallet: boolean };

export type UpdateMyLemonheadInvitationsMutationVariables = Exact<{
  invitations: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type UpdateMyLemonheadInvitationsMutation = { __typename: 'Mutation', updateMyLemonheadInvitations: { __typename: 'UpdateMyLemonheadInvitationsResponse', success: boolean, message?: string | null, wallets?: Array<string> | null } };

export type ListChainsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListChainsQuery = { __typename: 'Query', listChains: Array<{ __typename: 'Chain', active?: boolean | null, platform: string, chain_id: string, name: string, code_name: string, rpc_url: string, block_explorer_url?: string | null, block_explorer_name?: string | null, block_explorer_for_tx?: string | null, block_explorer_for_token?: string | null, block_explorer_for_address?: string | null, block_explorer_icon_url?: string | null, block_time: number, safe_confirmations: number, logo_url?: string | null, access_registry_contract?: string | null, poap_contract?: string | null, marketplace_contract?: string | null, marketplace_version?: number | null, biconomy_api_key?: string | null, ens_registry?: string | null, proxy_admin_contract?: string | null, payment_config_registry_contract?: string | null, escrow_manager_contract?: string | null, relay_payment_contract?: string | null, stake_payment_contract?: string | null, reward_registry_contract?: string | null, eas_event_contract?: string | null, eas_graphql_url?: string | null, aragon_network?: string | null, axelar_chain_name?: string | null, donation_registry_contract?: string | null, lemonhead_contract_address?: string | null, lemonade_passport_contract_address?: string | null, zugrama_passport_contract_address?: string | null, vinyl_nation_passport_contract_address?: string | null, drip_nation_passport_contract_address?: string | null, festival_nation_passport_contract_address?: string | null, lemonade_username_contract_address?: string | null, poap_enabled?: boolean | null, launchpad_closed_permissions_contract_address?: string | null, launchpad_treasury_address_fee_split_manager_implementation_contract_address?: string | null, launchpad_treasury_staking_manager_implementation_contract_address?: string | null, launchpad_zap_contract_address?: string | null, launchpad_fee_escrow_contract_address?: string | null, launchpad_market_capped_price_contract_address?: string | null, launchpad_market_utils_contract_address?: string | null, tokens?: Array<{ __typename: 'Token', active?: boolean | null, name: string, symbol: string, decimals: number, contract: string, logo_url?: string | null, is_native?: boolean | null }> | null }> };

export type GetUserWalletRequestQueryVariables = Exact<{
  wallet: Scalars['String']['input'];
}>;


export type GetUserWalletRequestQuery = { __typename: 'Query', getUserWalletRequest: { __typename: 'UserWalletRequest', message: string, token: string } };

export type GetSelfVerificationStatusQueryVariables = Exact<{
  config: SelfVerificationConfigInput;
}>;


export type GetSelfVerificationStatusQuery = { __typename: 'Query', getSelfVerificationStatus: { __typename: 'SelfVerificationStatus', disclosures: Array<{ __typename: 'SelfDisclosureStatus', type: string, verified: boolean }> } };

export type CreateSelfVerificationRequestMutationVariables = Exact<{
  config: SelfVerificationConfigInput;
}>;


export type CreateSelfVerificationRequestMutation = { __typename: 'Mutation', createSelfVerificationRequest: { __typename: 'UserSelfRequest', endpoint: string, endpoint_type: string, scope: string, uuid: string } };

export type CreateOauth2ClientMutationVariables = Exact<{
  input: Oauth2ClientInput;
}>;


export type CreateOauth2ClientMutation = { __typename: 'Mutation', createOauth2Client: { __typename: 'OAuth2Client', client_id: string, client_secret?: string | null, audience: Array<string> } };

export type CreateStripeCardMutationVariables = Exact<{
  paymentMethod: Scalars['String']['input'];
}>;


export type CreateStripeCardMutation = { __typename: 'Mutation', createStripeCard: { __typename: 'StripeCard', _id: any, provider_id: string } };

export type GetStripeCardsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetStripeCardsQuery = { __typename: 'Query', getStripeCards: Array<{ __typename: 'StripeCard', _id: any, active: boolean, brand: string, last4: string, name: string, provider_id: string, stamp: any, user: any }> };

export type UpdatePaymentMutationVariables = Exact<{
  input: UpdatePaymentInput;
}>;


export type UpdatePaymentMutation = { __typename: 'Mutation', updatePayment: { __typename: 'NewPayment', _id: any, transfer_metadata?: any | null, state: NewPaymentState, failure_reason?: string | null } };

export type GetNewPaymentQueryVariables = Exact<{
  id: Scalars['MongoID']['input'];
  paymentSecret?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetNewPaymentQuery = { __typename: 'Query', getNewPayment?: { __typename: 'NewPayment', _id: any, due_amount?: string | null, amount: string, currency: string, ref_data?: any | null, state: NewPaymentState, failure_reason?: string | null, account_expanded?: { __typename: 'NewPaymentAccount', _id: any, type: PaymentAccountType, account_info: { __typename: 'DigitalAccount' } | { __typename: 'EthereumAccount' } | { __typename: 'EthereumEscrowAccount', currencies: Array<string>, currency_map?: any | null, address: string, network: string, minimum_deposit_percent: number, host_refund_percent: number, refund_policies?: Array<{ __typename: 'RefundPolicy', percent: number, timestamp: number }> | null } | { __typename: 'EthereumRelayAccount' } | { __typename: 'EthereumStakeAccount' } | { __typename: 'SafeAccount' } | { __typename: 'SolanaAccount' } | { __typename: 'StripeAccount' } } | null } | null };

export type GetPaymentRefundSignatureQueryVariables = Exact<{
  id: Scalars['MongoID']['input'];
}>;


export type GetPaymentRefundSignatureQuery = { __typename: 'Query', getPaymentRefundSignature: { __typename: 'PaymentRefundSignature', args: Array<any>, signature: string } };

export type CancelPaymentMutationVariables = Exact<{
  input: CancelPaymentInput;
}>;


export type CancelPaymentMutation = { __typename: 'Mutation', cancelPayment: boolean };

export type GenerateStripeAccountLinkMutationVariables = Exact<{
  refreshUrl: Scalars['String']['input'];
  returnUrl: Scalars['String']['input'];
}>;


export type GenerateStripeAccountLinkMutation = { __typename: 'Mutation', generateStripeAccountLink: { __typename: 'GenerateStripeAccountLinkResponse', url: string } };

export type ListNewPaymentAccountsQueryVariables = Exact<{
  id?: InputMaybe<Array<Scalars['MongoID']['input']> | Scalars['MongoID']['input']>;
  type?: InputMaybe<PaymentAccountType>;
  provider?: InputMaybe<NewPaymentProvider>;
}>;


export type ListNewPaymentAccountsQuery = { __typename: 'Query', listNewPaymentAccounts: Array<{ __typename: 'NewPaymentAccount', _id: any, active: boolean, provider?: NewPaymentProvider | null, created_at: any, type: PaymentAccountType, user: any, title?: string | null, account_info: (
      { __typename: 'DigitalAccount' }
      & { ' $fragmentRefs'?: { 'AccountInfoFragment_DigitalAccount_Fragment': AccountInfoFragment_DigitalAccount_Fragment } }
    ) | (
      { __typename: 'EthereumAccount' }
      & { ' $fragmentRefs'?: { 'AccountInfoFragment_EthereumAccount_Fragment': AccountInfoFragment_EthereumAccount_Fragment } }
    ) | (
      { __typename: 'EthereumEscrowAccount' }
      & { ' $fragmentRefs'?: { 'AccountInfoFragment_EthereumEscrowAccount_Fragment': AccountInfoFragment_EthereumEscrowAccount_Fragment } }
    ) | (
      { __typename: 'EthereumRelayAccount' }
      & { ' $fragmentRefs'?: { 'AccountInfoFragment_EthereumRelayAccount_Fragment': AccountInfoFragment_EthereumRelayAccount_Fragment } }
    ) | (
      { __typename: 'EthereumStakeAccount' }
      & { ' $fragmentRefs'?: { 'AccountInfoFragment_EthereumStakeAccount_Fragment': AccountInfoFragment_EthereumStakeAccount_Fragment } }
    ) | (
      { __typename: 'SafeAccount' }
      & { ' $fragmentRefs'?: { 'AccountInfoFragment_SafeAccount_Fragment': AccountInfoFragment_SafeAccount_Fragment } }
    ) | (
      { __typename: 'SolanaAccount' }
      & { ' $fragmentRefs'?: { 'AccountInfoFragment_SolanaAccount_Fragment': AccountInfoFragment_SolanaAccount_Fragment } }
    ) | (
      { __typename: 'StripeAccount' }
      & { ' $fragmentRefs'?: { 'AccountInfoFragment_StripeAccount_Fragment': AccountInfoFragment_StripeAccount_Fragment } }
    ) }> };

export type CreateNewPaymentAccountMutationVariables = Exact<{
  type: PaymentAccountType;
  provider?: InputMaybe<NewPaymentProvider>;
  account_info?: InputMaybe<Scalars['JSON']['input']>;
}>;


export type CreateNewPaymentAccountMutation = { __typename: 'Mutation', createNewPaymentAccount: { __typename: 'NewPaymentAccount', _id: any, active: boolean, provider?: NewPaymentProvider | null, created_at: any, type: PaymentAccountType, user: any, title?: string | null, account_info: (
      { __typename: 'DigitalAccount' }
      & { ' $fragmentRefs'?: { 'AccountInfoFragment_DigitalAccount_Fragment': AccountInfoFragment_DigitalAccount_Fragment } }
    ) | (
      { __typename: 'EthereumAccount' }
      & { ' $fragmentRefs'?: { 'AccountInfoFragment_EthereumAccount_Fragment': AccountInfoFragment_EthereumAccount_Fragment } }
    ) | (
      { __typename: 'EthereumEscrowAccount' }
      & { ' $fragmentRefs'?: { 'AccountInfoFragment_EthereumEscrowAccount_Fragment': AccountInfoFragment_EthereumEscrowAccount_Fragment } }
    ) | (
      { __typename: 'EthereumRelayAccount' }
      & { ' $fragmentRefs'?: { 'AccountInfoFragment_EthereumRelayAccount_Fragment': AccountInfoFragment_EthereumRelayAccount_Fragment } }
    ) | (
      { __typename: 'EthereumStakeAccount' }
      & { ' $fragmentRefs'?: { 'AccountInfoFragment_EthereumStakeAccount_Fragment': AccountInfoFragment_EthereumStakeAccount_Fragment } }
    ) | (
      { __typename: 'SafeAccount' }
      & { ' $fragmentRefs'?: { 'AccountInfoFragment_SafeAccount_Fragment': AccountInfoFragment_SafeAccount_Fragment } }
    ) | (
      { __typename: 'SolanaAccount' }
      & { ' $fragmentRefs'?: { 'AccountInfoFragment_SolanaAccount_Fragment': AccountInfoFragment_SolanaAccount_Fragment } }
    ) | (
      { __typename: 'StripeAccount' }
      & { ' $fragmentRefs'?: { 'AccountInfoFragment_StripeAccount_Fragment': AccountInfoFragment_StripeAccount_Fragment } }
    ) } };

export type UpdateEventPaymentAccountsMutationVariables = Exact<{
  id: Scalars['MongoID']['input'];
  payment_accounts_new?: InputMaybe<Array<Scalars['MongoID']['input']> | Scalars['MongoID']['input']>;
}>;


export type UpdateEventPaymentAccountsMutation = { __typename: 'Mutation', updateEvent: { __typename: 'Event', payment_accounts_new?: Array<any> | null, payment_accounts_expanded?: Array<(
      { __typename: 'NewPaymentAccount' }
      & { ' $fragmentRefs'?: { 'PaymentAccountFragment': PaymentAccountFragment } }
    ) | null> | null } };

export type SpaceFragment = { __typename: 'Space', _id: any, title: string, description?: string | null, is_ambassador?: boolean | null, followed?: boolean | null, followers?: Array<any> | null, followers_count?: number | null, image_avatar?: any | null, image_cover?: any | null, creator: any, slug?: string | null, private?: boolean | null, listed_events?: Array<any> | null, website?: string | null, handle_instagram?: string | null, handle_twitter?: string | null, handle_linkedin?: string | null, handle_youtube?: string | null, handle_tiktok?: string | null, personal?: boolean | null, theme_data?: any | null, sub_spaces?: Array<any> | null, lens_feed_id?: string | null, state: SpaceState, nft_enabled?: boolean | null, theme_name?: string | null, admins?: Array<{ __typename: 'User', _id?: any | null, image_avatar?: string | null }> | null, image_avatar_expanded?: { __typename: 'File', _id?: any | null, bucket: string, url: string, type: string, key: string } | null, image_cover_expanded?: { __typename: 'File', _id?: any | null, bucket: string, url: string, type: string, key: string } | null, creator_expanded?: { __typename: 'User', _id?: any | null, name: string, image_avatar?: string | null } | null, address?: { __typename: 'Address', _id?: any | null, city?: string | null, country?: string | null, latitude?: number | null, longitude?: number | null, street_1?: string | null, street_2?: string | null, region?: string | null, title?: string | null } | null, council_members?: Array<{ __typename: 'SpaceCouncilMember', wallet: string, user?: { __typename: 'BasicUserInfo', _id: any, display_name?: string | null, username?: string | null, image_avatar?: string | null } | null }> | null } & { ' $fragmentName'?: 'SpaceFragment' };

export type SpaceTagFragmentFragment = { __typename: 'SpaceTag', _id: any, color: string, space: any, tag: string, targets?: Array<string> | null, type: SpaceTagType } & { ' $fragmentName'?: 'SpaceTagFragmentFragment' };

export type SpaceEventRequestFragmentFragment = { __typename: 'SpaceEventRequest', _id: any, created_at: any, space: any, event: any, state: SpaceEventRequestState, decided_at?: any | null, decided_by?: any | null } & { ' $fragmentName'?: 'SpaceEventRequestFragmentFragment' };

export type GetSpacesQueryVariables = Exact<{
  with_my_spaces?: InputMaybe<Scalars['Boolean']['input']>;
  with_public_spaces?: InputMaybe<Scalars['Boolean']['input']>;
  roles?: InputMaybe<Array<SpaceRole> | SpaceRole>;
  featured?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetSpacesQuery = { __typename: 'Query', listSpaces: Array<(
    { __typename: 'Space' }
    & { ' $fragmentRefs'?: { 'SpaceFragment': SpaceFragment } }
  )> };

export type GetSpaceQueryVariables = Exact<{
  id?: InputMaybe<Scalars['MongoID']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  hostname?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetSpaceQuery = { __typename: 'Query', getSpace?: (
    { __typename: 'Space' }
    & { ' $fragmentRefs'?: { 'SpaceFragment': SpaceFragment } }
  ) | null };

export type GetSpaceEventsQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  startFrom?: InputMaybe<Scalars['DateTimeISO']['input']>;
  startTo?: InputMaybe<Scalars['DateTimeISO']['input']>;
  space?: InputMaybe<Scalars['MongoID']['input']>;
  sort?: InputMaybe<EventSortInput>;
  endFrom?: InputMaybe<Scalars['DateTimeISO']['input']>;
  endTo?: InputMaybe<Scalars['DateTimeISO']['input']>;
  spaceTags?: InputMaybe<Array<Scalars['MongoID']['input']> | Scalars['MongoID']['input']>;
}>;


export type GetSpaceEventsQuery = { __typename: 'Query', getEvents: Array<{ __typename: 'Event', _id?: any | null, shortid: string, title: string, published?: boolean | null, start: any, end: any, timezone?: string | null, external_url?: string | null, external_hostname?: string | null, host_expanded_new?: { __typename: 'UserWithEmail', _id?: any | null, image_avatar?: string | null, name: string } | null, visible_cohosts_expanded_new?: Array<{ __typename: 'PossibleUserWithEmail', _id?: any | null, image_avatar?: string | null, name?: string | null } | null> | null, address?: { __typename: 'Address', city?: string | null, country?: string | null, region?: string | null, latitude?: number | null, longitude?: number | null } | null, new_new_photos_expanded?: Array<{ __typename: 'File', _id?: any | null, bucket: string, key: string, type: string, url: string } | null> | null, event_ticket_types?: Array<{ __typename: 'EventTicketType', _id: any, prices: Array<{ __typename: 'EventTicketPrice', cost: string, currency: string, default?: boolean | null, payment_accounts?: Array<any> | null, payment_accounts_expanded?: Array<(
          { __typename: 'NewPaymentAccount' }
          & { ' $fragmentRefs'?: { 'PaymentAccountFragment': PaymentAccountFragment } }
        )> | null }> }> | null }> };

export type GetSpaceEventsCalendarQueryVariables = Exact<{
  space?: InputMaybe<Scalars['MongoID']['input']>;
}>;


export type GetSpaceEventsCalendarQuery = { __typename: 'Query', getEvents: Array<{ __typename: 'Event', _id?: any | null, start: any, address?: { __typename: 'Address', _id?: any | null, latitude?: number | null, longitude?: number | null } | null }> };

export type GetSpaceTagsQueryVariables = Exact<{
  space: Scalars['MongoID']['input'];
}>;


export type GetSpaceTagsQuery = { __typename: 'Query', listSpaceTags: Array<(
    { __typename: 'SpaceTag' }
    & { ' $fragmentRefs'?: { 'SpaceTagFragmentFragment': SpaceTagFragmentFragment } }
  )> };

export type GetSpaceEventRequestsQueryVariables = Exact<{
  space: Scalars['MongoID']['input'];
  skip: Scalars['Int']['input'];
  limit: Scalars['Int']['input'];
  state?: InputMaybe<EventJoinRequestState>;
}>;


export type GetSpaceEventRequestsQuery = { __typename: 'Query', getSpaceEventRequests: { __typename: 'GetSpaceEventRequestsResponse', total: number, records: Array<{ __typename: 'SpaceEventRequest', _id: any, created_at: any, space: any, event: any, state: SpaceEventRequestState, decided_at?: any | null, decided_by?: any | null, created_by_expanded?: { __typename: 'User', name: string, display_name?: string | null, email?: string | null } | null, event_expanded?: { __typename: 'Event', title: string, start: any, timezone?: string | null, guests?: number | null, address?: { __typename: 'Address', city?: string | null, country?: string | null, region?: string | null } | null, new_new_photos_expanded?: Array<{ __typename: 'File', _id?: any | null, bucket: string, key: string, type: string, url: string } | null> | null } | null }> } };

export type GetMySpaceEventRequestsQueryVariables = Exact<{
  space: Scalars['MongoID']['input'];
  skip: Scalars['Int']['input'];
  limit: Scalars['Int']['input'];
  state?: InputMaybe<EventJoinRequestState>;
}>;


export type GetMySpaceEventRequestsQuery = { __typename: 'Query', getMySpaceEventRequests: { __typename: 'GetSpaceEventRequestsResponse', records: Array<{ __typename: 'SpaceEventRequest', _id: any, state: SpaceEventRequestState, event_expanded?: { __typename: 'Event', _id?: any | null, title: string, new_new_photos_expanded?: Array<{ __typename: 'File', key: string, bucket: string, _id?: any | null, url: string, type: string } | null> | null } | null }> } };

export type GetSubSpacesQueryVariables = Exact<{
  id: Scalars['MongoID']['input'];
}>;


export type GetSubSpacesQuery = { __typename: 'Query', getSubSpaces?: Array<{ __typename: 'PublicSpace', _id: any, title: string, description?: string | null, followers_count?: number | null, slug?: string | null, is_admin?: boolean | null, followed?: boolean | null, image_avatar_expanded?: { __typename: 'File', _id?: any | null, bucket: string, url: string, type: string, key: string } | null }> | null };

export type GetListSpaceCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetListSpaceCategoriesQuery = { __typename: 'Query', listSpaceCategories: Array<{ __typename: 'SpaceCategory', description?: string | null, image_url?: string | null, listed_events_count?: number | null, space: any, title: string }> };

export type GetListGeoRegionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetListGeoRegionsQuery = { __typename: 'Query', listGeoRegions: Array<{ __typename: 'GeoRegion', _id: any, title: string, cities: Array<{ __typename: 'GeoCity', name: string, region: any, space: any, icon_url?: string | null, listed_events_count?: number | null }> }> };

export type CheckSpaceSlugQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type CheckSpaceSlugQuery = { __typename: 'Query', canUseSpaceSlug: boolean };

export type SearchSpacesQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  input?: InputMaybe<SearchSpaceInput>;
}>;


export type SearchSpacesQuery = { __typename: 'Query', searchSpaces: { __typename: 'SearchSpacesResponse', total: number, items: Array<(
      { __typename: 'Space' }
      & { ' $fragmentRefs'?: { 'SpaceFragment': SpaceFragment } }
    )> } };

export type GetSpaceMembersQueryVariables = Exact<{
  space: Scalars['MongoID']['input'];
  roles?: InputMaybe<Array<SpaceRole> | SpaceRole>;
  state?: InputMaybe<SpaceMembershipState>;
  visible?: InputMaybe<Scalars['Boolean']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<SortInput>;
  deletion?: InputMaybe<Scalars['Boolean']['input']>;
  tags?: InputMaybe<Array<Scalars['MongoID']['input']> | Scalars['MongoID']['input']>;
}>;


export type GetSpaceMembersQuery = { __typename: 'Query', listSpaceMembers: { __typename: 'ListSpaceMembersResponse', total: number, items: Array<{ __typename: 'SpaceMember', _id?: any | null, user?: any | null, user_name?: string | null, email?: string | null, space?: any | null, role?: SpaceRole | null, state?: SpaceMembershipState | null, visible?: boolean | null, role_changed_at?: any | null, deleted_at?: any | null, event_count?: number | null, checkin_count?: number | null, user_expanded?: { __typename: 'UserWithEmail', _id?: any | null, name: string, display_name?: string | null, email?: string | null, new_photos_expanded?: Array<{ __typename: 'File', _id?: any | null, key: string, bucket: string } | null> | null } | null, tags?: Array<{ __typename: 'SpaceTag', _id: any, space: any, tag: string, color: string, type: SpaceTagType, targets?: Array<string> | null, targets_count?: number | null }> | null }> } };

export type FollowSpaceMutationVariables = Exact<{
  space: Scalars['MongoID']['input'];
}>;


export type FollowSpaceMutation = { __typename: 'Mutation', followSpace: boolean };

export type UnfollowSpaceMutationVariables = Exact<{
  space: Scalars['MongoID']['input'];
}>;


export type UnfollowSpaceMutation = { __typename: 'Mutation', unfollowSpace: boolean };

export type UpdateSpaceMutationVariables = Exact<{
  id: Scalars['MongoID']['input'];
  input: SpaceInput;
}>;


export type UpdateSpaceMutation = { __typename: 'Mutation', updateSpace?: (
    { __typename: 'Space' }
    & { ' $fragmentRefs'?: { 'SpaceFragment': SpaceFragment } }
  ) | null };

export type PinEventsToSpaceMutationVariables = Exact<{
  space: Scalars['MongoID']['input'];
  events: Array<Scalars['MongoID']['input']> | Scalars['MongoID']['input'];
  tags?: InputMaybe<Array<Scalars['MongoID']['input']> | Scalars['MongoID']['input']>;
}>;


export type PinEventsToSpaceMutation = { __typename: 'Mutation', pinEventsToSpace: { __typename: 'PinEventsToSpaceResponse', requests?: Array<(
      { __typename: 'SpaceEventRequest' }
      & { ' $fragmentRefs'?: { 'SpaceEventRequestFragmentFragment': SpaceEventRequestFragmentFragment } }
    )> | null } };

export type CreateExternalEventMutationVariables = Exact<{
  input: EventInput;
}>;


export type CreateExternalEventMutation = { __typename: 'Mutation', createEvent: { __typename: 'Event', _id?: any | null } };

export type CreateSpaceMutationVariables = Exact<{
  input: SpaceInput;
}>;


export type CreateSpaceMutation = { __typename: 'Mutation', createSpace: (
    { __typename: 'Space' }
    & { ' $fragmentRefs'?: { 'SpaceFragment': SpaceFragment } }
  ) };

export type DecideSpaceEventRequestsMutationVariables = Exact<{
  input: DecideSpaceEventRequestsInput;
}>;


export type DecideSpaceEventRequestsMutation = { __typename: 'Mutation', decideSpaceEventRequests: boolean };

export type AddSpaceMembersMutationVariables = Exact<{
  input: AddSpaceMemberInput;
}>;


export type AddSpaceMembersMutation = { __typename: 'Mutation', addSpaceMembers: boolean };

export type DeleteSpaceMembersMutationVariables = Exact<{
  input: DeleteSpaceMemberInput;
}>;


export type DeleteSpaceMembersMutation = { __typename: 'Mutation', deleteSpaceMembers: Array<{ __typename: 'SpaceMember', _id?: any | null, role?: SpaceRole | null, state?: SpaceMembershipState | null, user?: any | null, user_name?: string | null, email?: string | null, deleted_at?: any | null, role_changed_at?: any | null, visible?: boolean | null, user_expanded?: { __typename: 'UserWithEmail', _id?: any | null, name: string, email?: string | null, image_avatar?: string | null } | null }> };

export type DeleteSpaceMutationVariables = Exact<{
  id: Scalars['MongoID']['input'];
}>;


export type DeleteSpaceMutation = { __typename: 'Mutation', deleteSpace: boolean };

export type UpsertSpaceTagMutationVariables = Exact<{
  input: SpaceTagInput;
}>;


export type UpsertSpaceTagMutation = { __typename: 'Mutation', insertSpaceTag: (
    { __typename: 'SpaceTag' }
    & { ' $fragmentRefs'?: { 'SpaceTagFragmentFragment': SpaceTagFragmentFragment } }
  ) };

export type ManageSpaceTagMutationVariables = Exact<{
  tagged: Scalars['Boolean']['input'];
  target: Scalars['String']['input'];
  id: Scalars['MongoID']['input'];
  space: Scalars['MongoID']['input'];
}>;


export type ManageSpaceTagMutation = { __typename: 'Mutation', manageSpaceTag: boolean };

export type DeleteSpaceTagMutationVariables = Exact<{
  id: Scalars['MongoID']['input'];
  space: Scalars['MongoID']['input'];
}>;


export type DeleteSpaceTagMutation = { __typename: 'Mutation', deleteSpaceTag: boolean };

export type AttachSubSpacesMutationVariables = Exact<{
  id: Scalars['MongoID']['input'];
  subSpaces: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type AttachSubSpacesMutation = { __typename: 'Mutation', attachSubSpaces: boolean };

export type RemoveSubSpacesMutationVariables = Exact<{
  subSpaces: Array<Scalars['MongoID']['input']> | Scalars['MongoID']['input'];
  id: Scalars['MongoID']['input'];
}>;


export type RemoveSubSpacesMutation = { __typename: 'Mutation', removeSubSpaces: boolean };

export type UpdateSubSpaceOrderMutationVariables = Exact<{
  id: Scalars['MongoID']['input'];
  subSpaces: Array<Scalars['MongoID']['input']> | Scalars['MongoID']['input'];
}>;


export type UpdateSubSpaceOrderMutation = { __typename: 'Mutation', updateSubSpaceOrder: boolean };

export type GetSpaceNfTsQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  space?: InputMaybe<Scalars['MongoID']['input']>;
  kind?: InputMaybe<SpaceNftKind>;
}>;


export type GetSpaceNfTsQuery = { __typename: 'Query', listSpaceNFTs: { __typename: 'ListSpaceNFTsResponse', total: number, items: Array<{ __typename: 'SpaceNFT', _id: any, cover_image_url: string, name: string, content_url?: string | null, kind: string, token_limit: number, contracts: Array<{ __typename: 'SpaceNFTContract', _id: any, space_nft: any, network_id: string, mint_price?: string | null, currency_address?: string | null, deployed_contract_address?: string | null }> }> } };

export type CalculateTicketsPricingQueryVariables = Exact<{
  input: CalculateTicketsPricingInput;
}>;


export type CalculateTicketsPricingQuery = { __typename: 'Query', calculateTicketsPricing: { __typename: 'PricingInfo', discount: string, subtotal: string, total: string, deposit_infos?: Array<{ __typename: 'EscrowDepositInfo', minimum_amount: string, minimum_percent: number }> | null, payment_accounts: Array<{ __typename: 'PaymentAccountInfo', _id: any, active: boolean, created_at: any, fee?: string | null, provider?: NewPaymentProvider | null, title?: string | null, type: PaymentAccountType, user: any, account_info: { __typename: 'DigitalAccount', currencies: Array<string>, currency_map?: any | null, account_id: string } | { __typename: 'EthereumAccount', currencies: Array<string>, currency_map?: any | null, address: string, network: string } | { __typename: 'EthereumEscrowAccount', currencies: Array<string>, currency_map?: any | null, address: string, network: string, minimum_deposit_percent: number, host_refund_percent: number, refund_policies?: Array<{ __typename: 'RefundPolicy', percent: number, timestamp: number }> | null } | { __typename: 'EthereumRelayAccount', currencies: Array<string>, currency_map?: any | null, address: string, network: string, payment_splitter_contract?: string | null } | { __typename: 'EthereumStakeAccount', currencies: Array<string>, currency_map?: any | null, address: string, network: string, config_id: string, requirement_checkin_before?: any | null } | { __typename: 'SafeAccount', currencies: Array<string>, currency_map?: any | null, address: string, network: string, owners: Array<string>, threshold: number, pending?: boolean | null } | { __typename: 'SolanaAccount', currencies: Array<string>, currency_map?: any | null, address: string, network: string } | { __typename: 'StripeAccount', currencies: Array<string>, currency_map?: any | null, account_id: string, publishable_key: string }, escrow?: { __typename: 'EscrowDepositInfo', minimum_amount: string, minimum_percent: number } | null, relay?: { __typename: 'RelayPaymentInfo', payment_splitter_contract: string } | null }> } };

export type GetMyTicketsQueryVariables = Exact<{
  event: Scalars['MongoID']['input'];
  withPaymentInfo?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetMyTicketsQuery = { __typename: 'Query', getMyTickets: { __typename: 'GetMyTicketsResponse', tickets: Array<{ __typename: 'Ticket', _id: any, accepted?: boolean | null, assigned_email?: string | null, assigned_to?: any | null, event: any, invited_by?: any | null, type: any, shortid: string, assigned_to_expanded?: { __typename: 'User', _id?: any | null, name: string, new_photos_expanded?: Array<{ __typename: 'File', _id?: any | null, key: string, bucket: string } | null> | null } | null, type_expanded?: { __typename: 'EventTicketType', _id: any, title: string, prices: Array<{ __typename: 'EventTicketPrice', cost: string, currency: string, default?: boolean | null, payment_accounts?: Array<any> | null, payment_accounts_expanded?: Array<(
            { __typename: 'NewPaymentAccount' }
            & { ' $fragmentRefs'?: { 'PaymentAccountFragment': PaymentAccountFragment } }
          )> | null }> } | null, event_expanded?: { __typename: 'Event', _id?: any | null, title: string } | null }>, payments?: Array<{ __typename: 'PaymentRefundInfo', _id: any, state: NewPaymentState, amount: string, attempting_refund?: boolean | null, currency: string, refund_requirements_met?: boolean | null, refund_info?: { __typename: 'RefundInfo', available_amount: string, refunded?: boolean | null } | null, refund_policy?: { __typename: 'PaymentRefundPolicy', percent: number, satisfy_all?: boolean | null, requirements?: { __typename: 'RefundRequirements', checkin_before?: any | null } | null } | null, payment_account: { __typename: 'NewPaymentAccount', _id: any, type: PaymentAccountType, account_info: { __typename: 'DigitalAccount' } | { __typename: 'EthereumAccount' } | { __typename: 'EthereumEscrowAccount' } | { __typename: 'EthereumRelayAccount' } | { __typename: 'EthereumStakeAccount', currencies: Array<string>, currency_map?: any | null, address: string, network: string, config_id: string, requirement_checkin_before?: any | null } | { __typename: 'SafeAccount' } | { __typename: 'SolanaAccount' } | { __typename: 'StripeAccount' } } }> | null } };

export type RedeemTicketsMutationVariables = Exact<{
  event: Scalars['MongoID']['input'];
  items: Array<PurchasableItem> | PurchasableItem;
  buyer_info?: InputMaybe<BuyerInfoInput>;
  inviter?: InputMaybe<Scalars['MongoID']['input']>;
  user_info?: InputMaybe<UserInput>;
  connect_wallets?: InputMaybe<Array<ConnectWalletInput> | ConnectWalletInput>;
  buyer_wallet?: InputMaybe<Scalars['String']['input']>;
  passcodes?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type RedeemTicketsMutation = { __typename: 'Mutation', redeemTickets: { __typename: 'RedeemTicketsResponse', tickets?: Array<{ __typename: 'Ticket', _id: any, accepted?: boolean | null, assigned_email?: string | null, assigned_to?: any | null, event: any, invited_by?: any | null, type: any }> | null, join_request?: { __typename: 'EventJoinRequest', _id: any, state: EventJoinRequestState } | null } };

export type BuyTicketsMutationVariables = Exact<{
  input: BuyTicketsInput;
}>;


export type BuyTicketsMutation = { __typename: 'Mutation', buyTickets: { __typename: 'BuyTicketsResponse', payment: { __typename: 'NewPayment', _id: any, failure_reason?: string | null, state: NewPaymentState, stamps: any, transfer_metadata?: any | null }, join_request?: { __typename: 'EventJoinRequest', _id: any, state: EventJoinRequestState } | null } };

export type CreateEventTicketTypeMutationVariables = Exact<{
  input: EventTicketTypeInput;
}>;


export type CreateEventTicketTypeMutation = { __typename: 'Mutation', createEventTicketType: { __typename: 'EventTicketType', _id: any, active?: boolean | null, private?: boolean | null, default?: boolean | null, description?: string | null, photos?: Array<any> | null, ticket_limit?: number | null, title: string, limited?: boolean | null, category?: any | null, position?: number | null, photos_expanded?: Array<{ __typename: 'File', _id?: any | null, bucket: string, key: string } | null> | null, prices: Array<{ __typename: 'EventTicketPrice', cost: string, currency: string, default?: boolean | null, payment_accounts?: Array<any> | null, payment_accounts_expanded?: Array<(
        { __typename: 'NewPaymentAccount' }
        & { ' $fragmentRefs'?: { 'PaymentAccountFragment': PaymentAccountFragment } }
      )> | null }>, limited_whitelist_users?: Array<{ __typename: 'WhitelistUserInfo', _id?: any | null, email: string }> | null, category_expanded?: { __typename: 'EventTicketCategory', _id: any, description?: string | null, title: string, position?: number | null } | null } };

export type DeleteEventTicketTypeMutationVariables = Exact<{
  event: Scalars['MongoID']['input'];
  id: Scalars['MongoID']['input'];
}>;


export type DeleteEventTicketTypeMutation = { __typename: 'Mutation', deleteEventTicketType: boolean };

export type UpdateEventTicketTypeMutationVariables = Exact<{
  input: EventTicketTypeInput;
  id: Scalars['MongoID']['input'];
}>;


export type UpdateEventTicketTypeMutation = { __typename: 'Mutation', updateEventTicketType: { __typename: 'EventTicketType', _id: any, active?: boolean | null, default?: boolean | null, private?: boolean | null, description?: string | null, event: any, photos?: Array<any> | null, ticket_limit?: number | null, title: string, limited?: boolean | null, category?: any | null, position?: number | null, photos_expanded?: Array<{ __typename: 'File', _id?: any | null, bucket: string, key: string } | null> | null, prices: Array<{ __typename: 'EventTicketPrice', cost: string, currency: string, default?: boolean | null, payment_accounts?: Array<any> | null, payment_accounts_expanded?: Array<(
        { __typename: 'NewPaymentAccount' }
        & { ' $fragmentRefs'?: { 'PaymentAccountFragment': PaymentAccountFragment } }
      )> | null }>, offers?: Array<{ __typename: 'EventOffer', _id?: any | null, auto?: boolean | null, broadcast_rooms?: Array<any> | null, position?: number | null, provider: OfferProvider, provider_id: string, provider_network: string }> | null, limited_whitelist_users?: Array<{ __typename: 'WhitelistUserInfo', _id?: any | null, email: string }> | null, category_expanded?: { __typename: 'EventTicketCategory', _id: any, description?: string | null, title: string, position?: number | null } | null } };

export type ExportEventTicketsQueryVariables = Exact<{
  id: Scalars['MongoID']['input'];
  ticketTypeIds?: InputMaybe<Array<Scalars['MongoID']['input']> | Scalars['MongoID']['input']>;
  searchText?: InputMaybe<Scalars['String']['input']>;
  pagination?: InputMaybe<PaginationInput>;
  checkedIn?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type ExportEventTicketsQuery = { __typename: 'Query', exportEventTickets: { __typename: 'ExportedTickets', count: number, tickets: Array<{ __typename: 'TicketExport', _id: any, buyer_name?: string | null, buyer_first_name?: string | null, buyer_last_name?: string | null, buyer_email?: string | null, ticket_category?: string | null, ticket_type?: string | null, quantity: number, payment_amount?: string | null, discount_amount?: string | null, currency?: string | null, discount_code?: string | null, purchase_date: any, payment_provider?: string | null, payment_id?: any | null, checkin_date?: any | null, is_assigned?: boolean | null, assignee_email?: string | null, assigned_to?: any | null, assigned_email?: string | null, is_issued?: boolean | null, issued_by?: string | null, is_claimed?: boolean | null, active?: boolean | null, cancelled_by?: string | null, buyer_wallet?: string | null, buyer_id?: any | null, buyer_avatar?: string | null, buyer_username?: string | null, ticket_type_id?: any | null, shortid: string }> } };

export type CreateTicketsMutationVariables = Exact<{
  ticketType: Scalars['MongoID']['input'];
  ticketAssignments: Array<TicketAssignment> | TicketAssignment;
}>;


export type CreateTicketsMutation = { __typename: 'Mutation', createTickets: Array<{ __typename: 'Ticket', _id: any }> };

export type CheckTicketTypePasscodeQueryVariables = Exact<{
  passcode: Scalars['String']['input'];
  type: Scalars['MongoID']['input'];
}>;


export type CheckTicketTypePasscodeQuery = { __typename: 'Query', checkTicketTypePasscode: boolean };

export type CancelTicketsMutationVariables = Exact<{
  input: CancelTicketsInput;
}>;


export type CancelTicketsMutation = { __typename: 'Mutation', cancelTickets: boolean };

export type UpgradeTicketMutationVariables = Exact<{
  input: UpgradeTicketInput;
}>;


export type UpgradeTicketMutation = { __typename: 'Mutation', upgradeTicket: boolean };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename: 'Query', getMe: (
    { __typename: 'User', email?: string | null, email_verified?: boolean | null, wallets_new?: any | null, wallet_custodial?: string | null, kratos_wallet_address?: string | null, kratos_farcaster_fid?: string | null, kratos_unicorn_wallet_address?: string | null, oauth2_allow_creation?: boolean | null, oauth2_clients?: Array<string> | null, oauth2_max_clients?: number | null, stripe_connected_account?: { __typename: 'StripeConnectedAccount', account_id: string, connected?: boolean | null } | null }
    & { ' $fragmentRefs'?: { 'UserFragment': UserFragment } }
  ) };

export type UpdateUserMutationVariables = Exact<{
  input: UserInput;
}>;


export type UpdateUserMutation = { __typename: 'Mutation', updateUser: (
    { __typename: 'User' }
    & { ' $fragmentRefs'?: { 'UserFragment': UserFragment } }
  ) };

export type SearchUsersQueryVariables = Exact<{
  query: Scalars['String']['input'];
}>;


export type SearchUsersQuery = { __typename: 'Query', searchUsers: Array<{ __typename: 'UserWithEmail', _id?: any | null, email?: string | null, name: string, display_name?: string | null, new_photos_expanded?: Array<{ __typename: 'File', _id?: any | null, key: string, bucket: string } | null> | null }> };

export type GetUserQueryVariables = Exact<{
  id?: InputMaybe<Scalars['MongoID']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  lens_profile_id?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetUserQuery = { __typename: 'Query', getUser?: { __typename: 'User', _id?: any | null, name: string, display_name?: string | null, email?: string | null, username?: string | null, description?: string | null, followers?: number | null, following?: number | null, hosted?: number | null, handle_facebook?: string | null, handle_instagram?: string | null, handle_linkedin?: string | null, handle_twitter?: string | null, handle_farcaster?: string | null, handle_github?: string | null, created_at: any, addresses?: Array<{ __typename: 'Address', _id?: any | null, street_1?: string | null, street_2?: string | null, city?: string | null, region?: string | null, postal?: string | null, country?: string | null, title?: string | null, phone?: string | null, longitude?: number | null, latitude?: number | null, additional_directions?: string | null }> | null, new_photos_expanded?: Array<{ __typename: 'File', _id?: any | null, key: string, bucket: string } | null> | null, cover_expanded?: { __typename: 'File', _id?: any | null, bucket: string, url: string, type: string, key: string } | null } | null };

export type DeleteUserMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteUserMutation = { __typename: 'Mutation', deleteUser: boolean };

export type SyncUserUnicornWalletMutationVariables = Exact<{ [key: string]: never; }>;


export type SyncUserUnicornWalletMutation = { __typename: 'Mutation', syncUserUnicornWallet: boolean };

export type UsernameAvailabilityQueryVariables = Exact<{
  wallet: Scalars['String']['input'];
  username: Scalars['String']['input'];
}>;


export type UsernameAvailabilityQuery = { __typename: 'Query', isUsernameAvailable: boolean };

export const UserFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"User"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"job_title"}},{"kind":"Field","name":{"kind":"Name","value":"company_name"}},{"kind":"Field","name":{"kind":"Name","value":"addresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"street_1"}},{"kind":"Field","name":{"kind":"Name","value":"street_2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"postal"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"additional_directions"}}]}},{"kind":"Field","name":{"kind":"Name","value":"icebreakers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"question_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"handle_facebook"}},{"kind":"Field","name":{"kind":"Name","value":"handle_instagram"}},{"kind":"Field","name":{"kind":"Name","value":"handle_linkedin"}},{"kind":"Field","name":{"kind":"Name","value":"handle_twitter"}},{"kind":"Field","name":{"kind":"Name","value":"handle_farcaster"}},{"kind":"Field","name":{"kind":"Name","value":"handle_github"}},{"kind":"Field","name":{"kind":"Name","value":"pronoun"}},{"kind":"Field","name":{"kind":"Name","value":"calendly_url"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"new_photos_expanded"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}}]}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"url_go"}},{"kind":"Field","name":{"kind":"Name","value":"lens_profile_synced"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"hosted"}}]}}]} as unknown as DocumentNode<UserFragment, unknown>;
export const PaymentAccountFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PaymentAccount"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NewPaymentAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"account_info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SafeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"owners"}},{"kind":"Field","name":{"kind":"Name","value":"threshold"}},{"kind":"Field","name":{"kind":"Name","value":"pending"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DigitalAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"account_id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"account_id"}},{"kind":"Field","name":{"kind":"Name","value":"publishable_key"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumEscrowAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"minimum_deposit_percent"}},{"kind":"Field","name":{"kind":"Name","value":"host_refund_percent"}},{"kind":"Field","name":{"kind":"Name","value":"refund_policies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"percent"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumRelayAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"payment_splitter_contract"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumStakeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"config_id"}},{"kind":"Field","name":{"kind":"Name","value":"requirement_checkin_before"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SolanaAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}}]}}]}}]}}]} as unknown as DocumentNode<PaymentAccountFragment, unknown>;
export const AccountInfoFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AccountInfoFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AccountInfo"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SafeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"owners"}},{"kind":"Field","name":{"kind":"Name","value":"threshold"}},{"kind":"Field","name":{"kind":"Name","value":"pending"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DigitalAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"account_id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"account_id"}},{"kind":"Field","name":{"kind":"Name","value":"publishable_key"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumEscrowAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"minimum_deposit_percent"}},{"kind":"Field","name":{"kind":"Name","value":"host_refund_percent"}},{"kind":"Field","name":{"kind":"Name","value":"refund_policies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"percent"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumRelayAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"payment_splitter_contract"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumStakeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"config_id"}},{"kind":"Field","name":{"kind":"Name","value":"requirement_checkin_before"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SolanaAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}}]}}]}}]} as unknown as DocumentNode<AccountInfoFragmentFragment, unknown>;
export const SpaceFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Space"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"admins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"is_ambassador"}},{"kind":"Field","name":{"kind":"Name","value":"followed"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"followers_count"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image_cover"}},{"kind":"Field","name":{"kind":"Name","value":"image_cover_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}},{"kind":"Field","name":{"kind":"Name","value":"creator"}},{"kind":"Field","name":{"kind":"Name","value":"creator_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"listed_events"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"street_1"}},{"kind":"Field","name":{"kind":"Name","value":"street_2"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"handle_instagram"}},{"kind":"Field","name":{"kind":"Name","value":"handle_twitter"}},{"kind":"Field","name":{"kind":"Name","value":"handle_linkedin"}},{"kind":"Field","name":{"kind":"Name","value":"handle_youtube"}},{"kind":"Field","name":{"kind":"Name","value":"handle_tiktok"}},{"kind":"Field","name":{"kind":"Name","value":"personal"}},{"kind":"Field","name":{"kind":"Name","value":"theme_data"}},{"kind":"Field","name":{"kind":"Name","value":"sub_spaces"}},{"kind":"Field","name":{"kind":"Name","value":"lens_feed_id"}},{"kind":"Field","name":{"kind":"Name","value":"council_members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"wallet"}}]}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"nft_enabled"}},{"kind":"Field","name":{"kind":"Name","value":"theme_name"}}]}}]} as unknown as DocumentNode<SpaceFragment, unknown>;
export const SpaceTagFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SpaceTagFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SpaceTag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"space"}},{"kind":"Field","name":{"kind":"Name","value":"tag"}},{"kind":"Field","name":{"kind":"Name","value":"targets"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<SpaceTagFragmentFragment, unknown>;
export const SpaceEventRequestFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SpaceEventRequestFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SpaceEventRequest"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"space"}},{"kind":"Field","name":{"kind":"Name","value":"event"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"decided_at"}},{"kind":"Field","name":{"kind":"Name","value":"decided_by"}}]}}]} as unknown as DocumentNode<SpaceEventRequestFragmentFragment, unknown>;
export const GetEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"shortid"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"getEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"shortid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"shortid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"approval_required"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"shortid"}},{"kind":"Field","name":{"kind":"Name","value":"host"}},{"kind":"Field","name":{"kind":"Name","value":"cohosts"}},{"kind":"Field","name":{"kind":"Name","value":"host_expanded_new"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visible_cohosts_expanded_new"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cohosts_expanded_new"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"accepted"}},{"kind":"Field","name":{"kind":"Name","value":"new_new_photos_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"stamp"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"street_1"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"additional_directions"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address_directions"}},{"kind":"Field","name":{"kind":"Name","value":"subevent_enabled"}},{"kind":"Field","name":{"kind":"Name","value":"sessions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"broadcast"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"broadcast"}},{"kind":"Field","name":{"kind":"Name","value":"photos_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}}]}},{"kind":"Field","name":{"kind":"Name","value":"speaker_users"}},{"kind":"Field","name":{"kind":"Name","value":"speaker_users_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"User"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"space"}},{"kind":"Field","name":{"kind":"Name","value":"space_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"application_questions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"options"}},{"kind":"Field","name":{"kind":"Name","value":"select_type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"application_profile_fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"field"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"required"}}]}},{"kind":"Field","name":{"kind":"Name","value":"self_verification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"config"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"date_of_birth"}},{"kind":"Field","name":{"kind":"Name","value":"excludedCountries"}},{"kind":"Field","name":{"kind":"Name","value":"expiry_date"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"issuing_state"}},{"kind":"Field","name":{"kind":"Name","value":"minimumAge"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nationality"}},{"kind":"Field","name":{"kind":"Name","value":"ofac"}},{"kind":"Field","name":{"kind":"Name","value":"passport_number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rsvp_wallet_platforms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"required"}}]}},{"kind":"Field","name":{"kind":"Name","value":"calendar_links"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"google"}},{"kind":"Field","name":{"kind":"Name","value":"ical"}},{"kind":"Field","name":{"kind":"Name","value":"outlook"}},{"kind":"Field","name":{"kind":"Name","value":"yahoo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"offers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_network"}}]}},{"kind":"Field","name":{"kind":"Name","value":"event_ticket_types"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"offers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_network"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"guest_limit"}},{"kind":"Field","name":{"kind":"Name","value":"guest_limit_per"}},{"kind":"Field","name":{"kind":"Name","value":"terms_text"}},{"kind":"Field","name":{"kind":"Name","value":"virtual"}},{"kind":"Field","name":{"kind":"Name","value":"virtual_url"}},{"kind":"Field","name":{"kind":"Name","value":"theme_data"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"url_go"}},{"kind":"Field","name":{"kind":"Name","value":"external_url"}},{"kind":"Field","name":{"kind":"Name","value":"external_hostname"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"payment_accounts_new"}},{"kind":"Field","name":{"kind":"Name","value":"payment_accounts_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PaymentAccount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"layout_sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payment_ticket_discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"ratio"}},{"kind":"Field","name":{"kind":"Name","value":"use_limit"}},{"kind":"Field","name":{"kind":"Name","value":"use_limit_per"}},{"kind":"Field","name":{"kind":"Name","value":"use_count"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_types"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hide_attending"}},{"kind":"Field","name":{"kind":"Name","value":"registration_disabled"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_limit_per"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"User"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"job_title"}},{"kind":"Field","name":{"kind":"Name","value":"company_name"}},{"kind":"Field","name":{"kind":"Name","value":"addresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"street_1"}},{"kind":"Field","name":{"kind":"Name","value":"street_2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"postal"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"additional_directions"}}]}},{"kind":"Field","name":{"kind":"Name","value":"icebreakers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"question_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"handle_facebook"}},{"kind":"Field","name":{"kind":"Name","value":"handle_instagram"}},{"kind":"Field","name":{"kind":"Name","value":"handle_linkedin"}},{"kind":"Field","name":{"kind":"Name","value":"handle_twitter"}},{"kind":"Field","name":{"kind":"Name","value":"handle_farcaster"}},{"kind":"Field","name":{"kind":"Name","value":"handle_github"}},{"kind":"Field","name":{"kind":"Name","value":"pronoun"}},{"kind":"Field","name":{"kind":"Name","value":"calendly_url"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"new_photos_expanded"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}}]}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"url_go"}},{"kind":"Field","name":{"kind":"Name","value":"lens_profile_synced"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"hosted"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PaymentAccount"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NewPaymentAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"account_info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SafeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"owners"}},{"kind":"Field","name":{"kind":"Name","value":"threshold"}},{"kind":"Field","name":{"kind":"Name","value":"pending"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DigitalAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"account_id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"account_id"}},{"kind":"Field","name":{"kind":"Name","value":"publishable_key"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumEscrowAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"minimum_deposit_percent"}},{"kind":"Field","name":{"kind":"Name","value":"host_refund_percent"}},{"kind":"Field","name":{"kind":"Name","value":"refund_policies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"percent"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumRelayAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"payment_splitter_contract"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumStakeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"config_id"}},{"kind":"Field","name":{"kind":"Name","value":"requirement_checkin_before"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SolanaAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}}]}}]}}]}}]} as unknown as DocumentNode<GetEventQuery, GetEventQueryVariables>;
export const GetEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subeventParent"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"100"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"site"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accepted"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"highlight"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"unpublished"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startFrom"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTimeISO"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startTo"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTimeISO"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endFrom"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTimeISO"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hostFilter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"HostFilter"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"EventSortInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"getEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"subevent_parent"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subeventParent"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"site"},"value":{"kind":"Variable","name":{"kind":"Name","value":"site"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"accepted"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accepted"}}},{"kind":"Argument","name":{"kind":"Name","value":"highlight"},"value":{"kind":"Variable","name":{"kind":"Name","value":"highlight"}}},{"kind":"Argument","name":{"kind":"Name","value":"unpublished"},"value":{"kind":"Variable","name":{"kind":"Name","value":"unpublished"}}},{"kind":"Argument","name":{"kind":"Name","value":"start_from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startFrom"}}},{"kind":"Argument","name":{"kind":"Name","value":"start_to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startTo"}}},{"kind":"Argument","name":{"kind":"Name","value":"end_from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endFrom"}}},{"kind":"Argument","name":{"kind":"Name","value":"host_filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hostFilter"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"shortid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"host"}},{"kind":"Field","name":{"kind":"Name","value":"host_expanded_new"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cohosts"}},{"kind":"Field","name":{"kind":"Name","value":"cohosts_expanded_new"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"new_new_photos_expanded"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"event_ticket_types"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"prices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"cost"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"default"}},{"kind":"Field","name":{"kind":"Name","value":"payment_accounts"}},{"kind":"Field","name":{"kind":"Name","value":"payment_accounts_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PaymentAccount"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"broadcasts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"additional_directions"}}]}},{"kind":"Field","name":{"kind":"Name","value":"accepted"}},{"kind":"Field","name":{"kind":"Name","value":"sessions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"broadcast"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"speaker_users"}},{"kind":"Field","name":{"kind":"Name","value":"speaker_users_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"new_photos_expanded"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subevent_parent_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"shortid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"new_new_photos_expanded"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subevent_settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_required_for_creation"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_required_for_purchase"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"visible_cohosts_expanded_new"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"guests"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PaymentAccount"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NewPaymentAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"account_info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SafeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"owners"}},{"kind":"Field","name":{"kind":"Name","value":"threshold"}},{"kind":"Field","name":{"kind":"Name","value":"pending"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DigitalAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"account_id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"account_id"}},{"kind":"Field","name":{"kind":"Name","value":"publishable_key"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumEscrowAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"minimum_deposit_percent"}},{"kind":"Field","name":{"kind":"Name","value":"host_refund_percent"}},{"kind":"Field","name":{"kind":"Name","value":"refund_policies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"percent"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumRelayAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"payment_splitter_contract"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumStakeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"config_id"}},{"kind":"Field","name":{"kind":"Name","value":"requirement_checkin_before"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SolanaAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}}]}}]}}]}}]} as unknown as DocumentNode<GetEventsQuery, GetEventsQueryVariables>;
export const GetUpcomingEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUpcomingEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"100"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"host"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"JSON"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"site"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"unpublished"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","alias":{"kind":"Name","value":"events"},"name":{"kind":"Name","value":"getUpcomingEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"user"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"host"},"value":{"kind":"Variable","name":{"kind":"Name","value":"host"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}},{"kind":"Argument","name":{"kind":"Name","value":"site"},"value":{"kind":"Variable","name":{"kind":"Name","value":"site"}}},{"kind":"Argument","name":{"kind":"Name","value":"unpublished"},"value":{"kind":"Variable","name":{"kind":"Name","value":"unpublished"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"shortid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"host"}},{"kind":"Field","name":{"kind":"Name","value":"host_expanded_new"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"new_photos_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"cohosts"}},{"kind":"Field","name":{"kind":"Name","value":"new_new_photos_expanded"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"street_1"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"additional_directions"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tickets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"accepted"}},{"kind":"Field","name":{"kind":"Name","value":"assigned_email"}},{"kind":"Field","name":{"kind":"Name","value":"assigned_to"}},{"kind":"Field","name":{"kind":"Name","value":"event"}},{"kind":"Field","name":{"kind":"Name","value":"invited_by"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"me_awaiting_approval"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"guests"}},{"kind":"Field","name":{"kind":"Name","value":"visible_cohosts_expanded_new"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}}]}}]}}]} as unknown as DocumentNode<GetUpcomingEventsQuery, GetUpcomingEventsQueryVariables>;
export const GetPastEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPastEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"100"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"JSON"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"site"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"host"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"unpublished"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","alias":{"kind":"Name","value":"events"},"name":{"kind":"Name","value":"getPastEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"user"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}},{"kind":"Argument","name":{"kind":"Name","value":"site"},"value":{"kind":"Variable","name":{"kind":"Name","value":"site"}}},{"kind":"Argument","name":{"kind":"Name","value":"host"},"value":{"kind":"Variable","name":{"kind":"Name","value":"host"}}},{"kind":"Argument","name":{"kind":"Name","value":"unpublished"},"value":{"kind":"Variable","name":{"kind":"Name","value":"unpublished"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"shortid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"host"}},{"kind":"Field","name":{"kind":"Name","value":"host_expanded_new"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"new_photos_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"cohosts"}},{"kind":"Field","name":{"kind":"Name","value":"new_new_photos_expanded"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"street_1"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"additional_directions"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tickets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"accepted"}},{"kind":"Field","name":{"kind":"Name","value":"assigned_email"}},{"kind":"Field","name":{"kind":"Name","value":"assigned_to"}},{"kind":"Field","name":{"kind":"Name","value":"event"}},{"kind":"Field","name":{"kind":"Name","value":"invited_by"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"me_awaiting_approval"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"guests"}},{"kind":"Field","name":{"kind":"Name","value":"visible_cohosts_expanded_new"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}}]}}]}}]} as unknown as DocumentNode<GetPastEventsQuery, GetPastEventsQueryVariables>;
export const GetEventInvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getEventInvitation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"event"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"getEventInvitation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"event"},"value":{"kind":"Variable","name":{"kind":"Name","value":"event"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"inviters"}}]}}]}}]} as unknown as DocumentNode<GetEventInvitationQuery, GetEventInvitationQueryVariables>;
export const GetEventTicketTypesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEventTicketTypes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetEventTicketTypesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"getEventTicketTypes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_types"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"default"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"event"}},{"kind":"Field","name":{"kind":"Name","value":"limited"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"prices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"cost"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"default"}},{"kind":"Field","name":{"kind":"Name","value":"payment_accounts"}},{"kind":"Field","name":{"kind":"Name","value":"payment_accounts_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PaymentAccount"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"whitelisted"}},{"kind":"Field","name":{"kind":"Name","value":"photos_expanded"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"category_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"passcode_enabled"}},{"kind":"Field","name":{"kind":"Name","value":"recommended_upgrade_ticket_types"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PaymentAccount"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NewPaymentAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"account_info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SafeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"owners"}},{"kind":"Field","name":{"kind":"Name","value":"threshold"}},{"kind":"Field","name":{"kind":"Name","value":"pending"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DigitalAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"account_id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"account_id"}},{"kind":"Field","name":{"kind":"Name","value":"publishable_key"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumEscrowAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"minimum_deposit_percent"}},{"kind":"Field","name":{"kind":"Name","value":"host_refund_percent"}},{"kind":"Field","name":{"kind":"Name","value":"refund_policies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"percent"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumRelayAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"payment_splitter_contract"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumStakeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"config_id"}},{"kind":"Field","name":{"kind":"Name","value":"requirement_checkin_before"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SolanaAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}}]}}]}}]}}]} as unknown as DocumentNode<GetEventTicketTypesQuery, GetEventTicketTypesQueryVariables>;
export const GetMyEventJoinRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMyEventJoinRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"event"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"getMyEventJoinRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"event"},"value":{"kind":"Variable","name":{"kind":"Name","value":"event"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"decided_at"}},{"kind":"Field","name":{"kind":"Name","value":"decided_by"}},{"kind":"Field","name":{"kind":"Name","value":"decided_by_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"wallets"}}]}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"payment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requested_tickets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ticket_types_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]} as unknown as DocumentNode<GetMyEventJoinRequestQuery, GetMyEventJoinRequestQueryVariables>;
export const AcceptEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"acceptEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"acceptEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}}]}}]} as unknown as DocumentNode<AcceptEventMutation, AcceptEventMutationVariables>;
export const SubmitEventApplicationAnswersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SubmitEventApplicationAnswers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"answers"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventApplicationAnswerInput"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"event"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"submitEventApplicationAnswers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"answers"},"value":{"kind":"Variable","name":{"kind":"Name","value":"answers"}}},{"kind":"Argument","name":{"kind":"Name","value":"event"},"value":{"kind":"Variable","name":{"kind":"Name","value":"event"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}]}}]} as unknown as DocumentNode<SubmitEventApplicationAnswersMutation, SubmitEventApplicationAnswersMutationVariables>;
export const PeekEventGuestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PeekEventGuests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"peekEventGuests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]} as unknown as DocumentNode<PeekEventGuestsQuery, PeekEventGuestsQueryVariables>;
export const UpdateEventThemeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateEventTheme"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"updateEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"theme_data"}}]}}]}}]} as unknown as DocumentNode<UpdateEventThemeMutation, UpdateEventThemeMutationVariables>;
export const GetEventCohostInvitesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEventCohostInvites"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetEventCohostRequestsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"getEventCohostInvites"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"event"}},{"kind":"Field","name":{"kind":"Name","value":"from_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetEventCohostInvitesQuery, GetEventCohostInvitesQueryVariables>;
export const DecideEventCohostRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DecideEventCohostRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DecideEventCohostRequestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"decideEventCohostRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<DecideEventCohostRequestMutation, DecideEventCohostRequestMutationVariables>;
export const CreateEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"createEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"shortid"}}]}}]}}]} as unknown as DocumentNode<CreateEventMutation, CreateEventMutationVariables>;
export const PublishEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PublishEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"event"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"updateEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"event"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"published"},"value":{"kind":"BooleanValue","value":true}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"published"}}]}}]}}]} as unknown as DocumentNode<PublishEventMutation, PublishEventMutationVariables>;
export const UpdateEventSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateEventSettings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"updateEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"theme_data"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"street_1"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"additional_directions"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"virtual_url"}},{"kind":"Field","name":{"kind":"Name","value":"registration_disabled"}},{"kind":"Field","name":{"kind":"Name","value":"guest_limit"}},{"kind":"Field","name":{"kind":"Name","value":"terms_text"}},{"kind":"Field","name":{"kind":"Name","value":"terms_link"}},{"kind":"Field","name":{"kind":"Name","value":"shortid"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"layout_sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateEventSettingsMutation, UpdateEventSettingsMutationVariables>;
export const UpdateEventPhotosDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateEventPhotos"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"new_new_photos"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"updateEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"new_new_photos"},"value":{"kind":"Variable","name":{"kind":"Name","value":"new_new_photos"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"new_new_photos"}},{"kind":"Field","name":{"kind":"Name","value":"new_new_photos_expanded"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"50"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateEventPhotosMutation, UpdateEventPhotosMutationVariables>;
export const InviteEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"inviteEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"event"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"users"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"emails"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"custom_body_html"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"inviteEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"event"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"users"},"value":{"kind":"Variable","name":{"kind":"Name","value":"users"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"emails"},"value":{"kind":"Variable","name":{"kind":"Name","value":"emails"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"custom_body_html"},"value":{"kind":"Variable","name":{"kind":"Name","value":"custom_body_html"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"invited"}}]}}]}}]} as unknown as DocumentNode<InviteEventMutation, InviteEventMutationVariables>;
export const AssignTicketsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AssignTickets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AssignTicketsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"assignTickets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<AssignTicketsMutation, AssignTicketsMutationVariables>;
export const GetEventTicketSalesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEventTicketSales"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"event"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"getEventTicketSales"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"event"},"value":{"kind":"Variable","name":{"kind":"Name","value":"event"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"sales"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}}]}},{"kind":"Field","name":{"kind":"Name","value":"last_update"}}]}}]}}]} as unknown as DocumentNode<GetEventTicketSalesQuery, GetEventTicketSalesQueryVariables>;
export const ListEventTicketTypesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"listEventTicketTypes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"event"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"listEventTicketTypes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"event"},"value":{"kind":"Variable","name":{"kind":"Name","value":"event"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"limited_whitelist_users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"address_required"}},{"kind":"Field","name":{"kind":"Name","value":"default"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"description_line"}},{"kind":"Field","name":{"kind":"Name","value":"event"}},{"kind":"Field","name":{"kind":"Name","value":"external_ids"}},{"kind":"Field","name":{"kind":"Name","value":"limited"}},{"kind":"Field","name":{"kind":"Name","value":"offers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"auto"}},{"kind":"Field","name":{"kind":"Name","value":"broadcast_rooms"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_network"}}]}},{"kind":"Field","name":{"kind":"Name","value":"photos"}},{"kind":"Field","name":{"kind":"Name","value":"photos_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"cost"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"default"}},{"kind":"Field","name":{"kind":"Name","value":"payment_accounts"}},{"kind":"Field","name":{"kind":"Name","value":"payment_accounts_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PaymentAccount"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_count"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_limit"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_limit_per"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"category_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PaymentAccount"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NewPaymentAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"account_info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SafeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"owners"}},{"kind":"Field","name":{"kind":"Name","value":"threshold"}},{"kind":"Field","name":{"kind":"Name","value":"pending"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DigitalAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"account_id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"account_id"}},{"kind":"Field","name":{"kind":"Name","value":"publishable_key"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumEscrowAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"minimum_deposit_percent"}},{"kind":"Field","name":{"kind":"Name","value":"host_refund_percent"}},{"kind":"Field","name":{"kind":"Name","value":"refund_policies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"percent"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumRelayAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"payment_splitter_contract"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumStakeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"config_id"}},{"kind":"Field","name":{"kind":"Name","value":"requirement_checkin_before"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SolanaAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}}]}}]}}]}}]} as unknown as DocumentNode<ListEventTicketTypesQuery, ListEventTicketTypesQueryVariables>;
export const ListEventTokenGatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListEventTokenGates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"event"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ticketTypes"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"listEventTokenGates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"event"},"value":{"kind":"Variable","name":{"kind":"Name","value":"event"}}},{"kind":"Argument","name":{"kind":"Name","value":"ticket_types"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ticketTypes"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"event"}},{"kind":"Field","name":{"kind":"Name","value":"gated_ticket_types"}},{"kind":"Field","name":{"kind":"Name","value":"is_nft"}},{"kind":"Field","name":{"kind":"Name","value":"max_value"}},{"kind":"Field","name":{"kind":"Name","value":"min_value"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"token_address"}}]}}]}}]} as unknown as DocumentNode<ListEventTokenGatesQuery, ListEventTokenGatesQueryVariables>;
export const CreateEventTokenGateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateEventTokenGate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventTokenGateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"createEventTokenGate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]} as unknown as DocumentNode<CreateEventTokenGateMutation, CreateEventTokenGateMutationVariables>;
export const UpdateEventTokenGateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateEventTokenGate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventTokenGateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"updateEventTokenGate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]} as unknown as DocumentNode<UpdateEventTokenGateMutation, UpdateEventTokenGateMutationVariables>;
export const ManageEventCohostRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ManageEventCohostRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ManageEventCohostRequestsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"manageEventCohostRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<ManageEventCohostRequestsMutation, ManageEventCohostRequestsMutationVariables>;
export const GetEventInvitedStatisticsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEventInvitedStatistics"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"statuses"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationResponse"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"getEventInvitedStatistics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"statuses"},"value":{"kind":"Variable","name":{"kind":"Name","value":"statuses"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"emails_opened"}},{"kind":"Field","name":{"kind":"Name","value":"guests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"user"}},{"kind":"Field","name":{"kind":"Name","value":"pending"}},{"kind":"Field","name":{"kind":"Name","value":"joined"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"declined"}},{"kind":"Field","name":{"kind":"Name","value":"user_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"new_photos_expanded"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"total_declined"}},{"kind":"Field","name":{"kind":"Name","value":"total_joined"}}]}}]}}]} as unknown as DocumentNode<GetEventInvitedStatisticsQuery, GetEventInvitedStatisticsQueryVariables>;
export const GetEventGuestsStatisticsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEventGuestsStatistics"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"event"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"getEventGuestsStatistics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"event"},"value":{"kind":"Variable","name":{"kind":"Name","value":"event"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"going"}},{"kind":"Field","name":{"kind":"Name","value":"pending_approval"}},{"kind":"Field","name":{"kind":"Name","value":"pending_invite"}},{"kind":"Field","name":{"kind":"Name","value":"declined"}},{"kind":"Field","name":{"kind":"Name","value":"checked_in"}}]}}]}}]} as unknown as DocumentNode<GetEventGuestsStatisticsQuery, GetEventGuestsStatisticsQueryVariables>;
export const UpdateEventRegistrationFormDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateEventRegistrationForm"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"updateEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"rsvp_wallet_platforms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"required"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateEventRegistrationFormMutation, UpdateEventRegistrationFormMutationVariables>;
export const ListEventGuestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListEventGuests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ticketTypes"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"going"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pendingApproval"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pendingInvite"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"declined"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"checkedIn"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ListEventGuestsSortBy"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortOrder"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SortOrder"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"event"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"listEventGuests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ticket_types"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ticketTypes"}}},{"kind":"Argument","name":{"kind":"Name","value":"going"},"value":{"kind":"Variable","name":{"kind":"Name","value":"going"}}},{"kind":"Argument","name":{"kind":"Name","value":"pending_approval"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pendingApproval"}}},{"kind":"Argument","name":{"kind":"Name","value":"pending_invite"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pendingInvite"}}},{"kind":"Argument","name":{"kind":"Name","value":"declined"},"value":{"kind":"Variable","name":{"kind":"Name","value":"declined"}}},{"kind":"Argument","name":{"kind":"Name","value":"checked_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"checkedIn"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort_by"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort_order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortOrder"}}},{"kind":"Argument","name":{"kind":"Name","value":"event"},"value":{"kind":"Variable","name":{"kind":"Name","value":"event"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"join_request"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"non_login_user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ticket"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"type_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]} as unknown as DocumentNode<ListEventGuestsQuery, ListEventGuestsQueryVariables>;
export const GetEventGuestDetailedInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEventGuestDetailedInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"event"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"getEventGuestDetailedInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"event"},"value":{"kind":"Variable","name":{"kind":"Name","value":"event"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"checkin_count"}},{"kind":"Field","name":{"kind":"Name","value":"purchased_tickets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"type_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cancelled_by"}},{"kind":"Field","name":{"kind":"Name","value":"cancelled_by_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cancelled_at"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ticket"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"type_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"upgrade_history"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"from_type"}},{"kind":"Field","name":{"kind":"Name","value":"from_type_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"to_type"}},{"kind":"Field","name":{"kind":"Name","value":"to_type_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_by"}},{"kind":"Field","name":{"kind":"Name","value":"updated_by_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"account_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PaymentAccount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"crypto_payment_info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"tx_hash"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stripe_payment_info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"last4"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payment_intent"}}]}},{"kind":"Field","name":{"kind":"Name","value":"transfer_params"}},{"kind":"Field","name":{"kind":"Name","value":"formatted_total_amount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"join_request"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"decided_at"}},{"kind":"Field","name":{"kind":"Name","value":"decided_by_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requested_tickets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"application"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}},{"kind":"Field","name":{"kind":"Name","value":"answers"}},{"kind":"Field","name":{"kind":"Name","value":"question"}}]}},{"kind":"Field","name":{"kind":"Name","value":"invitation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"inviters_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PaymentAccount"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NewPaymentAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"account_info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SafeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"owners"}},{"kind":"Field","name":{"kind":"Name","value":"threshold"}},{"kind":"Field","name":{"kind":"Name","value":"pending"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DigitalAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"account_id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"account_id"}},{"kind":"Field","name":{"kind":"Name","value":"publishable_key"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumEscrowAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"minimum_deposit_percent"}},{"kind":"Field","name":{"kind":"Name","value":"host_refund_percent"}},{"kind":"Field","name":{"kind":"Name","value":"refund_policies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"percent"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumRelayAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"payment_splitter_contract"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumStakeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"config_id"}},{"kind":"Field","name":{"kind":"Name","value":"requirement_checkin_before"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SolanaAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}}]}}]}}]}}]} as unknown as DocumentNode<GetEventGuestDetailedInfoQuery, GetEventGuestDetailedInfoQueryVariables>;
export const SubmitEventApplicationQuestionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"submitEventApplicationQuestions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"event"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"questions"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"submitEventApplicationQuestions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"event"},"value":{"kind":"Variable","name":{"kind":"Name","value":"event"}}},{"kind":"Argument","name":{"kind":"Name","value":"questions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"questions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"options"}},{"kind":"Field","name":{"kind":"Name","value":"select_type"}}]}}]}}]} as unknown as DocumentNode<SubmitEventApplicationQuestionsMutation, SubmitEventApplicationQuestionsMutationVariables>;
export const UpdateEventApplicationProfilesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateEventApplicationProfiles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fields"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ApplicationProfileFieldInput"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"updateEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"application_profile_fields"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fields"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"application_profile_fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"field"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"question"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateEventApplicationProfilesMutation, UpdateEventApplicationProfilesMutationVariables>;
export const DecideUserJoinRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"decideUserJoinRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"decision"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventJoinRequestState"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"event"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"requests"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"decideUserJoinRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"decision"},"value":{"kind":"Variable","name":{"kind":"Name","value":"decision"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"event"},"value":{"kind":"Variable","name":{"kind":"Name","value":"event"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"requests"},"value":{"kind":"Variable","name":{"kind":"Name","value":"requests"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"processed"}}]}}]}}]} as unknown as DocumentNode<DecideUserJoinRequestsMutation, DecideUserJoinRequestsMutationVariables>;
export const GetEventJoinRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getEventJoinRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"event"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"state"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"EventJoinRequestState"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"getEventJoinRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"event"},"value":{"kind":"Variable","name":{"kind":"Name","value":"event"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"state"},"value":{"kind":"Variable","name":{"kind":"Name","value":"state"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"user"}},{"kind":"Field","name":{"kind":"Name","value":"user_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"new_photos_expanded"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"non_login_user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetEventJoinRequestsQuery, GetEventJoinRequestsQueryVariables>;
export const GetListEventEmailSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetListEventEmailSettings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"event"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"system"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sent"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"scheduled"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"listEventEmailSettings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"event"},"value":{"kind":"Variable","name":{"kind":"Name","value":"event"}}},{"kind":"Argument","name":{"kind":"Name","value":"system"},"value":{"kind":"Variable","name":{"kind":"Name","value":"system"}}},{"kind":"Argument","name":{"kind":"Name","value":"sent"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sent"}}},{"kind":"Argument","name":{"kind":"Name","value":"scheduled"},"value":{"kind":"Variable","name":{"kind":"Name","value":"scheduled"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"body_preview"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"disabled"}},{"kind":"Field","name":{"kind":"Name","value":"is_system_email"}},{"kind":"Field","name":{"kind":"Name","value":"recipient_types"}},{"kind":"Field","name":{"kind":"Name","value":"recipients"}},{"kind":"Field","name":{"kind":"Name","value":"recipients_details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"owner_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}},{"kind":"Field","name":{"kind":"Name","value":"new_photos_expanded"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"recipient_filters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"join_request_states"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_types"}}]}},{"kind":"Field","name":{"kind":"Name","value":"scheduled_at"}},{"kind":"Field","name":{"kind":"Name","value":"sent_at"}},{"kind":"Field","name":{"kind":"Name","value":"subject_preview"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"custom_body_html"}},{"kind":"Field","name":{"kind":"Name","value":"custom_subject_html"}},{"kind":"Field","name":{"kind":"Name","value":"opened"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"stamp"}}]}}]}}]}}]} as unknown as DocumentNode<GetListEventEmailSettingsQuery, GetListEventEmailSettingsQueryVariables>;
export const UpdateEventEmailSettingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateEventEmailSetting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateEventEmailSettingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"updateEventEmailSetting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"body_preview"}},{"kind":"Field","name":{"kind":"Name","value":"is_system_email"}},{"kind":"Field","name":{"kind":"Name","value":"disabled"}},{"kind":"Field","name":{"kind":"Name","value":"recipient_types"}},{"kind":"Field","name":{"kind":"Name","value":"recipients"}},{"kind":"Field","name":{"kind":"Name","value":"recipients_details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recipient_filters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"join_request_states"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_types"}}]}},{"kind":"Field","name":{"kind":"Name","value":"owner_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"scheduled_at"}},{"kind":"Field","name":{"kind":"Name","value":"sent_at"}},{"kind":"Field","name":{"kind":"Name","value":"subject_preview"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"custom_body_html"}},{"kind":"Field","name":{"kind":"Name","value":"custom_subject_html"}},{"kind":"Field","name":{"kind":"Name","value":"template"}}]}}]}}]} as unknown as DocumentNode<UpdateEventEmailSettingMutation, UpdateEventEmailSettingMutationVariables>;
export const CreateEventEmailSettingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateEventEmailSetting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateEventEmailSettingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"createEventEmailSetting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"body_preview"}},{"kind":"Field","name":{"kind":"Name","value":"cc"}},{"kind":"Field","name":{"kind":"Name","value":"custom_body_html"}},{"kind":"Field","name":{"kind":"Name","value":"context"}},{"kind":"Field","name":{"kind":"Name","value":"custom_subject_html"}},{"kind":"Field","name":{"kind":"Name","value":"disabled"}},{"kind":"Field","name":{"kind":"Name","value":"is_system_email"}},{"kind":"Field","name":{"kind":"Name","value":"recipient_types"}},{"kind":"Field","name":{"kind":"Name","value":"recipients"}},{"kind":"Field","name":{"kind":"Name","value":"recipients_details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recipient_filters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"join_request_states"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_types"}}]}},{"kind":"Field","name":{"kind":"Name","value":"owner_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"scheduled_at"}},{"kind":"Field","name":{"kind":"Name","value":"sendgrid_template_id"}},{"kind":"Field","name":{"kind":"Name","value":"sent_at"}},{"kind":"Field","name":{"kind":"Name","value":"subject_preview"}},{"kind":"Field","name":{"kind":"Name","value":"template"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"opened"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"stamp"}}]}}]}}]}}]} as unknown as DocumentNode<CreateEventEmailSettingMutation, CreateEventEmailSettingMutationVariables>;
export const DeleteEventEmailSettingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteEventEmailSetting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"deleteEventEmailSetting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteEventEmailSettingMutation, DeleteEventEmailSettingMutationVariables>;
export const SendEventEmailSettingTestEmailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendEventEmailSettingTestEmails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SendEventEmailSettingTestEmailsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"sendEventEmailSettingTestEmails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<SendEventEmailSettingTestEmailsMutation, SendEventEmailSettingTestEmailsMutationVariables>;
export const ToggleEventEmailSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ToggleEventEmailSettings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"disabled"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"event"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"toggleEventEmailSettings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"disabled"},"value":{"kind":"Variable","name":{"kind":"Name","value":"disabled"}}},{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}},{"kind":"Argument","name":{"kind":"Name","value":"event"},"value":{"kind":"Variable","name":{"kind":"Name","value":"event"}}}]}]}}]} as unknown as DocumentNode<ToggleEventEmailSettingsMutation, ToggleEventEmailSettingsMutationVariables>;
export const UpdateEventToggleAttendingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateEventToggleAttending"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"updateEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"hide_attending"}}]}}]}}]} as unknown as DocumentNode<UpdateEventToggleAttendingMutation, UpdateEventToggleAttendingMutationVariables>;
export const GetTicketsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTickets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"event"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ticket_types"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"getTickets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"event"},"value":{"kind":"Variable","name":{"kind":"Name","value":"event"}}},{"kind":"Argument","name":{"kind":"Name","value":"user"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user"}}},{"kind":"Argument","name":{"kind":"Name","value":"ticket_types"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ticket_types"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"accepted"}},{"kind":"Field","name":{"kind":"Name","value":"assigned_email"}},{"kind":"Field","name":{"kind":"Name","value":"assigned_to"}},{"kind":"Field","name":{"kind":"Name","value":"assigned_to_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"new_photos_expanded"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"event"}},{"kind":"Field","name":{"kind":"Name","value":"invited_by"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"shortid"}}]}}]}}]} as unknown as DocumentNode<GetTicketsQuery, GetTicketsQueryVariables>;
export const CreatePoapDropDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePoapDrop"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePoapInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"createPoapDrop"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"claim_count"}},{"kind":"Field","name":{"kind":"Name","value":"claim_mode"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"event"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"image_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"stamp"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_types"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_types_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]} as unknown as DocumentNode<CreatePoapDropMutation, CreatePoapDropMutationVariables>;
export const ListPoapDropsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListPoapDrops"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"event"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"listPoapDrops"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"event"},"value":{"kind":"Variable","name":{"kind":"Name","value":"event"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"claim_count"}},{"kind":"Field","name":{"kind":"Name","value":"claim_mode"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"event"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"image_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"stamp"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_types"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_types_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"minting_network"}}]}}]}}]} as unknown as DocumentNode<ListPoapDropsQuery, ListPoapDropsQueryVariables>;
export const ListMyPoapClaimsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListMyPoapClaims"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"event"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"listMyPoapClaims"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"event"},"value":{"kind":"Variable","name":{"kind":"Name","value":"event"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"drop"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"claimed_date"}}]}}]}}]} as unknown as DocumentNode<ListMyPoapClaimsQuery, ListMyPoapClaimsQueryVariables>;
export const GetEventCheckInStateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getEventCheckInState"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"getEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"checkedin"}}]}}]}}]} as unknown as DocumentNode<GetEventCheckInStateQuery, GetEventCheckInStateQueryVariables>;
export const ClaimPoapDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ClaimPoap"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"wallet"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"drop"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"claimPoap"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"wallet"},"value":{"kind":"Variable","name":{"kind":"Name","value":"wallet"}}},{"kind":"Argument","name":{"kind":"Name","value":"drop"},"value":{"kind":"Variable","name":{"kind":"Name","value":"drop"}}}]}]}}]} as unknown as DocumentNode<ClaimPoapMutation, ClaimPoapMutationVariables>;
export const UpdatePoapDropDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePoapDrop"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePoapInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"drop"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"updatePoapDrop"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"drop"},"value":{"kind":"Variable","name":{"kind":"Name","value":"drop"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"claim_count"}},{"kind":"Field","name":{"kind":"Name","value":"claim_mode"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"event"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"image_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"stamp"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_types"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_types_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]} as unknown as DocumentNode<UpdatePoapDropMutation, UpdatePoapDropMutationVariables>;
export const GetPoapDropInfoByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPoapDropInfoById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"getPoapDropInfoByIdId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"getPoapDropInfoById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"getPoapDropInfoByIdId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetPoapDropInfoByIdQuery, GetPoapDropInfoByIdQueryVariables>;
export const CheckPoapDropEditCodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CheckPoapDropEditCode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"checkPoapDropEditCodeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"checkPoapDropEditCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"checkPoapDropEditCodeId"}}}]}]}}]} as unknown as DocumentNode<CheckPoapDropEditCodeQuery, CheckPoapDropEditCodeQueryVariables>;
export const ImportPoapDropDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ImportPoapDrop"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ImportPoapInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"importPoapDropId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"importPoapDrop"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"importPoapDropId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"claim_count"}},{"kind":"Field","name":{"kind":"Name","value":"claim_mode"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"event"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"image_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"stamp"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_types"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_types_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]} as unknown as DocumentNode<ImportPoapDropMutation, ImportPoapDropMutationVariables>;
export const CancelEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CancelEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"event"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"cancelEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"event"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]} as unknown as DocumentNode<CancelEventMutation, CancelEventMutationVariables>;
export const CloneEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"cloneEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CloneEventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"cloneEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<CloneEventMutation, CloneEventMutationVariables>;
export const GenerateRecurringDatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GenerateRecurringDates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GenerateRecurringDatesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"generateRecurringDates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<GenerateRecurringDatesQuery, GenerateRecurringDatesQueryVariables>;
export const CreateEventTicketDiscountsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateEventTicketDiscounts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"event"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"inputs"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventPaymentTicketDiscountInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"createEventTicketDiscounts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"event"},"value":{"kind":"Variable","name":{"kind":"Name","value":"event"}}},{"kind":"Argument","name":{"kind":"Name","value":"inputs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"inputs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"payment_ticket_discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"ratio"}},{"kind":"Field","name":{"kind":"Name","value":"use_limit"}},{"kind":"Field","name":{"kind":"Name","value":"use_limit_per"}},{"kind":"Field","name":{"kind":"Name","value":"use_count"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_types"}}]}}]}}]}}]} as unknown as DocumentNode<CreateEventTicketDiscountsMutation, CreateEventTicketDiscountsMutationVariables>;
export const UpdateEventTicketDiscountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateEventTicketDiscount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"event"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateEventTicketDiscountInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"updateEventTicketDiscount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"event"},"value":{"kind":"Variable","name":{"kind":"Name","value":"event"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"payment_ticket_discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"ratio"}},{"kind":"Field","name":{"kind":"Name","value":"use_limit"}},{"kind":"Field","name":{"kind":"Name","value":"use_limit_per"}},{"kind":"Field","name":{"kind":"Name","value":"use_count"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_types"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateEventTicketDiscountMutation, UpdateEventTicketDiscountMutationVariables>;
export const DeleteEventTicketDiscountsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteEventTicketDiscounts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"event"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"discounts"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"deleteEventTicketDiscounts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"event"},"value":{"kind":"Variable","name":{"kind":"Name","value":"event"}}},{"kind":"Argument","name":{"kind":"Name","value":"discounts"},"value":{"kind":"Variable","name":{"kind":"Name","value":"discounts"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"payment_ticket_discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"ratio"}},{"kind":"Field","name":{"kind":"Name","value":"use_limit"}},{"kind":"Field","name":{"kind":"Name","value":"use_limit_per"}},{"kind":"Field","name":{"kind":"Name","value":"use_count"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_types"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteEventTicketDiscountsMutation, DeleteEventTicketDiscountsMutationVariables>;
export const UpdateEventSelfVerificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateEventSelfVerification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"self_verification"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SelfVerificationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"updateEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"self_verification"},"value":{"kind":"Variable","name":{"kind":"Name","value":"self_verification"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"self_verification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"config"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"date_of_birth"}},{"kind":"Field","name":{"kind":"Name","value":"excludedCountries"}},{"kind":"Field","name":{"kind":"Name","value":"expiry_date"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"issuing_state"}},{"kind":"Field","name":{"kind":"Name","value":"minimumAge"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nationality"}},{"kind":"Field","name":{"kind":"Name","value":"ofac"}},{"kind":"Field","name":{"kind":"Name","value":"passport_number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateEventSelfVerificationMutation, UpdateEventSelfVerificationMutationVariables>;
export const GetEventPaymentStatisticsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEventPaymentStatistics"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"event"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"getEventPaymentStatistics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"event"},"value":{"kind":"Variable","name":{"kind":"Name","value":"event"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"total_payments"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_payments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"revenue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"formatted_total_amount"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"crypto_payments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"revenue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"formatted_total_amount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"networks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"chain_id"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetEventPaymentStatisticsQuery, GetEventPaymentStatisticsQueryVariables>;
export const GetListEventPaymentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetListEventPayments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"event"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"provider"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"NewPaymentProvider"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"networks"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"checked_in"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ticket_types"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"listEventPayments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"event"},"value":{"kind":"Variable","name":{"kind":"Name","value":"event"}}},{"kind":"Argument","name":{"kind":"Name","value":"provider"},"value":{"kind":"Variable","name":{"kind":"Name","value":"provider"}}},{"kind":"Argument","name":{"kind":"Name","value":"networks"},"value":{"kind":"Variable","name":{"kind":"Name","value":"networks"}}},{"kind":"Argument","name":{"kind":"Name","value":"checked_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"checked_in"}}},{"kind":"Argument","name":{"kind":"Name","value":"ticket_types"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ticket_types"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"account_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stripe_payment_info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"payment_intent"}},{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"last4"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"application"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"Field","name":{"kind":"Name","value":"buyer_info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"buyer_user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"due_amount"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"formatted_total_amount"}},{"kind":"Field","name":{"kind":"Name","value":"formatted_discount_amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"user"}},{"kind":"Field","name":{"kind":"Name","value":"stamps"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_types_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"category_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"account_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"user"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ref_data"}},{"kind":"Field","name":{"kind":"Name","value":"transfer_params"}},{"kind":"Field","name":{"kind":"Name","value":"transfer_metadata"}},{"kind":"Field","name":{"kind":"Name","value":"crypto_payment_info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"tx_hash"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]} as unknown as DocumentNode<GetListEventPaymentsQuery, GetListEventPaymentsQueryVariables>;
export const GetTicketStatisticsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getTicketStatistics"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"getTicketStatistics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"all"}},{"kind":"Field","name":{"kind":"Name","value":"checked_in"}},{"kind":"Field","name":{"kind":"Name","value":"invited"}},{"kind":"Field","name":{"kind":"Name","value":"issued"}},{"kind":"Field","name":{"kind":"Name","value":"cancelled"}},{"kind":"Field","name":{"kind":"Name","value":"applicants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"not_checked_in"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_types"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_type"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_type_title"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<GetTicketStatisticsQuery, GetTicketStatisticsQueryVariables>;
export const GetEventTicketSoldChartDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEventTicketSoldChartData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"event"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"start"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTimeISO"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"end"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTimeISO"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"types"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"getEventTicketSoldChartData"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"event"},"value":{"kind":"Variable","name":{"kind":"Name","value":"event"}}},{"kind":"Argument","name":{"kind":"Name","value":"start"},"value":{"kind":"Variable","name":{"kind":"Name","value":"start"}}},{"kind":"Argument","name":{"kind":"Name","value":"end"},"value":{"kind":"Variable","name":{"kind":"Name","value":"end"}}},{"kind":"Argument","name":{"kind":"Name","value":"types"},"value":{"kind":"Variable","name":{"kind":"Name","value":"types"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<GetEventTicketSoldChartDataQuery, GetEventTicketSoldChartDataQueryVariables>;
export const GetEventViewChartDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEventViewChartData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"start"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTimeISO"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"end"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTimeISO"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"event"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"getEventViewChartData"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"start"},"value":{"kind":"Variable","name":{"kind":"Name","value":"start"}}},{"kind":"Argument","name":{"kind":"Name","value":"end"},"value":{"kind":"Variable","name":{"kind":"Name","value":"end"}}},{"kind":"Argument","name":{"kind":"Name","value":"event"},"value":{"kind":"Variable","name":{"kind":"Name","value":"event"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"date"}}]}}]}}]}}]} as unknown as DocumentNode<GetEventViewChartDataQuery, GetEventViewChartDataQueryVariables>;
export const GetEventViewStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEventViewStats"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"event"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ranges"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRangeInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"getEventViewStats"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"event"},"value":{"kind":"Variable","name":{"kind":"Name","value":"event"}}},{"kind":"Argument","name":{"kind":"Name","value":"ranges"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ranges"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"counts"}}]}}]}}]} as unknown as DocumentNode<GetEventViewStatsQuery, GetEventViewStatsQueryVariables>;
export const ViewsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Views"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"event"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"getEventLatestViews"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"event"},"value":{"kind":"Variable","name":{"kind":"Name","value":"event"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"views"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"geoip_country"}},{"kind":"Field","name":{"kind":"Name","value":"geoip_region"}},{"kind":"Field","name":{"kind":"Name","value":"geoip_city"}},{"kind":"Field","name":{"kind":"Name","value":"user_agent"}}]}}]}}]}}]} as unknown as DocumentNode<ViewsQuery, ViewsQueryVariables>;
export const GetEventTopViewsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEventTopViews"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"event"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cityLimit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sourceLimit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"getEventTopViews"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"event"},"value":{"kind":"Variable","name":{"kind":"Name","value":"event"}}},{"kind":"Argument","name":{"kind":"Name","value":"city_limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cityLimit"}}},{"kind":"Argument","name":{"kind":"Name","value":"source_limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sourceLimit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"by_city"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"geoip_city"}},{"kind":"Field","name":{"kind":"Name","value":"geoip_country"}},{"kind":"Field","name":{"kind":"Name","value":"geoip_region"}}]}},{"kind":"Field","name":{"kind":"Name","value":"by_source"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"utm_source"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]} as unknown as DocumentNode<GetEventTopViewsQuery, GetEventTopViewsQueryVariables>;
export const SubscribeEventLatestViewsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"SubscribeEventLatestViews"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"event"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscribeEventLatestViews"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"event"},"value":{"kind":"Variable","name":{"kind":"Name","value":"event"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"geoip_city"}},{"kind":"Field","name":{"kind":"Name","value":"geoip_country"}},{"kind":"Field","name":{"kind":"Name","value":"geoip_region"}},{"kind":"Field","name":{"kind":"Name","value":"user_agent"}}]}}]}}]} as unknown as DocumentNode<SubscribeEventLatestViewsSubscription, SubscribeEventLatestViewsSubscriptionVariables>;
export const GetSystemFilesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSystemFiles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"categories"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FileCategory"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"getSystemFiles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"categories"},"value":{"kind":"Variable","name":{"kind":"Name","value":"categories"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}}]} as unknown as DocumentNode<GetSystemFilesQuery, GetSystemFilesQueryVariables>;
export const CreateFileUploadsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createFileUploads"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uploadInfos"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FileUploadInfo"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"directory"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"createFileUploads"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"upload_infos"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uploadInfos"}}},{"kind":"Argument","name":{"kind":"Name","value":"directory"},"value":{"kind":"Variable","name":{"kind":"Name","value":"directory"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"stamp"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","alias":{"kind":"Name","value":"presignedUrl"},"name":{"kind":"Name","value":"presigned_url"}}]}}]}}]} as unknown as DocumentNode<CreateFileUploadsMutation, CreateFileUploadsMutationVariables>;
export const ConfirmFileUploadsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"confirmFileUploads"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"confirmFileUploads"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}]}]}}]} as unknown as DocumentNode<ConfirmFileUploadsMutation, ConfirmFileUploadsMutationVariables>;
export const UpdateFileDescriptionMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateFileDescriptionMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FileInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"updateFile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"stamp"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<UpdateFileDescriptionMutationMutation, UpdateFileDescriptionMutationMutationVariables>;
export const ListLaunchpadGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListLaunchpadGroups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"address"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"space"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"listLaunchpadGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"address"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"space"},"value":{"kind":"Variable","name":{"kind":"Name","value":"space"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"chain_id"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"cover_photo"}},{"kind":"Field","name":{"kind":"Name","value":"cover_photo_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cover_photo_url"}},{"kind":"Field","name":{"kind":"Name","value":"implementation_address"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]} as unknown as DocumentNode<ListLaunchpadGroupsQuery, ListLaunchpadGroupsQueryVariables>;
export const AddLaunchpadCoinDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddLaunchpadCoin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LaunchpadCoinInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"addLaunchpadCoin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"address"}}]}}]}}]} as unknown as DocumentNode<AddLaunchpadCoinMutation, AddLaunchpadCoinMutationVariables>;
export const AddLaunchpadGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddLaunchpadGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddLaunchpadGroupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"addLaunchpadGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"address"}}]}}]}}]} as unknown as DocumentNode<AddLaunchpadGroupMutation, AddLaunchpadGroupMutationVariables>;
export const ItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Items"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"address"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"listLaunchpadCoins"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"address"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"handle_telegram"}},{"kind":"Field","name":{"kind":"Name","value":"handle_discord"}},{"kind":"Field","name":{"kind":"Name","value":"handle_farcaster"}},{"kind":"Field","name":{"kind":"Name","value":"handle_twitter"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"website"}}]}}]}}]}}]} as unknown as DocumentNode<ItemsQuery, ItemsQueryVariables>;
export const GetListLemonheadSponsorsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetListLemonheadSponsors"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"wallet"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"listLemonheadSponsors"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"wallet"},"value":{"kind":"Variable","name":{"kind":"Name","value":"wallet"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"sponsors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"sponsor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"remaining"}}]}}]}}]}}]} as unknown as DocumentNode<GetListLemonheadSponsorsQuery, GetListLemonheadSponsorsQueryVariables>;
export const CanMintLemonheadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CanMintLemonhead"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"wallet"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"canMintLemonhead"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"wallet"},"value":{"kind":"Variable","name":{"kind":"Name","value":"wallet"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"can_mint"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"white_list_enabled"}}]}}]}}]} as unknown as DocumentNode<CanMintLemonheadQuery, CanMintLemonheadQueryVariables>;
export const CanMintPassportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CanMintPassport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"wallet"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"provider"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PassportProvider"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"canMintPassport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"wallet"},"value":{"kind":"Variable","name":{"kind":"Name","value":"wallet"}}},{"kind":"Argument","name":{"kind":"Name","value":"provider"},"value":{"kind":"Variable","name":{"kind":"Name","value":"provider"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"can_mint"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"white_list_enabled"}}]}}]}}]} as unknown as DocumentNode<CanMintPassportQuery, CanMintPassportQueryVariables>;
export const GetListMyLemonheadInvitationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetListMyLemonheadInvitations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"listMyLemonheadInvitations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"invitations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"invitee_wallet"}},{"kind":"Field","name":{"kind":"Name","value":"minted_at"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetListMyLemonheadInvitationsQuery, GetListMyLemonheadInvitationsQueryVariables>;
export const GetMyLemonheadInvitationRankDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyLemonheadInvitationRank"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"getMyLemonheadInvitationRank"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}},{"kind":"Field","name":{"kind":"Name","value":"lemonhead_inviter_wallet"}},{"kind":"Field","name":{"kind":"Name","value":"kratos_wallet_address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"invitations_count"}}]}}]}}]} as unknown as DocumentNode<GetMyLemonheadInvitationRankQuery, GetMyLemonheadInvitationRankQueryVariables>;
export const GetLemonheadInvitationRankDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLemonheadInvitationRank"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"getLemonheadInvitationRank"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}},{"kind":"Field","name":{"kind":"Name","value":"lemonhead_inviter_wallet"}},{"kind":"Field","name":{"kind":"Name","value":"kratos_wallet_address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"invitations_count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]} as unknown as DocumentNode<GetLemonheadInvitationRankQuery, GetLemonheadInvitationRankQueryVariables>;
export const SetUserWalletDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetUserWallet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"signature"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"setUserWallet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"Argument","name":{"kind":"Name","value":"signature"},"value":{"kind":"Variable","name":{"kind":"Name","value":"signature"}}}]}]}}]} as unknown as DocumentNode<SetUserWalletMutation, SetUserWalletMutationVariables>;
export const UpdateMyLemonheadInvitationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMyLemonheadInvitations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"invitations"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"updateMyLemonheadInvitations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"invitations"},"value":{"kind":"Variable","name":{"kind":"Name","value":"invitations"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"wallets"}}]}}]}}]} as unknown as DocumentNode<UpdateMyLemonheadInvitationsMutation, UpdateMyLemonheadInvitationsMutationVariables>;
export const ListChainsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"listChains"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"listChains"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"chain_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code_name"}},{"kind":"Field","name":{"kind":"Name","value":"rpc_url"}},{"kind":"Field","name":{"kind":"Name","value":"block_explorer_url"}},{"kind":"Field","name":{"kind":"Name","value":"block_explorer_name"}},{"kind":"Field","name":{"kind":"Name","value":"block_explorer_for_tx"}},{"kind":"Field","name":{"kind":"Name","value":"block_explorer_for_token"}},{"kind":"Field","name":{"kind":"Name","value":"block_explorer_for_address"}},{"kind":"Field","name":{"kind":"Name","value":"block_explorer_icon_url"}},{"kind":"Field","name":{"kind":"Name","value":"block_time"}},{"kind":"Field","name":{"kind":"Name","value":"safe_confirmations"}},{"kind":"Field","name":{"kind":"Name","value":"logo_url"}},{"kind":"Field","name":{"kind":"Name","value":"tokens"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"contract"}},{"kind":"Field","name":{"kind":"Name","value":"logo_url"}},{"kind":"Field","name":{"kind":"Name","value":"is_native"}}]}},{"kind":"Field","name":{"kind":"Name","value":"access_registry_contract"}},{"kind":"Field","name":{"kind":"Name","value":"poap_contract"}},{"kind":"Field","name":{"kind":"Name","value":"marketplace_contract"}},{"kind":"Field","name":{"kind":"Name","value":"marketplace_version"}},{"kind":"Field","name":{"kind":"Name","value":"biconomy_api_key"}},{"kind":"Field","name":{"kind":"Name","value":"ens_registry"}},{"kind":"Field","name":{"kind":"Name","value":"proxy_admin_contract"}},{"kind":"Field","name":{"kind":"Name","value":"payment_config_registry_contract"}},{"kind":"Field","name":{"kind":"Name","value":"escrow_manager_contract"}},{"kind":"Field","name":{"kind":"Name","value":"relay_payment_contract"}},{"kind":"Field","name":{"kind":"Name","value":"stake_payment_contract"}},{"kind":"Field","name":{"kind":"Name","value":"reward_registry_contract"}},{"kind":"Field","name":{"kind":"Name","value":"eas_event_contract"}},{"kind":"Field","name":{"kind":"Name","value":"eas_graphql_url"}},{"kind":"Field","name":{"kind":"Name","value":"aragon_network"}},{"kind":"Field","name":{"kind":"Name","value":"axelar_chain_name"}},{"kind":"Field","name":{"kind":"Name","value":"donation_registry_contract"}},{"kind":"Field","name":{"kind":"Name","value":"lemonhead_contract_address"}},{"kind":"Field","name":{"kind":"Name","value":"lemonade_passport_contract_address"}},{"kind":"Field","name":{"kind":"Name","value":"zugrama_passport_contract_address"}},{"kind":"Field","name":{"kind":"Name","value":"vinyl_nation_passport_contract_address"}},{"kind":"Field","name":{"kind":"Name","value":"drip_nation_passport_contract_address"}},{"kind":"Field","name":{"kind":"Name","value":"festival_nation_passport_contract_address"}},{"kind":"Field","name":{"kind":"Name","value":"lemonade_username_contract_address"}},{"kind":"Field","name":{"kind":"Name","value":"poap_enabled"}},{"kind":"Field","name":{"kind":"Name","value":"launchpad_closed_permissions_contract_address"}},{"kind":"Field","name":{"kind":"Name","value":"launchpad_treasury_address_fee_split_manager_implementation_contract_address"}},{"kind":"Field","name":{"kind":"Name","value":"launchpad_treasury_staking_manager_implementation_contract_address"}},{"kind":"Field","name":{"kind":"Name","value":"launchpad_zap_contract_address"}},{"kind":"Field","name":{"kind":"Name","value":"launchpad_fee_escrow_contract_address"}},{"kind":"Field","name":{"kind":"Name","value":"launchpad_market_capped_price_contract_address"}},{"kind":"Field","name":{"kind":"Name","value":"launchpad_market_utils_contract_address"}}]}}]}}]} as unknown as DocumentNode<ListChainsQuery, ListChainsQueryVariables>;
export const GetUserWalletRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserWalletRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"wallet"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"getUserWalletRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"wallet"},"value":{"kind":"Variable","name":{"kind":"Name","value":"wallet"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<GetUserWalletRequestQuery, GetUserWalletRequestQueryVariables>;
export const GetSelfVerificationStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSelfVerificationStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"config"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SelfVerificationConfigInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"getSelfVerificationStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"config"},"value":{"kind":"Variable","name":{"kind":"Name","value":"config"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"disclosures"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}}]}}]}}]}}]} as unknown as DocumentNode<GetSelfVerificationStatusQuery, GetSelfVerificationStatusQueryVariables>;
export const CreateSelfVerificationRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSelfVerificationRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"config"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SelfVerificationConfigInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"createSelfVerificationRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"config"},"value":{"kind":"Variable","name":{"kind":"Name","value":"config"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"endpoint"}},{"kind":"Field","name":{"kind":"Name","value":"endpoint_type"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}}]} as unknown as DocumentNode<CreateSelfVerificationRequestMutation, CreateSelfVerificationRequestMutationVariables>;
export const CreateOauth2ClientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateOauth2Client"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Oauth2ClientInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"createOauth2Client"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"client_id"}},{"kind":"Field","name":{"kind":"Name","value":"client_secret"}},{"kind":"Field","name":{"kind":"Name","value":"audience"}}]}}]}}]} as unknown as DocumentNode<CreateOauth2ClientMutation, CreateOauth2ClientMutationVariables>;
export const CreateStripeCardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createStripeCard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paymentMethod"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"createStripeCard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"payment_method"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paymentMethod"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}}]}}]}}]} as unknown as DocumentNode<CreateStripeCardMutation, CreateStripeCardMutationVariables>;
export const GetStripeCardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getStripeCards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"getStripeCards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"last4"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}},{"kind":"Field","name":{"kind":"Name","value":"stamp"}},{"kind":"Field","name":{"kind":"Name","value":"user"}}]}}]}}]} as unknown as DocumentNode<GetStripeCardsQuery, GetStripeCardsQueryVariables>;
export const UpdatePaymentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updatePayment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePaymentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"updatePayment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"transfer_metadata"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"failure_reason"}}]}}]}}]} as unknown as DocumentNode<UpdatePaymentMutation, UpdatePaymentMutationVariables>;
export const GetNewPaymentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getNewPayment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paymentSecret"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"getNewPayment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"payment_secret"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paymentSecret"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"due_amount"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"ref_data"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"failure_reason"}},{"kind":"Field","name":{"kind":"Name","value":"account_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"account_info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumEscrowAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"minimum_deposit_percent"}},{"kind":"Field","name":{"kind":"Name","value":"host_refund_percent"}},{"kind":"Field","name":{"kind":"Name","value":"refund_policies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"percent"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetNewPaymentQuery, GetNewPaymentQueryVariables>;
export const GetPaymentRefundSignatureDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPaymentRefundSignature"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"getPaymentRefundSignature"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"args"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]} as unknown as DocumentNode<GetPaymentRefundSignatureQuery, GetPaymentRefundSignatureQueryVariables>;
export const CancelPaymentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CancelPayment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CancelPaymentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"cancelPayment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<CancelPaymentMutation, CancelPaymentMutationVariables>;
export const GenerateStripeAccountLinkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GenerateStripeAccountLink"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"refreshUrl"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"returnUrl"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"generateStripeAccountLink"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"refresh_url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"refreshUrl"}}},{"kind":"Argument","name":{"kind":"Name","value":"return_url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"returnUrl"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode<GenerateStripeAccountLinkMutation, GenerateStripeAccountLinkMutationVariables>;
export const ListNewPaymentAccountsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"listNewPaymentAccounts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaymentAccountType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"provider"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"NewPaymentProvider"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"listNewPaymentAccounts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"provider"},"value":{"kind":"Variable","name":{"kind":"Name","value":"provider"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"account_info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AccountInfoFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"user"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AccountInfoFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AccountInfo"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SafeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"owners"}},{"kind":"Field","name":{"kind":"Name","value":"threshold"}},{"kind":"Field","name":{"kind":"Name","value":"pending"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DigitalAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"account_id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"account_id"}},{"kind":"Field","name":{"kind":"Name","value":"publishable_key"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumEscrowAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"minimum_deposit_percent"}},{"kind":"Field","name":{"kind":"Name","value":"host_refund_percent"}},{"kind":"Field","name":{"kind":"Name","value":"refund_policies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"percent"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumRelayAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"payment_splitter_contract"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumStakeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"config_id"}},{"kind":"Field","name":{"kind":"Name","value":"requirement_checkin_before"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SolanaAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}}]}}]}}]} as unknown as DocumentNode<ListNewPaymentAccountsQuery, ListNewPaymentAccountsQueryVariables>;
export const CreateNewPaymentAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createNewPaymentAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaymentAccountType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"provider"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"NewPaymentProvider"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"account_info"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"JSON"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"createNewPaymentAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"provider"},"value":{"kind":"Variable","name":{"kind":"Name","value":"provider"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"account_info"},"value":{"kind":"Variable","name":{"kind":"Name","value":"account_info"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"account_info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AccountInfoFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"user"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AccountInfoFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AccountInfo"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SafeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"owners"}},{"kind":"Field","name":{"kind":"Name","value":"threshold"}},{"kind":"Field","name":{"kind":"Name","value":"pending"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DigitalAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"account_id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"account_id"}},{"kind":"Field","name":{"kind":"Name","value":"publishable_key"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumEscrowAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"minimum_deposit_percent"}},{"kind":"Field","name":{"kind":"Name","value":"host_refund_percent"}},{"kind":"Field","name":{"kind":"Name","value":"refund_policies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"percent"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumRelayAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"payment_splitter_contract"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumStakeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"config_id"}},{"kind":"Field","name":{"kind":"Name","value":"requirement_checkin_before"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SolanaAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}}]}}]}}]} as unknown as DocumentNode<CreateNewPaymentAccountMutation, CreateNewPaymentAccountMutationVariables>;
export const UpdateEventPaymentAccountsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateEventPaymentAccounts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"payment_accounts_new"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"updateEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"payment_accounts_new"},"value":{"kind":"Variable","name":{"kind":"Name","value":"payment_accounts_new"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"payment_accounts_new"}},{"kind":"Field","name":{"kind":"Name","value":"payment_accounts_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PaymentAccount"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PaymentAccount"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NewPaymentAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"account_info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SafeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"owners"}},{"kind":"Field","name":{"kind":"Name","value":"threshold"}},{"kind":"Field","name":{"kind":"Name","value":"pending"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DigitalAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"account_id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"account_id"}},{"kind":"Field","name":{"kind":"Name","value":"publishable_key"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumEscrowAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"minimum_deposit_percent"}},{"kind":"Field","name":{"kind":"Name","value":"host_refund_percent"}},{"kind":"Field","name":{"kind":"Name","value":"refund_policies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"percent"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumRelayAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"payment_splitter_contract"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumStakeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"config_id"}},{"kind":"Field","name":{"kind":"Name","value":"requirement_checkin_before"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SolanaAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateEventPaymentAccountsMutation, UpdateEventPaymentAccountsMutationVariables>;
export const GetSpacesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSpaces"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"with_my_spaces"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"with_public_spaces"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roles"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SpaceRole"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"featured"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"listSpaces"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"with_my_spaces"},"value":{"kind":"Variable","name":{"kind":"Name","value":"with_my_spaces"}}},{"kind":"Argument","name":{"kind":"Name","value":"with_public_spaces"},"value":{"kind":"Variable","name":{"kind":"Name","value":"with_public_spaces"}}},{"kind":"Argument","name":{"kind":"Name","value":"roles"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roles"}}},{"kind":"Argument","name":{"kind":"Name","value":"featured"},"value":{"kind":"Variable","name":{"kind":"Name","value":"featured"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Space"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Space"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"admins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"is_ambassador"}},{"kind":"Field","name":{"kind":"Name","value":"followed"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"followers_count"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image_cover"}},{"kind":"Field","name":{"kind":"Name","value":"image_cover_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}},{"kind":"Field","name":{"kind":"Name","value":"creator"}},{"kind":"Field","name":{"kind":"Name","value":"creator_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"listed_events"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"street_1"}},{"kind":"Field","name":{"kind":"Name","value":"street_2"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"handle_instagram"}},{"kind":"Field","name":{"kind":"Name","value":"handle_twitter"}},{"kind":"Field","name":{"kind":"Name","value":"handle_linkedin"}},{"kind":"Field","name":{"kind":"Name","value":"handle_youtube"}},{"kind":"Field","name":{"kind":"Name","value":"handle_tiktok"}},{"kind":"Field","name":{"kind":"Name","value":"personal"}},{"kind":"Field","name":{"kind":"Name","value":"theme_data"}},{"kind":"Field","name":{"kind":"Name","value":"sub_spaces"}},{"kind":"Field","name":{"kind":"Name","value":"lens_feed_id"}},{"kind":"Field","name":{"kind":"Name","value":"council_members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"wallet"}}]}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"nft_enabled"}},{"kind":"Field","name":{"kind":"Name","value":"theme_name"}}]}}]} as unknown as DocumentNode<GetSpacesQuery, GetSpacesQueryVariables>;
export const GetSpaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSpace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hostname"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"getSpace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}},{"kind":"Argument","name":{"kind":"Name","value":"hostname"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hostname"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Space"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Space"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"admins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"is_ambassador"}},{"kind":"Field","name":{"kind":"Name","value":"followed"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"followers_count"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image_cover"}},{"kind":"Field","name":{"kind":"Name","value":"image_cover_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}},{"kind":"Field","name":{"kind":"Name","value":"creator"}},{"kind":"Field","name":{"kind":"Name","value":"creator_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"listed_events"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"street_1"}},{"kind":"Field","name":{"kind":"Name","value":"street_2"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"handle_instagram"}},{"kind":"Field","name":{"kind":"Name","value":"handle_twitter"}},{"kind":"Field","name":{"kind":"Name","value":"handle_linkedin"}},{"kind":"Field","name":{"kind":"Name","value":"handle_youtube"}},{"kind":"Field","name":{"kind":"Name","value":"handle_tiktok"}},{"kind":"Field","name":{"kind":"Name","value":"personal"}},{"kind":"Field","name":{"kind":"Name","value":"theme_data"}},{"kind":"Field","name":{"kind":"Name","value":"sub_spaces"}},{"kind":"Field","name":{"kind":"Name","value":"lens_feed_id"}},{"kind":"Field","name":{"kind":"Name","value":"council_members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"wallet"}}]}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"nft_enabled"}},{"kind":"Field","name":{"kind":"Name","value":"theme_name"}}]}}]} as unknown as DocumentNode<GetSpaceQuery, GetSpaceQueryVariables>;
export const GetSpaceEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSpaceEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startFrom"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTimeISO"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startTo"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTimeISO"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"space"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"EventSortInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endFrom"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTimeISO"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endTo"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTimeISO"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"spaceTags"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"getEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"start_from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startFrom"}}},{"kind":"Argument","name":{"kind":"Name","value":"start_to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startTo"}}},{"kind":"Argument","name":{"kind":"Name","value":"space"},"value":{"kind":"Variable","name":{"kind":"Name","value":"space"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}},{"kind":"Argument","name":{"kind":"Name","value":"end_from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endFrom"}}},{"kind":"Argument","name":{"kind":"Name","value":"end_to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endTo"}}},{"kind":"Argument","name":{"kind":"Name","value":"space_tags"},"value":{"kind":"Variable","name":{"kind":"Name","value":"spaceTags"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"shortid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"host_expanded_new"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visible_cohosts_expanded_new"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"Field","name":{"kind":"Name","value":"new_new_photos_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"external_url"}},{"kind":"Field","name":{"kind":"Name","value":"external_hostname"}},{"kind":"Field","name":{"kind":"Name","value":"event_ticket_types"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"prices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"cost"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"default"}},{"kind":"Field","name":{"kind":"Name","value":"payment_accounts"}},{"kind":"Field","name":{"kind":"Name","value":"payment_accounts_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PaymentAccount"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"host_expanded_new"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visible_cohosts_expanded_new"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PaymentAccount"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NewPaymentAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"account_info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SafeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"owners"}},{"kind":"Field","name":{"kind":"Name","value":"threshold"}},{"kind":"Field","name":{"kind":"Name","value":"pending"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DigitalAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"account_id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"account_id"}},{"kind":"Field","name":{"kind":"Name","value":"publishable_key"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumEscrowAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"minimum_deposit_percent"}},{"kind":"Field","name":{"kind":"Name","value":"host_refund_percent"}},{"kind":"Field","name":{"kind":"Name","value":"refund_policies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"percent"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumRelayAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"payment_splitter_contract"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumStakeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"config_id"}},{"kind":"Field","name":{"kind":"Name","value":"requirement_checkin_before"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SolanaAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}}]}}]}}]}}]} as unknown as DocumentNode<GetSpaceEventsQuery, GetSpaceEventsQueryVariables>;
export const GetSpaceEventsCalendarDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSpaceEventsCalendar"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"space"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"getEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"space"},"value":{"kind":"Variable","name":{"kind":"Name","value":"space"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}}]}}]}}]} as unknown as DocumentNode<GetSpaceEventsCalendarQuery, GetSpaceEventsCalendarQueryVariables>;
export const GetSpaceTagsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSpaceTags"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"space"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"listSpaceTags"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"space"},"value":{"kind":"Variable","name":{"kind":"Name","value":"space"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"SpaceTagFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SpaceTagFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SpaceTag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"space"}},{"kind":"Field","name":{"kind":"Name","value":"tag"}},{"kind":"Field","name":{"kind":"Name","value":"targets"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<GetSpaceTagsQuery, GetSpaceTagsQueryVariables>;
export const GetSpaceEventRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSpaceEventRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"space"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"state"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"EventJoinRequestState"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"getSpaceEventRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"space"},"value":{"kind":"Variable","name":{"kind":"Name","value":"space"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"state"},"value":{"kind":"Variable","name":{"kind":"Name","value":"state"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"space"}},{"kind":"Field","name":{"kind":"Name","value":"event"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"decided_at"}},{"kind":"Field","name":{"kind":"Name","value":"decided_by"}},{"kind":"Field","name":{"kind":"Name","value":"created_by_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"event_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"region"}}]}},{"kind":"Field","name":{"kind":"Name","value":"new_new_photos_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"guests"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]} as unknown as DocumentNode<GetSpaceEventRequestsQuery, GetSpaceEventRequestsQueryVariables>;
export const GetMySpaceEventRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMySpaceEventRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"space"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"state"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"EventJoinRequestState"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"getMySpaceEventRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"space"},"value":{"kind":"Variable","name":{"kind":"Name","value":"space"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"state"},"value":{"kind":"Variable","name":{"kind":"Name","value":"state"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"event_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"new_new_photos_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetMySpaceEventRequestsQuery, GetMySpaceEventRequestsQueryVariables>;
export const GetSubSpacesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getSubSpaces"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"getSubSpaces"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"followers_count"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"is_admin"}},{"kind":"Field","name":{"kind":"Name","value":"followed"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}}]}}]} as unknown as DocumentNode<GetSubSpacesQuery, GetSubSpacesQueryVariables>;
export const GetListSpaceCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetListSpaceCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"listSpaceCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"listed_events_count"}},{"kind":"Field","name":{"kind":"Name","value":"space"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<GetListSpaceCategoriesQuery, GetListSpaceCategoriesQueryVariables>;
export const GetListGeoRegionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetListGeoRegions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"listGeoRegions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"cities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"space"}},{"kind":"Field","name":{"kind":"Name","value":"icon_url"}},{"kind":"Field","name":{"kind":"Name","value":"listed_events_count"}}]}}]}}]}}]} as unknown as DocumentNode<GetListGeoRegionsQuery, GetListGeoRegionsQueryVariables>;
export const CheckSpaceSlugDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CheckSpaceSlug"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"canUseSpaceSlug"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}]}]}}]} as unknown as DocumentNode<CheckSpaceSlugQuery, CheckSpaceSlugQueryVariables>;
export const SearchSpacesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchSpaces"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchSpaceInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"searchSpaces"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Space"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Space"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"admins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"is_ambassador"}},{"kind":"Field","name":{"kind":"Name","value":"followed"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"followers_count"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image_cover"}},{"kind":"Field","name":{"kind":"Name","value":"image_cover_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}},{"kind":"Field","name":{"kind":"Name","value":"creator"}},{"kind":"Field","name":{"kind":"Name","value":"creator_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"listed_events"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"street_1"}},{"kind":"Field","name":{"kind":"Name","value":"street_2"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"handle_instagram"}},{"kind":"Field","name":{"kind":"Name","value":"handle_twitter"}},{"kind":"Field","name":{"kind":"Name","value":"handle_linkedin"}},{"kind":"Field","name":{"kind":"Name","value":"handle_youtube"}},{"kind":"Field","name":{"kind":"Name","value":"handle_tiktok"}},{"kind":"Field","name":{"kind":"Name","value":"personal"}},{"kind":"Field","name":{"kind":"Name","value":"theme_data"}},{"kind":"Field","name":{"kind":"Name","value":"sub_spaces"}},{"kind":"Field","name":{"kind":"Name","value":"lens_feed_id"}},{"kind":"Field","name":{"kind":"Name","value":"council_members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"wallet"}}]}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"nft_enabled"}},{"kind":"Field","name":{"kind":"Name","value":"theme_name"}}]}}]} as unknown as DocumentNode<SearchSpacesQuery, SearchSpacesQueryVariables>;
export const GetSpaceMembersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSpaceMembers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"space"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roles"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SpaceRole"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"state"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SpaceMembershipState"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visible"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SortInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deletion"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tags"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"listSpaceMembers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"space"},"value":{"kind":"Variable","name":{"kind":"Name","value":"space"}}},{"kind":"Argument","name":{"kind":"Name","value":"roles"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roles"}}},{"kind":"Argument","name":{"kind":"Name","value":"state"},"value":{"kind":"Variable","name":{"kind":"Name","value":"state"}}},{"kind":"Argument","name":{"kind":"Name","value":"visible"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visible"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}},{"kind":"Argument","name":{"kind":"Name","value":"deletion"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deletion"}}},{"kind":"Argument","name":{"kind":"Name","value":"tags"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tags"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"user"}},{"kind":"Field","name":{"kind":"Name","value":"user_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"space"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"visible"}},{"kind":"Field","name":{"kind":"Name","value":"role_changed_at"}},{"kind":"Field","name":{"kind":"Name","value":"deleted_at"}},{"kind":"Field","name":{"kind":"Name","value":"user_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"new_photos_expanded"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"event_count"}},{"kind":"Field","name":{"kind":"Name","value":"checkin_count"}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"space"}},{"kind":"Field","name":{"kind":"Name","value":"tag"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"targets"}},{"kind":"Field","name":{"kind":"Name","value":"targets_count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetSpaceMembersQuery, GetSpaceMembersQueryVariables>;
export const FollowSpaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"FollowSpace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"space"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"followSpace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"space"},"value":{"kind":"Variable","name":{"kind":"Name","value":"space"}}}]}]}}]} as unknown as DocumentNode<FollowSpaceMutation, FollowSpaceMutationVariables>;
export const UnfollowSpaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnfollowSpace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"space"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"unfollowSpace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"space"},"value":{"kind":"Variable","name":{"kind":"Name","value":"space"}}}]}]}}]} as unknown as DocumentNode<UnfollowSpaceMutation, UnfollowSpaceMutationVariables>;
export const UpdateSpaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSpace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SpaceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"updateSpace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Space"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Space"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"admins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"is_ambassador"}},{"kind":"Field","name":{"kind":"Name","value":"followed"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"followers_count"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image_cover"}},{"kind":"Field","name":{"kind":"Name","value":"image_cover_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}},{"kind":"Field","name":{"kind":"Name","value":"creator"}},{"kind":"Field","name":{"kind":"Name","value":"creator_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"listed_events"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"street_1"}},{"kind":"Field","name":{"kind":"Name","value":"street_2"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"handle_instagram"}},{"kind":"Field","name":{"kind":"Name","value":"handle_twitter"}},{"kind":"Field","name":{"kind":"Name","value":"handle_linkedin"}},{"kind":"Field","name":{"kind":"Name","value":"handle_youtube"}},{"kind":"Field","name":{"kind":"Name","value":"handle_tiktok"}},{"kind":"Field","name":{"kind":"Name","value":"personal"}},{"kind":"Field","name":{"kind":"Name","value":"theme_data"}},{"kind":"Field","name":{"kind":"Name","value":"sub_spaces"}},{"kind":"Field","name":{"kind":"Name","value":"lens_feed_id"}},{"kind":"Field","name":{"kind":"Name","value":"council_members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"wallet"}}]}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"nft_enabled"}},{"kind":"Field","name":{"kind":"Name","value":"theme_name"}}]}}]} as unknown as DocumentNode<UpdateSpaceMutation, UpdateSpaceMutationVariables>;
export const PinEventsToSpaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PinEventsToSpace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"space"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"events"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tags"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"pinEventsToSpace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"space"},"value":{"kind":"Variable","name":{"kind":"Name","value":"space"}}},{"kind":"Argument","name":{"kind":"Name","value":"events"},"value":{"kind":"Variable","name":{"kind":"Name","value":"events"}}},{"kind":"Argument","name":{"kind":"Name","value":"tags"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tags"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"requests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"SpaceEventRequestFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SpaceEventRequestFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SpaceEventRequest"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"space"}},{"kind":"Field","name":{"kind":"Name","value":"event"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"decided_at"}},{"kind":"Field","name":{"kind":"Name","value":"decided_by"}}]}}]} as unknown as DocumentNode<PinEventsToSpaceMutation, PinEventsToSpaceMutationVariables>;
export const CreateExternalEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateExternalEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"createEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]} as unknown as DocumentNode<CreateExternalEventMutation, CreateExternalEventMutationVariables>;
export const CreateSpaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSpace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SpaceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"createSpace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Space"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Space"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"admins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"is_ambassador"}},{"kind":"Field","name":{"kind":"Name","value":"followed"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"followers_count"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image_cover"}},{"kind":"Field","name":{"kind":"Name","value":"image_cover_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}},{"kind":"Field","name":{"kind":"Name","value":"creator"}},{"kind":"Field","name":{"kind":"Name","value":"creator_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"listed_events"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"street_1"}},{"kind":"Field","name":{"kind":"Name","value":"street_2"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"handle_instagram"}},{"kind":"Field","name":{"kind":"Name","value":"handle_twitter"}},{"kind":"Field","name":{"kind":"Name","value":"handle_linkedin"}},{"kind":"Field","name":{"kind":"Name","value":"handle_youtube"}},{"kind":"Field","name":{"kind":"Name","value":"handle_tiktok"}},{"kind":"Field","name":{"kind":"Name","value":"personal"}},{"kind":"Field","name":{"kind":"Name","value":"theme_data"}},{"kind":"Field","name":{"kind":"Name","value":"sub_spaces"}},{"kind":"Field","name":{"kind":"Name","value":"lens_feed_id"}},{"kind":"Field","name":{"kind":"Name","value":"council_members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"wallet"}}]}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"nft_enabled"}},{"kind":"Field","name":{"kind":"Name","value":"theme_name"}}]}}]} as unknown as DocumentNode<CreateSpaceMutation, CreateSpaceMutationVariables>;
export const DecideSpaceEventRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DecideSpaceEventRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DecideSpaceEventRequestsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"decideSpaceEventRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<DecideSpaceEventRequestsMutation, DecideSpaceEventRequestsMutationVariables>;
export const AddSpaceMembersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddSpaceMembers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddSpaceMemberInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"addSpaceMembers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<AddSpaceMembersMutation, AddSpaceMembersMutationVariables>;
export const DeleteSpaceMembersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteSpaceMembers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteSpaceMemberInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"deleteSpaceMembers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"user"}},{"kind":"Field","name":{"kind":"Name","value":"user_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"deleted_at"}},{"kind":"Field","name":{"kind":"Name","value":"role_changed_at"}},{"kind":"Field","name":{"kind":"Name","value":"user_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visible"}}]}}]}}]} as unknown as DocumentNode<DeleteSpaceMembersMutation, DeleteSpaceMembersMutationVariables>;
export const DeleteSpaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteSpace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"deleteSpace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteSpaceMutation, DeleteSpaceMutationVariables>;
export const UpsertSpaceTagDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpsertSpaceTag"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SpaceTagInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"insertSpaceTag"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"SpaceTagFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SpaceTagFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SpaceTag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"space"}},{"kind":"Field","name":{"kind":"Name","value":"tag"}},{"kind":"Field","name":{"kind":"Name","value":"targets"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<UpsertSpaceTagMutation, UpsertSpaceTagMutationVariables>;
export const ManageSpaceTagDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ManageSpaceTag"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tagged"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"target"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"space"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"manageSpaceTag"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"tagged"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tagged"}}},{"kind":"Argument","name":{"kind":"Name","value":"target"},"value":{"kind":"Variable","name":{"kind":"Name","value":"target"}}},{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"space"},"value":{"kind":"Variable","name":{"kind":"Name","value":"space"}}}]}]}}]} as unknown as DocumentNode<ManageSpaceTagMutation, ManageSpaceTagMutationVariables>;
export const DeleteSpaceTagDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteSpaceTag"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"space"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"deleteSpaceTag"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"space"},"value":{"kind":"Variable","name":{"kind":"Name","value":"space"}}}]}]}}]} as unknown as DocumentNode<DeleteSpaceTagMutation, DeleteSpaceTagMutationVariables>;
export const AttachSubSpacesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AttachSubSpaces"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subSpaces"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"attachSubSpaces"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"sub_spaces"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subSpaces"}}}]}]}}]} as unknown as DocumentNode<AttachSubSpacesMutation, AttachSubSpacesMutationVariables>;
export const RemoveSubSpacesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveSubSpaces"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subSpaces"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"removeSubSpaces"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sub_spaces"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subSpaces"}}},{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<RemoveSubSpacesMutation, RemoveSubSpacesMutationVariables>;
export const UpdateSubSpaceOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSubSpaceOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subSpaces"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"updateSubSpaceOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"sub_spaces"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subSpaces"}}}]}]}}]} as unknown as DocumentNode<UpdateSubSpaceOrderMutation, UpdateSubSpaceOrderMutationVariables>;
export const GetSpaceNfTsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSpaceNFTs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"space"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"kind"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SpaceNFTKind"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"listSpaceNFTs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"space"},"value":{"kind":"Variable","name":{"kind":"Name","value":"space"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"kind"},"value":{"kind":"Variable","name":{"kind":"Name","value":"kind"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"cover_image_url"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"content_url"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"token_limit"}},{"kind":"Field","name":{"kind":"Name","value":"contracts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"space_nft"}},{"kind":"Field","name":{"kind":"Name","value":"network_id"}},{"kind":"Field","name":{"kind":"Name","value":"mint_price"}},{"kind":"Field","name":{"kind":"Name","value":"currency_address"}},{"kind":"Field","name":{"kind":"Name","value":"deployed_contract_address"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]} as unknown as DocumentNode<GetSpaceNfTsQuery, GetSpaceNfTsQueryVariables>;
export const CalculateTicketsPricingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CalculateTicketsPricing"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalculateTicketsPricingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"calculateTicketsPricing"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"deposit_infos"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"minimum_amount"}},{"kind":"Field","name":{"kind":"Name","value":"minimum_percent"}}]}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"payment_accounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"account_info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SolanaAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SafeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"owners"}},{"kind":"Field","name":{"kind":"Name","value":"threshold"}},{"kind":"Field","name":{"kind":"Name","value":"pending"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DigitalAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"account_id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"account_id"}},{"kind":"Field","name":{"kind":"Name","value":"publishable_key"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumEscrowAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"minimum_deposit_percent"}},{"kind":"Field","name":{"kind":"Name","value":"host_refund_percent"}},{"kind":"Field","name":{"kind":"Name","value":"refund_policies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"percent"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumRelayAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"payment_splitter_contract"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumStakeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"config_id"}},{"kind":"Field","name":{"kind":"Name","value":"requirement_checkin_before"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"escrow"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"minimum_amount"}},{"kind":"Field","name":{"kind":"Name","value":"minimum_percent"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}},{"kind":"Field","name":{"kind":"Name","value":"relay"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"payment_splitter_contract"}}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"user"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]} as unknown as DocumentNode<CalculateTicketsPricingQuery, CalculateTicketsPricingQueryVariables>;
export const GetMyTicketsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMyTickets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"event"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"withPaymentInfo"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"getMyTickets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"event"},"value":{"kind":"Variable","name":{"kind":"Name","value":"event"}}},{"kind":"Argument","name":{"kind":"Name","value":"with_payment_info"},"value":{"kind":"Variable","name":{"kind":"Name","value":"withPaymentInfo"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"tickets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"accepted"}},{"kind":"Field","name":{"kind":"Name","value":"assigned_email"}},{"kind":"Field","name":{"kind":"Name","value":"assigned_to"}},{"kind":"Field","name":{"kind":"Name","value":"assigned_to_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"new_photos_expanded"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"event"}},{"kind":"Field","name":{"kind":"Name","value":"invited_by"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"type_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"prices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"cost"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"default"}},{"kind":"Field","name":{"kind":"Name","value":"payment_accounts"}},{"kind":"Field","name":{"kind":"Name","value":"payment_accounts_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PaymentAccount"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"shortid"}},{"kind":"Field","name":{"kind":"Name","value":"event_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"payments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"attempting_refund"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"refund_info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"available_amount"}},{"kind":"Field","name":{"kind":"Name","value":"refunded"}}]}},{"kind":"Field","name":{"kind":"Name","value":"refund_policy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"percent"}},{"kind":"Field","name":{"kind":"Name","value":"requirements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"checkin_before"}}]}},{"kind":"Field","name":{"kind":"Name","value":"satisfy_all"}}]}},{"kind":"Field","name":{"kind":"Name","value":"refund_requirements_met"}},{"kind":"Field","name":{"kind":"Name","value":"payment_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"account_info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumStakeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"config_id"}},{"kind":"Field","name":{"kind":"Name","value":"requirement_checkin_before"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PaymentAccount"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NewPaymentAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"account_info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SafeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"owners"}},{"kind":"Field","name":{"kind":"Name","value":"threshold"}},{"kind":"Field","name":{"kind":"Name","value":"pending"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DigitalAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"account_id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"account_id"}},{"kind":"Field","name":{"kind":"Name","value":"publishable_key"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumEscrowAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"minimum_deposit_percent"}},{"kind":"Field","name":{"kind":"Name","value":"host_refund_percent"}},{"kind":"Field","name":{"kind":"Name","value":"refund_policies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"percent"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumRelayAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"payment_splitter_contract"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumStakeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"config_id"}},{"kind":"Field","name":{"kind":"Name","value":"requirement_checkin_before"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SolanaAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}}]}}]}}]}}]} as unknown as DocumentNode<GetMyTicketsQuery, GetMyTicketsQueryVariables>;
export const RedeemTicketsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"redeemTickets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"event"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"items"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PurchasableItem"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"buyer_info"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"BuyerInfoInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"inviter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user_info"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UserInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"connect_wallets"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ConnectWalletInput"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"buyer_wallet"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"passcodes"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"redeemTickets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"event"},"value":{"kind":"Variable","name":{"kind":"Name","value":"event"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"items"},"value":{"kind":"Variable","name":{"kind":"Name","value":"items"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"buyer_info"},"value":{"kind":"Variable","name":{"kind":"Name","value":"buyer_info"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"inviter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"inviter"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"user_info"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user_info"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"connect_wallets"},"value":{"kind":"Variable","name":{"kind":"Name","value":"connect_wallets"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"buyer_wallet"},"value":{"kind":"Variable","name":{"kind":"Name","value":"buyer_wallet"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"passcodes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"passcodes"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"tickets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"accepted"}},{"kind":"Field","name":{"kind":"Name","value":"assigned_email"}},{"kind":"Field","name":{"kind":"Name","value":"assigned_to"}},{"kind":"Field","name":{"kind":"Name","value":"event"}},{"kind":"Field","name":{"kind":"Name","value":"invited_by"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"join_request"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}}]}}]}}]} as unknown as DocumentNode<RedeemTicketsMutation, RedeemTicketsMutationVariables>;
export const BuyTicketsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"buyTickets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BuyTicketsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"buyTickets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"payment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"failure_reason"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"stamps"}},{"kind":"Field","name":{"kind":"Name","value":"transfer_metadata"}}]}},{"kind":"Field","name":{"kind":"Name","value":"join_request"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}}]}}]}}]} as unknown as DocumentNode<BuyTicketsMutation, BuyTicketsMutationVariables>;
export const CreateEventTicketTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createEventTicketType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventTicketTypeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"createEventTicketType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"default"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"photos"}},{"kind":"Field","name":{"kind":"Name","value":"photos_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"cost"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"default"}},{"kind":"Field","name":{"kind":"Name","value":"payment_accounts"}},{"kind":"Field","name":{"kind":"Name","value":"payment_accounts_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PaymentAccount"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"ticket_limit"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"limited"}},{"kind":"Field","name":{"kind":"Name","value":"limited_whitelist_users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"category_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PaymentAccount"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NewPaymentAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"account_info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SafeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"owners"}},{"kind":"Field","name":{"kind":"Name","value":"threshold"}},{"kind":"Field","name":{"kind":"Name","value":"pending"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DigitalAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"account_id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"account_id"}},{"kind":"Field","name":{"kind":"Name","value":"publishable_key"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumEscrowAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"minimum_deposit_percent"}},{"kind":"Field","name":{"kind":"Name","value":"host_refund_percent"}},{"kind":"Field","name":{"kind":"Name","value":"refund_policies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"percent"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumRelayAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"payment_splitter_contract"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumStakeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"config_id"}},{"kind":"Field","name":{"kind":"Name","value":"requirement_checkin_before"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SolanaAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}}]}}]}}]}}]} as unknown as DocumentNode<CreateEventTicketTypeMutation, CreateEventTicketTypeMutationVariables>;
export const DeleteEventTicketTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteEventTicketType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"event"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"deleteEventTicketType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"event"},"value":{"kind":"Variable","name":{"kind":"Name","value":"event"}}},{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteEventTicketTypeMutation, DeleteEventTicketTypeMutationVariables>;
export const UpdateEventTicketTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateEventTicketType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventTicketTypeInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"updateEventTicketType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"default"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"event"}},{"kind":"Field","name":{"kind":"Name","value":"photos"}},{"kind":"Field","name":{"kind":"Name","value":"photos_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"cost"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"default"}},{"kind":"Field","name":{"kind":"Name","value":"payment_accounts"}},{"kind":"Field","name":{"kind":"Name","value":"payment_accounts_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PaymentAccount"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"ticket_limit"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"offers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"auto"}},{"kind":"Field","name":{"kind":"Name","value":"broadcast_rooms"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_network"}}]}},{"kind":"Field","name":{"kind":"Name","value":"limited"}},{"kind":"Field","name":{"kind":"Name","value":"limited_whitelist_users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"category_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PaymentAccount"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NewPaymentAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"account_info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SafeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"owners"}},{"kind":"Field","name":{"kind":"Name","value":"threshold"}},{"kind":"Field","name":{"kind":"Name","value":"pending"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DigitalAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"account_id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"account_id"}},{"kind":"Field","name":{"kind":"Name","value":"publishable_key"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumEscrowAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"minimum_deposit_percent"}},{"kind":"Field","name":{"kind":"Name","value":"host_refund_percent"}},{"kind":"Field","name":{"kind":"Name","value":"refund_policies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"percent"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumRelayAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"payment_splitter_contract"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EthereumStakeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"config_id"}},{"kind":"Field","name":{"kind":"Name","value":"requirement_checkin_before"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SolanaAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"currency_map"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateEventTicketTypeMutation, UpdateEventTicketTypeMutationVariables>;
export const ExportEventTicketsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"exportEventTickets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ticketTypeIds"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchText"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"checkedIn"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"exportEventTickets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"ticket_type_ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ticketTypeIds"}}},{"kind":"Argument","name":{"kind":"Name","value":"search_text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchText"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"checked_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"checkedIn"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"tickets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"buyer_name"}},{"kind":"Field","name":{"kind":"Name","value":"buyer_first_name"}},{"kind":"Field","name":{"kind":"Name","value":"buyer_last_name"}},{"kind":"Field","name":{"kind":"Name","value":"buyer_email"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_category"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_type"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"payment_amount"}},{"kind":"Field","name":{"kind":"Name","value":"discount_amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"discount_code"}},{"kind":"Field","name":{"kind":"Name","value":"purchase_date"}},{"kind":"Field","name":{"kind":"Name","value":"payment_provider"}},{"kind":"Field","name":{"kind":"Name","value":"payment_id"}},{"kind":"Field","name":{"kind":"Name","value":"checkin_date"}},{"kind":"Field","name":{"kind":"Name","value":"is_assigned"}},{"kind":"Field","name":{"kind":"Name","value":"assignee_email"}},{"kind":"Field","name":{"kind":"Name","value":"assigned_to"}},{"kind":"Field","name":{"kind":"Name","value":"assigned_email"}},{"kind":"Field","name":{"kind":"Name","value":"is_issued"}},{"kind":"Field","name":{"kind":"Name","value":"issued_by"}},{"kind":"Field","name":{"kind":"Name","value":"is_claimed"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"cancelled_by"}},{"kind":"Field","name":{"kind":"Name","value":"buyer_wallet"}},{"kind":"Field","name":{"kind":"Name","value":"buyer_id"}},{"kind":"Field","name":{"kind":"Name","value":"buyer_avatar"}},{"kind":"Field","name":{"kind":"Name","value":"buyer_username"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_type_id"}},{"kind":"Field","name":{"kind":"Name","value":"shortid"}}]}}]}}]}}]} as unknown as DocumentNode<ExportEventTicketsQuery, ExportEventTicketsQueryVariables>;
export const CreateTicketsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTickets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ticketType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ticketAssignments"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TicketAssignment"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"createTickets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ticket_type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ticketType"}}},{"kind":"Argument","name":{"kind":"Name","value":"ticket_assignments"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ticketAssignments"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]} as unknown as DocumentNode<CreateTicketsMutation, CreateTicketsMutationVariables>;
export const CheckTicketTypePasscodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CheckTicketTypePasscode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"passcode"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"checkTicketTypePasscode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"passcode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"passcode"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}]}]}}]} as unknown as DocumentNode<CheckTicketTypePasscodeQuery, CheckTicketTypePasscodeQueryVariables>;
export const CancelTicketsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CancelTickets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CancelTicketsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"cancelTickets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<CancelTicketsMutation, CancelTicketsMutationVariables>;
export const UpgradeTicketDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpgradeTicket"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpgradeTicketInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"upgradeTicket"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<UpgradeTicketMutation, UpgradeTicketMutationVariables>;
export const GetMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"getMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"User"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"email_verified"}},{"kind":"Field","name":{"kind":"Name","value":"wallets_new"}},{"kind":"Field","name":{"kind":"Name","value":"wallet_custodial"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_connected_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"account_id"}},{"kind":"Field","name":{"kind":"Name","value":"connected"}}]}},{"kind":"Field","name":{"kind":"Name","value":"kratos_wallet_address"}},{"kind":"Field","name":{"kind":"Name","value":"kratos_farcaster_fid"}},{"kind":"Field","name":{"kind":"Name","value":"kratos_unicorn_wallet_address"}},{"kind":"Field","name":{"kind":"Name","value":"oauth2_allow_creation"}},{"kind":"Field","name":{"kind":"Name","value":"oauth2_clients"}},{"kind":"Field","name":{"kind":"Name","value":"oauth2_max_clients"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"User"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"job_title"}},{"kind":"Field","name":{"kind":"Name","value":"company_name"}},{"kind":"Field","name":{"kind":"Name","value":"addresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"street_1"}},{"kind":"Field","name":{"kind":"Name","value":"street_2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"postal"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"additional_directions"}}]}},{"kind":"Field","name":{"kind":"Name","value":"icebreakers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"question_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"handle_facebook"}},{"kind":"Field","name":{"kind":"Name","value":"handle_instagram"}},{"kind":"Field","name":{"kind":"Name","value":"handle_linkedin"}},{"kind":"Field","name":{"kind":"Name","value":"handle_twitter"}},{"kind":"Field","name":{"kind":"Name","value":"handle_farcaster"}},{"kind":"Field","name":{"kind":"Name","value":"handle_github"}},{"kind":"Field","name":{"kind":"Name","value":"pronoun"}},{"kind":"Field","name":{"kind":"Name","value":"calendly_url"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"new_photos_expanded"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}}]}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"url_go"}},{"kind":"Field","name":{"kind":"Name","value":"lens_profile_synced"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"hosted"}}]}}]} as unknown as DocumentNode<GetMeQuery, GetMeQueryVariables>;
export const UpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"User"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"User"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"job_title"}},{"kind":"Field","name":{"kind":"Name","value":"company_name"}},{"kind":"Field","name":{"kind":"Name","value":"addresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"street_1"}},{"kind":"Field","name":{"kind":"Name","value":"street_2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"postal"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"additional_directions"}}]}},{"kind":"Field","name":{"kind":"Name","value":"icebreakers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"question_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"handle_facebook"}},{"kind":"Field","name":{"kind":"Name","value":"handle_instagram"}},{"kind":"Field","name":{"kind":"Name","value":"handle_linkedin"}},{"kind":"Field","name":{"kind":"Name","value":"handle_twitter"}},{"kind":"Field","name":{"kind":"Name","value":"handle_farcaster"}},{"kind":"Field","name":{"kind":"Name","value":"handle_github"}},{"kind":"Field","name":{"kind":"Name","value":"pronoun"}},{"kind":"Field","name":{"kind":"Name","value":"calendly_url"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"new_photos_expanded"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}}]}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"url_go"}},{"kind":"Field","name":{"kind":"Name","value":"lens_profile_synced"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"hosted"}}]}}]} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const SearchUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"searchUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"new_photos_expanded"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}}]}}]}}]}}]} as unknown as DocumentNode<SearchUsersQuery, SearchUsersQueryVariables>;
export const GetUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MongoID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lens_profile_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"getUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"lens_profile_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lens_profile_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"hosted"}},{"kind":"Field","name":{"kind":"Name","value":"addresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"street_1"}},{"kind":"Field","name":{"kind":"Name","value":"street_2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"postal"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"additional_directions"}}]}},{"kind":"Field","name":{"kind":"Name","value":"new_photos_expanded"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cover_expanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}},{"kind":"Field","name":{"kind":"Name","value":"handle_facebook"}},{"kind":"Field","name":{"kind":"Name","value":"handle_instagram"}},{"kind":"Field","name":{"kind":"Name","value":"handle_linkedin"}},{"kind":"Field","name":{"kind":"Name","value":"handle_twitter"}},{"kind":"Field","name":{"kind":"Name","value":"handle_farcaster"}},{"kind":"Field","name":{"kind":"Name","value":"handle_github"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]}}]} as unknown as DocumentNode<GetUserQuery, GetUserQueryVariables>;
export const DeleteUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"deleteUser"}}]}}]} as unknown as DocumentNode<DeleteUserMutation, DeleteUserMutationVariables>;
export const SyncUserUnicornWalletDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"syncUserUnicornWallet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"syncUserUnicornWallet"}}]}}]} as unknown as DocumentNode<SyncUserUnicornWalletMutation, SyncUserUnicornWalletMutationVariables>;
export const UsernameAvailabilityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UsernameAvailability"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"wallet"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"isUsernameAvailable"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"wallet"},"value":{"kind":"Variable","name":{"kind":"Name","value":"wallet"}}},{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}]}]}}]} as unknown as DocumentNode<UsernameAvailabilityQuery, UsernameAvailabilityQueryVariables>;