import type { Metadata } from "next";
import { MentorApplicationForm } from "@/components/mentors/mentor-application-form";
import { SignupPage } from "@/components/signup/signup-page";

export const metadata: Metadata = { title: "Become a mentor" };

export default function BecomeAMentorPage() {
  return (
    <SignupPage
      title="Become a mentor"
      description="Tell us about yourself. A counselor will review your application."
    >
      <MentorApplicationForm />
    </SignupPage>
  );
}
