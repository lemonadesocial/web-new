import { useForm, UseFormReturn } from "react-hook-form";
import { useEffect } from "react";

import { BuyerInfoInput } from "$lib/graphql/generated/backend/graphql";
import { buyerInfoAtom, formInstancesAtom, submitHandlersAtom, useSetAtom } from "../store";
import { ErrorText, Input, LabeledInput } from "$lib/components/core";
import { EMAIL_REGEX } from "$lib/utils/regex";

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
  const setBuyerInfo = useSetAtom(buyerInfoAtom);

  const onSubmit = (data: BuyerInfoInput) => {
    setBuyerInfo(data);
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
