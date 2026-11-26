import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard/dashboard";

export const metadata: Metadata = { title: "Mentee" };

export default function MenteePage() {
  return (
    <Dashboard
      area="mentee"
      allowedRoles={["mentee"]}
      description="The person guiding you."
      emptyTitle="No mentor yet"
      emptyMessage="Your mentor will appear here once a counselor assigns one."
    />
  );
}
