import { useForm, UseFormRegister, FieldErrors, Control, FieldError } from 'react-hook-form';
import * as React from 'react';

import { UserInput, ApplicationProfileField } from '$lib/graphql/generated/backend/graphql';
import { Input, LabeledInput, SelectController } from '$lib/components/core';
import { formInstancesAtom, requiredProfileFieldsAtom, submitHandlersAtom, useAtomValue, userInfoAtom, useSetAtom } from '../store';
import { useMe } from '$lib/hooks/useMe';
import { ETHNICITIES, INDUSTRY_OPTIONS, PRONOUNS } from '$lib/utils/constants';

export function UserForm() {
  const me = useMe();
  const setFormInstances = useSetAtom(formInstancesAtom);
  const setSubmitHandlers = useSetAtom(submitHandlersAtom);
  const setUserInfo = useSetAtom(userInfoAtom);
  const requiredProfileFields = useAtomValue(requiredProfileFieldsAtom);

  const form = useForm<UserInput>({
    defaultValues: {
      display_name: me?.display_name,
      pronoun: me?.pronoun,
      job_title: me?.job_title,
      company_name: me?.company_name,
      education_title: me?.education_title,
      description: me?.description,
      date_of_birth: me?.date_of_birth,
      email: me?.email,
      website: me?.website,
      handle_twitter: me?.handle_twitter,
      handle_linkedin: me?.handle_linkedin,
      handle_instagram: me?.handle_instagram,
      handle_facebook: me?.handle_facebook,
      handle_github: me?.handle_github,
      calendly_url: me?.calendly_url,
      ethnicity: me?.ethnicity,
      industry: me?.industry,
    },
    mode: 'onChange',
  });

  const onSubmit = (data: UserInput) => {
    setUserInfo(data);
  };

  React.useEffect(() => {
    setFormInstances(prev => ({ ...prev, userInfo: form }));
    setSubmitHandlers(prev => ({ ...prev, userInfo: onSubmit }));
  }, []);

  if (!requiredProfileFields?.length) return <></>;

  const { register, formState: { errors }, control } = form;

  return (
    <>
      {requiredProfileFields.map((profileField) => (
        <ProfileField
          key={profileField.field}
          profileField={profileField}
          name={profileField.field as keyof UserInput}
          register={register}
          errors={errors}
          control={control}
          required={!!profileField.required}
        />
      ))}
    </>
  );
}

function ProfileField({
  profileField,
  name,
  register,
  errors,
  control,
  required
}: {
  profileField: ApplicationProfileField;
  name: keyof UserInput;
  register: UseFormRegister<UserInput>;
  errors: FieldErrors<UserInput>;
  control: Control<UserInput>;
  required?: boolean;
}) {
  const getFieldLabel = (fieldName: string) => {
    const labels: Record<string, string> = {
      display_name: 'Name',
      pronoun: 'Pronoun',
      description: 'Biography',
      website: 'Website',
      handle_twitter: 'Twitter username',
      handle_linkedin: 'LinkedIn username',
      handle_instagram: 'Instagram username',
      handle_facebook: 'Facebook username',
      handle_farcaster: 'Farcaster username',
      handle_lens: 'Lens handle',
      handle_mirror: 'Mirror username',
      handle_github: 'Github username',
      calendly_url: 'Calendly handle',
      job_title: 'Job title',
      company_name: 'Organization',
      education_title: 'Education',
      ethnicity: 'Ethnicity / Race',
      industry: 'Industry',
      date_of_birth: 'Date of Birth',
      email: 'Email'
    };
    
    return labels[fieldName] || fieldName;
  };

  const getFieldOptions = (fieldName: string) => {
    switch (fieldName) {
      case 'pronoun':
        return PRONOUNS;
      case 'ethnicity':
        return ETHNICITIES;
      case 'industry':
        return INDUSTRY_OPTIONS;
      default:
        return null;
    }
  };

  const label = getFieldLabel(name);
  const placeholder = profileField.question || '';
  const options = getFieldOptions(name);

  const renderField = () => {
    if (options) {
      return (
        <SelectController
          name={name}
          control={control}
          options={options}
          placeholder={placeholder}
          error={errors[name] as FieldError | undefined}
          required={required}
        />
      );
    }

    return (
      <Input
        {...register(name, { required })}
        placeholder={placeholder}
        error={!!errors[name]}
      />
    );
  };

  return (
    <LabeledInput label={label} required={required}>
      {renderField()}
    </LabeledInput>
  );
}
