"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import "intl-tel-input/styles";
import { ChevronRight } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { signupFormValues } from "../_schema/signup.schema";

// Dynamically import the IntlTelInput to disable Server-Side Rendering (SSR)
const IntlTelInput = dynamic(() => import("intl-tel-input/reactWithUtils"), {
  ssr: false,
});

interface StepThreeProps {
  onNext: () => void;
}

export default function StepThree({ onNext }: StepThreeProps): React.ReactNode {
  const {
    register,
    trigger,
    setValue,
    formState: { errors },
  } = useFormContext<signupFormValues>();

  const handleNext = async () => {
    // Validate only this step's fields
    // trigger is a function that validates the fields that are passed to it
    const isStepValid = await trigger([
      "firstName",
      "lastName",
      "username",
      "phone",
    ]);
    if (isStepValid) onNext();
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
        <p className="text-base font-semibold text-blue-600 mt-1">
          Tell us more about you
        </p>
      </div>

      {/* First & Last name */}
      <div className="grid grid-cols-2 gap-3">
        {/* First name */}
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            First name<span className="text-red-500">*</span>
          </label>
          <input
            id="firstName"
            type="text"
            {...register("firstName")}
            placeholder="Ahmed"
            className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>
        {/* Last name */}
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Last name<span className="text-red-500">*</span>
          </label>
          <input
            id="lastName"
            type="text"
            {...register("lastName")}
            placeholder="Abdullah"
            className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      {/* Username */}
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Username<span className="text-red-500">*</span>
        </label>
        <input
          id="username"
          type="text"
          {...register("username")}
          placeholder="user123"
          className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
        />
        {errors.username && (
          <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
        )}
      </div>

      {/* Phone */}
      <div className="">
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Phone<span className="text-red-500">*</span>
        </label>
        <div className="w-full [&_.iti]:w-full">
          <IntlTelInput
            onChangeNumber={(num) =>
              setValue("phone", num, { shouldValidate: true })
            }
            inputProps={{
              className:
                "w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition",
            }}
            initOptions={{
              initialCountry: "eg",
              separateDialCode: true,
            }}
          />
        </div>
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
        )}
      </div>

      <button
        type="button"
        onClick={handleNext}
        className="w-full flex items-center justify-center gap-2 rounded-md border border-blue-300 bg-blue-50 py-2.5 px-4 text-sm font-medium text-blue-700 hover:bg-blue-100 transition"
      >
        Next
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
