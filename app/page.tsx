import { redirect } from "next/navigation";

// The login page forwards anyone already signed in to their dashboard.
export default function Home() {
  redirect("/login");
}
