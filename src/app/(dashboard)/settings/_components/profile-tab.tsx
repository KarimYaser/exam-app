"use client";

import { Edit3, Trash2, User } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileFormValues } from "../_schema/profile.schema";
import {
  deleteAccount,
  getProfile,
  updateProfile,
} from "../../_actions/userProfile";
import { uploadProfilePhoto } from "../_actions/upload-profile-photo";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { ImageUploadField } from "./image-upload-field";
import avatar from "../../../../../public/assets/user-photo.jpg";
import "intl-tel-input/styles";
import ChangeEmailModal from "./change-email-modal";

// intl-tel-input uses browser APIs — must be loaded client-side only
const IntlTelInput = dynamic(() => import("intl-tel-input/reactWithUtils"), {
  ssr: false,
});

export default function ProfileTab() {
  const { data: session, update } = useSession();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

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
    profilePhoto: session?.user?.image || null,
  };

  const { mutate: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: deleteAccount,
    onSuccess: (response) => {
      toast.success(response?.message || "Account deleted successfully!", {
        position: "top-right",
        duration: 3000,
      });
      queryClient.clear();
      signOut({ callbackUrl: "/login" });
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to delete account.", {
        position: "top-right",
        duration: 4000,
      });
    },
  });

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
      firstName: user?.firstName || "firstName",
      lastName: user?.lastName || "lastName",
      phone: (user?.phone || "").replace(/^\+20/, "0"),
      profilePhoto: user?.profilePhoto || null,
    },
    mode: "onBlur",
  });

  const profilePhoto = watch("profilePhoto");

  const onSubmit: SubmitHandler<ProfileFormValues> = async (values) => {
    await performUpdate({
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      profilePhoto: values.profilePhoto,
    });
  };

  const performUpdate = async (data: any) => {
    try {
      const response = await updateProfile(data);

      if (response?.status === true) {
        toast.success(response?.message || "Profile updated successfully!", {
          position: "top-right",
          duration: 3000,
        });

        await update({
          firstName: data.firstName,
          lastName: data.lastName,
          phone: "+20" + (data.phone || "").replace(/^0/, ""),
          image: data.profilePhoto,
        });

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

  const handlePhotoChange = (url: string | null) => {
    setValue("profilePhoto", url || "", {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <>
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-8 w-full"
    >
      {/* Profile Photo Section */}
      {/* Profile Photo Section */}
      <div className="flex flex-col items-center sm:items-start gap-4 p-4 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
        <div className="flex w-full items-center justify-between">
          <label className="text-sm font-semibold text-gray-700">
            Profile photo
          </label>
          <button
            type="button"
            onClick={() => {
              const input = document.querySelector(
                'input[type="file"]',
              ) as HTMLInputElement;
              input?.click();
            }}
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            Change photo
          </button>
        </div>
        <div className="flex flex-col justify-center items-center gap-3 w-full ">
          <ImageUploadField
            value={profilePhoto || ""}
            error={errors.profilePhoto?.message}
            onChange={handlePhotoChange}
            onRemove={() => handlePhotoChange(null)}
            onUploadingChange={(uploading) => setIsUploading(uploading)}
          />
          <p className="text-xs text-gray-400 text-center">
            JPG, GIF or PNG. Max size of 5MB.
          </p>
        </div>
      </div>

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

      {/* Username (read-only) */}
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

      {/* Email (read-only) */}
      <div className="flex flex-col gap-2 relative">
        <div className="flex justify-between items-center">
          <label className="text-sm font-semibold text-gray-700">Email</label>
          <button
            type="button"
            onClick={() => setIsEmailModalOpen(true)}
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
    
    <ChangeEmailModal 
      open={isEmailModalOpen} 
      onClose={() => setIsEmailModalOpen(false)} 
    />
    </>
  );
}
