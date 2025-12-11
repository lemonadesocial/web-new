'use client';

import { type CommunityData } from './CommunitySearch';

type SplitBreakdownProps = {
  communityData: CommunityData;
  feeReceiverShare: number;
};

export function SplitBreakdown({ communityData, feeReceiverShare }: SplitBreakdownProps) {
  const groupProfitPercentage = feeReceiverShare;
  const buybackPercentage = 100 - groupProfitPercentage;

  const creatorSharePercentage = Number(communityData.creatorShare);
  const ownerSharePercentage = Number(communityData.ownerShare);
  const memberSharePercentage = 100 - creatorSharePercentage - ownerSharePercentage;

  const youPercentage = (groupProfitPercentage * creatorSharePercentage) / 100;
  const communityOwnerPercentage = (groupProfitPercentage * ownerSharePercentage) / 100;
  const membersPercentage = (groupProfitPercentage * memberSharePercentage) / 100;

  return (
    <div className="p-4 space-y-3">
      <p className="text-lg">Split Breakdown</p>
      <div className="flex rounded-sm overflow-hidden gap-0.5" style={{ height: '8px' }}>
        <div 
          className="bg-success-500 transition-all duration-300" 
          style={{ width: `${youPercentage}%` }}
        />
        <div 
          className="bg-accent-400 transition-all duration-300" 
          style={{ width: `${membersPercentage}%` }}
        />
        <div 
          className="bg-alert-400 transition-all duration-300" 
          style={{ width: `${communityOwnerPercentage}%` }}
        />
        <div 
          className="bg-warning-400 transition-all duration-300" 
          style={{ width: `${buybackPercentage}%` }}
        />
      </div>
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-1.5">
          <span className="inline-block size-2 rounded-full bg-success-500" />
          <p className="text-success-500 text-sm">You {youPercentage.toFixed(1)}%</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block size-2 rounded-full bg-accent-400" />
          <span className="text-accent-400 text-sm">Members {membersPercentage.toFixed(1)}%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block size-2 rounded-full bg-alert-400" />
          <p className="text-alert-400 text-sm">Community Owner {communityOwnerPercentage.toFixed(1)}%</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block size-2 rounded-full bg-warning-400" />
          <p className="text-warning-400 text-sm">Auto Buybacks {buybackPercentage.toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
}
