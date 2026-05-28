"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Bell, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import type { Profile } from "@/types";

const ROLE_LABELS: Record<string, string> = {
  client_relations: "Chargé relation client",
  planner: "Planificateur",
  branding_manager: "Resp. branding",
  logistics_manager: "Resp. logistique",
  equipment_manager: "Resp. matériel",
  budget_manager: "Resp. budget",
  team_manager: "Resp. équipes",
  supervisor: "Superviseur général",
  scout: "Repéreur",
};

type TopbarProps = {
  profile: Profile;
  pageTitle?: string;
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Topbar({ profile, pageTitle }: TopbarProps) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex items-center justify-between h-16 px-6 border-b border-border bg-card shrink-0">
      {/* Titre de la page */}
      <div>
        {pageTitle && (
          <h1 className="text-base font-semibold text-foreground">{pageTitle}</h1>
        )}
      </div>

      {/* Actions droite */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary" />
        </Button>

        {/* Bascule thème clair / sombre */}
        <ThemeToggle />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-accent transition-colors">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-white text-xs font-semibold">
                  {getInitials(profile.full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-foreground leading-none">
                  {profile.full_name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {ROLE_LABELS[profile.role] ?? profile.role}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-card border-border">
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-foreground">{profile.full_name}</p>
              <p className="text-xs text-muted-foreground">{profile.email}</p>
            </div>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive hover:bg-destructive/10 cursor-pointer gap-2"
            >
              <LogOut className="w-4 h-4" />
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
