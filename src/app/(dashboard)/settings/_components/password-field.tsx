"use client";

import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { useFormContext, FieldPath, FieldValues } from "react-hook-form";

interface PasswordFieldProps<T extends FieldValues> {
  label: string;
  name: FieldPath<T>;
  show: boolean;
  onToggle: () => void;
}

export default function PasswordField<T extends FieldValues>({
  label,
  name,
  show,
  onToggle,
}: PasswordFieldProps<T>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();

  const error = errors[name];

  return (
    <div className="flex flex-col gap-2 relative">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          {...register(name)}
          placeholder="••••••••"
          className={`w-full px-4 py-3 border rounded-sm text-sm focus:outline-none focus:border-blue-500 pr-12 bg-white ${
            error ? "border-red-400" : "border-gray-200"
          }`}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1">
          {error.message as string}
        </p>
      )}
    </div>
  );
}
