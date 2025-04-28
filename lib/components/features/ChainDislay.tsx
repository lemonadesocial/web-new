import { Chain } from "$lib/graphql/generated/backend/graphql";

const iconSizes = {
  sm: 'size-4',
  md: 'size-5'
};

const textSizes = {
  sm: 'text-sm',
  md: 'text-md'
};

export function ChainDisplay({ chain, size = 'md' }: { chain: Chain; size?: 'sm' | 'md' }) {
  return (
    <div className="flex items-center gap-2.5">
      <img
        src={chain.logo_url}
        alt={chain.name}
        className={iconSizes[size]}
      />
      <p className={textSizes[size]}>{chain.name}</p>
    </div>
  );
}
