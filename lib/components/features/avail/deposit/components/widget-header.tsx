"use client";

import Image from "next/image";
import { CloseIcon, LeftChevronIcon } from "./icons";

interface WidgetHeaderProps {
  title: string;
  depositTargetLogo?: string;
  onBack?: () => void;
  onClose?: () => void;
}

const WidgetHeader = ({
  title,
  onBack,
  onClose,
  depositTargetLogo,
}: WidgetHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-6 pb-3">
      {onBack ? (
        <button
          onClick={onBack}
          className="h-5 w-5 flex items-center justify-center group/back"
        >
          <LeftChevronIcon className="h-5 w-5 text-muted-foreground group-hover/back:text-foreground" />
        </button>
      ) : depositTargetLogo ? (
        <img
          src={depositTargetLogo}
          width={20}
          height={20}
          className="h-5 w-5"
        />
      ) : (
        <div className="size-5 bg-background/20 rounded-full"></div>
      )}
      <p className="text-center text-base font-medium text-card-foreground">
        {title}
      </p>
      <button
        onClick={onClose}
        className="h-5 w-5 flex items-center justify-center group/close"
      >
        <CloseIcon className="h-5 w-5 text-muted-foreground group-hover/close:text-foreground transition-colors" />
      </button>
    </div>
  );
};

export default WidgetHeader;
