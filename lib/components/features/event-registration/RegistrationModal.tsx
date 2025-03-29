import { modal } from "$lib/components/core";
import { ListingEvent } from "../community/ListingEvent";

export function RegistrationModal() {
  return (
    <div className='h-screen w-screen bg-overlay/80 flex items-center justify-center'>
      hello
      <button onClick={() => modal.open(ListingEvent)}>
        open another modal
      </button>
    </div>
  );
}
