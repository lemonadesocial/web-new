import { ASSET_PREFIX } from '$lib/utils/constants';

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

export const CONNECTOR_ICON_MAP: Record<string, string> = {
  airtable: `${ASSET_PREFIX}/assets/images/connectors/airtable.png`,
  'firecrawl': `${ASSET_PREFIX}/assets/images/connectors/connector-firecrawl.png`,
  github: `${ASSET_PREFIX}/assets/images/connectors/connector-github.png`,
  'google-sheets': `${ASSET_PREFIX}/assets/images/connectors/google-sheets.png`,
  granola: `${ASSET_PREFIX}/assets/images/connectors/connector-granola.png`,
  linear: `${ASSET_PREFIX}/assets/images/connectors/connector-linear.png`,
  mcp: `${ASSET_PREFIX}/assets/images/connectors/connector-mcp.png`,
  miro: `${ASSET_PREFIX}/assets/images/connectors/connector-miro.png`,
  perplexity: `${ASSET_PREFIX}/assets/images/connectors/connector-perplexity.png`,
  shopify: `${ASSET_PREFIX}/assets/images/connectors/connector-shopify.png`,
  stripe: `${ASSET_PREFIX}/assets/images/connectors/connector-stripe.png`,
  supabase: `${ASSET_PREFIX}/assets/images/connectors/connector-supabase.png`,
  'eleven-labs': `${ASSET_PREFIX}/assets/images/connectors/connector-eleven-labs.png`,
};

