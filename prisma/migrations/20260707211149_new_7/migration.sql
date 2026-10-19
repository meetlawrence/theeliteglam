/*
  Warnings:

  - Added the required column `eventId` to the `Contestant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contestant" ADD COLUMN     "eventId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Contestant" ADD CONSTRAINT "Contestant_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
