"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  CheckCircle2,
  LayoutDashboard,
  Newspaper,
  PlusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/feed", icon: Newspaper, label: "Feed" },
  { href: "/entry/new", icon: PlusCircle, label: "New" },
  { href: "/habits", icon: CheckCircle2, label: "Habits" },
  { href: "/projects", icon: Briefcase, label: "Projects" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t bg-card md:hidden">
      <div className="grid h-16 grid-cols-5 items-center">
        {navItems.map((item) => {
          const isActive =
            item.href === "/entry/new"
              ? pathname.startsWith(item.href)
              : pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center justify-center gap-1 text-muted-foreground"
            >
              <item.icon
                className={cn(
                  "h-6 w-6",
                  isActive && "text-primary",
                  item.href === "/entry/new" && "h-8 w-8 text-primary"
                )}
              />
              <span
                className={cn(
                  "text-xs",
                  isActive && "text-primary font-medium"
                )}
              >
                {item.href !== "/entry/new" && item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
