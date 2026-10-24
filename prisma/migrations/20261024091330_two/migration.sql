/*
  Warnings:

  - The values [PAID,CANCELLED] on the enum `TicketStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `avatar` on the `Contestant` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Contestant` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfBirth` on the `Contestant` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `Ticket` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[reference]` on the table `Contestant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[paymentTransactionId]` on the table `Contestant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ticket]` on the table `Ticket` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[paymentTransactionId,reference]` on the table `Ticket` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `advocacy` to the `Contestant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `age` to the `Contestant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `funFact` to the `Contestant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `occupation` to the `Contestant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentTransactionId` to the `Contestant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reference` to the `Contestant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Contestant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tribe` to the `Contestant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contestantFee` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `categories` on the `Event` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `paymentTransactionId` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reference` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ticket` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ticketTypeId` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentPurpose" AS ENUM ('TICKET', 'CONTESTANT');

-- CreateEnum
CREATE TYPE "PaymentGateway" AS ENUM ('PAYSTACK', 'OPAY');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "FulfillmentStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('ABANDONED', 'FAILED', 'ONGOING', 'PENDING', 'PROCESSING', 'QUEUED', 'REVERSED', 'SUCCESS', 'USED');

-- AlterEnum
BEGIN;
CREATE TYPE "TicketStatus_new" AS ENUM ('PENDING', 'SENT', 'USED');
ALTER TABLE "public"."Ticket" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Ticket" ALTER COLUMN "status" TYPE "TicketStatus_new" USING ("status"::text::"TicketStatus_new");
ALTER TYPE "TicketStatus" RENAME TO "TicketStatus_old";
ALTER TYPE "TicketStatus_new" RENAME TO "TicketStatus";
DROP TYPE "public"."TicketStatus_old";
ALTER TABLE "Ticket" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "Contestant" DROP CONSTRAINT "Contestant_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_eventId_fkey";

-- DropIndex
DROP INDEX "Ticket_email_idx";

-- AlterTable
ALTER TABLE "Contestant" DROP COLUMN "avatar",
DROP COLUMN "city",
DROP COLUMN "dateOfBirth",
ADD COLUMN     "advocacy" TEXT NOT NULL,
ADD COLUMN     "age" INTEGER NOT NULL,
ADD COLUMN     "funFact" TEXT NOT NULL,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "number" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "occupation" TEXT NOT NULL,
ADD COLUMN     "paymentTransactionId" TEXT NOT NULL,
ADD COLUMN     "reference" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "tribe" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "auditionsDate" TIMESTAMP(3),
ADD COLUMN     "contestantFee" INTEGER NOT NULL,
ADD COLUMN     "grandFinaleDate" TIMESTAMP(3),
ADD COLUMN     "isContestantsVisible" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isRegistrationOpen" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isTicketsOpen" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVotingOpen" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "itineraryTitle" TEXT DEFAULT 'FOUR DAYS OF EXCELLENCE',
ADD COLUMN     "preliminaryDate" TIMESTAMP(3),
ADD COLUMN     "registrationCloseDate" TIMESTAMP(3),
ADD COLUMN     "registrationOpenDate" TIMESTAMP(3),
DROP COLUMN "categories",
ADD COLUMN     "categories" "ContestantCategories" NOT NULL;

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "amount",
DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "phone",
DROP COLUMN "quantity",
DROP COLUMN "total",
ADD COLUMN     "paymentTransactionId" TEXT NOT NULL,
ADD COLUMN     "reference" TEXT NOT NULL,
ADD COLUMN     "ticket" TEXT NOT NULL,
ADD COLUMN     "ticketTransactionId" TEXT,
ADD COLUMN     "ticketTypeId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "EventCategories";

-- CreateTable
CREATE TABLE "event_itinerary_days" (
    "id" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "schedule" JSONB NOT NULL,
    "eventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_itinerary_days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "capacity" INTEGER,
    "benefits" TEXT[],
    "eventId" TEXT NOT NULL,

    CONSTRAINT "TicketType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketTransaction" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "eventId" TEXT NOT NULL,
    "ticketTypeId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "total" DOUBLE PRECISION NOT NULL,
    "reference" TEXT NOT NULL,
    "paymentMethod" TEXT,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "claimed" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TicketTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "idempotency_keys" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL DEFAULT 0,
    "response" JSONB,
    "pending" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "idempotency_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentTransaction" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "purpose" "PaymentPurpose" NOT NULL,
    "gateway" "PaymentGateway" NOT NULL,
    "gatewayReference" TEXT,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'NGN',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "fulfillmentStatus" "FulfillmentStatus" NOT NULL DEFAULT 'PENDING',
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "name" TEXT,
    "eventId" TEXT NOT NULL,
    "ticketTypeId" TEXT,
    "quantity" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_itinerary_days_eventId_dayNumber_key" ON "event_itinerary_days"("eventId", "dayNumber");

-- CreateIndex
CREATE UNIQUE INDEX "TicketTransaction_reference_key" ON "TicketTransaction"("reference");

-- CreateIndex
CREATE INDEX "TicketTransaction_email_idx" ON "TicketTransaction"("email");

-- CreateIndex
CREATE INDEX "TicketTransaction_eventId_idx" ON "TicketTransaction"("eventId");

-- CreateIndex
CREATE INDEX "TicketTransaction_reference_idx" ON "TicketTransaction"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "idempotency_keys_key_key" ON "idempotency_keys"("key");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentTransaction_reference_key" ON "PaymentTransaction"("reference");

-- CreateIndex
CREATE INDEX "PaymentTransaction_email_idx" ON "PaymentTransaction"("email");

-- CreateIndex
CREATE INDEX "PaymentTransaction_eventId_idx" ON "PaymentTransaction"("eventId");

-- CreateIndex
CREATE INDEX "PaymentTransaction_status_idx" ON "PaymentTransaction"("status");

-- CreateIndex
CREATE INDEX "PaymentTransaction_purpose_idx" ON "PaymentTransaction"("purpose");

-- CreateIndex
CREATE UNIQUE INDEX "Contestant_reference_key" ON "Contestant"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Contestant_paymentTransactionId_key" ON "Contestant"("paymentTransactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_ticket_key" ON "Ticket"("ticket");

-- CreateIndex
CREATE INDEX "Ticket_paymentTransactionId_idx" ON "Ticket"("paymentTransactionId");

-- CreateIndex
CREATE INDEX "Ticket_reference_idx" ON "Ticket"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_paymentTransactionId_reference_key" ON "Ticket"("paymentTransactionId", "reference");

-- AddForeignKey
ALTER TABLE "Contestant" ADD CONSTRAINT "Contestant_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contestant" ADD CONSTRAINT "Contestant_paymentTransactionId_fkey" FOREIGN KEY ("paymentTransactionId") REFERENCES "PaymentTransaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_itinerary_days" ADD CONSTRAINT "event_itinerary_days_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketType" ADD CONSTRAINT "TicketType_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketTransaction" ADD CONSTRAINT "TicketTransaction_ticketTypeId_fkey" FOREIGN KEY ("ticketTypeId") REFERENCES "TicketType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketTransaction" ADD CONSTRAINT "TicketTransaction_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_paymentTransactionId_fkey" FOREIGN KEY ("paymentTransactionId") REFERENCES "PaymentTransaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_ticketTypeId_fkey" FOREIGN KEY ("ticketTypeId") REFERENCES "TicketType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_ticketTransactionId_fkey" FOREIGN KEY ("ticketTransactionId") REFERENCES "TicketTransaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
