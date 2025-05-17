import { PublicSpace } from "$lib/graphql/generated/backend/graphql";
import CommunityCard from "../community/CommunityCard";

const SubCommunity = ({ subSpaces }: { subSpaces: PublicSpace[]; }) => {
  return (
    <div className="page relative py-6 flex flex-col gap-8">
      <div>
        <h1 className="text-2xl text-primary md:text-3xl font-semibold pb-2"> Featured Hubs </h1>
        <p className="text-base text-tertiary font-medium">A closer look at all the hubs linked to this community. Discover new events, people, and ideas.</p>
      </div>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subSpaces.map((space) => (
            <CommunityCard key={space._id} space={space as PublicSpace} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubCommunity;
