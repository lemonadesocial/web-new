export function LemonHeadsTreasuryCard() {
  return (
    <>
      <div className="flex w-full min-w-fit items-center md:hidden p-2.5 border-(length:--card-border-width) border-card-border rounded-md gap-2.5">
        <div className="flex justify-center items-center rounded-sm bg-success-500/16 size-8 p-1.5 aspect-square">
          <i className="icon-account-balance-outline text-success-500" />
        </div>

        <div className="flex flex-col gpa-1.5">
          <p>Treasury</p>
          <p className="text-secondary text-sm">Unlocks at 5,000 LemonHeads.</p>
        </div>
      </div>

      <div className="hidden md:flex p-4 border-(length:--card-border-width) border-card-border  rounded-md flex-col gap-3">
        <div className="flex justify-between">
          <div className="flex justify-center items-center rounded-full bg-success-500/16 size-[48px] aspect-square">
            <i className="icon-account-balance-outline text-success-500" />
          </div>

          <div className="tooltip tooltip-bottom">
            <div className="tooltip-content backdrop-blur-md border-card text-left! p-3">
              <p>
                The LemonHeads treasury is building up. Once 5,000 LemonHeads are minted, it will unlock for proposals
                and voting—funding requests by the community, for the community.
              </p>
            </div>
            <i className="icon-info size-5 aspect-square text-quaternary" />
          </div>
        </div>

        <div className="flex flex-col gpa-1.5">
          <p>Treasury</p>
          <p className="text-secondary text-sm">Unlocks at 5,000 LemonHeads.</p>
        </div>
      </div>
    </>
  );
}
