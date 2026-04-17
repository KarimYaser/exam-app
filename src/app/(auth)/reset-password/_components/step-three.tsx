import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useFormContext } from "react-hook-form";
import { forgetPasswordFormValues } from "../../forget-password/_schema/forget-password.schema";
import { resetPasswordAction } from "../_actions/reset-password.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    trigger,
    getValues,
    formState: { errors },
  } = useFormContext<forgetPasswordFormValues>();

  const { mutate: resetPassword, isPending } = useMutation({
    mutationFn: (values: any) => resetPasswordAction(values),
    onSuccess: (res) => {
      if (res.status) {
        toast.success(res.message || "Password reset successfully!", {
          duration: 3000,
          position: "top-right",
          className: "bg-green-500 text-white",
        });
        setTimeout(() => router.push("/login"), 2000);
      } else {
        toast.error(res.message || "Failed to reset password.", {
          duration: 3000,
          position: "top-right",
        });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "An unexpected error occurred. Please try again.", {
        duration: 3000,
        position: "top-right",
      });
    },
  });

  const handleSubmit = async () => {
    const isValid = await trigger(["newPassword", "confirmPassword"]);
    if (!isValid) return;

    const { newPassword, confirmPassword } = getValues();
    resetPassword({
      token,
      newPassword,
      confirmPassword,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Create a New Password
        </h2>
        <p className="text-sm font-medium text-gray-500 mt-2">
          Create a new strong password for your account.
        </p>
      </div>

      <div className="space-y-4">
        {/* New Password */}
        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            New Password
          </label>
          <div className="relative">
            <input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition pr-10"
              {...register("newPassword")}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              tabIndex={-1}
              onClick={() => setShowNewPassword((v) => !v)}
            >
              {showNewPassword ? (
                <Eye className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* Confirm New Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Confirm New Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition pr-10"
              {...register("confirmPassword")}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              tabIndex={-1}
              onClick={() => setShowConfirmPassword((v) => !v)}
            >
              {showConfirmPassword ? (
                <Eye className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isPending}
        className="w-full rounded-md bg-blue-600 py-2.5 px-4 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50"
      >
        {isPending ? "Resetting..." : "Reset Password"}
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
