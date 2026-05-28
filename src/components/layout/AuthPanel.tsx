"use client";

import { MapPin } from "lucide-react";

interface AuthPanelProps {
  mode: "login" | "register";
}

export function AuthPanel({ mode }: AuthPanelProps) {
  return (
    <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-16 overflow-hidden bg-[#161616] border-r border-white/5">
      {/* Grille technique de fond (Radar / Boussole) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff/[0.015]_1px,transparent_1px),linear-gradient(to_bottom,#ffffff/[0.015]_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      
      {/* Décorations (Glows & Concentric Circles) */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#ae2453]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] rounded-full bg-[#ae2453]/8 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[640px] rounded-full border border-white/[0.03] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] h-[440px] rounded-full border border-white/[0.05] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full border border-[#ae2453]/10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] rounded-full border border-[#ae2453]/20 pointer-events-none" />

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#ae2453] shadow-lg shadow-[#ae2453]/20">
          <MapPin className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">
          Camp<span className="text-[#ae2453]">Compass</span>
        </span>
      </div>

      {/* Titre & Description - Disposition Corrigée */}
      <div className="relative z-10 my-auto py-12">
        <p className="text-[#ae2453] text-xs font-bold uppercase tracking-[0.25em] mb-4">
          {mode === "login" ? "Plateforme terrain" : "Rejoindre l'équipe"}
        </p>
        <h2 className="text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-[1.2]">
          {mode === "login" ? (
            <>
              Gérez vos campagnes{" "}
              <span className="text-[#ae2453] block mt-1">d'affichage.</span>
            </>
          ) : (
            <>
              Votre rôle,{" "}
              <span className="text-[#ae2453] block mt-1">votre espace dédié.</span>
            </>
          )}
        </h2>
        <p className="text-white/60 mt-6 text-base leading-relaxed max-w-sm">
          {mode === "login"
            ? "Un outil centralisé, intuitif et entièrement traçable pour orchestrer vos campagnes terrain en toute simplicité."
            : "Chaque membre de l'organisation accède instantanément à l'ensemble des outils spécifiques à ses missions."}
        </p>
      </div>

      {/* Bas */}
      <p className="relative z-10 text-white/30 text-xs tracking-wide">
        © 2026 CampCompass. Tous droits réservés.
      </p>
    </div>
  );
}
