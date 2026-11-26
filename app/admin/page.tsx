import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard/dashboard";

export const metadata: Metadata = { title: "Admin" };

export default function AdminPage() {
  return (
    <Dashboard
      area="admin"
      allowedRoles={["admin"]}
      description="Manage people and keep the programme running."
      emptyTitle="No user management yet"
      emptyMessage="Creating and managing accounts isn't available yet."
    />
  );
}
