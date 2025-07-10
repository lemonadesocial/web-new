import { PageTitle } from '../shared';
import { Content } from './content';

export default function Page() {
  return (
    <div className="flex flex-col gap-8 mt-6 md:mt-11">
      <PageTitle title="Settings" subtitle="Choose how you are displayed as a host or guest." />
      <Content />
    </div>
  );
}
