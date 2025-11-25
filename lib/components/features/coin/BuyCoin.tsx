import { Button } from '$lib/components/core';

const quickAmounts = ['0.01 ETH', '0.1 ETH', '0.5 ETH', '1 ETH'];

export function BuyCoin() {
  return (
    <div className="w-full max-w-[336px] rounded-[28px] bg-[#0c0c14] p-6 text-white space-y-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/70">1 LSD = 0.00261 ETH</p>
        <Button size="sm" variant="flat" icon="icon-settings" className="p-2 rounded-full bg-white/5 hover:bg-white/10" />
      </div>

      <div className="rounded-3xl bg-white/5 p-4 space-y-4 border border-white/5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/10 px-3 py-2 flex items-center gap-2">
              <div className="size-8 rounded-full bg-white/10 flex items-center justify-center">
                <i className="icon-eth text-lg" />
              </div>
              <p className="text-base font-semibold">ETH</p>
            </div>
          </div>
          <p className="text-4xl font-semibold text-white/40">0.00</p>
        </div>
        <div className="flex items-center justify-between text-sm">
          <p className="text-white/40">Balance: 18.32 ETH</p>
          <p className="text-white/30">Max</p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {quickAmounts.map(value => (
            <Button key={value} size="sm" variant="flat" className="w-full rounded-xl border border-white/10 bg-white/5 text-xs text-white/80">
              {value}
            </Button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl bg-white/5 p-4 space-y-4 border border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/40">0 ETH</p>
            <p className="text-sm text-white/40">→ 0 LSD</p>
          </div>
          <p className="text-sm text-white/40">~$0</p>
        </div>
        <div className="rounded-2xl bg-white/[0.02] p-3 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <p className="text-white/40">Est. gas fees</p>
            <p className="text-white/80">0.000015 ETH</p>
          </div>
          <div className="flex items-center justify-between text-sm">
            <p className="text-white/40">Slippage</p>
            <p className="text-white/80">5%</p>
          </div>
        </div>
      </div>

      <Button variant="secondary" className="w-full rounded-2xl py-4 text-base text-black">
        Buy LSD
      </Button>
    </div>
  );
}

