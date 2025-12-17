import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface Props {
  total: number;
  value: number;
  className?: string;
}

export function Progress({ value, total, className }: Props) {
  return (
    <div className={twMerge('flex items-center rounded-s-full rounded-e-full relative overflow-hidden', className)}>
      <div className="h-2 w-full bg-quaternary absolute" />
      <div className="w-full flex items-center z-0">
        <motion.div
          data-color
          className="h-2 bg-accent-500 rounded-s-full rounded-e-full"
          transition={{ duration: 1 }}
          animate={{
            width: `calc(${(value * 100) / total}%)`,
          }}
        />
      </div>
    </div>
  );
}
