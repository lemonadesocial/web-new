import { EventApplicationQuestion, QuestionInput, QuestionType, SubmitEventApplicationQuestionsDocument, ApplicationProfileFieldInput, UpdateEventApplicationProfilesDocument, DecideUserJoinRequestsDocument, EventJoinRequestState } from "$lib/graphql/generated/backend/graphql";
import { useMutation } from "$lib/graphql/request";
import { useEvent, useUpdateEvent } from "./store";
import { modal, toast } from "$lib/components/core";

export function useSaveQuestion(applicationQuestion?: EventApplicationQuestion) {
  const event = useEvent();
  const updateEvent = useUpdateEvent();

  const questions = event?.application_questions || [];

  const [submitQuestions, { loading }] = useMutation(SubmitEventApplicationQuestionsDocument, {
    onComplete: (_, data) => {
      if (data?.submitEventApplicationQuestions) {
        updateEvent({
          application_questions: data.submitEventApplicationQuestions,
        });
        
        toast.success(applicationQuestion ? 'Question updated successfully!' : 'Question added successfully!');
        
        modal.close();
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to save question');
    },
  });

  const handleSave = async (values: QuestionInput) => {
    if (!event?._id) {
      toast.error('Event not found');
      return;
    }

    const existingQuestions: QuestionInput[] = questions.map(q => ({
      _id: q._id,
      question: q.question,
      required: q.required,
      position: q.position,
      type: q.type || QuestionType.Text,
      options: q.options,
      select_type: q.select_type,
    }));

    const newQuestions = [...existingQuestions];
    
    if (values._id) {
      const questionIndex = existingQuestions.findIndex(q => q._id === values._id);
      if (questionIndex !== -1) {
        newQuestions[questionIndex] = { ...values };
      }
    } else {
      newQuestions.push({ position: existingQuestions.length, ...values });
    }

    await submitQuestions({
      variables: {
        event: event._id,
        questions: newQuestions,
      },
    });
  };

  return {
    handleSave,
    loading,
  };
}

export function useSaveApplicationProfileField() {
  const event = useEvent();
  const updateEvent = useUpdateEvent();

  const [updateEventApplicationProfiles, { loading }] = useMutation(UpdateEventApplicationProfilesDocument, {
    onComplete: (_, data) => {
      if (data?.updateEvent) {
        updateEvent(data.updateEvent);
        toast.success("Application profile field saved successfully");
        modal.close();
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save application profile field");
    },
  });

  const saveApplicationProfileField = (field: string, required: boolean, question?: string) => {
    if (!event?._id) {
      toast.error("Event not found");
      return;
    }

    const existingFields = event?.application_profile_fields || [];
    
    const newField: ApplicationProfileFieldInput = {
      field,
      required,
      question: question || null,
    };

    let updatedFields: ApplicationProfileFieldInput[];

    const existingFieldIndex = existingFields.findIndex(f => f.field === field);
    
    if (existingFieldIndex !== -1) {
      updatedFields = existingFields.map((f, index) => 
        index === existingFieldIndex 
          ? { field: f.field, required, question: question || null }
          : { field: f.field, required: f.required, question: f.question }
      );
    } else {
      updatedFields = [
        ...existingFields.map(f => ({ 
          field: f.field, 
          required: f.required, 
          question: f.question 
        })),
        newField
      ];
    }

    updateEventApplicationProfiles({
      variables: {
        fields: updatedFields,
        id: event._id,
      },
    });
  };

  return {
    saveApplicationProfileField,
    loading,
  };
}

export function useEventRequest(event: string, onCompleted?: () => void) {
  const [decide, { loading }] = useMutation(DecideUserJoinRequestsDocument, {
    onComplete: (_, data) => {
      const processed = data.decideUserJoinRequests.every((r) => r.processed);
      if (processed) {
        toast.success('Update request successfully!');
        onCompleted?.();
      } else {
        toast.error('Update request failed!');
      }
    },
  });

  const approve = (requests: string[]) => {
    return decide({
      variables: {
        decision: EventJoinRequestState.Approved,
        event,
        requests
      }
    });
  };

  const decline = (requests: string[]) => {
    return decide({
      variables: {
        decision: EventJoinRequestState.Declined,
        event,
        requests
      }
    });
  };

  return { approve, decline, loading };
}
