export type UserRole =
  | "admin"
  | "client_relations"
  | "planner"
  | "branding_manager"
  | "logistics_manager"
  | "equipment_manager"
  | "budget_manager"
  | "team_manager"
  | "supervisor"
  | "scout";

export type CampaignStatus =
  | "brief"
  | "preparation"
  | "printing"
  | "logistics"
  | "deployment_plan"
  | "deployment"
  | "reports"
  | "closed";

export type CampaignPhase = {
  id: number;
  label: string;
  status: "pending" | "in_progress" | "completed";
};

export type Campaign = {
  id: string;
  name: string;
  client_name: string;
  client_company: string;
  status: CampaignStatus;
  created_at: string;
  updated_at: string;
  phases: CampaignPhase[];
};

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
};

export type Task = {
  id: string;
  campaign_id: string;
  title: string;
  assigned_to: string;
  role: UserRole;
  completed: boolean;
  due_date?: string;
  created_at: string;
};

export type BudgetLine = {
  id: string;
  campaign_id: string;
  label: string;
  category: "transport" | "accommodation" | "food" | "material" | "communication" | "printing" | "other";
  estimated: number;
  actual?: number;
  validated: boolean;
};
