"use client";

import React, { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordSchema, PasswordFormValues } from "../_schema/password.schema";
import { changePassword } from "../../_actions/userProfile";
import { toast } from "sonner";
import PasswordField from "./password-field";

import { useMutation } from "@tanstack/react-query";

export default function PasswordTab() {
  const [showPwd, setShowPwd] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const methods = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  const { handleSubmit, reset } = methods;

  const { mutate: updatePassword, isPending } = useMutation({
    mutationFn: (values: PasswordFormValues) => changePassword(values),
    onSuccess: (res) => {
      if (res?.status === true || res?.message === "Password changed") {
        toast.success("Password updated successfully!", {
          position: "top-right",
          duration: 3000,
        });
        reset();
      } else {
        toast.error(res?.message || "Failed to change password.", {
          position: "top-right",
          duration: 4000,
        });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "An unexpected error occurred. Please try again.", {
        position: "top-right",
        duration: 4000,
      });
    },
  });

  const onSubmit: SubmitHandler<PasswordFormValues> = (values) => {
    updatePassword(values);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-8 max-w-2xl"
      >
        <PasswordField<PasswordFormValues>
          label="Current Password"
          name="currentPassword"
          show={showPwd.current}
          onToggle={() =>
            setShowPwd((prev) => ({ ...prev, current: !prev.current }))
          }
        />
        <PasswordField<PasswordFormValues>
          label="New Password"
          name="newPassword"
          show={showPwd.new}
          onToggle={() =>
            setShowPwd((prev) => ({ ...prev, new: !prev.new }))
          }
        />
        <PasswordField<PasswordFormValues>
          label="Confirm New Password"
          name="confirmPassword"
          show={showPwd.confirm}
          onToggle={() =>
            setShowPwd((prev) => ({ ...prev, confirm: !prev.confirm }))
          }
        />

        <div className="pt-4 border-t border-gray-100 mt-4">
          <button
            type="submit"
            disabled={isPending}
            className={`w-full sm:w-auto min-w-[200px] py-4 px-8 text-sm font-semibold text-white rounded-sm transition-colors ${
              isPending
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isPending ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
