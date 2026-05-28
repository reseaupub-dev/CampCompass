"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuthPanel } from "@/components/layout/AuthPanel";
import { AlertCircle, Eye, EyeOff, Loader2, MapPin } from "lucide-react";
import type { UserRole } from "@/types";

const ROLES: { value: UserRole; label: string }[] = [
  { value: "client_relations", label: "Chargé relation client" },
  { value: "planner", label: "Planificateur" },
  { value: "branding_manager", label: "Responsable branding" },
  { value: "logistics_manager", label: "Responsable logistique" },
  { value: "equipment_manager", label: "Responsable matériel" },
  { value: "budget_manager", label: "Responsable budget" },
  { value: "team_manager", label: "Responsable équipes" },
  { value: "supervisor", label: "Superviseur général" },
  { value: "scout", label: "Repéreur" },
];

function getStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: "", color: "" };
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (s <= 1) return { score: s, label: "Faible", color: "bg-red-400" };
  if (s === 2) return { score: s, label: "Moyen", color: "bg-amber-400" };
  if (s === 3) return { score: s, label: "Fort", color: "bg-lime-500" };
  return { score: s, label: "Très fort", color: "bg-green-500" };
}

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [role, setRole] = useState<UserRole | "">("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => getStrength(password), [password]);
  const mismatch = confirmPassword.length > 0 && password !== confirmPassword;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!role) { setError("Veuillez sélectionner votre rôle."); return; }
    if (password !== confirmPassword) { setError("Les mots de passe ne correspondent pas."); return; }
    if (password.length < 6) { setError("Le mot de passe doit contenir au moins 6 caractères."); return; }
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role } },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        full_name: fullName,
        email,
        role,
      });
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#161616]">
      <AuthPanel mode="register" />

      {/* Panneau droit — scrollable si le formulaire dépasse la hauteur */}
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
                Créer un compte
              </h1>
              <p className="text-white/40 mt-2 text-sm leading-relaxed">
                Remplissez les informations ci-dessous pour rejoindre votre équipe.
              </p>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Nom complet */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-semibold text-white/80">
                  Nom complet
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Jean Dupont"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  autoComplete="name"
                  className="h-11 rounded-xl border-white/10 bg-white/[0.03] text-white placeholder:text-white/20 focus-visible:border-[#ae2453] focus-visible:ring-2 focus-visible:ring-[#ae2453]/20 transition-all duration-200"
                />
              </div>

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

              {/* Mot de passe + force */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-white/80">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 6 caractères"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete="new-password"
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

                {password.length > 0 && (
                  <div className="space-y-1.5 pt-0.5">
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors duration-350 ${
                            i <= strength.score ? strength.color : "bg-white/10"
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-[11px] font-bold ${
                      strength.score <= 1 ? "text-red-400" :
                      strength.score === 2 ? "text-amber-400" : "text-emerald-400"
                    }`}>
                      Force : {strength.label}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirmation mot de passe */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-white/80">
                  Confirmer le mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Retapez votre mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    className={`h-11 pr-11 rounded-xl bg-white/[0.03] text-white placeholder:text-white/20 transition-all duration-200 ${
                      mismatch
                        ? "border-red-500/40 focus-visible:ring-2 focus-visible:ring-red-500/20 focus-visible:border-red-500"
                        : "border-white/10 focus-visible:ring-2 focus-visible:ring-[#ae2453]/20 focus-visible:border-[#ae2453]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    tabIndex={-1}
                    aria-label={showConfirm ? "Masquer" : "Afficher"}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {mismatch && (
                  <p className="text-xs text-red-400 animate-in fade-in duration-200">Les mots de passe ne correspondent pas.</p>
                )}
              </div>

              {/* Rôle */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-white/80">
                  Votre rôle
                </Label>
                <Select onValueChange={(v) => setRole(v as UserRole)}>
                  <SelectTrigger className="h-11 w-full rounded-xl border-white/10 bg-white/[0.03] text-white focus:ring-2 focus:ring-[#ae2453]/20 focus:border-[#ae2453] data-[placeholder]:text-white/20 transition-all duration-200 px-3.5">
                    <SelectValue placeholder="Sélectionnez votre rôle" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-white/5 bg-[#1c1c1f] shadow-2xl text-white">
                    {ROLES.map((r) => (
                      <SelectItem
                        key={r.value}
                        value={r.value}
                        className="cursor-pointer text-white/80 focus:bg-[#ae2453]/15 focus:text-white rounded-lg transition-colors px-3 py-2 text-sm"
                      >
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Erreur globale */}
              {error && (
                <div className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400 animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Bouton */}
              <button
                type="submit"
                disabled={loading || mismatch}
                className="mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#ae2453] text-sm font-semibold text-white transition-all duration-200 hover:bg-[#c43267] hover:shadow-lg hover:shadow-[#ae2453]/20 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Création…
                  </>
                ) : (
                  "Créer mon compte"
                )}
              </button>
            </form>

            {/* Séparateur */}
            <div className="my-7 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/[0.05]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/20">ou</span>
              <div className="h-px flex-1 bg-white/[0.05]" />
            </div>

            {/* Lien connexion */}
            <p className="text-center text-sm text-white/40">
              Déjà un compte ?{" "}
              <Link href="/login" className="font-semibold text-[#ae2453] hover:text-[#c43267] transition-colors">
                Se connecter
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
