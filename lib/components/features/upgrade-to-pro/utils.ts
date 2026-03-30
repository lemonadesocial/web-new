import { ASSET_PREFIX } from '$lib/utils/constants';
import { formatUnits } from 'viem';

import {
  type ConnectionOutput,
  type ConnectorActionInfo,
  type ConnectorDefinition,
  type SubscriptionItem,
  type SubscriptionPricing,
  SubscriptionItemType,
  type SubscriptionCryptoPrice,
} from '$lib/graphql/generated/backend/graphql';
import { formatNumber } from '$lib/utils/number';
import type { TokenMeta } from '$lib/utils/crypto';

// ── Feature config types (matches backend SubscriptionFeatureConfig) ──

export type FeatureConfigTier = {
  enabled: boolean;
  limit?: number;
  values?: string[];
};

export type FeatureConfig = {
  feature_code: string;
  feature_type: 'boolean' | 'numeric_limit' | 'enum_set';
  display_label?: string | null;
  description: string;
  tiers: Record<string, FeatureConfigTier>;
};

export type ComparePlan = 'pro' | 'plus' | 'max' | 'enterprise';
type CompareValue = string | boolean;

type CompareRow = {
  label: string;
  values: Record<ComparePlan, CompareValue>;
};

export type CompareSection = {
  id: string;
  title: string;
  icon: string;
  rows: CompareRow[];
};

type CompareSectionDef = {
  id: string;
  title: string;
  icon: string;
  features: string[];
};

export const COMPARE_SECTION_DEFS: CompareSectionDef[] = [
  {
    id: 'ai_agents',
    title: 'AI & Agents',
    icon: 'icon-robot',
    features: ['ai_credits_per_month', 'topup_multiplier', 'advanced_ai_models', 'premium_ai_models', 'custom_agents', 'ai_tool_access', 'ai_page_generation'],
  },
  {
    id: 'domain_branding',
    title: 'Domain & Branding',
    icon: 'icon-globe',
    features: ['custom_event_slug', 'custom_domain', 'remove_branding'],
  },
  {
    id: 'design_page_builder',
    title: 'Design & Page Builder',
    icon: 'icon-palette-outline',
    features: ['premium_themes', 'page_builder', 'custom_code_access'],
  },
  {
    id: 'newsletter_email',
    title: 'Newsletter & Email',
    icon: 'icon-email',
    features: ['newsletter_access', 'newsletter_sends_per_month', 'newsletter_recipients_per_send'],
  },
  {
    id: 'integrations',
    title: 'Integrations',
    icon: 'icon-connector-line',
    features: ['available_connectors', 'api_access', 'marketplace_seller', 'referral_stablecoin_rewards', 'config_versions'],
  },
  {
    id: 'api_access',
    title: 'API access',
    icon: 'icon-api',
    features: ['api_keys_limit', 'api_rate_limit', 'api_burst_limit', 'max_page_size', 'api_monthly_quota', 'api_overage_rate', 'api_hard_cap', 'api_scopes'],
  },
];

const COMPARE_PLANS: ComparePlan[] = ['pro', 'plus', 'max', 'enterprise'];

function formatTierValue(config: FeatureConfig, tier: ComparePlan): CompareValue {
  const tierConfig = config.tiers[tier];

  if (!tierConfig?.enabled) {
    return false;
  }

  if (config.feature_type === 'boolean') {
    return true;
  }

  if (config.feature_type === 'numeric_limit') {
    const limit = tierConfig.limit ?? 0;

    if (limit === 0) {
      return tier === 'enterprise' ? 'Custom' : 'Unlimited';
    }

    return limit.toLocaleString('en-US');
  }

  if (config.feature_type === 'enum_set') {
    const values = tierConfig.values ?? [];

    if (values.includes('*')) return 'All';
    if (values.length === 0) return false;

    return values.map((v) => v.replace(/_/g, ' ')).join(', ');
  }

  return false;
}

