# CampCompass

Système de gestion intégré pour campagnes terrain — de la participation client au rapport d'achèvement.

---

## Présentation

CampCompass centralise toutes les étapes d'une campagne d'affichage / communication terrain :
brief client → impressions → logistique → déploiement → fiches de présence → rapports PDF + GPS → archivage.

**Problème résolu :** plus de fichiers Excel éparpillés, plus de coordination par WhatsApp. Tout est traçable, rôle par rôle, phase par phase.

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | Next.js 15 (App Router) + TypeScript |
| UI | Tailwind CSS v4 + shadcn/ui |
| Backend / DB | Supabase (PostgreSQL managé) |
| Auth | Supabase Auth |
| Stockage fichiers | Supabase Storage |
| PDF | @react-pdf/renderer |
| State management | Zustand |
| Date utils | date-fns |
| Package manager | **pnpm** (obligatoire) |

---

## Prérequis

- Node.js >= 18.17
- pnpm >= 8 (`npm install -g pnpm`)
- Un compte Supabase (gratuit) : [app.supabase.com](https://app.supabase.com)

---

## Installation

```bash
# 1. Cloner le repo
git clone <url-du-repo>
cd camp-compass

# 2. Installer les dépendances (toujours avec pnpm)
pnpm install

# 3. Configurer les variables d'environnement
cp .env.local.example .env.local
# → Remplir les valeurs Supabase dans .env.local

# 4. Lancer en développement
pnpm dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000).

---

## Variables d'environnement

Copier `.env.local.example` en `.env.local` et remplir :

| Variable | Où la trouver |
|----------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase > Project Settings > API > Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase > Project Settings > API > anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase > Project Settings > API > service_role |

> **Important :** ne jamais commiter `.env.local`. Il est déjà dans `.gitignore`.

---

## Structure du projet

```
camp-compass/
├── src/
│   ├── app/
│   │   ├── (auth)/               # Pages publiques (login, register)
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/          # Pages protégées (rôles connectés)
│   │   │   ├── dashboard/        # Vue d'ensemble par rôle
│   │   │   ├── campaigns/        # Liste et détail des campagnes
│   │   │   │   └── [id]/         # Détail d'une campagne (8 phases)
│   │   │   ├── clients/          # Gestion clients & briefs
│   │   │   ├── teams/            # Équipes terrain
│   │   │   ├── logistics/        # Transport, hébergement, repas
│   │   │   ├── budget/           # Lignes budgétaires
│   │   │   ├── materials/        # Matériel, stocks, réparations
│   │   │   └── reports/          # PDFs, GPS, rapports finaux
│   │   └── api/                  # Route handlers Next.js
│   ├── components/
│   │   ├── ui/                   # Composants shadcn/ui (auto-générés)
│   │   ├── layout/               # Sidebar, navbar, layout global
│   │   ├── campaigns/            # Composants liés aux campagnes
│   │   ├── dashboard/            # Widgets du tableau de bord
│   │   └── forms/                # Formulaires réutilisables
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts         # Client Supabase (côté navigateur)
│   │   │   └── server.ts         # Client Supabase (côté serveur)
│   │   └── utils.ts              # Utilitaires généraux
│   ├── types/
│   │   └── index.ts              # Types TypeScript partagés
│   ├── store/                    # Stores Zustand (état global)
│   ├── hooks/                    # Custom React hooks
│   └── middleware.ts             # Protection des routes (auth)
├── .env.local.example            # Template variables d'environnement
├── components.json               # Config shadcn/ui
└── README.md
```

---

## Les 8 rôles

Chaque utilisateur se voit assigner un rôle lors de la création de son compte. Son tableau de bord affiche uniquement les tâches qui le concernent.

| Rôle | Identifiant système | Responsabilités |
|------|--------------------|--------------   |
| Chargé relation client | `client_relations` | Brief, devis, facture client |
| Planificateur | `planner` | Jalons, délais, alertes |
| Responsable branding | `branding_manager` | T-shirts, flyers, goodies |
| Responsable logistique | `logistics_manager` | Transport, hébergement, repas |
| Responsable matériel | `equipment_manager` | Stocks, batteries, réparations |
| Responsable budget | `budget_manager` | Coûts prévisionnels, validation |
| Responsable équipes | `team_manager` | Plannings, présences, paiements |
| Superviseur général | `supervisor` | Vue globale, validations critiques |
| Repéreur | `scout` | Plan de déploiement terrain |

---

## Les 8 phases d'une campagne

```
Phase 1 — Brief client          → Formulaire client + devis + facture signée
Phase 2 — Préparation technique → Dimensions + 16 images client validées
Phase 3 — Impressions           → Commande + réception impressions physiques
Phase 4 — Logistique & équipes  → Transport + hébergement + équipes assignées
Phase 5 — Plan de déploiement   → Fichier lieux/dates/équipes (repéreur)
Phase 6 — Déploiement terrain   → Fiches présence + photos + traces GPS
Phase 7 — Rapports              → PDF rapport affichage + PDF données GPS
Phase 8 — Clôture               → Archivage + export ZIP du dossier complet
```

---

## Commandes disponibles

```bash
pnpm dev          # Serveur de développement (http://localhost:3000)
pnpm build        # Build de production
pnpm start        # Serveur de production
pnpm lint         # Vérification ESLint
```

> **Règle d'équipe :** utiliser **pnpm** exclusivement. Ne jamais utiliser npm ou yarn pour installer des packages dans ce projet.

---

## Contribuer

1. Créer une branche depuis `main` : `git checkout -b feature/nom-de-la-feature`
2. Coder + tester localement
3. Ouvrir une Pull Request vers `main`
4. Un review est requis avant merge

---

## Campagne pilote

La campagne **Sothézée** sert de référence pour valider toutes les phases de l'outil.
