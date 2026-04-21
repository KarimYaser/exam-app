import isAdmin from "@/lib/util/is-admin";
import NewDiplomaForm from "./_components/new-diploma-form";
import Unauthorized from "../unauthorized";

export default async function Page() {
  const isAdminUser = await isAdmin();
  if (!isAdminUser) {
    return <Unauthorized />;
  }
  return <NewDiplomaForm />;
}
