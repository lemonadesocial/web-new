import { useState, useEffect } from "react";

import { Button, Input, LabeledInput, ModalContent, modal, Toggle, Select } from "$lib/components/core";
import { ApplicationProfileField } from "$lib/graphql/generated/backend/graphql";

import { AddQuestionModal } from "./AddQuestionModal";
import { useSaveApplicationProfileField } from "../hooks";

const PLATFORM_OPTIONS = ['X (Twitter)', 'LinkedIn', 'Farcaster', 'Instagram', 'Github', 'Calendly'];

const FIELD_CONFIG: Record<string, { field: string; defaultQuestion: string }> = {
  'X (Twitter)': { field: 'handle_twitter', defaultQuestion: 'What is your X (Twitter) handle?' },
  'LinkedIn': { field: 'handle_linkedin', defaultQuestion: 'What is your LinkedIn profile?' },
  'Farcaster': { field: 'handle_farcaster', defaultQuestion: 'What is your Farcaster handle?' },
  'Instagram': { field: 'handle_instagram', defaultQuestion: 'What is your Instagram username?' },
  'Github': { field: 'handle_github', defaultQuestion: 'What is your Github username?' },
  'Calendly': { field: 'calendly_url', defaultQuestion: 'What is your Calendly URL?' }
};

interface AddSocialProfileQuestionProps {
  field?: ApplicationProfileField;
}

export function AddSocialProfileQuestion({ field }: AddSocialProfileQuestionProps) {
  const getInitialPlatform = () => {
    if (!field) return PLATFORM_OPTIONS[0];
    
    const fieldConfig = Object.entries(FIELD_CONFIG).find(([_, config]) => config.field === field.field);
    return fieldConfig ? fieldConfig[0] : PLATFORM_OPTIONS[0];
  };

  const getInitialQuestion = () => {
    if (field?.question) return field.question;
    
    const platform = getInitialPlatform();
    return FIELD_CONFIG[platform]?.defaultQuestion || PLATFORM_OPTIONS[0];
  };

  const [question, setQuestion] = useState<string>(getInitialQuestion());
  const [required, setRequired] = useState<boolean>(field?.required || false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>(getInitialPlatform());
  const { saveApplicationProfileField, loading } = useSaveApplicationProfileField();
  
  useEffect(() => {
    if (field) {
      const platform = getInitialPlatform();
      setSelectedPlatform(platform);
      setQuestion(field.question || FIELD_CONFIG[platform]?.defaultQuestion || platform);
      setRequired(field.required || false);
    }
  }, [field]);
  
  const handleSaveClick = () => {
    const fieldConfig = FIELD_CONFIG[selectedPlatform];
    if (!fieldConfig) {
      return;
    }
    
    const questionText = question || fieldConfig.defaultQuestion || selectedPlatform;
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
            <i className="icon-account size-4.5 text-tertiary" />
          </div>
          <div>
            <p className="text-sm text-secondary">Social Profile</p>
            <p className="text-xs text-secondary">Ask for a social network username</p>
          </div>
        </div>
        <hr className="border-t border-t-divider -mx-4" />
        <LabeledInput label="Platform">
          <Select
            value={selectedPlatform}
            onChange={(value) => {
              const newPlatform = value || '';
              setSelectedPlatform(newPlatform);
              const fieldConfig = FIELD_CONFIG[newPlatform];
              if (fieldConfig) {
                setQuestion(fieldConfig.defaultQuestion);
              }
            }}
            options={PLATFORM_OPTIONS}
            placeholder="Select platform"
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
          disabled={!selectedPlatform.trim()}
          loading={loading}
        >
          {'Add Question'}
        </Button>
      </div>
    </ModalContent>
  );
}
