import * as React from 'react';
import { useForm, Controller, Control, FieldErrors } from 'react-hook-form';
import { sortBy } from 'lodash';

import { Input, SelectController, MultiSelectController } from '$lib/components/core';
import {
  formInstancesAtom,
  submitHandlersAtom,
  useAtomValue,
  useSetAtom,
  eventDataAtom
} from '../store';
import { EventApplicationAnswerInput, EventApplicationQuestion, SubmitEventApplicationAnswersDocument } from '$lib/graphql/generated/backend/graphql';
import { useMutation } from '$lib/graphql/request';

interface ApplicationFormValues {
  [key: string]: string | string[];
}

export function ApplicationForm() {
  const event = useAtomValue(eventDataAtom);

  const setFormInstances = useSetAtom(formInstancesAtom);
  const setSubmitHandlers = useSetAtom(submitHandlersAtom);

  const questions = event.application_questions || [];

  const initialValues = React.useMemo(() => {
    return questions.reduce((acc, question) => {
      acc[question._id] = question.type === 'options' && question.select_type === 'multi'
        ? []
        : '';
      return acc;
    }, {} as ApplicationFormValues);
  }, [questions]);

  const form = useForm<ApplicationFormValues>({
    defaultValues: initialValues
  });

  const { control, formState: { errors } } = form;

  const [submitEventApplication] = useMutation(SubmitEventApplicationAnswersDocument);

  const onSubmit = (data: ApplicationFormValues) => {
    const answers = questions.map(question => ({
      question: question._id,
      answer: question.type === 'text' ? data[question._id] : undefined,
      answers: question.type === 'options' ? data[question._id] : undefined
    }));

    submitEventApplication({
      variables: {
        event: event._id,
        answers: answers as EventApplicationAnswerInput[]
      }
    });
  };

  React.useEffect(() => {
    setFormInstances(prev => ({ ...prev, application: form }));
    setSubmitHandlers(prev => ({ ...prev, application: onSubmit }));
  }, []);

  if (!questions?.length) return null;

  return (
    <div className="flex flex-col gap-6">
      {sortBy(questions, ['position']).map((question) => (
        <div key={question._id} className="flex flex-col gap-3">
          {question.question && (
            <div className="text-sm font-medium">
              {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </div>
          )}

          {renderQuestionField(question, control, errors)}
        </div>
      ))}
    </div>
  );
}

function renderQuestionField(
  question: EventApplicationQuestion,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<ApplicationFormValues, any>,
  errors: FieldErrors<ApplicationFormValues>
) {
  switch (question.type) {
    case 'text':
      return (
        <Controller
          name={question._id}
          control={control}
          rules={{ required: !!question.required }}
          render={({ field }) => (
            <Input
              {...field}
              error={!!errors[question._id]}
            />
          )}
        />
      );
    case 'options':
      if (question.select_type === 'multi') {
        return (
          <MultiSelectController
            name={question._id}
            control={control}
            options={question.options || []}
            placeholder="Select options"
            error={errors[question._id]}
            required={!!question.required}
          />
        );
      } else {
        return (
          <SelectController
            name={question._id}
            control={control}
            options={question.options || []}
            placeholder="Select an option"
            error={errors[question._id]}
            required={!!question.required}
          />
        );
      }
    default:
      return null;
  }
}
