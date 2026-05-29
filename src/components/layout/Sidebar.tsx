"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Target,
  Users,
  Truck,
  DollarSign,
  Package,
  FileText,
  UserCheck,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

type NavItem = {
  href: string;
  icon: React.ElementType;
  label: string;
  roles: UserRole[] | "all";
};

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Tableau de bord", roles: "all" },
  { href: "/campaigns", icon: Target, label: "Campagnes", roles: "all" },
  { href: "/clients", icon: UserCheck, label: "Clients", roles: ["admin", "client_relations", "supervisor"] },
  { href: "/teams", icon: Users, label: "Équipes", roles: ["admin", "team_manager", "supervisor"] },
  { href: "/logistics", icon: Truck, label: "Logistique", roles: ["admin", "logistics_manager", "supervisor"] },
  { href: "/budget", icon: DollarSign, label: "Budget", roles: ["admin", "budget_manager", "supervisor"] },
  { href: "/materials", icon: Package, label: "Matériel", roles: ["admin", "equipment_manager", "branding_manager", "supervisor"] },
  { href: "/reports", icon: FileText, label: "Rapports", roles: ["admin", "client_relations", "supervisor"] },
];

function filterNav(role: UserRole): NavItem[] {
  return NAV_ITEMS.filter((item) =>
    item.roles === "all" || item.roles.includes(role)
  );
}

type SidebarProps = {
  role: UserRole;
};

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const items = filterNav(role);

  return (
    <aside
      className={cn(
        "relative flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 shrink-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-16 border-b border-sidebar-border overflow-hidden">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary shrink-0">
          <MapPin className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <span className="text-base font-bold tracking-tight text-foreground whitespace-nowrap">
            Camp<span className="text-primary">Compass</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-white"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 flex items-center justify-center w-6 h-6 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors z-10"
        aria-label={collapsed ? "Étendre" : "Réduire"}
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>
    </aside>
  );
}
