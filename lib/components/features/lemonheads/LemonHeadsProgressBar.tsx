import { useLemonhead } from '$lib/hooks/useLemonhead';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export function LemonHeadsProgressBar() {
  const { data } = useLemonhead();
  const totalMint = Number(data?.totalMinted) || 0;

  return (
    <div className="flex items-center relative">
      <div className="h-2 w-full rounded-s-full rounded-e-full bg-quaternary absolute" />
      <div className="w-full flex items-center z-0">
        <motion.div
          className="h-2 bg-(--color-lemonheads-progress-bar) rounded-s-full"
          transition={{ duration: 1 }}
          animate={{ width: `calc(${(totalMint * 100) / 10000}% - 50px)` }}
        />

        <div className="-ml-[1px]">
          <div className="size-6 border-8 aspect-square rounded-full border-(--color-lemonheads-progress-bar)"></div>
        </div>

        <div
          className={clsx(
            'size-8 aspect-square rounded-full flex items-center justify-center absolute left-[45%]',
            totalMint >= 5000
              ? 'bg-primary text-primary-invert'
              : 'bg-(--btn-tertiary) backdrop-blur-sm  text-(--btn-tertiary-content)',
          )}
        >
          <i className="icon-account-balance-outline size-4" />
        </div>

        <div
          className={clsx(
            'size-8 aspect-square rounded-full flex items-center justify-center absolute right-5',
            totalMint < 10000
              ? 'bg-(--btn-tertiary) backdrop-blur-sm text-(--btn-tertiary-content)'
              : 'bg-primary text-primary-invert',
          )}
        >
          <i className="icon-celebration size-4" />
        </div>
      </div>
    </div>
  );
}
