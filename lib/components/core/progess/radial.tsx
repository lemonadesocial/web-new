import { twMerge } from 'tailwind-merge';

export function RadialProgress({
  size = 'size-10',
  color,
  value = 0,
  label,
}: {
  size?: string;
  color: string;
  value?: number;
  label?: string;
}) {
  return (
    <div className={twMerge('relative', size)}>
      <div className={twMerge('relative aspect-square rotate-[-90deg]', size)}>
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            className="text-quaternary stroke-current"
            strokeWidth="4"
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
      {label && (
        <div className="absolute inset-0">
          <div className="flex items-center justify-center w-full h-full text-sm">
            <p>{label}</p>
          </div>
        </div>
      )}
    </div>
  );
}
