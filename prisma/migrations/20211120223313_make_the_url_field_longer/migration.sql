-- DropIndex
DROP INDEX `clips_url_key` ON `clips`;

-- AlterTable
ALTER TABLE `clips` MODIFY `url` TEXT NOT NULL;
