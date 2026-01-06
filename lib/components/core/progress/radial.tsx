'use client';
import { twMerge } from 'tailwind-merge';

export function RadialProgress({ size, color, value = 0 }: { size: string; color: string; value?: number }) {
  return (
    <div className={twMerge('relative size-40 rotate-[-90deg]', size)}>
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-divider stroke-current"
          strokeWidth="1"
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
        ></circle>

        <circle
          className={twMerge('stroke-current transition-all duration-700', color)}
          strokeWidth="16"
          strokeLinecap="round"
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          strokeDasharray="251.2"
          style={{ strokeDashoffset: `calc(251.2 - (251.2 * ${value}) / 100)` }}
        ></circle>
      </svg>
    </div>
  );
}
