"use client";

import { useState } from "react";
import StepOne from "./_components/step-one";
import StepTwo from "./_components/step-two";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgetPasswordFormValues,
  forgetPasswordSchema,
} from "./_schema/forget-password.schema";

export default function ForgetPasswordPage() {
  const [step, setStep] = useState<number>(1);

  const methods = useForm<forgetPasswordFormValues>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  const next = () => setStep((s) => Math.min(s + 1, 3));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="w-full max-w-sm">
      <FormProvider {...methods}>
        <form>
          {step === 1 && <StepOne onNext={next} />}
          {step === 2 && <StepTwo onBack={back} />}
        </form>
      </FormProvider>
    </div>
  );
}
