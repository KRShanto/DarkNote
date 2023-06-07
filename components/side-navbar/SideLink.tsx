import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function SideLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const active = router.pathname === href;
  const className = `link ${active ? "active" : ""}`;

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
