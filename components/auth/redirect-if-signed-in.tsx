import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { DASHBOARD_PATHS } from "@/lib/roles";

// For public pages that make no sense once signed in. Render inside Suspense.
export async function RedirectIfSignedIn() {
  const user = await getCurrentUser();
  if (user) redirect(DASHBOARD_PATHS[user.role]);
  return null;
}
