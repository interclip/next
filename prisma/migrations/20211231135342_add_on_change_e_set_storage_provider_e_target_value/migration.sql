-- AlterTable
ALTER TABLE `users` ADD COLUMN `clipExpirationPreference` VARCHAR(191) NOT NULL DEFAULT 's3',
    ADD COLUMN `storageProvider` VARCHAR(191) NULL;
