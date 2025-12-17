'use client';
import { Button } from "$lib/components/core";
import { drawer } from "$lib/components/core/dialog";
import { ActivateLaunchpad } from "./drawers/ActivateLaunchpad";

export function CommunityLaunchpad() {
  return (
    <div className="page mx-auto py-7 px-4 md:px-0">
      <div className="flex py-2.5 px-4 items-center gap-3 bg-warning-300/16 rounded-sm">
        <i className="icon-rocket size-5 text-warning-300" />
        <div className="flex-1">
          <p className="text-warning-300">Please activate your Launchpad.</p>
          <p className="text-secondary text-sm">You can activate your Launchpad by clicking the button below.</p>
        </div>
        <Button
          size="sm"
          variant="tertiary"
          iconRight="icon-arrow-foward-sharp"
          onClick={() => drawer.open(ActivateLaunchpad, { dismissible: false })}
        >
          Activate
        </Button>
      </div>
    </div>
  );
}
