import { Card } from '$lib/components/core';
import { ASSET_PREFIX } from '$lib/utils/constants';

const connectors = [
  {
    logo: `${ASSET_PREFIX}/images/connectors/connector-shopify.png`,
    brand: 'Shopify',
    description: 'Build an eCommerce store',
  },
  {
    logo: `${ASSET_PREFIX}/images/connectors/connector-stripe.png`,
    brand: 'Stripe',
    description: 'Set up payments',
  },
  {
    logo: `${ASSET_PREFIX}/images/connectors/connector-elevent-lab.png`,
    brand: 'ElevenLabs',
    description: 'AI voice generation, text-to-speech, and speech-to-text',
  },
  {
    logo: `${ASSET_PREFIX}/images/connectors/connector-firecrawl.png`,
    brand: 'Firecrawl',
    description: 'AI-powered scraper, search and retrieval tool',
  },
  {
    logo: `${ASSET_PREFIX}/images/connectors/connector-perplexity.png`,
    brand: 'Perplexity',
    description: 'AI-powered search and answer engine',
  },
  {
    logo: `${ASSET_PREFIX}/images/connectors/connector-supabase.png`,
    brand: 'Supabase',
    description: 'Connect your own Supabase project',
  },
  {
    logo: `${ASSET_PREFIX}/images/connectors/connector-atlassian.png`,
    brand: 'Atlassian',
    description: 'Access your Jira issues and Confluence pages',
  },
  {
    logo: `${ASSET_PREFIX}/images/connectors/connector-perplexity.png`,
    brand: 'Perplexity',
    description: 'AI-powered search and answer engine',
  },
  {
    logo: `${ASSET_PREFIX}/images/connectors/connector-linear.png`,
    brand: 'Linear',
    description: 'Access your Linear issues and project data',
  },
  {
    logo: `${ASSET_PREFIX}/images/connectors/connector-miro.png`,
    brand: 'Miro',
    description: 'Access your Miro boards and diagrams',
  },
  {
    logo: `${ASSET_PREFIX}/images/connectors/connector-github.png`,
    brand: 'GitHub',
    description: 'Connect your GitHub account',
  },
  {
    logo: `${ASSET_PREFIX}/images/connectors/connector-mcp.png`,
    brand: 'New MCP Server',
    description: 'Add custom MCP server',
  },
];

export function Connector() {
  return (
    <div className="p-12 flex flex-col gap-6">
      <div className="space-y-1">
        <h3 className="text-2xl font-bold">Connectors</h3>
        <p className="text-tertiary">Power up your community with connected tools and richer context.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {connectors.map((item, idx) => (
          <Card.Root key={idx}>
            <Card.Content className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <img src={item.logo} className="size-[48px] aspect-square rounded-sm" />
                <div className="py-[3px] line-clamp-1 px-2 rounded-full text-xs bg-(--btn-tertiary)">Comming Soon</div>
              </div>

              <div>
                <p className="text-lg">{item.brand}</p>
                <p className="text-tertiary text-sm">{item.description}</p>
              </div>
            </Card.Content>
          </Card.Root>
        ))}
      </div>
    </div>
  );
}
