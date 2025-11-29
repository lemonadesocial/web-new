import { CreateCoin } from '$lib/components/features/create-coin/CreateCoin';
import Header from '$lib/components/layouts/header';

export default function Page() {
  return (
    <>
      <Header />

      <CreateCoin />
    </>
  );
}
