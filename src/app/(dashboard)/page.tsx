import { Suspense } from "react";
import DiplomasSection from "./_components/diplomas-section";
import Loading from "./loading";
import ErrorBoundary from "@/components/shared/error-boundary";

export default function DashboardPage() {
  return (
    <>
      <ErrorBoundary fallback={<Loading />}>
        {/* <Suspense fallback={<Loading />}> */}
        <DiplomasSection />
        {/* </Suspense> */}
      </ErrorBoundary>
    </>
  );
}
