"use client";

import Image from "next/image";
import { ChevronDownIcon } from "./icons";
import type { Token } from "../types";
import { getTokenCheckState } from "../utils/asset-helpers";
import { Checkbox } from "$lib/components/core/input/checkbox";
import { usdFormatter } from "../../common";
import { formatTokenBalance } from "@avail-project/nexus-core";
import { TOKEN_IMAGES } from "../constants/assets";
import {
  CHAIN_ITEM_HEIGHT_PX,
  VERTICAL_LINE_TOP_OFFSET_PX,
} from "../constants/widget";

interface TokenRowProps {
  token: Token;
  selectedChainIds: Set<string>;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleToken: () => void;
  onToggleChain: (chainId: string) => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export function TokenRow({
  token,
  selectedChainIds,
  isExpanded,
  onToggleExpand,
  onToggleToken,
  onToggleChain,
  isFirst = false,
  isLast = false,
}: TokenRowProps) {
  const hasMultipleChains = token.chains.length > 1;
  const tokenCheckState = getTokenCheckState(token, selectedChainIds);

  return (
    <div
      className={`border-b bg-base relative ${isFirst ? "rounded-t-lg" : ""} ${
        isLast ? "rounded-b-lg border-b-0" : ""
      }`}
    >
      {/* Main token row */}
      <div
        className={`${
          isExpanded ? "pt-5 px-5 pb-4" : "pt-5 px-5 pb-5"
        } flex justify-between items-center cursor-pointer`}
        onClick={hasMultipleChains ? onToggleExpand : undefined}
      >
        <div className="flex gap-6 items-center">
          <div onClick={(event) => event.stopPropagation()}>
            <Checkbox
              id={`token-${token.id}`}
              value={tokenCheckState === true || tokenCheckState === "indeterminate"}
              onChange={onToggleToken}
            />
          </div>
          <div className="flex items-center gap-3">
            <img
              src={
                Object.keys(TOKEN_IMAGES).includes(token.symbol)
                  ? TOKEN_IMAGES[token.symbol]
                  : token.logo
              }
              alt={token.symbol}
              width={24}
              height={24}
              className="rounded-full"
            />
            <div className="flex flex-col gap-1">
              <span className="font-display font-medium text-base leading-5 text-card-foreground">
                {token.symbol}
              </span>
              <span className="font-sans text-sm text-secondary leading-5">
                {token.chainsLabel}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex flex-col gap-1 items-end">
            <span className="text-sm leading-5 text-secondary">
              {token.usdValue}
            </span>
            <span className="text-sm leading-5 text-secondary">
              {token.amount}
            </span>
          </div>
          {hasMultipleChains ? (
            <ChevronDownIcon
              className={`text-muted-foreground transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          ) : (
            <div className="w-4 h-4"></div>
          )}
        </div>
      </div>

      {/* Expanded chain list */}
      {isExpanded && hasMultipleChains && (
        <div className="pl-5 pb-4 w-full">
          <div className="w-full">
            {/* Vertical line */}
            <div
              className="bg-border shrink-0 absolute left-[26px] w-0.5"
              style={{
                top: `${VERTICAL_LINE_TOP_OFFSET_PX}px`,
                height: `${token.chains.length * CHAIN_ITEM_HEIGHT_PX + 4}px`,
              }}
            />
            {/* Chain items */}
            <div className="flex flex-col">
              {token.chains.map((chain) => (
                <div
                  key={chain.id}
                  className="flex items-center"
                  style={{ height: `${CHAIN_ITEM_HEIGHT_PX}px` }}
                >
                  {/* Horizontal line */}
                  <div className="bg-border shrink-0 ml-1.5 w-[37px] h-0.5" />
                  {/* Chain content */}
                  <div className="flex items-center justify-between flex-1 pr-5">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id={`token-${token.id}-chain-${chain.id}`}
                        value={selectedChainIds.has(chain.id)}
                        onChange={() => onToggleChain(chain.id)}
                      />
                      <span className="font-sans text-base leading-5 text-card-foreground">
                        {chain.name}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 items-end mr-8">
                      <span className="text-sm leading-5 text-secondary">
                        {usdFormatter.format(chain.usdValue)}
                      </span>
                      <span className="text-sm leading-5 text-secondary">
                        {formatTokenBalance(chain.amount, {
                          decimals: token.decimals,
                          symbol: token.symbol,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TokenRow;
