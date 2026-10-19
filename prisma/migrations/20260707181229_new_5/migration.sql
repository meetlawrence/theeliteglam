/*
  Warnings:

  - The values [OTHER] on the enum `Gender` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `password` on the `Contestant` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContestantCategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `contestantCategories` to the `Contestant` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContestantCategories" AS ENUM ('MALE', 'FEMALE');

-- AlterEnum
BEGIN;
CREATE TYPE "Gender_new" AS ENUM ('MALE', 'FEMALE');
ALTER TABLE "Contestant" ALTER COLUMN "gender" TYPE "Gender_new" USING ("gender"::text::"Gender_new");
ALTER TYPE "Gender" RENAME TO "Gender_old";
ALTER TYPE "Gender_new" RENAME TO "Gender";
DROP TYPE "public"."Gender_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_eventId_fkey";

-- DropForeignKey
ALTER TABLE "ContestantCategory" DROP CONSTRAINT "ContestantCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "ContestantCategory" DROP CONSTRAINT "ContestantCategory_contestantId_fkey";

-- DropForeignKey
ALTER TABLE "refresh_tokens" DROP CONSTRAINT "refresh_tokens_adminId_fkey";

-- AlterTable
ALTER TABLE "Contestant" DROP COLUMN "password",
ADD COLUMN     "contestantCategories" "ContestantCategories" NOT NULL;

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "categories" TEXT[];

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "ContestantCategory";

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;
