/*
  Warnings:

  - Made the column `storageProvider` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `storageProvider` ENUM('S3', 'IPFS') NOT NULL DEFAULT 'S3';
