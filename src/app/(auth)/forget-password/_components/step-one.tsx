import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useFormContext } from "react-hook-form";
import { forgetPasswordFormValues } from "../_schema/forget-password.schema";
import { forgetPasswordAction } from "../_actions/forget-password.actions";
import { toast } from "sonner";

import { useMutation } from "@tanstack/react-query";

interface StepOneProps {
  onNext: () => void;
}

export default function StepOne({ onNext }: StepOneProps) {
  const {
    register,
    formState: { errors },
    trigger,
    getValues,
  } = useFormContext<forgetPasswordFormValues>();

  const { mutate: sendCode, isPending } = useMutation({
    mutationFn: (email: string) => forgetPasswordAction({ email }),
    onSuccess: (res) => {
      if (res.status) {
        toast.success(res.message || "Password reset code sent to your email.", {
          duration: 3000,
          position: "top-right",
          className: "bg-green-500 text-white",
        });
        onNext();
      } else {
        toast.error(res.message || "Failed to send password reset code.", {
          duration: 3000,
          position: "top-right",
          className: "bg-red-500 text-white",
        });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "An unexpected error occurred.", {
        duration: 3000,
        position: "top-right",
      });
    },
  });

  const handleNext = async () => {
    // Validate email explicitly
    const isStepValid = await trigger(["email"]);
    if (isStepValid) {
      const email = getValues("email");
      sendCode(email);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Forgot Password</h2>
        <p className="text-sm font-medium text-gray-500 mt-2 leading-relaxed">
          Don&apos;t worry, we will help you recover your account.
        </p>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="user@example.com"
          className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <button
        type="button"
        onClick={handleNext}
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 rounded-md bg-blue-600 py-2.5 px-4 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50"
      >
        {isPending ? "Sending Code..." : "Next"}
        {!isPending && <ChevronRight className="w-4 h-4" />}
      </button>

      <p className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-blue-600 hover:text-blue-700 transition"
        >
          Create yours
        </Link>
      </p>
    </div>
  );
}