export function buildCompareSections(featureConfigs: FeatureConfig[]): CompareSection[] {
  const configByCode = new Map(featureConfigs.map((c) => [c.feature_code, c]));

  return COMPARE_SECTION_DEFS.map((def) => ({
    id: def.id,
    title: def.title,
    icon: def.icon,
    rows: def.features
      .map((code) => {
        const config = configByCode.get(code);

        if (!config) return null;

        const values = {} as Record<ComparePlan, CompareValue>;

        for (const plan of COMPARE_PLANS) {
          values[plan] = formatTierValue(config, plan);
        }

        return {
          label: config.display_label || config.description,
          values,
        };
      })
      .filter((row): row is CompareRow => row !== null),
  }));
}

const CONNECTOR_AUTH_FAILED_MESSAGE = 'Authentication failed — please try again';
const DEFAULT_CONNECTOR_ERROR_MESSAGE = 'Unable to connect. Please try again.';

export function getConnectorErrorMessage(errorParam: string) {
  const normalizedError = errorParam.trim();

  if (!normalizedError) return DEFAULT_CONNECTOR_ERROR_MESSAGE;
  if (normalizedError.toLowerCase() === 'invalid_csrf') return CONNECTOR_AUTH_FAILED_MESSAGE;

  try {
    const decodedError = decodeURIComponent(normalizedError.replace(/\+/g, ' ')).trim();
    return decodedError || DEFAULT_CONNECTOR_ERROR_MESSAGE;
  } catch {
    return normalizedError;
  }
}

export const CONNECTOR_ICONS: Record<string, string> = {
  api: `${ASSET_PREFIX}/assets/images/connectors/api.svg`,
  airtable: `${ASSET_PREFIX}/assets/images/connectors/airtable.png`,
  dice: `${ASSET_PREFIX}/assets/images/connectors/dice.png`,
  'generic-api': `${ASSET_PREFIX}/assets/images/connectors/api.svg`,
  'generic-webhook': `${ASSET_PREFIX}/assets/images/connectors/webhook.svg`,
  eventbrite: `${ASSET_PREFIX}/assets/images/connectors/eventbrite.png`,
  'google-sheets': `${ASSET_PREFIX}/assets/images/connectors/google-sheets.png`,
  luma: `${ASSET_PREFIX}/assets/images/connectors/luma.png`,
  meetup: `${ASSET_PREFIX}/assets/images/connectors/meetup.svg`,
  'resident-advisor': `${ASSET_PREFIX}/assets/images/connectors/resident-advisor.png`,
  'firecrawl': `${ASSET_PREFIX}/assets/images/connectors/connector-firecrawl.png`,
  github: `${ASSET_PREFIX}/assets/images/connectors/connector-github.png`,
  granola: `${ASSET_PREFIX}/assets/images/connectors/connector-granola.png`,
  linear: `${ASSET_PREFIX}/assets/images/connectors/connector-linear.png`,
  mcp: `${ASSET_PREFIX}/assets/images/connectors/connector-mcp.png`,
  miro: `${ASSET_PREFIX}/assets/images/connectors/connector-miro.png`,
  perplexity: `${ASSET_PREFIX}/assets/images/connectors/connector-perplexity.png`,
  shopify: `${ASSET_PREFIX}/assets/images/connectors/connector-shopify.png`,
  stripe: `${ASSET_PREFIX}/assets/images/connectors/connector-stripe.png`,
  supabase: `${ASSET_PREFIX}/assets/images/connectors/connector-supabase.png`,
  'eleven-labs': `${ASSET_PREFIX}/assets/images/connectors/connector-eleven-labs.png`,
  webhook: `${ASSET_PREFIX}/assets/images/connectors/webhook.svg`,
};

type ConnectorActionLike = {
  id: string;
  name?: string | null;
  description?: string | null;
};

export type ConnectorModalAction = ConnectorActionInfo;
export type ConnectorModalConnection = ConnectionOutput & {
  connector: ConnectorDefinition;
};

