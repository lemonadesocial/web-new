
import { TicketsProcessingModal } from "./TicketsProcessingModal";
import { registrationModal } from "../store";

export function PaymentProcessingModal() {
  return (
    <div className="p-4 space-y-4 w-[340px]">
      <div className="size-[56px] flex justify-center items-center rounded-full bg-background/64 border border-primary/8">

      </div>
      <p>PaymentProcessingModal</p>
      <button onClick={() => registrationModal.close()}>close</button>
      <button onClick={() => {
        registrationModal.close();
        registrationModal.open(TicketsProcessingModal);
      }}>open tickets</button>
    </div>
  );
}
