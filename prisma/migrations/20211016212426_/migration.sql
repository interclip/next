/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `clips` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `clips` ADD COLUMN `ownerUsername` VARCHAR(191);

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `clips_url_key` ON `clips`(`url`);
