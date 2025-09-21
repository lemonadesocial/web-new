import { SubTitleSection, TitleSection } from '../shared';

function Page() {
  return (
    <div>
      <div className="flex flex-col gap-2">
        <TitleSection className="md:text-3xl">Events</TitleSection>
        <SubTitleSection>
          Discover gatherings, meetups, and more from this community. Jump into what excites you.
        </SubTitleSection>
      </div>
    </div>
  );
}

export default Page;
