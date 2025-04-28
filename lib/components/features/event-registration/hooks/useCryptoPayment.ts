import { registrationModal } from "../store";
import { ConfirmCryptoPaymentModal } from "../modals/ConfirmCryptoPaymentModal";
import { useBuyTickets } from "./useBuyTickets";

export function useCryptoPayment() {
  const { pay, loading } = useBuyTickets(data => {
    registrationModal.open(ConfirmCryptoPaymentModal, {
      props: {
        paymentId: data.buyTickets.payment._id,
        paymentSecret: data.buyTickets.payment.transfer_metadata.payment_secret,
        hasJoinRequest: data.buyTickets.join_request?.state === 'pending'
      },
      dismissible: true
    });
  });

  return { pay, loading };
}
