/*
  Warnings:

  - You are about to alter the column `favicons` on the `ClipPreview` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - You are about to alter the column `images` on the `ClipPreview` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `ClipPreview` MODIFY `favicons` JSON NULL,
    MODIFY `images` JSON NULL;
