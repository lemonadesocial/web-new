import { CreateFreeCoin } from './CreateFreeCoin';

export function CreateCoin() {
  return (
    <div className="max-w-[720px] mx-auto">
      <h1 className="text-3xl font-semibold pt-6 pb-8">Create Coin</h1>
      <CreateFreeCoin />
    </div>
  );
}
