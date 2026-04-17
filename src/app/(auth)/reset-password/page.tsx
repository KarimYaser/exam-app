"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ResetPasswordForm from "./_components/step-three";
import { toast } from "sonner";
import {
  resetPasswordSchema,
  ResetPasswordFormValues,
} from "./_schema/reset-password.schema";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get("token");

  const methods = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  // Redirect if no token present in URL
  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset link. Please request a new one.", {
        duration: 4000,
        position: "top-right",
      });
      router.replace("/forget-password");
    }
  }, [token, router]);

  if (!token) return null;

  return (
    <div className="w-full max-w-sm">
      <FormProvider {...methods}>
        <form>
          <ResetPasswordForm token={token} />
        </form>
      </FormProvider>
    </div>
  );
}
