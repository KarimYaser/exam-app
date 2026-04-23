import { getProfile } from "@/app/(dashboard)/_actions/userProfile";
import { USER_ROLES } from "@/lib/constants/api.constant";

export default async function isSuperAdmin(): Promise<boolean> {
  const userProfileResponse = await getProfile();
  const role = userProfileResponse?.payload?.user?.role as string;
  const isSuperAdmin: boolean = role === USER_ROLES.SUPER_ADMIN;
  return isSuperAdmin;
}
