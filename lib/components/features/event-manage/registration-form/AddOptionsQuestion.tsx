import { useState } from "react";

import { Button, Input, LabeledInput, ModalContent, modal, Toggle, Segment, OptionsInput } from "$lib/components/core";
import { EventApplicationQuestion, QuestionType, SelectType } from "$lib/graphql/generated/backend/graphql";

import { AddQuestionModal } from "./AddQuestionModal";
import { useSaveQuestion } from "../hooks";

export function AddOptionsQuestion({ applicationQuestion }: { applicationQuestion?: EventApplicationQuestion }) {
  const [question, setQuestion] = useState<string>(applicationQuestion?.question || '');
  const [required, setRequired] = useState<boolean>(applicationQuestion?.required || false);
  const [options, setOptions] = useState<string[]>(applicationQuestion?.options || []);
  const [currentOption, setCurrentOption] = useState<string>('');
  const [selectType, setSelectType] = useState<SelectType>(applicationQuestion?.select_type || SelectType.Single);
  const { handleSave, loading } = useSaveQuestion(applicationQuestion);
  
  const handleAddOption = () => {
    if (currentOption.trim() && !options.includes(currentOption.trim())) {
      setOptions([...options, currentOption.trim()]);
      setCurrentOption('');
    }
  };

  const handleRemoveOption = (optionToRemove: string) => {
    setOptions(options.filter(option => option !== optionToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      handleAddOption();
    }
  };

  const isFormValid = question.trim() && options.length > 0;
  
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
            <i className="icon-checklist size-4.5 text-tertiary" />
          </div>
          <div>
            <p className="text-sm text-secondary">Options</p>
            <p className="text-xs text-secondary">Let the guest choose from a list of options</p>
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
        <LabeledInput label="Options">
         <OptionsInput
            value={options}
            onChange={setOptions}
          />
        </LabeledInput>
        <div className="space-y-2">
          <p className="text-sm text-secondary">Selection Type</p>
          <Segment
            items={[
              { value: SelectType.Single, label: 'Single', iconLeft: 'icon-list-check-3' },
              { value: SelectType.Multi, label: 'Multiple', iconLeft: 'icon-list-bulleted' }
            ]}
            selected={selectType}
            onSelect={(item) => setSelectType(item.value)}
            className="w-full"
          />
        </div>
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
            if (!isFormValid) {
              return;
            }
            
            await handleSave({
              _id: applicationQuestion?._id,
              question: question.trim(),
              required,
              type: QuestionType.Options,
              options,
              select_type: selectType,
            });
          }}
          disabled={!isFormValid}
          loading={loading}
        >
          {applicationQuestion ? 'Update' : 'Add Question'}
        </Button>
      </div>
    </ModalContent>
  );
}
