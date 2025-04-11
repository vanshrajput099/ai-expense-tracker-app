/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `testimonials` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "testimonials_userId_key" ON "testimonials"("userId");
