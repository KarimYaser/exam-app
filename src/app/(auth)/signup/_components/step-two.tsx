import React, { useState, useRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { signupFormValues } from "../_schema/signup.schema";
import { verifyCode, sendVerificationCode } from "../_actions/signup.actions";

interface StepTwoProps {
  onNext: () => void;
  onBack: () => void;
}

export default function StepTwo({
  onNext,
  onBack,
}: StepTwoProps): React.ReactNode {
  const [loading, setLoading] = useState<boolean>(false);
  const [otp, setOtp] = useState<string[]>(Array<string>(6).fill(""));
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { getValues } = useFormContext<signupFormValues>();
  const email = getValues("email");

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

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
    // If user hits Backspace on an empty field, focus the previous field backward
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1]!.focus();
    }
  };

  const handleResend = async () => {
    setLoading(true);
    const res = await sendVerificationCode(email);
    setLoading(false);
    if (res.success) {
      setOtp(Array<string>(6).fill(""));
      setErrorMsg(null);
      setCountdown(60);
      toast(res.message || "Verification code resent.", {
        duration: 3000,
        position: "top-right",
        className: "bg-green-500 text-white",
      });
    } else {
      toast(res.message || "Failed to resend code. Please try again.", {
        duration: 3000,
        position: "top-right",
        className: "bg-red-500 text-white",
      });
    }
  };

  const handleVerify = async () => {
    const code =
      otp.join(""); /* this joins the otp array into a string to be one string*/
    if (code.length !== 6) {
      setErrorMsg("Please enter the full 6-digit code.");
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    const res = await verifyCode(email, code);
    setLoading(false);
    console.log("[OTP verify response]", res);

    if (res.success) {
      onNext();
      toast(res.message || "OTP verified successfully.", {
        duration: 3000,
        position: "top-right",
        className: "bg-green-500 text-white",
      });
    } else {
      setErrorMsg(res.message || "Invalid or expired OTP. Please try again.");
      toast(res.message || "Invalid or expired OTP. Please try again.", {
        duration: 3000,
        position: "top-right",
        className: "bg-red-500 text-white",
      });
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
        <p className="text-base font-semibold text-blue-600 mt-1">Verify OTP</p>
        <p className="text-sm text-gray-500 mt-1">
          Please enter the 6-digit code we have sent to:{" "}
          <span className="font-medium text-gray-700">
            {email || "your email"}
          </span>{" "}
          <button
            type="button"
            onClick={onBack}
            className="text-blue-600 hover:underline text-sm"
          >
            Edit
          </button>
        </p>
      </div>

      {/* OTP inputs */}
      <div className="flex items-center gap-3 justify-between">
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
            className={`w-10 h-10 text-center rounded-md 
              border text-sm font-semibold outline-none
              border-gray-200 focus:border-blue-500 focus:ring-2
              focus:ring-blue-500/20 transition`}
          />
        ))}
      </div>

      {errorMsg && <p className="text-red-500 text-xs">{errorMsg}</p>}

      <p className="text-sm text-gray-500 mt-2">
        {countdown > 0 ? (
          <>
            You can request another code in:{" "}
            <span className="font-medium text-gray-700">{countdown}s</span>
          </>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={loading}
            className="text-blue-600 hover:underline font-medium disabled:opacity-50"
          >
            Resend code
          </button>
        )}
      </p>

      <button
        type="button"
        onClick={handleVerify}
        disabled={loading}
        className="w-full flex items-center justify-center rounded-md border border-blue-300 bg-blue-50 py-2.5 px-4 text-sm font-medium text-blue-700 hover:bg-blue-100 transition disabled:opacity-50"
      >
        {loading ? "Verifying..." : "Verify Code"}
      </button>
    </div>
  );
}
