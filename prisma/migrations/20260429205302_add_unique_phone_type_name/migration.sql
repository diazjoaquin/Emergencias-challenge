/*
  Warnings:

  - A unique constraint covering the columns `[typeName]` on the table `PhoneType` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PhoneType_typeName_key" ON "PhoneType"("typeName");
