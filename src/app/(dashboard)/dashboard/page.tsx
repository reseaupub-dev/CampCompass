import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Target,
  CheckSquare,
  AlertTriangle,
  TrendingUp,
  Clock,
  Users,
} from "lucide-react";

const PHASE_LABELS: Record<string, string> = {
  brief: "Brief client",
  preparation: "Préparation technique",
  printing: "Impressions",
  logistics: "Logistique & équipes",
  deployment_plan: "Plan de déploiement",
  deployment: "Déploiement terrain",
  reports: "Rapports",
  closed: "Clôture",
};

const STATUS_COLORS: Record<string, string> = {
  brief: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  preparation: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  printing: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  logistics: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  deployment_plan: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  deployment: "bg-green-500/20 text-green-400 border-green-500/30",
  reports: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  closed: "bg-muted text-muted-foreground border-border",
};

type StatCardProps = {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
};

function StatCard({ icon: Icon, label, value, sub, accent }: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex items-start gap-4">
      <div
        className={`flex items-center justify-center w-10 h-10 rounded-lg shrink-0 ${
          accent ? "bg-primary/20 text-primary" : "bg-accent text-muted-foreground"
        }`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm font-medium text-foreground/80">{label}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("id, name, client_name, status, created_at")
    .neq("status", "closed")
    .order("created_at", { ascending: false })
    .limit(5);

  const { count: totalCampaigns } = await supabase
    .from("campaigns")
    .select("*", { count: "exact", head: true });

  const { count: activeCampaigns } = await supabase
    .from("campaigns")
    .select("*", { count: "exact", head: true })
    .neq("status", "closed");

  const { count: pendingTasks } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("completed", false);

  const firstName = profile?.full_name?.split(" ")[0] ?? "là";

  return (
    <div className="space-y-6 max-w-6xl">
      {/* En-tête */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Bonjour, {firstName} 👋
        </h2>
        <p className="text-muted-foreground mt-1">
          Voici un aperçu de l'activité en cours.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Target}
          label="Campagnes actives"
          value={activeCampaigns ?? 0}
          sub={`${totalCampaigns ?? 0} au total`}
          accent
        />
        <StatCard
          icon={CheckSquare}
          label="Tâches en attente"
          value={pendingTasks ?? 0}
          sub="À traiter"
        />
        <StatCard
          icon={Users}
          label="Équipe"
          value="—"
          sub="Membres actifs"
        />
        <StatCard
          icon={TrendingUp}
          label="Taux d'avancement"
          value="—"
          sub="Toutes campagnes"
        />
      </div>

      {/* Campagnes récentes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-foreground">
            Campagnes en cours
          </h3>
          <a
            href="/campaigns"
            className="text-sm text-primary hover:underline font-medium"
          >
            Voir tout →
          </a>
        </div>

        {campaigns && campaigns.length > 0 ? (
          <div className="space-y-2">
            {campaigns.map((c) => (
              <a
                key={c.id}
                href={`/campaigns/${c.id}`}
                className="flex items-center justify-between bg-card border border-border rounded-xl px-5 py-4 hover:border-primary/40 hover:bg-card/80 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary shrink-0">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {c.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{c.client_name}</p>
                  </div>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                    STATUS_COLORS[c.status] ?? "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {PHASE_LABELS[c.status] ?? c.status}
                </span>
              </a>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-10 flex flex-col items-center justify-center text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent mb-3">
              <AlertTriangle className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">Aucune campagne active</p>
            <p className="text-xs text-muted-foreground mt-1">
              Créez votre première campagne pour commencer.
            </p>
            <a
              href="/campaigns"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              <Clock className="w-3.5 h-3.5" />
              Créer une campagne
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
