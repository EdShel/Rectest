"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { InfoAlertProvider } from "@/utils/useShowAlertNotification/InfoAlertProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <InfoAlertProvider>{children}</InfoAlertProvider>
    </SessionProvider>
  );
}
