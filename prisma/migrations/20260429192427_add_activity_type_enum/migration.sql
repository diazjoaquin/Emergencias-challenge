/*
  Warnings:

  - Changed the type of `activityType` on the `ContactActivity` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('call', 'meeting', 'email');

-- AlterTable
ALTER TABLE "ContactActivity" DROP COLUMN "activityType",
ADD COLUMN     "activityType" "ActivityType" NOT NULL;
