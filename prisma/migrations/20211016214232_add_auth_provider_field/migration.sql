-- AlterTable
ALTER TABLE `users` ADD COLUMN `authProvider` VARCHAR(191) NOT NULL DEFAULT 'email';
