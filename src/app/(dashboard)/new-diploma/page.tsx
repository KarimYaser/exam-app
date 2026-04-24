import isAdmin from "@/lib/util/is-admin";
import NewDiplomaForm from "./_components/new-diploma-form";
import Unauthorized from "../unauthorized";
import isSuperAdmin from "@/lib/util/is-super-admin";

export default async function Page() {
  const isAdminUser = await isAdmin();
  const isSuperAdminUser = await isSuperAdmin();
  if (!isAdminUser && !isSuperAdminUser ) {
    return <Unauthorized />;
  }
  return <NewDiplomaForm />;
}
