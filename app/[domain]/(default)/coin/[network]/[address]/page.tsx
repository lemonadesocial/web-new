import { CoinPage } from '$lib/components/features/coin/CoinPage';

type PageProps = {
  params: {
    network: string;
    address: string;
    domain: string;
  };
};

export default function Page({ params }: PageProps) {
  return <CoinPage network={params.network} address={params.address} />;
}
