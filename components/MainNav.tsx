"use client";

import { IRoute } from "@/data/interfaces/route.interface";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";

const MainNav = ({
  className,
  ...props
}: React.HtmlHTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();
  const params = useParams();

  const routes: IRoute[] = [
    {
      href: `/${params.storeId}/settings`,
      label: "Settings",
      active: pathname === `/${params.storeId}/settings`,
    },
  ];
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6 pl-6")}>
      {routes.map((r) => (
        <Link
          key={r.href}
          href={r.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            r.active ? "text-black dark:text-white" : "text-muted-foreground"
          )}
        >
          {r.label}
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;
