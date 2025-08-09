import { useState } from 'react';

import { Button, Menu, MenuItem, modal, toast } from '$lib/components/core';
import { UpdateEventRegistrationFormDocument, BlockchainPlatform, EventApplicationQuestion, QuestionType } from '$lib/graphql/generated/backend/graphql';
import { useMutation } from '$lib/graphql/request';
import { useEvent, useUpdateEvent } from '../store';
import { AddQuestionModal } from './AddQuestionModal';
import { AddTextQuestion } from './AddTextQuestion';
import { AddOptionsQuestion } from './AddOptionsQuestion';
import { ApplicationProfileCard } from './ApplicationProfileCard';

type EthAddressRequirement = 'Off' | 'Optional' | 'Required';

export function RegistrationForm() {
  const event = useEvent();
  const updateEvent = useUpdateEvent();

  const [ethAddressRequirement, setEthAddressRequirement] = useState<EthAddressRequirement>(() => {
    const ethereumPlatform = event?.rsvp_wallet_platforms?.find(
      platform => platform.platform === BlockchainPlatform.Ethereum
    );

    if (!ethereumPlatform) return 'Off';
    if (ethereumPlatform.required) return 'Required';
    return 'Optional';
  });

  const [updateEventRegistrationForm] = useMutation(UpdateEventRegistrationFormDocument, {
    onComplete: (_, data) => {
      if (data?.updateEvent) {
        updateEvent(data.updateEvent);
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update registration form');
    },
  });

  const handleEthAddressChange = (requirement: EthAddressRequirement) => {
    setEthAddressRequirement(requirement);

    const rsvp_wallet_platforms = event?.rsvp_wallet_platforms?.filter(
      platform => platform.platform !== BlockchainPlatform.Ethereum
    ) || [];

    if (requirement !== 'Off') {
      rsvp_wallet_platforms.push({
        platform: BlockchainPlatform.Ethereum,
        required: requirement === 'Required',
      });
    }

    updateEventRegistrationForm({
      variables: {
        id: event!._id,
        input: {
          rsvp_wallet_platforms,
        },
      },
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold">Registration Form</h1>
        <p className="text-secondary">We will ask guests the following questions when they register for the event.</p>
      </div>
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <i className="icon-info size-5 text-success-500" />
            <p>Personal Information</p>
          </div>
          <div className="grid grid-cols-2 gap-3.5 max-w-[654px]">
            <div className="rounded-md py-2.5 px-3.5 border border-card-border bg-card flex gap-2 items-center">
              <i className="icon-person-outline size-5 text-tertiary" />
              <p className="flex-1">Name</p>
              <p className="text-tertiary">Required</p>
            </div>
            <div className="rounded-md py-2.5 px-3.5 border border-card-border bg-card flex gap-2 items-center">
              <i className="icon-email size-5 text-tertiary" />
              <p className="flex-1">Email</p>
              <p className="text-tertiary">Required</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <i className="icon-wallet size-5 text-accent-400" />
            <p>Web3 Identity</p>
          </div>
          <div className="grid grid-cols-2 gap-3.5 max-w-[654px]">
            <div className="rounded-md py-2.5 px-3.5 border border-card-border bg-card flex gap-2 items-center">
              <i className="icon-eth size-5 text-tertiary" />
              <p className="flex-1">ETH Address</p>
              <Menu.Root>
                <Menu.Trigger>
                  {({ toggle }) => (
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={toggle}
                    >
                      <p className="text-tertiary">{ethAddressRequirement}</p>
                      <i className="icon-arrow-down text-tertiary size-4" />
                    </div>
                  )}
                </Menu.Trigger>
                <Menu.Content className="p-1 min-w-[120px]">
                  {({ toggle }) => (
                    <>
                      <MenuItem
                        title="Off"
                        onClick={() => {
                          handleEthAddressChange('Off');
                          toggle();
                        }}
                      />
                      <MenuItem
                        title="Optional"
                        onClick={() => {
                          handleEthAddressChange('Optional');
                          toggle();
                        }}
                      />
                      <MenuItem
                        title="Required"
                        onClick={() => {
                          handleEthAddressChange('Required');
                          toggle();
                        }}
                      />
                    </>
                  )}
                </Menu.Content>
              </Menu.Root>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <i className="icon-question size-5 text-warning-300" />
            <p>Custom Questions</p>
          </div>
          <div className="space-y-3">
            {event?.application_questions?.map((question, index) => (
              <QuestionCard key={question._id} question={question} index={index} />
            ))}
           {event?.application_profile_fields?.map((field, index) => (
            <ApplicationProfileCard key={field.field} field={field} index={index} />
          ))}
          </div>
          <Button
            variant="tertiary"
            iconLeft="icon-plus"
            onClick={() => modal.open(AddQuestionModal)}
          >
            Add Question
          </Button>
        </div>
      </div>
    </div>
  );
}


function QuestionCard({ question, index }: { question: EventApplicationQuestion; index: number }) {
  const getQuestionTypeLabel = (type?: QuestionType, selectType?: string) => {
    if (type === QuestionType.Options) {
      return selectType === 'multi' ? 'Multi Select' : 'Single Select';
    }
    if (type === QuestionType.Text) {
      return 'Text';
    }
    if (type === QuestionType.Company) {
      return 'Company';
    }
    if (type === QuestionType.Website) {
      return 'Website';
    }
    if (type === QuestionType.Checkbox) {
      return 'Checkbox';
    }
  };


  const handleEdit = (question: EventApplicationQuestion) => {
    if (question.type === QuestionType.Text) {
      modal.open(AddTextQuestion, {
        props: {
          applicationQuestion: question,
        },
      });

      return;
    }

    if (question.type === QuestionType.Options) {
      modal.open(AddOptionsQuestion, {
        props: {
          applicationQuestion: question,
        }
      })
    }
  };

  return (
    <div className="rounded-md py-2 px-3.5 border border-card-border bg-card flex items-center gap-3">
      {/* <i className="icon-drag-indicator size-4 text-quaternary cursor-move" /> */}

      <div className="flex-1 min-w-0">
        <p>{question.question}</p>

        <div className="flex items-center gap-1.5">
          <p className="text-sm text-tertiary">{getQuestionTypeLabel(question.type, question.select_type)}</p>
          {question.required && <>
            <i className="icon-dot size-2 text-tertiary" />
            <p className="text-sm text-tertiary">
              Required
            </p>
          </>}
        </div>

        {question.type === QuestionType.Options && question.options && question.options.length > 0 && (
          <p className="text-xs text-tertiary mt-1">
            {question.options.length} Option{question.options.length !== 1 ? 's' : ''}: {question.options.slice(0, 3).join(', ')}
            {question.options.length > 3 && ` +${question.options.length - 3} more`}
          </p>
        )}
      </div>

      <i
        className="icon-edit-sharp size-5 text-tertiary cursor-pointer"
        onClick={() => handleEdit(question)}
      />
    </div>
  );
}
