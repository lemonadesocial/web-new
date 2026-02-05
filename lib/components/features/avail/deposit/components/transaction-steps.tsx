"use client";

import { AnimatedSpinner } from "../../ui/animated-spinner";
import { CheckIcon } from "./icons";

export interface SimplifiedStep {
  id: string;
  label: string;
  completed: boolean;
  /** If true, this step will be grouped with the next step (no separator, only gap) */
  groupWithNext?: boolean;
}

interface TransactionStepsProps {
  steps: SimplifiedStep[];
}

type StepStatus = "completed" | "in-progress" | "pending";

function getStepStatus(
  steps: SimplifiedStep[],
  stepIndex: number,
): StepStatus {
  const step = steps[stepIndex];
  if (step?.completed) return "completed";

  // Find the first incomplete step
  const firstIncompleteIndex = steps.findIndex((s) => !s.completed);
  if (stepIndex === firstIncompleteIndex) return "in-progress";

  return "pending";
}

export function TransactionSteps({ steps }: TransactionStepsProps) {
  // Group steps based on groupWithNext property
  const groupedSteps: SimplifiedStep[][] = [];
  let currentGroup: SimplifiedStep[] = [];

  steps.forEach((step) => {
    currentGroup.push(step);
    if (!step.groupWithNext) {
      groupedSteps.push(currentGroup);
      currentGroup = [];
    }
  });
  if (currentGroup.length > 0) {
    groupedSteps.push(currentGroup);
  }

  return (
    <div className="flex flex-col px-6">
      {groupedSteps.map((group, groupIndex) => {
        const isLastGroup = groupIndex === groupedSteps.length - 1;

        return (
          <div
            key={group[0].id}
            className={`${
              isLastGroup ? "pt-5" : "py-5"
            } flex flex-col gap-5 border-t`}
          >
            {group.map((step) => {
              const stepIndex = steps.findIndex((s) => s.id === step.id);
              const status = getStepStatus(steps, stepIndex);

              return (
                <div key={step.id} className="flex gap-4">
                  <div className="h-5 w-5 flex items-center justify-center">
                    {status === "completed" && (
                      <CheckIcon className="text-primary" />
                    )}
                    {status === "in-progress" && (
                      <AnimatedSpinner className="h-6 w-6 text-primary" />
                    )}
                    {status === "pending" && (
                      <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                    )}
                  </div>
                  <span className="font-sans text-card-foreground leading-5">
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
