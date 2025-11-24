'use client';
import React from 'react';
import { Card } from '$lib/components/core';

const topVolumn = [
  { id: 1, title: 'Tech Growth Token', subtitle: 'TGT', amount: '$4.20M' },
  { id: 2, title: 'Crypto Art Token', subtitle: 'CRYPTOART', amount: '$3.05M' },
  { id: 3, title: 'Solar Power Token', subtitle: 'SOLAR', amount: '$7.60M' },
  { id: 4, title: 'Clean Water Coin', subtitle: 'CCWATER', amount: '$3.85M' },
  { id: 5, title: 'Education Token', subtitle: 'EDUCOIN', amount: '$4.20M' },
];

export function TopPerformers() {
  const [loadingTopVolumn, setLoadingTopVolumn] = React.useState(true);

  React.useEffect(() => {
    const timer1 = setTimeout(() => setLoadingTopVolumn(false), 1000);
    return () => {
        clearTimeout(timer1)
    }
  }, []);

  return <>{
    topVolumn.map(item => <CardList title={item.title} />)
  }</>;
}

function CardList({ title }: { title: string }) {
  return (
    <Card.Root>
      <Card.Header></Card.Header>
      <Card.Content></Card.Content>
    </Card.Root>
  );
}
