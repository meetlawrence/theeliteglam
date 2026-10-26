/*
  Warnings:

  - The `categories` column on the `Event` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `contestantCategories` on the `Contestant` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ContestantCategory" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "Contestant" DROP COLUMN "contestantCategories",
ADD COLUMN     "contestantCategories" "ContestantCategory" NOT NULL;

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "contestantFee" SET DATA TYPE DECIMAL(12,2),
DROP COLUMN "categories",
ADD COLUMN     "categories" "ContestantCategory"[];
