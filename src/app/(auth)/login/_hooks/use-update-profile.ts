// import 'client-only';

import { updateProfileAction } from "@/lib/api/user/user.api";
import { useMutation } from "@tanstack/react-query";

export default function useUpdateProfile() {
  const { isPending, error, mutate } = useMutation({
    mutationFn: updateProfileAction,
    onSuccess: (data) => {
      // console.log(data);
    },
    onError: (error) => {
      // console.error(error);
    },
  });

  return {
    isPending,
    error,
    updateProfile: mutate,
  };
}
