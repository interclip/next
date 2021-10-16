/*
  Warnings:

  - You are about to drop the `Clip` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Clip`;

-- CreateTable
CREATE TABLE `clips` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiresAt` DATETIME(3),

    UNIQUE INDEX `clips_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
