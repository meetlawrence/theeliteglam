/*
  Warnings:

  - The `categories` column on the `Event` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "EventCategories" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "categories",
ADD COLUMN     "categories" "EventCategories" NOT NULL DEFAULT 'MALE';
