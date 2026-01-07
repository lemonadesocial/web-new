import { Tokens } from '$lib/components/features/tokens/Tokens';
import { notFound } from 'next/navigation';

// FIXME: temp hide
export default function Page() {
  if (process.env.APP_ENV === 'production') return notFound();

  return <Tokens />;
}
