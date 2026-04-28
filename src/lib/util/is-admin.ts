import { getProfile } from "@/app/(dashboard)/_actions/userProfile";
import { TRole } from "../types/user";
import { USER_ROLES } from "@/lib/constants/api.constant";

export default async function isAdmin(): Promise<boolean> {
  const userProfileResponse = await getProfile();
  const role = userProfileResponse?.payload?.user?.role as TRole;
  const isAdmin: boolean =
    role === USER_ROLES.ADMIN || role === USER_ROLES.SUPER_ADMIN;
  return isAdmin;
}
