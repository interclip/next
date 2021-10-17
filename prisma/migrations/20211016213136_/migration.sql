/*
  Warnings:

  - You are about to drop the column `ownerUsername` on the `clips` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `clips` DROP COLUMN `ownerUsername`,
    ADD COLUMN `ownerID` VARCHAR(191);
