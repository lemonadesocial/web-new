import type { Address } from '$lib/graphql/generated/backend/graphql';
import { z } from 'zod';

// Keep all submitted RHF fields in the schema so Zod validation doesn't strip them before submit.
export const communityValidationSchema = z.object({
  title: z.string().min(1, { message: 'Title is required.' }),
  description: z.string().optional(),
  slug: z
    .string()
    .min(3, { message: 'URLs must be at least 3 characters and contain only letters, numbers or dashes.' }),
  image_avatar: z.string().optional(),
  image_cover: z.string().optional(),
  address: z.custom<Address>().optional(),
});

export type CommunityFormValues = z.input<typeof communityValidationSchema>;
