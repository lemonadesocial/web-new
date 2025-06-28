import { Button } from "$lib/components/core";
import { ASSET_PREFIX } from "$lib/utils/constants";

export default function SwipePage() {
  return (
    <div className="max-w-[794] mx-auto pt-11 flex flex-col items-center">
      <div
        className="h-[296] flex items-end justify-center w-full"
        style={{
          backgroundImage: `url(${ASSET_PREFIX}/assets/images/swipe-graphic.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h1 className="text-3xl font-semibold pt-9">Swipe & Match</h1>
      </div>
      <p className="mt-2 text-tertiary text-center">
        Connect with like-minded creators and collaborators from the Lemonade community. Swipe to discover, match with people who inspire you, and start chatting instantly.
      </p>

      <div className="flex items-center justify-center mt-14">
        <div className="flex flex-col items-center justify-center size-[88px] gap-3 rounded-md bg-primary/8">
          <i className="icon-swipe size-8 text-[#FBBF24]" />
          <p className="text-sm text-secondary">
            Swipe
          </p>
        </div>
        <hr className="w-5 border border-t-divider" />
        <div className="flex flex-col items-center justify-center size-[88px] gap-3 rounded-md bg-primary/8">
          <i className="icon-heart size-8 text-[#F472B6]" />
          <p className="text-sm text-secondary">
            Match
          </p>
        </div>
        <hr className="w-5 border border-t-divider" />
        <div className="flex flex-col items-center justify-center size-[88px] gap-3 rounded-md bg-primary/8">
          <i className="icon-chat size-8 text-[#51A2FF]" />
          <p className="text-sm text-secondary">
            Chat
          </p>
        </div>
        <hr className="w-5 border border-t-divider" />
        <div className="flex flex-col items-center justify-center size-[88px] gap-3 rounded-md bg-primary/8">
          <i className="icon-collab size-8 text-[#A684FF]" />
          <p className="text-sm text-secondary">
            Collab
          </p>
        </div>
      </div>

      <div className="mt-14 py-2.5 px-4 rounded-full border-2 border-dashed border-tertiary">
        <p className="text-lg text-tertiary">Coming Soon!</p>
      </div>
    </div>
  );
}
