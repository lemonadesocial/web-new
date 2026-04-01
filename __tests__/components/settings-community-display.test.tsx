import { expect, it, describe, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { CommunityDetailForm } from '$lib/components/features/community-manage/settings/SettingsCommunityDisplay';
import { Space } from '$lib/graphql/generated/backend/graphql';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock('@floating-ui/react', async (importOriginal) => {
  const actual = (await importOriginal()) as any;
  return {
    ...actual,
    FloatingPortal: ({ children }: any) => <>{children}</>,
  };
});

vi.mock('$lib/components/features/theme-builder/provider', () => ({
  useTheme: () => [{ theme: 'minimal', config: { color: 'blue', mode: 'dark' } }, vi.fn()],
  ThemeProvider: ({ children }: any) => <>{children}</>,
}));

vi.mock('$lib/graphql/request', () => ({
  useClient: () => ({ client: { query: vi.fn() } }),
  useMutation: vi.fn(() => [vi.fn(), { loading: false }]),
}));

vi.mock('$lib/components/core', async (importOriginal) => {
  const actual = (await importOriginal()) as any;
  return {
    ...actual,
    Button: ({ children, loading, type, onClick }: any) => (
      <button type={type} onClick={onClick} disabled={loading}>{children}</button>
    ),
    FileInput: ({ children }: any) => (
      <div>
        {children(() => {})}
      </div>
    ),
    InputField: ({ label, value, onChangeText, error, hint, placeholder }: any) => (
      <div>
        <label>
          {label}
          <input 
            placeholder={placeholder} 
            value={value} 
            onChange={(e) => onChangeText?.(e.target.value)} 
          />
        </label>
        {error && <span>{hint}</span>}
      </div>
    ),
    TextAreaField: ({ value, onChange, placeholder }: any) => (
      <textarea value={value} onChange={onChange} placeholder={placeholder} />
    ),
    Map: () => <div data-testid="map" />,
    PlaceAutoComplete: () => <div data-testid="place-autocomplete" />,
    Segment: () => <div data-testid="segment" />,
    toast: {
      success: vi.fn(),
      error: vi.fn(),
    },
  };
});

vi.mock('../../theme-builder/CommunityThemeBuilder', () => ({
  CommunityThemeContentBuilder: () => <div data-testid="theme-builder" />,
}));

vi.mock('$lib/utils/cnd', () => ({
  generateUrl: vi.fn((img) => img?.url || ''),
}));

vi.mock('$lib/utils/file', () => ({
  uploadFiles: vi.fn(),
}));

vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
}));

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

const mockSpace: Space = {
  _id: 'space-1',
  title: 'Test Community',
  slug: 'test-community',
  description: 'A test description',
  image_avatar: 'avatar-id',
  image_cover: 'cover-id',
  address: {
    title: 'Test Location',
  },
  handle_instagram: 'insta',
  handle_twitter: 'twitter',
  handle_youtube: 'youtube',
  handle_tiktok: 'tiktok',
  handle_linkedin: 'linkedin',
  website: 'https://example.com',
  theme_data: null,
} as any;

describe('CommunityDetailForm', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('sanitizes image fields on submit (removes them if empty/null)', async () => {
    const updateMutation = vi.fn();
    const { useMutation } = await import('$lib/graphql/request');
    (useMutation as any).mockReturnValue([updateMutation, { loading: false }]);

    render(<CommunityDetailForm space={mockSpace} />);

    // Change title to make the form dirty
    const titleInput = screen.getByPlaceholderText('Community Name');
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });

    // Find and click the save button
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(updateMutation).toHaveBeenCalled();
    });

    const callArgs = updateMutation.mock.calls[0][0];
    const input = callArgs.variables.input;

    // These should be present because they were in mockSpace and weren't cleared
    expect(input.image_avatar).toBe('avatar-id');
    expect(input.image_cover).toBe('cover-id');
  });

  it('omits image fields if they are cleared', async () => {
    const updateMutation = vi.fn();
    const { useMutation } = await import('$lib/graphql/request');
    (useMutation as any).mockReturnValue([updateMutation, { loading: false }]);

    // Initialize with a space that has no images
    const spaceWithoutImages = {
      ...mockSpace,
      image_avatar: null,
      image_cover: null,
    };

    render(<CommunityDetailForm space={spaceWithoutImages} />);

    const titleInput = screen.getByPlaceholderText('Community Name');
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });

    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(updateMutation).toHaveBeenCalled();
    });

    const input = updateMutation.mock.calls[0][0].variables.input;
    
    // image_avatar and image_cover should be omitted because of the logic in onSubmit
    expect(input.image_avatar).toBeUndefined();
    expect(input.image_cover).toBeUndefined();
  });

  it('shows error if title is empty', async () => {
    render(<CommunityDetailForm space={mockSpace} />);

    const titleInput = screen.getByPlaceholderText('Community Name');
    fireEvent.change(titleInput, { target: { value: '' } });

    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(titleInput.className).toContain('border-danger-500');
    });
  });

  it('shows error if slug is too short', async () => {
    render(<CommunityDetailForm space={mockSpace} />);

    // We need to find the Public URL input. In our mock it has label "Public URL"
    const slugInput = screen.getByLabelText('Public URL');
    fireEvent.change(slugInput, { target: { value: 'ab' } });

    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('URLs must be at least 3 characters and contain only letters, numbers or dashes.')).toBeDefined();
    });
  });
});
