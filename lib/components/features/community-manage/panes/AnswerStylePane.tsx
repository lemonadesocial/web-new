'use client';
import React from 'react';
import { Button, modal } from '$lib/components/core';
import { ASSET_PREFIX } from '$lib/utils/constants';

export type AnswerStyleValue = 'very_direct' | 'direct' | 'friendly' | 'expressive' | 'very_expressive';

export const ANSWER_STYLES = [
  { value: 'very_direct', label: 'Very Direct', image: 'very-direct.png' },
  { value: 'direct', label: 'Direct', image: 'direct.png' },
  { value: 'friendly', label: 'Friendly', image: 'friendly.png' },
  { value: 'expressive', label: 'Expressive', image: 'expressive.png' },
  { value: 'very_expressive', label: 'Very Expressive', image: 'very-expressive.png' },
] as const;

interface Props {
  initialValue?: AnswerStyleValue;
  onSave: (value: AnswerStyleValue) => void;
}

export function AnswerStylePane({ initialValue, onSave }: Props) {
  const [answerStyle, setAnswerStyle] = React.useState<AnswerStyleValue>(initialValue || 'friendly');

  const handleSave = () => {
    onSave(answerStyle);
    modal.close();
  };

  return (
    <div className="w-[480px] max-w-full">
      <div className="flex justify-between items-center px-5 py-3 border-b bg-card">
        <p className="text-lg">Answer Style</p>
        <Button icon="icon-x" size="xs" variant="tertiary" className="rounded-full" onClick={() => modal.close()} />
      </div>
      <div className="p-5 space-y-4">
        <p className="text-sm text-secondary">
          Controls how direct or expressive the agent's responses feel.
        </p>
        <div className="space-y-3">
          {ANSWER_STYLES.map((style) => (
            <div
              key={style.value}
              onClick={() => setAnswerStyle(style.value)}
              className={`w-full flex items-center justify-between gap-3 py-3 px-4 rounded-md border border-card-border bg-card transition-colors cursor-pointer ${
                answerStyle === style.value
                  ? 'border-primary'
                  : 'hover:bg-card'
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={`${ASSET_PREFIX}/assets/images/answer-styles/${style.image}`}
                  alt={style.label}
                  className="size-5"
                />
                <p>{style.label}</p>
              </div>
            </div>
          ))}
        </div>
        <Button variant="secondary" onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
