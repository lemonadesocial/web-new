import { useForm, UseFormReturn } from "react-hook-form";
import { useEffect } from "react";
import clsx from "clsx";
import type { SelfAppDisclosureConfig } from "@selfxyz/common";

import { formInstancesAtom, submitHandlersAtom, useSetAtom } from "../store";
import { Button, LabeledInput, modal } from "$lib/components/core";
import { GetSelfVerificationStatusDocument, SelfVerificationConfig } from "$lib/graphql/generated/backend/graphql";
import { useQuery } from "$lib/graphql/request";

import { GetVerifiedModal } from "../../modals/GetVerifiedModal";
import { getFullConfig } from "../../../../utils/constants";

export function SelfVerificationForm({ config }: { config: SelfVerificationConfig }) {
  const setFormInstances = useSetAtom(formInstancesAtom);
  const setSubmitHandlers = useSetAtom(submitHandlersAtom);

  const form: UseFormReturn<{ isVerified: boolean }> = useForm<{ isVerified: boolean }>({
    defaultValues: {
      isVerified: false,
    },
    mode: 'onChange',
  });

  const { __typename, ...configWithoutTypename } = config;

  const { data } = useQuery(GetSelfVerificationStatusDocument, {
    variables: {
      config: configWithoutTypename
    },
  });

  useEffect(() => {
    if (data?.getSelfVerificationStatus) {
      const allVerified = data.getSelfVerificationStatus.disclosures?.every((d: { verified: boolean }) => d.verified);
      form.setValue('isVerified', allVerified);
    }
  }, [data]);

  const onSubmit = (data: { isVerified: boolean }) => {
    // Form validation handled by validation rules
    // This is just to satisfy form submission requirements
  };

  const handleVerifyClick = () => {
    modal.open(GetVerifiedModal, {
      dismissible: true,
      props: {
        config: getFullConfig(configWithoutTypename as Partial<SelfAppDisclosureConfig>)
      }
    });
  };

  useEffect(() => {
    setFormInstances(prev => ({ ...prev, selfVerification: form }));
    setSubmitHandlers(prev => ({ ...prev, selfVerification: onSubmit }));
  }, []);

  useEffect(() => {
    form.register('isVerified', {
      validate: (value) => {
        return value ? true : 'Self ID verification is required';
      }
    });
  }, []);

  const isVerified = form.watch('isVerified');

  return (
    <>
      <LabeledInput label="Self ID Verification" required={true}>
        {isVerified ? (
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-sm bg-success-400/16 w-min">
            <i aria-hidden="true" className="icon-verified text-success-400 size-5" />
            <p className="flex-1 text-success-400">Verified</p>
          </div>
        ) : (
          <Button
            variant="tertiary"
            className={clsx(
              'w-fit',
              form.formState.errors.isVerified && '!bg-danger-400/16 !hover:bg-danger-400/20 !text-danger-400',
            )}
            iconLeft="icon-self"
            onClick={handleVerifyClick}
          >
            Verify Self ID
          </Button>
        )}
      </LabeledInput>
    </>
  );
}
