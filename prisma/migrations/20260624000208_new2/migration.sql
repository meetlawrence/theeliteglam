/*
  Warnings:

  - You are about to drop the column `isActive` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `lastLogin` on the `admins` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "admins" DROP COLUMN "isActive",
DROP COLUMN "lastLogin",
ADD COLUMN     "lastLoginAt" TIMESTAMP(3);
