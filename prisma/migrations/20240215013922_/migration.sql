/*
  Warnings:

  - A unique constraint covering the columns `[name,userId,shareURL]` on the table `Form` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Form_name_userId_key";

-- DropIndex
DROP INDEX "Form_shareURL_key";

-- CreateIndex
CREATE UNIQUE INDEX "Form_name_userId_shareURL_key" ON "Form"("name", "userId", "shareURL");
