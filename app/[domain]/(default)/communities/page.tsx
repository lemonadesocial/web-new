import { Spacer } from '$lib/components/core';
import { PageTitle } from '../shared';
import { Content } from './content';

export default function Page() {
  return (
    <div>
      <Spacer className="h-6 md:h-11" />
      <PageTitle
        title="Communities"
        subtitle="Manage your community hubs and stay up-to-date with communities you subscribed to."
      />

      <Content />
    </div>
  );
}
