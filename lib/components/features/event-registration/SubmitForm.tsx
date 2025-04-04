import { UseFormReturn } from "react-hook-form";
import { formInstancesAtom, submitHandlersAtom, useAtom } from "./store";

export function SubmitForm({ children, onComplete }: { children: (handleSubmit: () => Promise<void>) => React.ReactNode, onComplete?: () => void }) {
  const [formInstances] = useAtom(formInstancesAtom);
  const [submitHandlers] = useAtom(submitHandlersAtom);

  const handleSubmitAll = async (): Promise<void> => {
    console.log('submit');
    const formKeys: string[] = Object.keys(formInstances);
    if (formKeys.length === 0) {
      onComplete?.();
      return;
    }

    const forms: UseFormReturn<any>[] = Object.values(formInstances);

    const isValid: boolean[] = await Promise.all(forms.map(form => form.trigger()));

    if (isValid.every(Boolean)) {
      formKeys.forEach(key => {
        const form = formInstances[key];
        const handler = submitHandlers[key];
        if (form && handler) {
          const data = form.getValues();
          handler(data);
        }
      });

      onComplete?.();
    }
  };

  return children(handleSubmitAll);
}
