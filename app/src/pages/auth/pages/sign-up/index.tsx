import { Card } from "@heroui/react";
import { SignUpForm } from "./components/sign-up-form";
import { Suspense } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Routes } from "@/routes/routes";
import { useGetInvitationDetails } from "@/features/auth/hooks/use-auth";

function SignUpHeader() {
  const [searchParams] = useSearchParams();
  const invitationToken = searchParams.get("invitation_token") ?? undefined;
  const invitationQuery = useGetInvitationDetails(invitationToken);

  if (invitationToken) {
    return (
      <div className="flex flex-col gap-1 text-left mb-6">
        <p className="text-2xl font-semibold">Accept your invitation</p>
        <p className="text-sm text-muted">
          {invitationQuery.data
            ? `Create a password to join ${invitationQuery.data.organization_name}.`
            : "Create a password to join your team workspace."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 text-left mb-6">
      <p className="text-2xl font-semibold">Create your workspace</p>
      <p className="text-sm text-muted">
        Start unifying company apps, data, documents, and knowledge.
      </p>
    </div>
  );
}

export default function SignUp() {
  return (
    <Card className="w-full max-w-md mx-auto p-8">
      <Suspense
        fallback={
          <div className="flex flex-col gap-1 text-left mb-6">
            <div className="h-8 w-56 rounded-lg bg-surface-secondary animate-pulse" />
            <div className="h-4 w-full rounded-lg bg-surface-secondary animate-pulse" />
          </div>
        }
      >
        <SignUpHeader />
      </Suspense>

      <Suspense
        fallback={
          <div className="space-y-4 animate-pulse" aria-hidden>
            <div className="h-10 w-full rounded-lg bg-surface-secondary" />
            <div className="h-10 w-full rounded-lg bg-surface-secondary" />
            <div className="h-10 w-full rounded-lg bg-surface-secondary" />
            <div className="h-10 w-full rounded-lg bg-surface-secondary" />
            <div className="h-10 w-28 rounded-lg bg-surface-secondary" />
          </div>
        }
      >
        <SignUpForm />
      </Suspense>

      <div className="text-center text-sm mt-4 text-muted">
        Already have an account?{" "}
        <Link to={Routes.auth.sign_in} className="underline underline-offset-4 hover:opacity-80">
          Sign In
        </Link>
      </div>
    </Card>
  );
}
