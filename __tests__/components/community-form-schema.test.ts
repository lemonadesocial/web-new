import { zodResolver } from '@hookform/resolvers/zod';
import { describe, expect, it } from 'vitest';

import { communityValidationSchema } from '$lib/components/features/community/communityFormSchema';

describe('communityValidationSchema', () => {
  it('preserves submitted form fields that are not required for validation', async () => {
    const values = {
      title: 'Test Community',
      description: 'Community description',
      slug: 'test-community',
      image_avatar: 'avatar-id',
      image_cover: 'cover-id',
      address: { title: 'Test Location' },
    };

    const result = await zodResolver(communityValidationSchema)(values, undefined, {
      criteriaMode: 'firstError',
      fields: {},
      names: [],
      shouldUseNativeValidation: false,
    });

    expect(result.errors).toEqual({});
    expect(result.values).toEqual(values);
  });
});
