import React, { useEffect } from 'react';
import clsx from 'clsx';

import { Button, Card, Skeleton } from '$lib/components/core';
import { useLemonhead } from '$lib/hooks/useLemonhead';
import { useFluffle } from '$lib/hooks/useFluffle';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { PassportActionKind, usePassportContext } from '../provider';

export function LemonheadCard() {
  const { data, loading } = useLemonhead();
  const [state, dispatch] = usePassportContext();

  const handleSelect = () => {
    dispatch({ type: PassportActionKind.SelectLemonhead });
  };

  const isSelected = state.useLemonhead;

  useEffect(() => {
    if (state.useLemonhead && data) {
      dispatch({ type: PassportActionKind.SetPhoto, payload: data.image });
    }
  }, [state.useLemonhead, data, dispatch]);

  if (loading || !data) {
    return <CardIndicator />;
  }

  return (
    <CardDetail
      containerClass={clsx({ 'border-primary': isSelected })}
      image={data.image}
      title={`LemonHead #${data.tokenId}`}
      subtitle="Set LemonHead as Passport Photo."
    >
      <Button
        variant={isSelected ? 'tertiary' : 'secondary'}
        className="w-full"
        onClick={handleSelect}
        iconLeft={isSelected ? 'icon-done' : undefined}
        size="sm"
      >
        {isSelected ? 'Selected' : 'Select'}
      </Button>
    </CardDetail>
  );
}

export function FluffleCard() {
  const { data, loading } = useFluffle();
  const [state, dispatch] = usePassportContext();

  const handleSelect = () => {
    dispatch({ type: PassportActionKind.SelectFluffle });
  };

  const isSelected = state.useFluffle;

  useEffect(() => {
    if (state.useFluffle && data) {
      dispatch({ type: PassportActionKind.SetPhoto, payload: data.image });
    }
  }, [state.useFluffle, data, dispatch]);

  if (loading) {
    return <CardIndicator />;
  }

  if (data) {
    return (
      <CardDetail
        image={data.image}
        title={data.name}
        subtitle="Set Fluffle as Passport Photo."
        containerClass={clsx({ 'border-primary': isSelected })}
      >
        <Button
          size="sm"
          className="w-full"
          onClick={handleSelect}
          variant={isSelected ? 'tertiary' : 'secondary'}
          iconLeft={isSelected ? 'icon-done' : undefined}
        >
          {isSelected ? 'Selected' : 'Select'}
        </Button>
      </CardDetail>
    );
  }

  return (
    <CardDetail
      title="No Fluffle Found"
      subtitle="You don’t have a fluffle, yet."
      image={`${ASSET_PREFIX}/assets/images/fluffle.png`}
    >
      <Button
        variant="secondary"
        className="w-full"
        size="sm"
        iconRight="icon-arrow-outward"
        onClick={() => window.open('https://www.megaeth.com/thefluffle', '_blank')}
      >
        Get Fluffle
      </Button>
    </CardDetail>
  );
}

function CardIndicator() {
  return (
    <Card.Root>
      <Card.Content className="flex flex-col gap-4">
        <Skeleton animate className="w-full aspect-square rounded-sm" />
        <Skeleton animate className="h-4 w-24 rounded-full" />
        <Skeleton animate className="hidden md:block h-3 w-32 rounded-full" />
        <Skeleton animate className="h-8 w-full rounded-md" />
      </Card.Content>
    </Card.Root>
  );
}

interface CardDetailProps extends React.PropsWithChildren {
  containerClass?: string;
  image: string;
  title: string;
  subtitle: string;
}

function CardDetail({ containerClass, image, title, subtitle, children }: CardDetailProps) {
  return (
    <Card.Root className={containerClass}>
      <Card.Content className="flex flex-col gap-4">
        <img src={image} className={clsx('w-full aspect-square border-card-border rounded-sm')} />
        <div className="flex flex-col gap-1">
          <p>{title}</p>
          <p className="hidden md:block text-sm text-tertiary">{subtitle}</p>
        </div>
        {children}
      </Card.Content>
    </Card.Root>
  );
}
