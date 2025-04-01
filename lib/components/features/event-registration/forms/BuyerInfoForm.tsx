import { useForm, UseFormReturn } from "react-hook-form";
import { useEffect } from "react";

import { BuyerInfoInput } from "$lib/generated/backend/graphql";
import { formInstancesAtom, submitHandlersAtom, useSetAtom } from "../store";
import { ErrorText, Input, LabeledInput } from "$lib/components/core";

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export function BuyerInfoForm() {
  const form: UseFormReturn<BuyerInfoInput> = useForm<BuyerInfoInput>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: ''
    }
  });
  const setFormInstances = useSetAtom(formInstancesAtom);
  const setSubmitHandlers = useSetAtom(submitHandlersAtom);

  const onSubmit = (data: BuyerInfoInput) => {
    console.log('BuyerInfoForm submitted with:', data);
  };

  useEffect(() => {
    setFormInstances(prev => ({ ...prev, buyerInfo: form }));
    setSubmitHandlers(prev => ({ ...prev, buyerInfo: onSubmit }));
  }, []);

  const { register, formState: { errors } } = form;

  return (
    <>
      <LabeledInput label="Name" required>
        <Input
          {...register('name', {
            required: "Name is required",
          })}
          placeholder="Enter your name"
          error={!!errors.name}
        />
        {errors.name && <ErrorText message={errors.name.message!} />}
      </LabeledInput>
      <LabeledInput label="Email" required>
        <Input
          {...register('email', {
            required: "Email is required",
            pattern: {
              value: EMAIL_REGEX,
              message: "Please enter a valid email address"
            }
          })}
          type="email"
          placeholder="Enter your email"
          error={!!errors.email}
        />
        {errors.email && <ErrorText message={errors.email.message!} />}
      </LabeledInput>
    </>
  );
};
