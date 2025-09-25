export function EmptyLeaderboard() {
  return (
    <div className="flex flex-col justify-center items-center aspect-video py-12">
      <i className="icon-bar-chart size-[120px] md:size-[184px] aspect-square text-quaternary" />
      <div className="space-y-2 text-center">
        <h3 className="text-xl text-tertiary font-semibold">No Invites Yet</h3>
        <p className="text-tertiary max-sm:text-xs max-sm:w-xs md:w-[480px]">
          When LemonHeads start inviting their friends, the top inviters will appear on the leaderboard here.
        </p>
      </div>
    </div>
  );
}
