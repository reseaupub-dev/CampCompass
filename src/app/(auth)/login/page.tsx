"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthPanel } from "@/components/layout/AuthPanel";
import { AlertCircle, Eye, EyeOff, Loader2, MapPin } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#161616]">
      <AuthPanel mode="login" />

      {/* Panneau droit sombre premium — centré et équilibré */}
      <div className="flex-1 overflow-y-auto bg-[#121214] relative flex flex-col justify-center">
        {/* Lueur d'ambiance discrète en arrière-plan */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-[#ae2453]/5 blur-3xl pointer-events-none" />

        <div className="min-h-full flex items-center justify-center px-8 py-16 relative z-10">
          <div className="w-full max-w-[380px]">

            {/* Logo mobile */}
            <div className="flex lg:hidden items-center justify-center gap-2.5 mb-10">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#ae2453] shadow-lg shadow-[#ae2453]/20">
                <MapPin className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Camp<span className="text-[#ae2453]">Compass</span>
              </span>
            </div>

            {/* En-tête */}
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Connexion
              </h1>
              <p className="text-white/40 mt-2 text-sm leading-relaxed">
                Entrez vos identifiants pour accéder à votre espace de travail.
              </p>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-white/80">
                  Adresse email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="h-11 rounded-xl border-white/10 bg-white/[0.03] text-white placeholder:text-white/20 focus-visible:border-[#ae2453] focus-visible:ring-2 focus-visible:ring-[#ae2453]/20 transition-all duration-200"
                />
              </div>

              {/* Mot de passe */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-semibold text-white/80">
                    Mot de passe
                  </Label>
                  <button
                    type="button"
                    className="text-xs font-semibold text-[#ae2453] hover:text-[#c43267] transition-colors"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="h-11 pr-11 rounded-xl border-white/10 bg-white/[0.03] text-white placeholder:text-white/20 focus-visible:border-[#ae2453] focus-visible:ring-2 focus-visible:ring-[#ae2453]/20 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Masquer" : "Afficher"}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Erreur */}
              {error && (
                <div className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400 animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Bouton */}
              <button
                type="submit"
                disabled={loading}
                className="mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#ae2453] text-sm font-semibold text-white transition-all duration-200 hover:bg-[#c43267] hover:shadow-lg hover:shadow-[#ae2453]/20 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Connexion…
                  </>
                ) : (
                  "Se connecter"
                )}
              </button>
            </form>

            {/* Séparateur */}
            <div className="my-7 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/[0.05]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/20">ou</span>
              <div className="h-px flex-1 bg-white/[0.05]" />
            </div>

            {/* Lien inscription */}
            <p className="text-center text-sm text-white/40">
              Pas encore de compte ?{" "}
              <Link href="/register" className="font-semibold text-[#ae2453] hover:text-[#c43267] transition-colors">
                Créer un compte
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
