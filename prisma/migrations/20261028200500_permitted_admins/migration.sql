ALTER TABLE "admins"
ADD COLUMN "permitted" BOOLEAN NOT NULL DEFAULT false;

UPDATE "admins"
SET "permitted" = "emailVerified";

ALTER TABLE "admins"
DROP COLUMN "emailVerifiedAt",
DROP COLUMN "emailVerified";
