import { useForm, UseFormRegister, FieldErrors, Control } from 'react-hook-form';
import * as React from 'react';

import { UserInput } from '$lib/graphql/generated/backend/graphql';
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
      {requiredProfileFields.map(({ field, required }) => (
        <ProfileField
          key={field}
          name={field as keyof UserInput}
          register={register}
          errors={errors}
          control={control}
          required={!!required}
        />
      ))}
    </>
  );
}

function ProfileField({
  name,
  register,
  errors,
  control,
  required
}: {
  name: keyof UserInput;
  register: UseFormRegister<UserInput>;
  errors: FieldErrors<UserInput>;
  control: Control<UserInput>;
  required?: boolean;
}) {
  const getFieldInfo = () => {
    switch (name) {
      case 'display_name':
        return {
          label: 'Name',
          placeholder: 'Enter your name'
        };
      case 'pronoun':
        return {
          label: 'Pronoun',
          placeholder: 'Enter your pronoun'
        };
      case 'description':
        return {
          label: 'Biography',
          placeholder: 'Enter your biography'
        };
      case 'handle_twitter':
        return {
          label: 'Twitter username',
          placeholder: 'Enter your Twitter username'
        };
      case 'handle_linkedin':
        return {
          label: 'LinkedIn username',
          placeholder: 'Enter your LinkedIn username'
        };
      case 'handle_instagram':
        return {
          label: 'Instagram username',
          placeholder: 'Enter your Instagram username'
        };
      case 'handle_facebook':
        return {
          label: 'Facebook username',
          placeholder: 'Enter your Facebook username'
        };
      case 'handle_farcaster':
        return {
          label: 'Farcaster username',
          placeholder: 'Enter your Farcaster username'
        };
      case 'handle_lens':
        return {
          label: 'Lens handle',
          placeholder: 'Enter your Lens handle'
        };
      case 'handle_mirror':
        return {
          label: 'Mirror username',
          placeholder: 'Enter your Mirror username'
        };
      case 'handle_github':
        return {
          label: 'Github username',
          placeholder: 'Enter your Github username'
        };
      case 'calendly_url':
        return {
          label: 'Calendly handle',
          placeholder: 'Enter your Calendly handle'
        };
      case 'job_title':
        return {
          label: 'Job title',
          placeholder: 'Enter your job title'
        };
      case 'company_name':
        return {
          label: 'Organization',
          placeholder: 'Enter your organization'
        };
      case 'education_title':
        return {
          label: 'Education',
          placeholder: 'Enter your education'
        };
      case 'ethnicity':
        return {
          label: 'Ethnicity / Race',
          placeholder: 'Select your ethnicity'
        };
      case 'industry':
        return {
          label: 'Industry',
          placeholder: 'Select your industry'
        };
      case 'date_of_birth':
        return {
          label: 'Date of Birth',
          placeholder: 'MM / DD / YYYY'
        };
      default:
        return {
          label: String(name),
          placeholder: `Enter your ${String(name)}`
        };
    }
  };

  const { label, placeholder } = getFieldInfo();

  const renderField = () => {
    switch (name) {
      case 'pronoun':
        return (
          <SelectController
            name={name}
            control={control}
            options={PRONOUNS}
            placeholder={placeholder}
            error={errors[name]}
            required={required}
          />
        );
      case 'ethnicity':
        return (
          <SelectController
            name={name}
            control={control}
            options={ETHNICITIES}
            placeholder={placeholder}
            error={errors[name]}
            required={required}
          />
        );

      case 'industry':
        return (
          <SelectController
            name={name}
            control={control}
            options={INDUSTRY_OPTIONS}
            placeholder={placeholder}
            error={errors[name]}
            required={required}
          />
        );

      default:
        return (
          <Input
            {...register(name, { required })}
            placeholder={placeholder}
            error={!!errors[name]}
          />
        );
    }
  };

  return (
    <LabeledInput label={label} required={required}>
      {renderField()}
    </LabeledInput>
  );
}
