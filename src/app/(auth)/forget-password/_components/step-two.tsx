import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useFormContext } from "react-hook-form";
import { forgetPasswordFormValues } from "../_schema/forget-password.schema";

interface StepTwoProps {
  onBack: () => void;
}

export default function StepTwo({ onBack }: StepTwoProps) {
  const { getValues } = useFormContext<forgetPasswordFormValues>();
  const email =
    getValues("email"); /* this is the email that the user will enter */

  return (
    <div className="flex flex-col gap-8">
      <button
        type="button"
        onClick={onBack}
        className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Password Reset Sent
        </h2>

        <div className="mt-4 space-y-4 text-sm font-medium text-gray-700">
          <p>
            We have sent a password reset link to:
            <br />
            <span className="text-blue-600">{email}</span>.
          </p>

          <p>
            Please check your inbox and follow the instructions to reset your
            password.
          </p>
        </div>

        <p className="text-sm text-gray-400 mt-6 leading-relaxed">
          If you don&apos;t see the email within a few minutes, check your spam
          or junk folder.
        </p>
      </div>

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
