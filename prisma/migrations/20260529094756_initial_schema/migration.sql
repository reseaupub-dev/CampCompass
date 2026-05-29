-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('client_relations', 'planner', 'branding_manager', 'logistics_manager', 'equipment_manager', 'budget_manager', 'team_manager', 'supervisor', 'scout');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('brief', 'preparation', 'printing', 'logistics', 'deployment_plan', 'deployment', 'reports', 'closed');

-- CreateEnum
CREATE TYPE "BudgetCategory" AS ENUM ('transport', 'accommodation', 'food', 'material', 'communication', 'printing', 'other');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('pending', 'in_progress', 'completed');

-- CreateEnum
CREATE TYPE "PrintStatus" AS ENUM ('ordered', 'in_production', 'received', 'transferred');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('affichage', 'gps');

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "avatar_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "client_name" TEXT NOT NULL,
    "client_company" TEXT NOT NULL DEFAULT '',
    "client_email" TEXT,
    "client_phone" TEXT,
    "status" "CampaignStatus" NOT NULL DEFAULT 'brief',
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" UUID NOT NULL,
    "campaign_id" UUID NOT NULL,
    "file_url" TEXT,
    "amount" DECIMAL(12,2),
    "signed_at" TIMESTAMP(3),
    "validated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "branding_items" (
    "id" UUID NOT NULL,
    "campaign_id" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,

    CONSTRAINT "branding_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_images" (
    "id" UUID NOT NULL,
    "campaign_id" UUID NOT NULL,
    "dimension_label" TEXT NOT NULL,
    "file_url" TEXT,
    "uploaded_at" TIMESTAMP(3),
    "validated" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "campaign_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "print_orders" (
    "id" UUID NOT NULL,
    "campaign_id" UUID NOT NULL,
    "supplier" TEXT,
    "status" "PrintStatus" NOT NULL DEFAULT 'ordered',
    "ordered_at" TIMESTAMP(3),
    "received_at" TIMESTAMP(3),
    "transferred_at" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "print_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logistics_entries" (
    "id" UUID NOT NULL,
    "campaign_id" UUID NOT NULL,
    "category" "BudgetCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "estimated_cost" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "actual_cost" DECIMAL(12,2),
    "validated" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logistics_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipment_items" (
    "id" UUID NOT NULL,
    "campaign_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'ok',
    "notes" TEXT,
    "cost" DECIMAL(12,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "equipment_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_assignments" (
    "id" UUID NOT NULL,
    "campaign_id" UUID NOT NULL,
    "member_name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "phone" TEXT,
    "daily_rate" DECIMAL(12,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deployment_plans" (
    "id" UUID NOT NULL,
    "campaign_id" UUID NOT NULL,
    "file_url" TEXT,
    "zones" TEXT[],
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "validated_at" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deployment_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance_records" (
    "id" UUID NOT NULL,
    "campaign_id" UUID NOT NULL,
    "team_assignment_id" UUID,
    "profile_id" UUID,
    "date" DATE NOT NULL,
    "hours_worked" DECIMAL(5,2),
    "amount_due" DECIMAL(12,2),
    "present" BOOLEAN NOT NULL DEFAULT true,
    "branding_ok" BOOLEAN NOT NULL DEFAULT false,
    "photo_url" TEXT,
    "gps_lat" DECIMAL(10,7),
    "gps_lng" DECIMAL(10,7),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attendance_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" UUID NOT NULL,
    "campaign_id" UUID NOT NULL,
    "type" "ReportType" NOT NULL,
    "file_url" TEXT,
    "uploaded_at" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" UUID NOT NULL,
    "campaign_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "phase" INTEGER NOT NULL DEFAULT 1,
    "status" "TaskStatus" NOT NULL DEFAULT 'pending',
    "assigned_to" UUID,
    "due_date" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budget_lines" (
    "id" UUID NOT NULL,
    "campaign_id" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "category" "BudgetCategory" NOT NULL,
    "estimated" DECIMAL(12,2) NOT NULL,
    "actual" DECIMAL(12,2),
    "validated" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "budget_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" UUID NOT NULL,
    "campaign_id" UUID NOT NULL,
    "author_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "phase" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_campaign_id_key" ON "invoices"("campaign_id");

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branding_items" ADD CONSTRAINT "branding_items_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_images" ADD CONSTRAINT "campaign_images_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "print_orders" ADD CONSTRAINT "print_orders_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logistics_entries" ADD CONSTRAINT "logistics_entries_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_items" ADD CONSTRAINT "equipment_items_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_assignments" ADD CONSTRAINT "team_assignments_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deployment_plans" ADD CONSTRAINT "deployment_plans_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_team_assignment_id_fkey" FOREIGN KEY ("team_assignment_id") REFERENCES "team_assignments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_lines" ADD CONSTRAINT "budget_lines_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
