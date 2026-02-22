'use client';

import React from 'react';

import clsx from 'clsx';
import { SectionWrapper } from '../SectionWrapper';
import type { SectionWidth, SectionPadding, SectionAlignment, SectionBackground } from '../../types';

interface WalletConnectProps {
  width?: SectionWidth;
  padding?: SectionPadding;
  alignment?: SectionAlignment;
  min_height?: string;
  background?: SectionBackground;
  heading?: string;
  description?: string;
  cta_text?: string;
  supported_wallets?: string[];
  show_wallet_icons?: boolean;
}

const WALLET_ICON_MAP: Record<string, { icon: string; label: string }> = {
  metamask: { icon: 'icon-wallet', label: 'MetaMask' },
  coinbase: { icon: 'icon-account-balance-wallet', label: 'Coinbase' },
  walletconnect: { icon: 'icon-link', label: 'WalletConnect' },
  phantom: { icon: 'icon-wallet', label: 'Phantom' },
  rainbow: { icon: 'icon-wallet', label: 'Rainbow' },
};

function getWalletInfo(wallet: string): { icon: string; label: string } {
  return (
    WALLET_ICON_MAP[wallet.toLowerCase()] ?? {
      icon: 'icon-wallet',
      label: wallet.charAt(0).toUpperCase() + wallet.slice(1),
    }
  );
}

function _WalletConnect({
  width = 'contained',
  padding = 'lg',
  alignment = 'center',
  min_height,
  background,
  heading = 'Connect Wallet',
  description = '',
  cta_text = 'Connect Wallet',
  supported_wallets = [],
  show_wallet_icons = true,
}: WalletConnectProps) {
  const hasHeading = heading.trim().length > 0;
  const hasDescription = description.trim().length > 0;
  const hasWallets = supported_wallets.length > 0;

  return (
    <SectionWrapper
      width={width}
      padding={padding}
      alignment={alignment}
      min_height={min_height}
      background={background}
    >
      <div
        className={clsx(
          'flex flex-col gap-6 rounded-xl border border-card-border bg-overlay-primary/40 px-8 py-10 md:px-12 md:py-14',
          alignment === 'center' && 'items-center',
          alignment === 'left' && 'items-start',
          alignment === 'right' && 'items-end',
        )}
      >
        {/* Wallet icon header */}
        <div className="flex size-16 items-center justify-center rounded-full bg-accent/20">
          <i className="icon-account-balance-wallet size-8 text-accent" />
        </div>

        {hasHeading && (
          <h2
            className={clsx(
              'text-2xl font-bold text-primary md:text-3xl',
              alignment === 'center' && 'text-center',
              alignment === 'right' && 'text-right',
            )}
          >
            {heading}
          </h2>
        )}

        {hasDescription && (
          <p
            className={clsx(
              'max-w-lg text-base text-secondary',
              alignment === 'center' && 'text-center',
              alignment === 'right' && 'text-right',
            )}
          >
            {description}
          </p>
        )}

        {/* Supported wallet icons */}
        {show_wallet_icons && hasWallets && (
          <div className="flex flex-wrap items-center justify-center gap-3">
            {supported_wallets.map((wallet, idx) => {
              const info = getWalletInfo(wallet);
              return (
                <div
                  key={idx}
                  className="flex items-center gap-2 rounded-lg border border-card-border bg-overlay-primary/40 px-3 py-2"
                >
                  <i className={clsx(info.icon, 'size-5 text-secondary')} />
                  <span className="text-xs font-medium text-secondary">{info.label}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Connect button */}
        <button
          type="button"
          className="mt-2 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <i className="icon-link size-4" />
          {cta_text}
        </button>
      </div>
    </SectionWrapper>
  );
}

export const WalletConnect = React.memo(_WalletConnect);
WalletConnect.craft = {
  displayName: 'WalletConnect',
  props: {
    width: 'contained',
    padding: 'lg',
    alignment: 'center',
    heading: 'Connect Wallet',
    description: '',
    cta_text: 'Connect Wallet',
    supported_wallets: [],
    show_wallet_icons: true,
  },
};
