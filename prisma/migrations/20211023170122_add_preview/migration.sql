-- CreateTable
CREATE TABLE `ClipPreview` (
    `id` INTEGER NOT NULL,
    `title` VARCHAR(191) NULL,
    `favicons` VARCHAR(191) NULL,
    `images` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,

    UNIQUE INDEX `ClipPreview_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
