'use client';

import React from 'react';
import { useForm, UseFormRegister, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { uniq } from 'lodash';
import { z } from 'zod';
import clsx from 'clsx';

import { Button, Card, Divider, drawer, Input, ErrorText, LabeledInput, modal, ModalContent, toast } from '$lib/components/core';
import { Pane } from '$lib/components/core/pane/pane';
import { Space, UpdateSpaceDocument } from '$lib/graphql/generated/backend/graphql';
import { useMutation } from '$lib/graphql/request';
import { copy } from '$lib/utils/helpers';

type DNSType = { type: 'A' | 'CNAME'; values: string[]; host: string };

const isProduction = process.env.NEXT_PUBLIC_APP_ENV === 'production';

const DNS_A_RECORD_VALUES = isProduction ? ['15.197.209.64', '3.33.205.125'] : ['15.197.191.87', '3.33.251.112'];

const DNS_RECORDS: DNSType[] = [
  {
    type: 'A' as const,
    host: '@',
    values: DNS_A_RECORD_VALUES,
  },
  { type: 'CNAME' as const, host: 'www', values: ['@'] },
];

const domainSchema = z.object({
  domain: z
    .string()
    .min(1, 'Required')
    .regex(
      /((https?):\/\/)?(www\.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      'Enter correct url!',
    ),
  primaryDomain: z.boolean().default(true),
  subdomains: z.array(z.string()).default(['']),
});

type DomainFormValues = z.infer<typeof domainSchema>;

type Step = 'domain' | 'select' | 'subdomain' | 'warning' | 'dns';

export function CustomDomainPane({ space }: { space: Space }) {
  const [currentStep, setCurrentStep] = React.useState<Step>('domain');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    getValues,
  } = useForm<DomainFormValues>({
    resolver: zodResolver(domainSchema),
    defaultValues: {
      domain: '',
      primaryDomain: true,
      subdomains: [''],
    },
    mode: 'onChange',
  });

  const domain = watch('domain');
  const primaryDomain = watch('primaryDomain');
  const subdomains = watch('subdomains');

  const [updateSpace, { loading }] = useMutation(UpdateSpaceDocument, {
    onComplete: (client, incoming) => {
      if (space) {
        client.writeFragment({ id: `Space:${space._id}`, data: { ...space, ...incoming.updateSpace } });
      }
      const values = getValues();
      const subdomainsList = values.subdomains.filter(Boolean).map((p) => `${p}.${values.domain}`);
      const allDomains = [values.domain, ...subdomainsList];
      modal.open(CompleteModal, {
        props: { domains: allDomains },
        onClose: () => {
          drawer.close();
        },
      });
    },
  });

  const onSubmit = async (values: DomainFormValues) => {
    const subdomainsList = values.subdomains.filter(Boolean).map((p) => `${p}.${values.domain}`);
    const hostnames = uniq([...(space.hostnames || []), values.domain, ...subdomainsList]);
    await updateSpace({ variables: { id: space._id, input: { hostnames } } });
  };

  const getNextStep = (step: Step): Step | null => {
    switch (step) {
      case 'domain':
        return 'select';
      case 'select':
        return primaryDomain ? 'warning' : 'subdomain';
      case 'subdomain':
        return 'warning';
      case 'warning':
        return 'dns';
      case 'dns':
        return null;
    }
  };

  const getPreviousStep = (step: Step): Step | null => {
    switch (step) {
      case 'select':
        return 'domain';
      case 'subdomain':
        return 'select';
      case 'warning':
        return primaryDomain ? 'select' : 'subdomain';
      case 'dns':
        return 'warning';
      case 'domain':
        return null;
    }
  };

  const handleNext = () => {
    if (currentStep === 'dns') {
      handleSubmit(onSubmit)();
      return;
    }

    const nextStep = getNextStep(currentStep);
    if (nextStep && (currentStep !== 'domain' || isValid)) {
      setCurrentStep(nextStep);
    }
  };

  const handleBack = () => {
    const previousStep = getPreviousStep(currentStep);
    if (previousStep) {
      setCurrentStep(previousStep);
    }
  };

  const renderStep = () => {
    if (currentStep === 'domain') {
      return <AddDomain register={register} errors={errors} />;
    }

    if (currentStep === 'select') {
      return <SelectPrimaryOrSubDomain domain={domain} primaryDomain={primaryDomain} onSelect={(value) => setValue('primaryDomain', value)} />;
    }

    if (currentStep === 'subdomain') {
      return <AddSubDomain domain={domain} subdomains={subdomains} setValue={setValue} />;
    }

    if (currentStep === 'warning') {
      return <DomainWarningInfo subdomains={subdomains} />;
    }

    if (currentStep === 'dns') {
      return <AddDNSDomain />;
    }

    return null;
  };

  return (
    <Pane.Root>
      <Pane.Header.Root>
        <Pane.Header.Left showBackButton={currentStep === 'domain'}>
          {currentStep !== 'domain' && (
            <Button icon="icon-chevron-left" variant="tertiary-alt" size="sm" onClick={handleBack} />
          )}
        </Pane.Header.Left>
      </Pane.Header.Root>

      <Pane.Content className="p-4 flex flex-col gap-6">{renderStep()}</Pane.Content>

      <Pane.Footer>
        <div className="p-4 border-t">
          <Button variant="secondary" disabled={currentStep === 'domain' && !isValid} loading={loading} onClick={handleNext}>
            Next
          </Button>
        </div>
      </Pane.Footer>
    </Pane.Root>
  );
}

function AddDomain({
  register,
  errors,
}: {
  register: UseFormRegister<DomainFormValues>;
  errors: FieldErrors<DomainFormValues>;
}) {
  return (
    <>
      <div>
        <p className="text-2xl mb-1">Let's get your domain up & running!</p>
      </div>

      <div className="flex flex-col gap-6">
        <LabeledInput label="Enter Your Primary Domain">
          <Input
            variant="underlined"
            placeholder="yourdomain.com"
            {...register('domain')}
            error={!!errors.domain}
          />
          {errors.domain && <ErrorText message={errors.domain.message || ''} />}
        </LabeledInput>

        <p className="text-sm text-secondary">
          We'll verify domain is properly connected before your site is published. This can take upto 24h.
        </p>
      </div>
    </>
  );
}

function SelectPrimaryOrSubDomain({
  domain,
  primaryDomain,
  onSelect,
}: {
  domain: string;
  primaryDomain: boolean;
  onSelect: (value: boolean) => void;
}) {
  return (
    <>
      <div>
        <p className="text-2xl mb-1">Where do you want to host your site?</p>
      </div>

      <div className="flex flex-col gap-3">
        <Card.Root
          className={clsx(
            'cursor-pointer transition-colors',
            primaryDomain ? 'border-primary' : 'border-card-border',
          )}
          onClick={() => onSelect(true)}
        >
          <Card.Content className="px-4 py-3 flex flex-col gap-2">
            <div>
              <p>On the Primary Domain</p>
              <p className="text-sm text-accent-400">{domain}</p>
            </div>
            <p className="text-sm text-tertiary">
              This will replace any existing website on your primary domain. If you already have a site there, choose
              the subdomain option instead.
            </p>
          </Card.Content>
        </Card.Root>

        <Card.Root
          className={clsx(
            'cursor-pointer transition-colors',
            !primaryDomain ? 'border-primary' : 'border-card-border',
          )}
          onClick={() => onSelect(false)}
        >
          <Card.Content className="px-4 py-3 flex flex-col gap-2">
            <div>
              <p>On a Subdomain</p>
              <p className="text-sm text-accent-400">Eg: community.{domain}</p>
            </div>
            <p className="text-sm text-tertiary">
              Your main website stays untouched. You can add multiple subdomains.
            </p>
          </Card.Content>
        </Card.Root>
      </div>
    </>
  );
}

function AddSubDomain({
  domain,
  subdomains,
  setValue,
}: {
  domain: string;
  subdomains: string[];
  setValue: (name: 'subdomains', value: string[]) => void;
}) {
  const handleSubdomainChange = (idx: number, value: string) => {
    const values = [...subdomains];
    values[idx] = value;
    if (values[values.length - 1] !== '') {
      values.push('');
    }
    if (!value && values.length > 1) {
      values.splice(idx, 1);
    }
    setValue('subdomains', values);
  };

  const handleRemoveSubdomain = (idx: number) => {
    const values = subdomains.filter((_, i) => i !== idx);
    if (values.length === 0) {
      values.push('');
    }
    setValue('subdomains', values);
  };

  return (
    <>
      <div>
        <p className="text-2xl mb-1">Enter the subdomains you want to use</p>
      </div>

      <div className="flex flex-col gap-6">
        {subdomains.map((subDomain: string, idx: number) => {
          return (
            <div key={idx} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <p className="text-sm">Enter Subdomain</p>
                {subDomain && (
                  <i
                    className="icon-x size-4 cursor-pointer text-tertiary hover:text-secondary"
                    onClick={() => handleRemoveSubdomain(idx)}
                  />
                )}
              </div>
              <div className="flex items-center pb-2 border-b">
                <input
                  className="w-[84px] bg-transparent border-0 outline-none placeholder:text-quaternary font-medium"
                  placeholder="subdomain"
                  type="text"
                  onChange={(e) => handleSubdomainChange(idx, e.target.value)}
                  value={subDomain}
                />
                <span className="text-tertiary font-medium">.{domain}</span>
              </div>
            </div>
          );
        })}

        <p className="text-sm text-secondary">
          We'll verify domain is properly connected before your site is published. This can take upto 24h.
        </p>
      </div>
    </>
  );
}

function DomainWarningInfo({ subdomains }: { subdomains: string[] }) {
  const hasSubdomains = subdomains.filter(Boolean).length > 0;

  return (
    <>
      <div>
        <p className="text-2xl mb-1">Before you update your DNS settings</p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center size-14 rounded-full bg-error/16">
            <p className="text-xl text-error">
              1
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-lg">Backup Your Current DNS Records</p>
            <p className="text-sm text-secondary">
              Take a screenshot of your existing DNS records in your domain host's settings before making any changes.
              This will help you restore them if needed.
            </p>
          </div>
        </div>

        <Divider />

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center size-14 rounded-full bg-error/16">
            <p className="text-xl text-error">
              2
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-lg">Remove Conflicting Records</p>

            <div className="flex flex-col gap-2">
              {hasSubdomains ? (
                <>
                  <p className="text-sm text-secondary">
                    Before adding new records, delete any existing CNAME records for the following subdomains.
                  </p>
                  <ul className="pl-4 m-0 list-disc text-secondary">
                    {subdomains.filter(Boolean).map((subdomain, idx) => (
                      <li key={idx}>
                        <p className="text-sm text-secondary">{subdomain}</p>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <p className="text-sm text-secondary">
                    Before adding new records, delete the following if they exist:
                  </p>
                  <ul className="pl-4 m-0 list-disc text-secondary">
                    <li>
                      <p className="text-sm text-secondary">Any A Records</p>
                    </li>
                    <li>
                      <p className="text-sm text-secondary">
                        Any CNAME Record with the host/name set to @, www, or *
                      </p>
                    </li>
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="bg-card rounded-sm px-4 py-3">
          <p className="text-sm text-tertiary">
            Keeping these old records may cause conflicts, preventing your domain from pointing to Lemonade.
          </p>
        </div>
      </div>
    </>
  );
}

function AddDNSDomain() {
  return (
    <>
      <p className="text-2xl">In your DNS settings, add these records:</p>

      {DNS_RECORDS.map((item, idx) => (
        <div key={idx} className="flex flex-col gap-3">
          <p className="text-sm text-secondary">Add New {item.type} Record</p>
          <Card.Root className="border border-card-border">
            <Card.Content className="p-0">
              <div className="flex justify-between items-center px-4 py-3 border-b border-divider">
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-tertiary">Name / Host</p>
                  <p>{item.host}</p>
                </div>
                <Button
                  type="button"
                  icon="icon-copy"
                  variant="tertiary"
                  size="sm"
                  onClick={() => copy(item.host, () => toast.success('Copied to clipboard! 📋'))}
                />
              </div>
              {item.values.map((v, valueIdx) => (
                <div
                  key={valueIdx}
                  className={clsx(
                    'flex justify-between items-center px-4 py-4',
                    valueIdx < item.values.length - 1 && 'border-b border-divider',
                  )}
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-tertiary">Value</p>
                    <p>{v}</p>
                  </div>
                  <Button
                    type="button"
                    icon="icon-copy"
                    variant="tertiary"
                    size="sm"
                    onClick={() => copy(v, () => toast.success('Copied to clipboard! 📋'))}
                  />
                </div>
              ))}
            </Card.Content>
          </Card.Root>
        </div>
      ))}
    </>
  );
}

function CompleteModal({ domains }: { domains: string[] }) {
  return (
    <ModalContent className="p-4">
      <div  className="flex flex-col gap-4">
      <div className="flex items-center justify-center size-14 rounded-full bg-warning-300/16">
        <i aria-hidden="true" className="icon-timer-flash size-8 text-warning-300" />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-lg">Going Live...</p>
        <p className="text-sm text-secondary">
          Changes may take up to 24 hours to take effect. Once done, your community will be live at{' '}
          {domains.map((domain, idx) => (
            <React.Fragment key={domain}>
              <span className="text-accent-400">{domain}</span>
              {idx < domains.length - 1 && <span className="text-secondary"> & </span>}
            </React.Fragment>
          ))}
          .
        </p>
      </div>

      <Button variant="secondary" className="w-full bg-primary text-background" onClick={() => modal.close()}>
        Done
      </Button>
      </div>

    </ModalContent>
  );
}
