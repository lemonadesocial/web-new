import { SubTitleSection, TitleSection } from '../shared';

function Page() {
  return (
    <div>
      <div className="flex flex-col gap-2">
        <TitleSection className="text-3xl">Treasury</TitleSection>
        <SubTitleSection>Shared vault for the community. Create & vote on proposals to access funds.</SubTitleSection>
      </div>
    </div>
  );
}

export default Page;
