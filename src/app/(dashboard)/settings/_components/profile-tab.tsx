"use client";

import { Edit3 } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileFormValues } from "../_schema/profile.schema";
import {
  deleteAccount,
  getProfile,
  updateProfile,
} from "../../_actions/userProfile";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import "intl-tel-input/styles";

// intl-tel-input uses browser APIs — must be loaded client-side only
const IntlTelInput = dynamic(() => import("intl-tel-input/reactWithUtils"), {
  ssr: false,
});

export default function ProfileTab() {
  const { data: session, update } = useSession();
  const queryClient = useQueryClient();

  const { mutate: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: deleteAccount,
    onSuccess: (response) => {
      toast.success(response?.message || "Account deleted successfully!", {
        position: "top-right",
        duration: 3000,
      });
      queryClient.clear();
      // Sign out clears the NextAuth client session state and redirects to /login
      signOut({ callbackUrl: "/login" });
    },

    onError: (error: Error) => {
      toast.error(error?.message || "Failed to delete account.", {
        position: "top-right",
        duration: 4000,
      });
    },
  });

  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: getProfile,
  });
  const user = userData?.payload?.user ?? {
    firstName: session?.user?.firstName || "firstName",
    lastName: session?.user?.lastName || "lastName",
    phone: session?.user?.phone || "+20123456789",
    username: session?.user?.username || "username",
    email: session?.user?.email || "email",
  };
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    // `values` (not defaultValues) is reactive — updates the form whenever query data changes
    values: {
      firstName: user?.firstName || "firstName",
      lastName: user?.lastName || "lastName",
      // Replace +20 with 0 if present: +201016832985 → 01016832985
      phone: (user?.phone || "").replace(/^\+20/, "0"),
    },
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<ProfileFormValues> = async (values) => {
    try {
      const response = await updateProfile({
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone, // already in 01XXXXXXXXX format
      });
      // console.log(response);
      if (response?.status === true) {
        toast.success(response?.message || "Profile updated successfully!", {
          position: "top-right",
          duration: 3000,
        });

        // Push the new values into the NextAuth JWT (triggers useSession to update everywhere)
        await update({
          firstName: values.firstName,
          lastName: values.lastName,
          phone: "+20" + values.phone.replace(/^0/, ""),
        });
        // Refresh the React Query cache so sidebar & profile-tab show fresh API data
        // queryClient.invalidateQueries({ queryKey: ["user"] });
        queryClient.refetchQueries({ queryKey: ["user"] });
      } else {
        toast.error(response?.message || "Failed to update profile.", {
          position: "top-right",
          duration: 4000,
        });
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.", {
        position: "top-right",
        duration: 4000,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-8 max-w-2xl"
    >
      {/* Name Row */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col gap-2 flex-1">
          <label className="text-sm font-semibold text-gray-700">
            First name
          </label>
          <input
            type="text"
            {...register("firstName")}
            className={`px-4 py-3 border rounded-sm text-sm focus:outline-none focus:border-blue-500 bg-white ${
              errors.firstName ? "border-red-400" : "border-gray-200"
            }`}
          />
          {errors.firstName && (
            <p className="text-xs text-red-500 mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <label className="text-sm font-semibold text-gray-700">
            Last name
          </label>
          <input
            type="text"
            {...register("lastName")}
            className={`px-4 py-3 border rounded-sm text-sm focus:outline-none focus:border-blue-500 bg-white ${
              errors.lastName ? "border-red-400" : "border-gray-200"
            }`}
          />
          {errors.lastName && (
            <p className="text-xs text-red-500 mt-1">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      {/* Username (read-only, not part of form) */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-700">Username</label>
        <input
          type="text"
          readOnly
          placeholder="username"
          value={user.username}
          className="px-4 py-3 border border-gray-200 bg-gray-50 rounded-sm text-sm text-gray-500 cursor-not-allowed outline-none"
        />
      </div>

      {/* Email (read-only, not part of form) */}
      <div className="flex flex-col gap-2 relative">
        <div className="flex justify-between items-center">
          <label className="text-sm font-semibold text-gray-700">Email</label>
          <button
            type="button"
            className="text-blue-600 text-sm flex items-center gap-1.5 hover:underline pointer-events-auto font-semibold"
          >
            <Edit3 size={14} /> Change
          </button>
        </div>
        <input
          type="email"
          readOnly
          placeholder="email"
          value={user.email}
          className="px-4 py-3 border border-gray-200 rounded-sm text-sm text-gray-500 w-full outline-none bg-gray-50 cursor-not-allowed"
        />
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-2">
        <label htmlFor="phone" className="text-sm font-semibold text-gray-700">
          Phone
        </label>
        <div className="w-full [&_.iti]:w-full">
          <IntlTelInput
            initialValue={user?.phone || ""}
            onChangeNumber={(num) =>
              setValue("phone", num.replace(/^\+20/, "0"), {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            inputProps={{
              id: "phone",
              className: `w-full px-4 py-3 border rounded-sm text-sm focus:outline-none focus:border-blue-500 bg-white ${
                errors.phone ? "border-red-400" : "border-gray-200"
              }`,
            }}
            initOptions={{
              initialCountry: "eg",
              separateDialCode: true,
            }}
          />
        </div>
        {errors.phone && (
          <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100 mt-4">
        <button
          onClick={() => deleteUser()}
          disabled={isDeleting}
          type="button"
          className="cursor-pointer flex-1 py-4 px-6 text-sm font-semibold text-red-500 bg-[#fff5f5] hover:bg-red-50 rounded-sm transition-colors text-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? "Deleting..." : "Delete My Account"}
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className={`flex-[1.5] py-4 px-6 text-sm font-semibold text-white rounded-sm transition-colors text-center ${
            isSubmitting || !isDirty
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
