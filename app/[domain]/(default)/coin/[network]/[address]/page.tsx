import { CoinPage } from '$lib/components/features/coin/CoinPage';

interface PageProps {
  params: Promise<{
    network: string;
    address: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { network, address } = await params;
  return (
    <div className="py-12 max-sm:px-4">
      <CoinPage network={network} address={address} />
    </div>
  );
}
