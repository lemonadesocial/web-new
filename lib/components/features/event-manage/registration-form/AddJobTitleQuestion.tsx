import { useState, useEffect } from "react";

import { Button, Input, LabeledInput, ModalContent, modal, Toggle } from "$lib/components/core";
import { ApplicationProfileField } from "$lib/graphql/generated/backend/graphql";

import { AddQuestionModal } from "./AddQuestionModal";
import { useSaveApplicationProfileField } from "../hooks";

interface AddJobTitleQuestionProps {
  field?: ApplicationProfileField;
}

export function AddJobTitleQuestion({ field }: AddJobTitleQuestionProps) {
  const [question, setQuestion] = useState<string>(field?.question || 'What is your job title?');
  const [required, setRequired] = useState<boolean>(field?.required || false);
  const { saveApplicationProfileField, loading } = useSaveApplicationProfileField();
  
  useEffect(() => {
    if (field) {
      setQuestion(field.question || 'What is your job title?');
      setRequired(field.required || false);
    }
  }, [field]);
  
  const handleSaveClick = () => {
    saveApplicationProfileField('job_title', required, question || 'What is your job title?');
  };
  
  return (
    <ModalContent
      title={'Add Question'}
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
            <i aria-hidden="true" className="icon-work size-4.5 text-tertiary" />
          </div>
          <div>
            <p className="text-sm text-secondary">Job Title</p>
            <p className="text-xs text-secondary">Ask for the guest's current job title or role</p>
          </div>
        </div>
        <hr className="border-t border-t-divider -mx-4" />
        <LabeledInput label="Question">
          <Input
            variant="outlined"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <p className="text-sm text-secondary">We'll automatically get this information from their profile if available.</p>
        </LabeledInput>
        <div className="flex items-center justify-between">
          <p className="text-sm text-secondary">Required</p>
          <Toggle
            id="required"
            checked={required}
            onChange={(value) => setRequired(value)}
          />
        </div>
        <Button 
          variant="secondary" 
          className="w-full"
          onClick={handleSaveClick}
          disabled={!question.trim()}
          loading={loading}
        >
          Add Question
        </Button>
      </div>
    </ModalContent>
  );
} 