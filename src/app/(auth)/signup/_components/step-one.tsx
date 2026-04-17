import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { signupFormValues } from "../_schema/signup.schema";
import { sendVerificationCode } from "../_actions/signup.actions";

interface StepOneProps {
  onNext: () => void;
}

export default function StepOne({ onNext }: StepOneProps) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    trigger,
    getValues,
    formState: { errors },
  } = useFormContext<signupFormValues>();

  const handleNext = async () => {
    // Validate email explicitly
    const isStepValid = await trigger(["email"]);
    if (isStepValid) {
      setLoading(true);
      const email = getValues("email");
      const res = await sendVerificationCode(email);
      setLoading(false);

      if (res.success) {
        toast(res.message || "Verification code sent to your email.", {
          duration: 3000,
          position: "top-right",
          className: "bg-green-500 text-white",
        });
        onNext();
      } else {
        toast(res.message || "Failed to send code.", {
          duration: 3000,
          position: "top-right",
          className: "bg-red-500 text-white",
        });
      }
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>

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
          {...register("email")}
          placeholder="user@example.com"
          className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <button
        type="button"
        onClick={handleNext}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-md border border-blue-300 bg-blue-50 py-2.5 px-4 text-sm font-medium text-blue-700 hover:bg-blue-100 transition disabled:opacity-50"
      >
        {loading ? "Sending Code..." : "Next"}
        {!loading && <ChevronRight size={18} />}
      </button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-blue-600 hover:text-blue-700 transition"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
