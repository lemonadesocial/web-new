import { Button } from '$lib/components/core';
import { Pane } from '$lib/components/core/pane/pane';

interface Props {
  /** localName lens account */
  username?: string;
  /** lens account address */
  address: string;
}

export function UserProfilePane({}: Props) {
  return (
    <Pane.Root>
      <Pane.Header.Root>
        <Pane.Header.Left className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Button size="sm" iconLeft="icon-copy" variant="tertiary-alt">
              Copy Link
            </Button>
            <Button size="sm" variant="tertiary-alt" iconRight="icon-arrow-outward">
              Profile Page
            </Button>
          </div>
        </Pane.Header.Left>
      </Pane.Header.Root>
    </Pane.Root>
  );
}
