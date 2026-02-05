import Image from "next/image";
import { cn } from "../utils";

type TokenIconSize = "sm" | "md" | "lg";

const SIZE_MAP: Record<TokenIconSize, { token: number; protocol: number }> = {
  sm: { token: 24, protocol: 16 },
  md: { token: 32, protocol: 16 },
  lg: { token: 40, protocol: 20 },
};

interface TokenIconProps {
  tokenSrc: string;
  protocolSrc?: string;
  tokenAlt?: string;
  protocolAlt?: string;
  size?: TokenIconSize;
  className?: string;
}

export function TokenIcon({
  tokenSrc,
  protocolSrc,
  tokenAlt = "Token",
  protocolAlt = "Protocol",
  size = "sm",
  className,
}: TokenIconProps) {
  const dimensions = SIZE_MAP[size];

  return (
    <div className={cn("relative inline-flex", className)}>
      <img
        src={tokenSrc}
        alt={tokenAlt}
        width={dimensions.token}
        height={dimensions.token}
        className="rounded-full object-cover"
      />
      {protocolSrc && (
        <img
          src={protocolSrc}
          alt={protocolAlt}
          width={dimensions.protocol}
          height={dimensions.protocol}
          className="absolute -bottom-0.5 -right-0.5 translate-x-1/5 translate-y-1/5 rounded-full border-2 border-base object-cover"
        />
      )}
    </div>
  );
}
