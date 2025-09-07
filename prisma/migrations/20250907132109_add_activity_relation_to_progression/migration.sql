-- AlterTable
ALTER TABLE `progressions` ADD COLUMN `activityId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `progressions` ADD CONSTRAINT `progressions_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `activities`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
