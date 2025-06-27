import { Button, ModalContent, modal } from "$lib/components/core";
import { AddTextQuestion } from "./AddTextQuestion";
import { AddOptionsQuestion } from "./AddOptionsQuestion";
import { AddPersonalDetailsQuestion } from "./AddPersonalDetailsQuestion";
import { AddSocialProfileQuestion } from "./AddSocialProfileQuestion";
import { AddJobTitleQuestion } from "./AddJobTitleQuestion";
import { AddOrganizationQuestion } from "./AddOrganizationQuestion";
import { AddWebsiteQuestion } from "./AddWebsiteQuestion";
import { AddTermsQuestion } from "./AddTermsQuestion";

export function AddQuestionModal() {
  return (
    <ModalContent
      icon="icon-question"
      className="w-[480px] max-w-full"
      onClose={() => modal.close()}
    >
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-lg">Add Question</p>
          <p className="text-sm text-secondary">Ask guests custom questions when they register.</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="tertiary"
            iconLeft="icon-insert"
            className="justify-start"
            onClick={() => {
              modal.close();
              modal.open(AddTextQuestion);
            }}
          >
            Text
          </Button>
          <Button
            variant="tertiary"
            iconLeft="icon-checklist"
            className="justify-start"
            onClick={() => {
              modal.close();
              modal.open(AddOptionsQuestion);
            }}
          >
            Options
          </Button>

          <Button
            variant="tertiary"
            iconLeft="icon-info"
            className="justify-start"
            onClick={() => {
              modal.close();
              modal.open(AddPersonalDetailsQuestion);
            }}
          >
            Personal Details
          </Button>
          <Button
            variant="tertiary"
            iconLeft="icon-account"
            className="justify-start"
            onClick={() => {
              modal.close();
              modal.open(AddSocialProfileQuestion, { className: 'overflow-visible' });
            }}
          >
            Social Profile
          </Button>

          <Button
            variant="tertiary"
            iconLeft="icon-work"
            className="justify-start"
            onClick={() => {
              modal.close();
              modal.open(AddJobTitleQuestion);
            }}
          >
            Job Title
          </Button>
          <Button
            variant="tertiary"
            iconLeft="icon-villa"
            className="justify-start"
            onClick={() => {
              modal.close();
              modal.open(AddOrganizationQuestion);
            }}
          >
            Organization
          </Button>

          <Button
            variant="tertiary"
            iconLeft="icon-signature"
            className="justify-start"
            onClick={() => {
              modal.close();
              modal.open(AddTermsQuestion);
            }}
          >
            Terms
          </Button>
          <Button
            variant="tertiary"
            iconLeft="icon-globe"
            className="justify-start"
            onClick={() => {
              modal.close();
              modal.open(AddWebsiteQuestion);
            }}
          >
            Website
          </Button>
        </div>
      </div>
    </ModalContent>
  );
}
