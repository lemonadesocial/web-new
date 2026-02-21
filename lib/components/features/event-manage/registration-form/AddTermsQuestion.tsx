import { useState } from "react";

import { Button, Input, ModalContent, modal, Toggle, TextEditor, toast, Segment } from "$lib/components/core";
import { UpdateEventSettingsDocument } from "$lib/graphql/generated/backend/graphql";
import { useMutation } from "$lib/graphql/request";

import { AddQuestionModal } from "./AddQuestionModal";
import { useEvent, useUpdateEvent } from "../store";

export function AddTermsQuestion() {
  const currentEvent = useEvent();
  const updateEvent = useUpdateEvent();

  const [contentType, setContentType] = useState<'text' | 'link'>('text');
  const [termsText, setTermsText] = useState(currentEvent?.terms_text || '');
  const [termsLink, setTermsLink] = useState(currentEvent?.terms_link || '');
  const [required, setRequired] = useState(false);

  const [update, { loading }] = useMutation(UpdateEventSettingsDocument, {
    onComplete: (_, data) => {
      if (data?.updateEvent) {
        updateEvent({
          terms_text: contentType === 'text' ? termsText : null,
          terms_link: contentType === 'link' ? termsLink : null,
        });
        toast.success('Terms question added successfully!');
        modal.close();
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add terms question');
    },
  });

  const handleSave = async () => {
    if (!currentEvent?._id) {
      toast.error('Event not found');
      return;
    }

    await update({
      variables: {
        id: currentEvent._id,
        input: {
          terms_text: contentType === 'text' ? termsText : null,
          terms_link: contentType === 'link' ? termsLink : null,
        },
      },
    });
  };

  return (
    <ModalContent
      title="Add Question"
      className="w-[480px] max-w-full"
      onClose={() => modal.close()}
      onBack={() => {
        modal.close();
        modal.open(AddQuestionModal);
      }}
    >
      <div className="space-y-4">
        <div className="flex gap-3 items-center">
          <div className="flex items-center justify-center p-2 rounded-sm bg-primary/8">
            <i aria-hidden="true" className="icon-signature size-4.5 text-tertiary" />
          </div>
          <div>
            <p className="text-sm text-secondary">Terms</p>
            <p className="text-xs text-secondary">Collect consent to terms and conditions</p>
          </div>
        </div>

        <hr className="border-t border-t-divider -mx-4" />

        <div className="space-y-2">
          <p className="text-sm font-medium">Content Type</p>
          <Segment
            size="sm"
            selected={contentType}
            onSelect={(item) => setContentType(item.value as 'text' | 'link')}
            items={[
              { label: 'Text', value: 'text', iconLeft: 'icon-insert' },
              { label: 'Link', value: 'link', iconLeft: 'icon-link' },
            ]}
            className="w-full"
          />
        </div>

        <div className={`${contentType === 'text' ? 'block space-y-2' : 'hidden'}`}>
          <p className="text-sm font-medium">Terms Content</p>
          <TextEditor
            content={termsText}
            onChange={setTermsText}
            placeholder="Enter terms and conditions text here..."
          />
        </div>

        <div className={`${contentType === 'link' ? 'block space-y-2' : 'hidden'}`}>
          <p className="text-sm font-medium">Terms Link</p>
          <Input
            type="url"
            value={termsLink}
            onChange={(e) => setTermsLink(e.target.value)}
            placeholder="Enter terms and conditions link here..."
            variant="outlined"
          />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-secondary">Required</p>
          <Toggle
            id="required"
            checked={required}
            onChange={setRequired}
          />
        </div>

        <Button
          variant="secondary"
          className="w-full"
          onClick={handleSave}
          loading={loading}
          disabled={contentType === 'text' ? !termsText.trim() : !termsLink.trim()}
        >
          Add Question
        </Button>
      </div>
    </ModalContent>
  );
}
