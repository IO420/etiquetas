"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import BarNavigation from "../BarNavigation/BarNavigation";

export default function HeaderNavigation({ role }: { role: number }) {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <Suspense fallback={null}>
      {role === 1 && <BarNavigation />}
    </Suspense>
  );
}
//IO