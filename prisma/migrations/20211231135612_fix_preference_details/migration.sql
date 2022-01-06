/*
  Warnings:

  - You are about to alter the column `clipExpirationPreference` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `clipExpirationPreference` INTEGER NOT NULL DEFAULT 90,
    MODIFY `storageProvider` VARCHAR(191) NULL DEFAULT 's3';
