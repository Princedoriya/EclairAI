import React from "react";
import UpgradeRequired from "@/components/common/upgrade-required";
import { hasActivePlan, hasReachedUploadLimit } from "@/lib/user";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const hasActiveSubscription = await hasActivePlan(
    user.emailAddresses[0].emailAddress
  );
  const { hasReachedLimit } = await hasReachedUploadLimit(user.emailAddresses[0].emailAddress);
  if (!hasActiveSubscription && hasReachedLimit) {
    return <UpgradeRequired />;
  }

  return <>{children}</>;
}
