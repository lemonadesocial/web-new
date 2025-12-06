'use client';

interface CoinDistributionBarProps {
  fairLaunchPercentage: number;
  initialAllocationPercentage: number;
}

export function CoinDistributionBar({ 
  fairLaunchPercentage, 
  initialAllocationPercentage 
}: CoinDistributionBarProps) {
  const liquidityPoolPercentage = 100 - fairLaunchPercentage - initialAllocationPercentage;

  return (
    <div className="px-4 pb-4">
      <div className="mb-3">
        <div className="flex rounded-sm overflow-hidden" style={{ height: '8px' }}>
          <div 
            className="bg-accent-400 transition-all duration-300" 
            style={{ width: `${fairLaunchPercentage}%` }}
          />
          <div 
            className="bg-warning-300 transition-all duration-300" 
            style={{ width: `${initialAllocationPercentage}%` }}
          />
          <div 
            className="bg-quaternary transition-all duration-300" 
            style={{ width: `${liquidityPoolPercentage}%` }}
          />
        </div>
      </div>
      <div className="flex gap-1 md:gap-6 text-sm flex-wrap md:flex-nowrap">
        <div className="flex items-center gap-1.5">
          <span className="inline-block size-2 rounded-full bg-accent-400" />
          <span className="text-secondary">Fair Launch {fairLaunchPercentage}%</span>
        </div>
        <div className="flex items-center gap-1.5 ml-2 md:ml-0">
          <span className="inline-block size-2 rounded-full bg-warning-300" />
          <span className="text-secondary">Initial Allocation {initialAllocationPercentage.toFixed(1)}%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block size-2 rounded-full bg-quaternary" />
          <span className="text-secondary">Liquidity Pool {liquidityPoolPercentage.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}


