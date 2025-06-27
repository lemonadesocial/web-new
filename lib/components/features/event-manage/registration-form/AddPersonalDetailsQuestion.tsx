import { useState, useEffect } from "react";

import { Button, Input, LabeledInput, ModalContent, modal, Toggle, Select } from "$lib/components/core";
import { ApplicationProfileField } from "$lib/graphql/generated/backend/graphql";

import { AddQuestionModal } from "./AddQuestionModal";
import { useSaveApplicationProfileField } from "../hooks";

const INFO_OPTIONS = ['Bio', 'Location', 'Pronouns'];

const FIELD_CONFIG: Record<string, { field: string; defaultQuestion: string }> = {
  'Bio': { field: 'description', defaultQuestion: 'Tell us about yourself' },
  'Location': { field: 'location_line', defaultQuestion: 'Where are you based?' },
  'Pronouns': { field: 'pronoun', defaultQuestion: 'What are your pronouns?' }
};

interface AddPersonalDetailsQuestionProps {
  field?: ApplicationProfileField;
}

export function AddPersonalDetailsQuestion({ field }: AddPersonalDetailsQuestionProps) {
  const getInitialInfoType = () => {
    if (!field) return INFO_OPTIONS[0];
    
    const fieldConfig = Object.entries(FIELD_CONFIG).find(([_, config]) => config.field === field.field);
    return fieldConfig ? fieldConfig[0] : INFO_OPTIONS[0];
  };

  const getInitialQuestion = () => {
    if (field?.question) return field.question;
    
    const infoType = getInitialInfoType();
    return FIELD_CONFIG[infoType]?.defaultQuestion || INFO_OPTIONS[0];
  };

  const [question, setQuestion] = useState<string>(getInitialQuestion());
  const [required, setRequired] = useState<boolean>(field?.required || false);
  const [selectedInfoType, setSelectedInfoType] = useState<string>(getInitialInfoType());
  const { saveApplicationProfileField, loading } = useSaveApplicationProfileField();
  
  useEffect(() => {
    if (field) {
      const infoType = getInitialInfoType();
      setSelectedInfoType(infoType);
      setQuestion(field.question || FIELD_CONFIG[infoType]?.defaultQuestion || infoType);
      setRequired(field.required || false);
    }
  }, [field]);
  
  const handleSaveClick = () => {
    const fieldConfig = FIELD_CONFIG[selectedInfoType];
    if (!fieldConfig) {
      return;
    }
    
    const questionText = question || fieldConfig.defaultQuestion || selectedInfoType;
    saveApplicationProfileField(fieldConfig.field, required, questionText);
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
            <i className="icon-info size-4.5 text-tertiary" />
          </div>
          <div>
            <p className="text-sm text-secondary">Personal Details</p>
            <p className="text-xs text-secondary">Ask for info to better understand your guests </p>
          </div>
        </div>
        <hr className="border-t border-t-divider -mx-4" />
        <LabeledInput label="Info Type">
          <Select
            value={selectedInfoType}
            onChange={(value) => {
              const newInfoType = value || '';
              setSelectedInfoType(newInfoType);
              const fieldConfig = FIELD_CONFIG[newInfoType];
              if (fieldConfig) {
                setQuestion(fieldConfig.defaultQuestion);
              }
            }}
            options={INFO_OPTIONS}
            placeholder="Select info type"
            removeable={false}
            disabled={!!field}
          />
        </LabeledInput>
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
          disabled={!selectedInfoType.trim()}
          loading={loading}
        >
          {'Add Question'}
        </Button>
      </div>
    </ModalContent>
  );
}
