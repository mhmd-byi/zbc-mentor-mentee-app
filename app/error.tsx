"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ retry }: { retry: () => void }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-12 text-center">
      <PageHeader
        title="Something went wrong"
        description="Please try again in a moment."
      />
      <Button onClick={() => retry()}>Try again</Button>
    </main>
  );
}
