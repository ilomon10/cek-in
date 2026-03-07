"use client";

import { Button } from "@repo/ui/components/ui/button";
import { Progress } from "@repo/ui/components/ui/progress";
import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@repo/ui/lib/utils";
import { isDev } from "@/components/hooks/utils";
import { TenantOnboardingStep1 } from "./tenant-onboarding.step-1";
import { TenantOnboardingStep2 } from "./tenant-onboarding.step-2";
import { TenantOnboardingStep3 } from "./tenant-onboarding.step-3";

const MAX_STEP = 3;

export const TenantOnboarding = () => {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<{
    name: string;
    email: string;
    phone: string;
    file: File | null;
  }>({
    name: "",
    email: "",
    phone: "",
    file: null,
  });

  const handleBackStep = () => {
    setStep((s) => {
      if (s > 0) return s - 1;
      return s;
    });
  };
  const handleNextStep = () => {
    setStep((s) => {
      if (s < MAX_STEP) return s + 1;
      return s;
    });
  };

  return (
    <div className="py-4 h-screen flex flex-col">
      <div className="flex items-center gap-2 px-2">
        <div>
          <Button
            variant={"ghost"}
            onClick={handleBackStep}
            disabled={!isDev && step === MAX_STEP - 1}
          >
            <ArrowLeftIcon />
          </Button>
        </div>

        <div className="grow">
          <Progress value={(100 / MAX_STEP) * (step + 1)} />
        </div>
      </div>
      <TenantOnboardingStep1
        className={cn(step != 0 && "hidden")}
        onSubmit={(value) => {
          handleNextStep();
          setValues((s) => ({ ...s, ...value }));
        }}
      />
      <TenantOnboardingStep2
        className={cn(step != 1 && "hidden")}
        onSubmit={(file) => {
          handleNextStep();
          setValues((s) => ({ ...s, file }));
        }}
      />

      <TenantOnboardingStep3
        isActive={step === 2}
        className={cn(step != 2 && "hidden")}
        values={values as any}
        onSubmit={() => {}}
      />
    </div>
  );
};
