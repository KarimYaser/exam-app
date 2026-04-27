"use client";

import React, { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { X } from "lucide-react";
import {
  requestEmailChange,
  confirmEmailChange,
} from "../../_actions/userProfile";
import { useSession } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  changeEmailSchema,
  ChangeEmailFormValues,
} from "../_schema/change-email.schema";

interface ChangeEmailModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ChangeEmailModal({
  open,
  onClose,
}: ChangeEmailModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [otp, setOtp] = useState<string[]>(Array<string>(6).fill(""));
  const [otpErrorMsg, setOtpErrorMsg] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { update } = useSession();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangeEmailFormValues>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: { newEmail: "" },
  });

  const newEmail = watch("newEmail");

  useEffect(() => {
    if (countdown <= 0 || step !== 2) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown, step]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (open) {
      setStep(1);
      reset();
      setOtp(Array<string>(6).fill(""));
      setOtpErrorMsg(null);
      setCountdown(60);
    }
  }, [open, reset]);

  const requestMutation = useMutation({
    mutationFn: (email: string) => requestEmailChange(email),
    onSuccess: (res) => {
      setStep(2);
      setOtpErrorMsg(null);
      setCountdown(60);
      setOtp(Array<string>(6).fill(""));
      toast.success(res.message || "Verification code sent.", {
        position: "top-right",
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to request email change.", {
        position: "top-right",
      });
    },
  });

  const confirmMutation = useMutation({
    mutationFn: (code: string) => confirmEmailChange(code),
    onSuccess: async (res) => {
      toast.success(res.message || "Email updated successfully.", {
        position: "top-right",
      });
      // Update session with new email
      await update({ email: newEmail });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      onClose();
    },
    onError: (error: Error) => {
      setOtpErrorMsg(
        error.message || "Invalid or expired OTP. Please try again.",
      );
      toast.error(error.message || "Invalid or expired OTP.", {
        position: "top-right",
      });
    },
  });

  const onSubmitRequest: SubmitHandler<ChangeEmailFormValues> = (data) => {
    requestMutation.mutate(data.newEmail);
  };

  const handleVerify = () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setOtpErrorMsg("Please enter the full 6-digit code.");
      return;
    }
    setOtpErrorMsg(null);
    confirmMutation.mutate(code);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input immediately
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]!.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1]!.focus();
    }
  };

  const handleResend = () => {
    requestMutation.mutate(newEmail);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-md bg-white rounded shadow-lg flex flex-col font-mono text-[14px]">
        {/* Header decoration and close button */}
        <div className="px-6 pt-6 pb-2 flex items-center justify-between">
          <div className="flex-1 flex items-center">
            <div className="w-2 h-2 rotate-45 bg-[#155DFC]"></div>
            <div className="flex-1 h-px border-t border-dashed border-[#155DFC]/30 mx-1"></div>
            <div className="w-1.5 h-1.5 rotate-45 border border-[#155DFC]"></div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-6">
          {/* Titles */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 font-sans">
              Change Email
            </h2>
            <p className="text-[#155DFC] font-semibold mt-1">
              {step === 1 ? "Enter your new email" : "Verify OTP"}
            </p>
          </div>

          {step === 1 ? (
            // --- STEP 1 ---
            <form
              onSubmit={handleSubmit(onSubmitRequest)}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="user@example.com"
                  {...register("newEmail")}
                  className={`w-full px-4 py-3 text-[14px] font-sans border rounded focus:outline-none focus:ring-2 focus:ring-[#155DFC]/20 focus:border-[#155DFC] transition-colors ${
                    errors.newEmail ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.newEmail && (
                  <p className="text-xs text-red-500">
                    {errors.newEmail.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={requestMutation.isPending || isSubmitting}
                className="w-full py-3 bg-[#155DFC] text-white font-medium rounded hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {requestMutation.isPending ? "Sending..." : "Next"}
                {!requestMutation.isPending && (
                  <span className="text-lg leading-none mt-0.5">›</span>
                )}
              </button>
            </form>
          ) : (
            // --- STEP 2 ---
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-[13px] text-gray-500 font-sans leading-relaxed">
                  Please enter the 6-digits code we have sent to: <br />
                  <span className="font-semibold text-gray-700">
                    {newEmail}
                  </span>
                  .{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setOtpErrorMsg(null);
                    }}
                    className="text-[#155DFC] font-medium hover:underline"
                  >
                    Edit
                  </button>
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 max-w-sm mx-auto w-full">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      inputRefs.current[i] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    className={`w-10 h-10 sm:w-12 sm:h-12 text-center rounded border text-base font-semibold outline-none transition-all ${
                      otpErrorMsg
                        ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                        : "border-gray-300 focus:ring-[#155DFC]/20 focus:border-[#155DFC]"
                    }`}
                  />
                ))}
              </div>

              {otpErrorMsg && (
                <p className="text-xs text-red-500 text-center">
                  {otpErrorMsg}
                </p>
              )}

              <p className="text-[13px] text-gray-500 text-center font-sans">
                {countdown > 0 ? (
                  <>
                    You can request another code in:{" "}
                    <span className="font-semibold text-gray-700">
                      {countdown}s
                    </span>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={requestMutation.isPending}
                    className="text-[#155DFC] hover:underline font-semibold disabled:opacity-50"
                  >
                    Resend code
                  </button>
                )}
              </p>

              <button
                type="button"
                onClick={handleVerify}
                disabled={confirmMutation.isPending || otp.some((d) => !d)}
                className="w-full py-3 bg-[#155DFC] text-white font-medium rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {confirmMutation.isPending ? "Verifying..." : "Verify Code"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
