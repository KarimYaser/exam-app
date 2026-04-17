"use client";

import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { signupFormValues, signupSchema } from "./_schema/signup.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupAction } from "./_actions/signup.actions";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import StepIndicator from "./_components/step-indicator";
import StepOne from "./_components/step-one";
import StepTwo from "./_components/step-two";
import StepThree from "./_components/step-three";
import StepFour from "./_components/step-four";
import { toast } from "sonner";

const TOTAL_STEPS = 4;

export default function SignupPage(): React.ReactNode {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [apiError, setApiError] = useState<string | null>(null);
  const next = (): void => setStep((s: number) => Math.min(s + 1, TOTAL_STEPS));
  const back = (): void => setStep((s: number) => Math.max(s - 1, 1));

  const methods = useForm<signupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
    mode: "onBlur",
  });

  // useMutation: mutationFn receives the form values and calls the server action
  const {
    mutate: signup,
    isPending,
    error,
  } = useMutation({
    mutationFn: (values: signupFormValues) => signupAction(values),
    onSuccess: (response) => {
      if (response?.success) {
        toast.success(
          response.message ||
            "Registration successful. Redirecting to login...",
          {
            duration: 3000,
            position: "top-right",
            className: "bg-green-500 text-white",
          },
        );
        console.log(response);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        // Map field-level errors back into the form
        if (response?.errors) {
          Object.keys(response.errors).forEach((key) => {
            methods.setError(key as keyof signupFormValues, {
              message: response.errors![key],
            });
          });
        }
        const msg =
          response?.message ||
          "Registration failed. Please check your details.";
        setApiError(msg);
        toast.error(msg, { position: "top-right", duration: 4000 });
      }
    },
    onError: (error: Error) => {
      const msg =
        error.message || "An unexpected error occurred. Please try again.";
      setApiError(msg);
      toast.error(msg, { position: "top-right", duration: 4000 });
    },
  });

  // onSubmit is now synchronous — just triggers the mutation
  const onSubmit: SubmitHandler<signupFormValues> = (values) => {
    setApiError(null);

    signup(values);
  };

  return (
    <div className="w-full max-w-sm">
      {/* Only show the step indicator from step 2 onward */}
      {step > 1 && (
        <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} />
      )}

      {apiError && step === 4 && (
        <p className="text-red-500 text-sm mb-3 text-center">{apiError}</p>
      )}

      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit, (errs) =>
            console.error("[Zod validation errors - submit blocked]", errs),
          )}
          className="w-full"
        >
          {step === 1 && <StepOne onNext={next} />}
          {step === 2 && <StepTwo onNext={next} onBack={back} />}
          {step === 3 && <StepThree onNext={next} />}
          {step === 4 && <StepFour onBack={back} isPending={isPending} />}
        </form>
      </FormProvider>
    </div>
  );
}
