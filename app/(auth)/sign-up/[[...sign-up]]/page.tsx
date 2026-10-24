import SignUpForm from "@/components/forms/SignUpForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | DevOverflow",
  description: "Create your DevOverflow account",
};

export default function Page() {
  return <SignUpForm />;
}
