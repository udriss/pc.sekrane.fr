"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Book } from "lucide-react";

export function MainNav() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center space-x-6">
      <Link
        href="/"
        className="flex items-center space-x-2"
      >
        <Book className="h-6 w-6" />
        <span className="font-bold">Plan de travail</span>
      </Link>
      <Link
        href="/"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/" ? "text-primary" : "text-muted-foreground"
        )}
      >
        Accueil
      </Link>
      <Link
        href="/courses"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/courses" ? "text-primary" : "text-muted-foreground"
        )}
      >
        Cours
      </Link>
      <Link
        href="/admin"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/admin" ? "text-primary" : "text-muted-foreground"
        )}
      >
        Administration
      </Link>
    </nav>
  );
}