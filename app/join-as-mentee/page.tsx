import type { Metadata } from "next";
import { MenteeSignupForm } from "@/components/mentees/mentee-signup-form";
import { SignupPage } from "@/components/signup/signup-page";

export const metadata: Metadata = { title: "Join as a mentee" };

export default function JoinAsMenteePage() {
  return (
    <SignupPage
      title="Join as a mentee"
      description="Tell us about yourself, then verify your email to join the waiting list."
    >
      <MenteeSignupForm />
    </SignupPage>
  );
}
