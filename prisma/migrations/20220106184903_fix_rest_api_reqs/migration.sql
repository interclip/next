/*
  Warnings:

  - You are about to alter the column `storageProvider` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Enum("users_storageProvider")` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `storageProvider` VARCHAR(191) NOT NULL DEFAULT 'S3';
