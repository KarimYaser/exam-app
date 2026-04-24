import { notFound } from "next/navigation";
import { getDiplomas } from "@/app/(dashboard)/_actions/diplomas.actions";
import isAdmin from "@/lib/util/is-admin";
import Unauthorized from "@/app/unauthorized";
import EditDiplomaForm from "./_components/edit-diploma-form";
import isSuperAdmin from "@/lib/util/is-super-admin";

interface EditDiplomaPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDiplomaPage({ params }: EditDiplomaPageProps) {
  const isAdminUser = await isAdmin();
  const isSuperAdminUser =await isSuperAdmin()
  if (!isAdminUser && !isSuperAdminUser) {
    return <Unauthorized />;
  }

  const resolvedParams = await params;
  const diplomaId = resolvedParams.id;

  const diplomasResponse = await getDiplomas(1, 100);
  const diplomas = diplomasResponse?.payload?.data ?? [];
  const diploma = diplomas.find((item) => item.id === diplomaId);

  if (!diploma) {
    notFound();
  }

  return <EditDiplomaForm diploma={diploma} />;
}
