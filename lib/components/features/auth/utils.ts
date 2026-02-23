import * as Sentry from '@sentry/nextjs';
import { modal } from '$lib/components/core';
import { CompleteProfile } from './CompleteProfile';
import { defaultClient } from '$lib/graphql/request/instances';
import { GetMeDocument, User } from '$lib/graphql/generated/backend/graphql';

export async function completeProfile() {
  try {
    const { data } = await defaultClient.query({
      query: GetMeDocument,
    });
    
    const user = data?.getMe as User;
    
    if (!user) {
      return;
    }

    if (!user.display_name) {
      modal.open(CompleteProfile);
    }
  } catch (error) {
    Sentry.captureException(error);
  }
}
