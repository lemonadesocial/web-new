export const PASSPORT_PROVIDERS = [
  'mint',
  'zugrama',
  'vinyl-nation',
  'festival-nation',
  'drip-nation',
  'alzena-world',
] as const;
export type PASSPORT_PROVIDER = (typeof PASSPORT_PROVIDERS)[number];

export type PassportConfig = PassportState & {
  ui?: Record<
    PassportStep,
    {
      title?: string;
      subtitle?: string;
      showBgVideo?: boolean;
      footer: {
        label?: string;
        btnText: string;
        index: number;
      };
    }
  >;
  modal: {
    beforeMint: PassportModalConfig;
  };
};

export type PassportModalConfig = {
  description: string;
  li: string[];
  termLink?: string;
};

export enum PassportStep {
  'intro' = 'intro',
  'photo' = 'photo',
  'username' = 'username',
  'celebrate' = 'celebrate',
}

export type PassportState = {
  provider: PASSPORT_PROVIDER;
  passportTitle: string;
  currentStep?: PassportStep;
  useLemonhead?: boolean;
  useFluffle?: boolean;
  lemonadeUsername?: string;
  useENS?: boolean;
  ensName?: string;
  photo?: string;
  passportImage?: string;
  isSelfVerified?: boolean;
  mintData?: {
    signature: string;
    price: string;
    metadata: string;
  };
  mintState?: {
    txHash: string;
    tokenId: string;
  };
  enabled?: {
    /** @description Passport Photo */
    lemonhead?: boolean;
    /** @description Passport Photo */
    fluffePhoto?: boolean;

    /** @description Passport Username */
    ens?: boolean;
    /** @description Passport Username */
    lemonadeUsername?: boolean;
    selfVerify?: boolean;
    uploadPhoto?: boolean;
    /** @description check can mint before move next */
    whitelist?: boolean;
    /** @description required minted lemonhead before mint */
    shouldMintedLemonhead?: boolean;
    sharePassport?: boolean;
  };
};

export enum PassportActionKind {
  NextStep = 'NEXT_STEP',
  PrevStep = 'PREV_STEP',
  SelectLemonhead = 'SELECT_LEMONHEAD',
  SelectFluffle = 'SELECT_FLUFFLE',
  SetLemonadeUsername = 'SET_LEMONADE_USERNAME',
  SelectENS = 'SELECT_ENS',
  SetMintData = 'SET_MINT_DATA',
  SetPhoto = 'SET_PHOTO',
  SetPassportImage = 'SET_PASSPORT_IMAGE',
  SetSelfVerified = 'SET_SELF_VERIFIED',
  SetEnsName = 'SET_ENS_NAME',
  SetMintState = 'SET_MINT_STATE',
}

export const ContractAddressFieldMapping: Record<PASSPORT_PROVIDER, string> = {
  mint: 'lemonade_passport_contract_address',
  zugrama: 'zugrama_passport_contract_address',
  'vinyl-nation': 'vinyl_nation_passport_contract_address',
  'festival-nation': 'festival_nation_passport_contract_address',
  'drip-nation': 'drip_nation_passport_contract_address',
  'alzena-world': '',
};
