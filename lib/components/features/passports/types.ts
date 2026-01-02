export type PASSPORT_PROVIDER = 'mint' | 'zugrama' | 'vinyl-nation' | 'festival-nation' | 'drip-nation';

export type PassportConfig = PassportState & {
  ui?: Record<
    PassportStep,
    {
      title: string;
      subtitle?: string;
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
    ens?: boolean;
    lemonadeUsername?: boolean;
    selfVerify?: boolean;
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
  SetMintState = 'SET_MINT_STATE',
}

export const ContractAddressFieldMapping: Record<PASSPORT_PROVIDER, string> = {
  mint: 'lemonade_passport_contract_address',
  zugrama: '',
  'vinyl-nation': 'vinyl_nation_passport_contract_address',
  'festival-nation': 'festival_nation_passport_contract_address',
  'drip-nation': 'drip_nation_passport_contract_address',
};
