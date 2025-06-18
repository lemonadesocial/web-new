import { Button, Dropdown, FileInput, InputField, TextAreaField } from '$lib/components/core';
import { Pane } from '$lib/components/core/pane/pane';
import { useMe } from '$lib/hooks/useMe';
import { userAvatar } from '$lib/utils/user';
import { Controller, useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

type ProfileValues = {
  name?: string;
  username?: string;
  bio?: string;
  website?: string;
};

const SOCIAL_LINKS = [
  { icon: 'icon-twitter', name: 'twitter', prefix: 'x.com/', placeholder: 'username' },
  { icon: 'icon-linkedin', name: 'twitter', prefix: 'linkedin.com', placeholder: '/us/handle' },
  { icon: 'icon-farcaster', name: 'farcaster', prefix: 'farcaster.xyz/', placeholder: 'username' },
  { icon: 'icon-instagram', name: 'instagram', prefix: 'instagram.com/', placeholder: 'username' },
  { icon: 'icon-github-fill', name: 'github', prefix: 'github.com/', placeholder: 'username' },
  { icon: 'icon-calendly', name: 'calendly', prefix: 'calendly.com/', placeholder: 'username' },
];

export function ProfilePane() {
  const me = useMe();

  const { control, setValue, watch } = useForm<ProfileValues>({
    defaultValues: {
      name: '',
    },
  });

  return (
    <Pane.Root>
      <Pane.Header.Root>
        <Pane.Header.Left />
        <Pane.Header.Center className="flex items-center justify-center">
          <p className="text-primary">Edit Profile</p>
        </Pane.Header.Center>
        <Pane.Header.Right>
          <Button icon="icon-arrow-outward" variant="tertiary" size="sm" />
        </Pane.Header.Right>
      </Pane.Header.Root>
      <Pane.Content className="p-4 flex flex-col gap-5">
        <div className="flex items-center justify-center py-4">
          <div className="size-[140px] relative">
            <img src={userAvatar(me)} className="w-full h-full rounded-full" />
            <FileInput onChange={(e) => console.log(e)}>
              {(open) => (
                <Button
                  icon="icon-upload-sharp"
                  variant="secondary"
                  onClick={open}
                  className="rounded-full absolute bottom-0 right-0 border-4! border-overlay-primary! max-w-[40px] max-h-[40px]"
                />
              )}
            </FileInput>
          </div>
        </div>

        <div className="flex flex-col gap-5 divide-y divide-[var(--color-divider)]">
          <div className="flex flex-col gap-4 pb-5">
            <Controller
              control={control}
              name="name"
              render={() => {
                return (
                  <InputField
                    label="Name"
                    placeholder="Jane Doe"
                    value={me?.name}
                    onChangeText={(value) => setValue('name', value)}
                  />
                );
              }}
            />
            {me?.username ? (
              <Controller
                control={control}
                name="username"
                render={() => {
                  const username = watch('username');
                  return (
                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        <InputField
                          label="Username"
                          prefix="@lemonade/"
                          value={username}
                          onChangeText={(value) => setValue('username', value)}
                        />
                      </div>
                      <Button variant="tertiary" icon="icon-more-vert" className="w-[40px] h-[40px]" />
                    </div>
                  );
                }}
              />
            ) : (
              <div className="flex flex-col gap-1.5">
                <label className="font-medium text-sm">Username</label>
                <Button variant="tertiary" className="w-fit">
                  Claim Your Username
                </Button>
              </div>
            )}
            <Controller
              control={control}
              name="bio"
              render={({ field }) => (
                <TextAreaField label="Bio" rows={5} value={field.value} onChange={field.onChange} />
              )}
            />

            {/* TODO: check location value from lens */}
            <InputField label="Location" iconLeft="icon-location-outline" placeholder="Where you’re currently based" />

            <Controller
              control={control}
              name="website"
              render={({ field }) => (
                <InputField
                  label="Website"
                  iconLeft="icon-globe"
                  placeholder="Your website"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-4 pb-5">
            <p>Social Links</p>
            <div className="flex flex-col gap-4">
              {SOCIAL_LINKS.map((item) => (
                <div key={item.name} className="flex items-center gap-4">
                  <i className={twMerge('size-5 text-tertiary', item.icon)} />
                  <div className="flex-1">
                    <InputField prefix={item.prefix} placeholder={item.placeholder} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 pb-5">
            <p>Personal Details</p>
            <div className="flex flex-col gap-4">
              <Dropdown
                iconLeft="icon-user"
                options={[
                  { key: '1', value: 'Option 1' },
                  { key: '2', value: 'Option 2' },
                ]}
              />
              <InputField iconLeft="icon-suitcase" label="Job Title" placeholder="Your current role" />
              <InputField iconLeft="icon-factory" label="Organization" placeholder="Where you work" />
            </div>
          </div>
        </div>
      </Pane.Content>
      <Pane.Footer className="border-t px-4 py-3">
        <Button variant="secondary" disabled>
          Save Changes
        </Button>
      </Pane.Footer>
    </Pane.Root>
  );
}
