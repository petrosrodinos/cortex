/*
  Warnings:

  - You are about to drop the column `org_id` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `org_id` on the `organization_members` table. All the data in the column will be lost.
  - You are about to drop the column `role_id` on the `organization_members` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `organization_members` table. All the data in the column will be lost.
  - You are about to drop the column `org_id` on the `organization_roles` table. All the data in the column will be lost.
  - The primary key for the `role_permissions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `permission_id` on the `role_permissions` table. All the data in the column will be lost.
  - You are about to drop the column `role_id` on the `role_permissions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uuid]` on the table `audit_logs` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `organization_members` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[org_uuid,user_uuid]` on the table `organization_members` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `organization_roles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[org_uuid,name]` on the table `organization_roles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `permissions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `role_permissions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[role_uuid,permission_uuid]` on the table `role_permissions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `org_uuid` to the `audit_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_uuid` to the `audit_logs` table without a default value. This is not possible if the table is not empty.
  - The required column `uuid` was added to the `audit_logs` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `org_uuid` to the `organization_members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_uuid` to the `organization_members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_uuid` to the `organization_members` table without a default value. This is not possible if the table is not empty.
  - The required column `uuid` was added to the `organization_members` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `org_uuid` to the `organization_roles` table without a default value. This is not possible if the table is not empty.
  - The required column `uuid` was added to the `organization_roles` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `uuid` was added to the `permissions` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `permission_uuid` to the `role_permissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_uuid` to the `role_permissions` table without a default value. This is not possible if the table is not empty.
  - The required column `uuid` was added to the `role_permissions` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_org_id_fkey";

-- DropForeignKey
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_user_id_fkey";

-- DropForeignKey
ALTER TABLE "organization_members" DROP CONSTRAINT "organization_members_org_id_fkey";

-- DropForeignKey
ALTER TABLE "organization_members" DROP CONSTRAINT "organization_members_role_id_fkey";

-- DropForeignKey
ALTER TABLE "organization_members" DROP CONSTRAINT "organization_members_user_id_fkey";

-- DropForeignKey
ALTER TABLE "organization_roles" DROP CONSTRAINT "organization_roles_org_id_fkey";

-- DropForeignKey
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_permission_id_fkey";

-- DropForeignKey
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_role_id_fkey";

-- DropIndex
DROP INDEX "audit_logs_org_id_idx";

-- DropIndex
DROP INDEX "audit_logs_user_id_idx";

-- DropIndex
DROP INDEX "organization_members_org_id_idx";

-- DropIndex
DROP INDEX "organization_members_org_id_user_id_key";

-- DropIndex
DROP INDEX "organization_members_role_id_idx";

-- DropIndex
DROP INDEX "organization_members_user_id_idx";

-- DropIndex
DROP INDEX "organization_roles_org_id_idx";

-- DropIndex
DROP INDEX "organization_roles_org_id_name_key";

-- DropIndex
DROP INDEX "role_permissions_permission_id_idx";

-- AlterTable
ALTER TABLE "audit_logs" DROP COLUMN "org_id",
DROP COLUMN "user_id",
ADD COLUMN     "org_uuid" TEXT NOT NULL,
ADD COLUMN     "user_uuid" TEXT NOT NULL,
ADD COLUMN     "uuid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "organization_members" DROP COLUMN "org_id",
DROP COLUMN "role_id",
DROP COLUMN "user_id",
ADD COLUMN     "org_uuid" TEXT NOT NULL,
ADD COLUMN     "role_uuid" TEXT NOT NULL,
ADD COLUMN     "user_uuid" TEXT NOT NULL,
ADD COLUMN     "uuid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "organization_roles" DROP COLUMN "org_id",
ADD COLUMN     "org_uuid" TEXT NOT NULL,
ADD COLUMN     "uuid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "permissions" ADD COLUMN     "uuid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_pkey",
DROP COLUMN "permission_id",
DROP COLUMN "role_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "permission_uuid" TEXT NOT NULL,
ADD COLUMN     "role_uuid" TEXT NOT NULL,
ADD COLUMN     "uuid" TEXT NOT NULL,
ADD CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "audit_logs_uuid_key" ON "audit_logs"("uuid");

-- CreateIndex
CREATE INDEX "audit_logs_org_uuid_idx" ON "audit_logs"("org_uuid");

-- CreateIndex
CREATE INDEX "audit_logs_user_uuid_idx" ON "audit_logs"("user_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "organization_members_uuid_key" ON "organization_members"("uuid");

-- CreateIndex
CREATE INDEX "organization_members_org_uuid_idx" ON "organization_members"("org_uuid");

-- CreateIndex
CREATE INDEX "organization_members_user_uuid_idx" ON "organization_members"("user_uuid");

-- CreateIndex
CREATE INDEX "organization_members_role_uuid_idx" ON "organization_members"("role_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "organization_members_org_uuid_user_uuid_key" ON "organization_members"("org_uuid", "user_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "organization_roles_uuid_key" ON "organization_roles"("uuid");

-- CreateIndex
CREATE INDEX "organization_roles_org_uuid_idx" ON "organization_roles"("org_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "organization_roles_org_uuid_name_key" ON "organization_roles"("org_uuid", "name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_uuid_key" ON "permissions"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_uuid_key" ON "role_permissions"("uuid");

-- CreateIndex
CREATE INDEX "role_permissions_role_uuid_idx" ON "role_permissions"("role_uuid");

-- CreateIndex
CREATE INDEX "role_permissions_permission_uuid_idx" ON "role_permissions"("permission_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_role_uuid_permission_uuid_key" ON "role_permissions"("role_uuid", "permission_uuid");

-- AddForeignKey
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_org_uuid_fkey" FOREIGN KEY ("org_uuid") REFERENCES "organizations"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_role_uuid_fkey" FOREIGN KEY ("role_uuid") REFERENCES "organization_roles"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_roles" ADD CONSTRAINT "organization_roles_org_uuid_fkey" FOREIGN KEY ("org_uuid") REFERENCES "organizations"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_uuid_fkey" FOREIGN KEY ("role_uuid") REFERENCES "organization_roles"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_uuid_fkey" FOREIGN KEY ("permission_uuid") REFERENCES "permissions"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_org_uuid_fkey" FOREIGN KEY ("org_uuid") REFERENCES "organizations"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
