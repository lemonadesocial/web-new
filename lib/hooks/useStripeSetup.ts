import { GenerateStripeAccountLinkDocument } from "$lib/graphql/generated/backend/graphql";
import { useMutation } from "$lib/graphql/request";

export function useStripeSetup() {
  const [generateAccountLink] = useMutation(GenerateStripeAccountLinkDocument, {
    onComplete: (_, res) => {
      location.href = res.generateStripeAccountLink.url;
    }
  });

  return () => {
    const url = window.location.href;

    generateAccountLink({
      variables: {
        refreshUrl: url,
        returnUrl: url,
      }
    });
  };
}
