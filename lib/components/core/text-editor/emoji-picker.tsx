'use client';
import React, { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

import { Menu } from '$lib/components/core';
import emojis from 'emojibase-data/en/compact.json';

type EmojiData = {
  annotation: string;
  group: number;
  hexcode: string;
  order: number;
  shortcodes: string[];
  tags: string[];
  unicode: string;
  skins?: EmojiData[];
};

type EmojiPickerProps = {
  onSelect: (emoji: string) => void;
  trigger?: React.ReactNode;
  className?: string;
};


export const EmojiPicker = ({ onSelect, trigger, className }: EmojiPickerProps) => {
  const emojiData = emojis as EmojiData[];

  const groupedEmojis = useMemo(() => {
    const groups: { [key: number]: EmojiData[] } = {};
    emojiData.forEach((emoji) => {
      if (!groups[emoji.group]) {
        groups[emoji.group] = [];
      }
      groups[emoji.group].push(emoji);
    });
    return groups;
  }, [emojiData]);

  const handleEmojiClick = (emoji: string) => {
    onSelect(emoji);
  };

  return (
    <Menu.Root placement="bottom-start">
      <Menu.Trigger className="flex">
        {trigger || <i aria-hidden="true" className="icon-mood size-5 text-[#FB923C]" />}
      </Menu.Trigger>
      <Menu.Content className={twMerge('w-[320px] h-[400px] p-0', className)}>
        {({ toggle }) => (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-1.5">
              {Object.keys(groupedEmojis).map((groupKey) => {
                const groupIndex = parseInt(groupKey);
                const groupEmojis = groupedEmojis[groupIndex] || [];
                if (groupEmojis.length === 0) return null;
                
                return (
                  <div key={groupIndex} className="mb-4">
                    <div className="grid grid-cols-8 gap-1">
                      {groupEmojis.map((emoji, index) => (
                        <button
                          key={`${emoji.hexcode}-${index}`}
                          type="button"
                          onClick={() => {
                            handleEmojiClick(emoji.unicode);
                            toggle();
                          }}
                          className="flex items-center justify-center w-8 h-8 rounded hover:bg-[var(--btn-tertiary)] transition-colors text-lg"
                          title={emoji.annotation}
                        >
                          {emoji.unicode}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Menu.Content>
    </Menu.Root>
  );
};
