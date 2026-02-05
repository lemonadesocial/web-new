"use client";

import WidgetHeader from "./widget-header";
import { CardContent } from "../../ui/card";
import { Skeleton } from "../../ui/skeleton";

interface ConfirmationLoadingProps {
  onClose?: () => void;
}

const ConfirmationLoading = ({ onClose }: ConfirmationLoadingProps) => {
  return (
    <>
      <WidgetHeader title="Deposit USDC" onClose={onClose} />
      <CardContent>
        <div className="flex flex-col">
          <div className="bg-base rounded-t-lg border-t border-l border-r shadow-[0_1px_12px_0_rgba(91,91,91,0.05)] px-6 pt-10 pb-1 flex flex-col gap-6 animate-pulse">
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-12 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>
          <Skeleton className="h-12 w-full rounded-t-none" />
        </div>
      </CardContent>
    </>
  );
};

export default ConfirmationLoading;
