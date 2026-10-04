"use client";

import type { ReactNode } from "react";

import { useAuthSession } from "@/shared/hooks/useAuthSession";
import { isSubmitterRole } from "@/shared/lib/auth-session";
import { Container } from "@/shared/ui/primitives/Container";
import { Skeleton } from "@/shared/ui/primitives/Skeleton";

import { SignInPrompt } from "./SignInPrompt";

type RequireRoleProps = Readonly<{
  /** submitter: resident, NGO or local government; admin: ROPS staff. */
  role: "submitter" | "admin";
  children: ReactNode;
}>;

/** Shows the children to the right kind of signed-in account, a sign-in prompt to everyone else. */
export function RequireRole({ children, role }: RequireRoleProps) {
  const session = useAuthSession();

  if (session === undefined) {
    return (
      <Container className="py-16">
        <Skeleton className="h-40" />
      </Container>
    );
  }

  const allowed = role === "admin" ? session?.user.role === "Admin" : isSubmitterRole(session?.user.role);
  if (!allowed) {
    return <SignInPrompt portal={role === "admin" ? "admin" : "public"} wrongAccount={session !== null} />;
  }

  return children;
}