type ConnectorLike<TAction extends ConnectorActionLike = ConnectorActionLike> = {
  actions?: Array<TAction | null> | null;
};

export function getGuestExportAction<TAction extends ConnectorActionLike>(
  connector?: ConnectorLike<TAction> | null,
): TAction | null {
  const actions = connector?.actions ?? [];

  return (
    actions.find((action) => action?.id === 'export-guests') ??
    actions.find((action) => {
      if (!action) return false;

      const haystack = `${action.id} ${action.name ?? ''} ${action.description ?? ''}`.toLowerCase();
      return haystack.includes('export') && haystack.includes('guest');
    }) ??
    null
  ) as TAction | null;
}

export function getProcessingMessage(status: string) {
  if (status === 'approving') return 'Please approve token spending in your wallet.';
  if (status === 'paying') return 'Please confirm the payment transaction in your wallet.';
  return 'Waiting for blockchain confirmation.';
}

export function formatTokenAmount(amount: string, tokenMeta?: TokenMeta | null): string {
  const decimals = tokenMeta?.decimals ?? 18;
  const symbol = tokenMeta?.symbol ?? 'Token';
  const value = formatUnits(BigInt(amount), decimals);
  return `${formatNumber(Number(value))} ${symbol}`;
}

export function getTokenSymbol(tokenMeta?: TokenMeta | null) {
  return tokenMeta?.symbol ?? 'Token';
}

export function formatPlanTitle(item?: SubscriptionItemType) {
  if (!item) return 'Plan';
  return item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();
}

export function mergePlansWithSubscriptions<T extends { type: SubscriptionItemType | 'enterprise' }>(
  basePlans: T[],
  subscriptionItems: SubscriptionItem[],
): T[] {
  const subscriptionByType = new Map(subscriptionItems.map((item) => [item.type, item]));

  return basePlans.map((plan) => {
    if (plan.type === 'enterprise') return { ...plan };

    const subscription = subscriptionByType.get(plan.type);
    return subscription ? { ...plan, ...subscription } : { ...plan };
  }) as T[];
}

type WalletUiPlan = {
  type: SubscriptionItemType | 'enterprise';
  title?: string;
  description?: string;
  annual: boolean | null;
  crypto_prices?: SubscriptionItem['crypto_prices'];
};

export type WalletPlanOption = {
  key: string;
  planType?: SubscriptionItemType;
  title: string;
  description?: string;
  annual: boolean;
  cryptoPrices: SubscriptionCryptoPrice[];
  available: boolean;
};

function hasPositiveCryptoAmount(amount?: string | null) {
  if (!amount) return false;

  try {
    return BigInt(amount) > 0n;
  } catch {
    return false;
  }
}

export function filterCryptoPricesForPeriod(
  cryptoPrices: SubscriptionCryptoPrice[] = [],
  annual: boolean,
): SubscriptionCryptoPrice[] {
  return cryptoPrices.filter((price) =>
    hasPositiveCryptoAmount(annual ? price.amount_annual : price.amount),
  );
}

export function getFirstCryptoPriceForPeriod(
  cryptoPrices: SubscriptionCryptoPrice[] = [],
  annual: boolean,
): SubscriptionCryptoPrice | null {
  return filterCryptoPricesForPeriod(cryptoPrices, annual)[0] ?? null;
}

export function hasCryptoPriceForPeriod(
  cryptoPrices: SubscriptionCryptoPrice[] = [],
  annual: boolean,
): boolean {
  return filterCryptoPricesForPeriod(cryptoPrices, annual).length > 0;
}

export function getDisplayedMonthlyFiatAmount(
  pricing: Pick<SubscriptionPricing, 'price' | 'annual_price' | 'decimals'>,
  annual = false,
): number {
  let amount = annual ? Number(pricing.annual_price) / 12 : Number(pricing.price);

  if (pricing.decimals > 0) amount /= 10 ** pricing.decimals;

  return amount;
}

