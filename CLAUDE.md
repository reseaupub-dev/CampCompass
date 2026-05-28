@AGENTS.md

# CampCompass — Contexte projet pour Claude

## C'est quoi ce projet ?
Plateforme web de gestion intégrée pour campagnes terrain (affichage publicitaire, communication terrain).
Remplace Excel + WhatsApp par un outil centralisé, traçable, multi-rôles.

## Règles absolues
- Toujours utiliser **pnpm** (jamais npm ou yarn)
- Framework : Next.js 15 App Router (pas Pages Router)
- Tout le code est en **TypeScript**
- Les composants UI viennent de **shadcn/ui** (`src/components/ui/`)
- La base de données et l'auth sont sur **Supabase**

## Stack complète
- Next.js 15 + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Supabase (PostgreSQL + Auth + Storage)
- @react-pdf/renderer (génération PDF)
- Zustand (state global)
- date-fns (dates)

## Les 9 rôles utilisateurs
| Identifiant système | Rôle |
|---|---|
| `client_relations` | Chargé relation client — brief, devis, facture |
| `planner` | Planificateur — jalons, délais, alertes |
| `branding_manager` | Responsable branding — t-shirts, flyers, goodies |
| `logistics_manager` | Responsable logistique — transport, hébergement, repas |
| `equipment_manager` | Responsable matériel — stocks, batteries, réparations |
| `budget_manager` | Responsable budget — coûts, validation dépenses |
| `team_manager` | Responsable équipes — plannings, présences, paiements |
| `supervisor` | Superviseur général — vue globale, validations |
| `scout` | Repéreur — plan de déploiement terrain |

## Les 8 phases d'une campagne
```
Phase 1 — Brief client          → formulaire client + devis + facture signée
Phase 2 — Préparation technique → dimensions affichage + 16 images client validées
Phase 3 — Impressions           → commande + réception impressions physiques
Phase 4 — Logistique & équipes  → transport + hébergement + équipes assignées
Phase 5 — Plan de déploiement   → fichier lieux/dates/équipes (repéreur)
Phase 6 — Déploiement terrain   → fiches présence + photos + fichier GPS uploadé
Phase 7 — Rapports              → upload PDF rapport affichage + upload PDF GPS
Phase 8 — Clôture               → archivage + export ZIP dossier complet
```

## Structure des dossiers
```
src/
├── app/
│   ├── (auth)/          → login, register (pages publiques)
│   ├── (dashboard)/     → toutes les pages protégées
│   │   ├── dashboard/   → tableau de bord par rôle
│   │   ├── campaigns/   → liste + détail campagnes ([id])
│   │   ├── clients/
│   │   ├── teams/
│   │   ├── logistics/
│   │   ├── budget/
│   │   ├── materials/
│   │   └── reports/
│   └── api/             → route handlers
├── components/
│   ├── ui/              → shadcn/ui (NE PAS modifier manuellement)
│   ├── layout/          → sidebar, navbar, layout global
│   ├── campaigns/       → composants liés aux campagnes
│   ├── dashboard/       → widgets tableau de bord
│   └── forms/           → formulaires réutilisables
├── lib/
│   ├── supabase/
│   │   ├── client.ts    → client navigateur
│   │   └── server.ts    → client serveur (Server Components)
│   └── utils.ts
├── types/index.ts       → types TypeScript partagés (UserRole, Campaign, Task…)
├── store/               → stores Zustand
├── hooks/               → custom hooks
└── middleware.ts        → protection routes (redirige vers /login si non connecté)
```

## Ce qui est déjà fait
- [x] Projet Next.js 15 initialisé avec pnpm
- [x] Tailwind CSS v4 configuré
- [x] shadcn/ui initialisé + 20 composants installés
- [x] Supabase client (navigateur + serveur) configuré
- [x] Middleware d'authentification (protection des routes)
- [x] Types TypeScript de base (UserRole, Campaign, Task, BudgetLine)
- [x] Structure de dossiers complète créée
- [x] .env.local.example créé
- [x] README.md équipe créé

## Roadmap — Ce qui reste à faire (dans l'ordre)

### BLOC 1 — Configuration Supabase
- [ ] Créer le projet sur app.supabase.com
- [ ] Remplir .env.local avec les clés
- [ ] Créer le schéma base de données (tables)
- [ ] Configurer les RLS (Row Level Security) par rôle
- [ ] Configurer les buckets Storage (images, pdfs, gps-files)

### BLOC 2 — Authentification
- [ ] Page /login
- [ ] Page /register (avec choix du rôle)
- [ ] Création du profil utilisateur après inscription
- [ ] Redirection selon le rôle après connexion

### BLOC 3 — Layout & Navigation
- [ ] Layout principal (sidebar + topbar)
- [ ] Sidebar avec liens filtrés par rôle
- [ ] Topbar (user info, notifications, logout)
- [ ] Responsive mobile

### BLOC 4 — Dashboard
- [ ] Page /dashboard avec widgets par rôle
- [ ] Widget tâches en attente
- [ ] Widget campagnes actives
- [ ] Widget alertes délais

### BLOC 5 — Gestion campagnes (cœur)
- [ ] Page /campaigns (liste)
- [ ] Création d'une campagne
- [ ] Page /campaigns/[id] avec les 8 phases
- [ ] Phase stepper visuel
- [ ] Système de tâches à cocher
- [ ] Historique + commentaires

### BLOC 6 à 13 — Les 8 phases (une par une)
(voir détail dans chaque phase ci-dessus)

### BLOC 14 — Fonctionnalités transverses
- [ ] Système de notifications
- [ ] Suivi budgétaire global
- [ ] Gestion matériel / équipes / rapports

### BLOC 15 — Finition & Déploiement
- [ ] Tests mobile (PWA)
- [ ] Campagne pilote Sothézée (test bout en bout)
- [ ] Déploiement Vercel
- [ ] Variables d'environnement production

## Conventions de code
- Composants : PascalCase (`CampaignCard.tsx`)
- Fonctions / hooks : camelCase (`useCampaign.ts`)
- Types : PascalCase avec suffixe si besoin (`CampaignStatus`)
- Pas de commentaires inutiles — le code doit se lire seul
- Server Components par défaut, `"use client"` seulement si nécessaire
