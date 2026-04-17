"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProfileTab from "./_components/profile-tab";
import PasswordTab from "./_components/password-tab";

function SettingsPageContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams?.get("tab") || "profile";

  return activeTab === "profile" ? <ProfileTab /> : <PasswordTab />;
}

export default function SettingsPage() {
  return (
    <Suspense fallback={null}>
      <SettingsPageContent />
    </Suspense>
  );
}
