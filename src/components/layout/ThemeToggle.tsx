"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Évite les erreurs d'hydratation en attendant le montage côté client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Placeholder identique en taille pour éviter le layout shift
    return (
      <Button
        variant="ghost"
        size="icon"
        className="relative text-muted-foreground"
        aria-label="Chargement du thème"
        disabled
      >
        <span className="w-4.5 h-4.5" />
      </Button>
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
      aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
      title={isDark ? "Mode clair" : "Mode sombre"}
    >
      <span
        className="absolute inset-0 flex items-center justify-center transition-all duration-300"
        style={{
          opacity: isDark ? 1 : 0,
          transform: isDark ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0.5)",
        }}
      >
        <Sun className="w-4.5 h-4.5" />
      </span>
      <span
        className="absolute inset-0 flex items-center justify-center transition-all duration-300"
        style={{
          opacity: isDark ? 0 : 1,
          transform: isDark ? "rotate(-90deg) scale(0.5)" : "rotate(0deg) scale(1)",
        }}
      >
        <Moon className="w-4.5 h-4.5" />
      </span>
    </Button>
  );
}
