import { useState } from "react";

import { Button, Input, LabeledInput, ModalContent, modal, Toggle } from "$lib/components/core";
import { EventApplicationQuestion, QuestionType } from "$lib/graphql/generated/backend/graphql";

import { AddQuestionModal } from "./AddQuestionModal";
import { useSaveQuestion } from "../hooks";

export function AddTextQuestion({ applicationQuestion }: { applicationQuestion?: EventApplicationQuestion }) {
  const [question, setQuestion] = useState<string>(applicationQuestion?.question || '');
  const [required, setRequired] = useState<boolean>(applicationQuestion?.required || false);
  const { handleSave, loading } = useSaveQuestion(applicationQuestion);
  
  return (
    <ModalContent
      title={applicationQuestion ? 'Edit Question' : 'Add Question'}
      className="w-[480px] max-w-full"
      onClose={() => modal.close()}
      onBack={applicationQuestion ? undefined : () => {
        modal.close();
        modal.open(AddQuestionModal);
      }}
    >
      <div className="space-y-4">
        <div className="flex gap-3 items-center">
          <div className="flex items-center justify-center p-2 rounded-sm bg-primary/8">
            <i className="icon-insert size-4.5 text-tertiary" />
          </div>
          <div>
            <p className="text-sm text-secondary">Text</p>
            <p className="text-xs text-secondary">Ask for a free-form response</p>
          </div>
        </div>
        <hr className="border-t border-t-divider -mx-4" />
        <LabeledInput label="Question">
          <Input
            variant="outlined"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
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
          onClick={async () => {
            if (!question.trim()) {
              return;
            }
            
            await handleSave({
              _id: applicationQuestion?._id,
              question: question.trim(),
              required,
              type: QuestionType.Text,
            });
          }}
          disabled={!question.trim()}
          loading={loading}
        >
          {applicationQuestion ? 'Update' : 'Add Question'}
        </Button>
      </div>
    </ModalContent>
  );
}
