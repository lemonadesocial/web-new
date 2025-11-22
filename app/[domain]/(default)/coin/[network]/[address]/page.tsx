import { CoinPage } from "$lib/components/features/coin/CoinPage";

interface PageProps {
  params: {
    network: string;
    address: string;
  };
}

export default function Page({ params }: PageProps) {
  return <CoinPage network={params.network} address={params.address} />;
}
