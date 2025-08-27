import { useState } from "react";

import { Button, modal, ModalContent, TextEditor, toast } from "$lib/components/core";
import { EmailSetting, EmailTemplateType, Event, SendEventEmailSettingTestEmailsDocument, UpdateEventEmailSettingDocument } from "$lib/graphql/generated/backend/graphql";
import { useMutation } from "$lib/graphql/request";
import { useMe } from "$lib/hooks/useMe";

export function ConfirmationEmailModal({ setting, event }: { setting: EmailSetting; event: Event }) {
  const [body, setBody] = useState<string>(setting.custom_body_html || '');
  const me = useMe();

  const [sendTest, { loading: sendingTest }] = useMutation(SendEventEmailSettingTestEmailsDocument, {
    onComplete: () => {
      toast.success('Email send successfully');
    },
  });

  const [updateEmailSetting, { loading: updatingEmailSetting }] = useMutation(UpdateEventEmailSettingDocument, {
    onComplete: () => {
      toast.success('Email updated successfully');
      modal.close();
    },
  });

  const handleSendPreview = () => {
    sendTest({
      variables: {
        input: {
          event: event._id,
          custom_body_html: body,
          type: EmailTemplateType.PostRsvp,
          test_recipients: [me?.email!],
        },
      },
    });
  };

  const handleUpdateEmail = () => {
    updateEmailSetting({
      variables: {
        input: {
          _id: setting._id,
          custom_body_html: body,
        },
      },
    });
  };

  return (
    <ModalContent
      icon="icon-check"
      className="w-[480px] max-w-full"
      onClose={() => modal.close()}
    >
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-lg">Customize Email</p>
          <p className="text-secondary text-sm">This email is sent when a guest registers or when you approve a guest who is pending approval.</p>
        </div>
        <div>
          <p className="text-sm text-tertiary">Subject</p>
          <p>{setting.subject_preview}</p>
        </div>

        <TextEditor
          placeholder="Add your custom message here."
          content={body}
          containerClass="bg-background/64"
          onChange={(content) => setBody(content)}
        />

        <div className="flex items-center justify-between">
          <Button
            className="px-0 text-tertiary! hover:text-primary!"
            variant="flat"
            loading={sendingTest}
            onClick={handleSendPreview}
          >
            Send Preview
          </Button>
          <Button
            variant="secondary"
            onClick={handleUpdateEmail}
            disabled={!body}
            loading={updatingEmailSetting}
          >
            Update Email
          </Button>
        </div>
      </div>
    </ModalContent>
  );
}