export function getMonthlyFiatAmount(
  pricing: Pick<SubscriptionPricing, 'price' | 'decimals'>,
): number {
  let amount = Number(pricing.price);

  if (pricing.decimals > 0) amount /= 10 ** pricing.decimals;

  return amount;
}

export function getDisplayedMonthlyCryptoAmount(
  cryptoPrice: Pick<SubscriptionCryptoPrice, 'amount' | 'amount_annual'>,
  tokenDecimals: number,
  annual: boolean,
): number | null {
  const rawAmount = annual ? cryptoPrice.amount_annual : cryptoPrice.amount;

  if (!rawAmount || !hasPositiveCryptoAmount(rawAmount)) return null;

  const amount = Number(formatUnits(BigInt(rawAmount), tokenDecimals));
  return annual ? amount / 12 : amount;
}

export function getCryptoSavingsAmount(
  pricing: Pick<SubscriptionPricing, 'price' | 'decimals'>,
  cryptoPrice: Pick<SubscriptionCryptoPrice, 'amount' | 'amount_annual'>,
  tokenDecimals: number,
  annual: boolean,
): number | null {
  const fiatMonthlyAmount = getMonthlyFiatAmount(pricing);
  const cryptoMonthlyAmount = getDisplayedMonthlyCryptoAmount(cryptoPrice, tokenDecimals, annual);

  if (fiatMonthlyAmount <= 0 || cryptoMonthlyAmount === null || cryptoMonthlyAmount >= fiatMonthlyAmount) {
    return null;
  }

  return fiatMonthlyAmount - cryptoMonthlyAmount;
}

export function buildWalletPlanOptions(subscriptionItems: SubscriptionItem[], uiPlans: WalletUiPlan[]): WalletPlanOption[] {
  const uiPlanByType = new Map(uiPlans.map((plan) => [plan.type, plan]));
  const sourcePlans = subscriptionItems.length
    ? subscriptionItems
    : uiPlans.map((plan) => ({
      type: plan.type as SubscriptionItemType,
      title: plan.title || '',
      crypto_prices: plan.crypto_prices || [],
    })) as Array<Pick<SubscriptionItem, 'type' | 'title' | 'crypto_prices'>>;

  const options = sourcePlans.map((plan, index) => {
    const planType = plan.type as SubscriptionItemType;
    const isEnterprise = planType === SubscriptionItemType.Enterprise;
    const fallbackTitle = planType.charAt(0).toUpperCase() + planType.slice(1).toLowerCase();
    const uiPlan = uiPlanByType.get(planType);

    return {
      key: `${String(plan.type)}-${index}`,
      planType,
      title: plan.title || fallbackTitle,
      description: uiPlan?.description || undefined,
      annual: Boolean(uiPlan?.annual),
      cryptoPrices: plan.crypto_prices || [],
      available: Boolean(!isEnterprise && hasCryptoPriceForPeriod(plan.crypto_prices || [], Boolean(uiPlan?.annual))),
    };
  });

  return options
    .map((option, index) => ({ option, index }))
    .sort((a, b) => {
      if (a.option.available !== b.option.available) {
        return a.option.available ? -1 : 1;
      }

      if (!a.option.available && !b.option.available) {
        return a.index - b.index;
      }

      const aPrice = getFirstCryptoPriceForPeriod(a.option.cryptoPrices, a.option.annual);
      const bPrice = getFirstCryptoPriceForPeriod(b.option.cryptoPrices, b.option.annual);

      if (!aPrice || !bPrice) return a.index - b.index;

      const aRawAmount = a.option.annual ? aPrice.amount_annual : aPrice.amount;
      const bRawAmount = b.option.annual ? bPrice.amount_annual : bPrice.amount;

      if (!aRawAmount || !bRawAmount) return a.index - b.index;

      const aAmount = BigInt(aRawAmount);
      const bAmount = BigInt(bRawAmount);

      if (aAmount === bAmount) return a.index - b.index;
      return aAmount < bAmount ? -1 : 1;
    })
    .map(({ option }) => option);
}
