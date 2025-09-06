-- AlterTable
ALTER TABLE `classes` ADD COLUMN `hasProgression` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `progressions` (
    `id` VARCHAR(191) NOT NULL,
    `classeId` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `icon` VARCHAR(191) NULL,
    `iconColor` VARCHAR(191) NULL,
    `contentType` VARCHAR(191) NOT NULL,
    `resourceUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `progressions_classeId_date_idx`(`classeId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `progressions` ADD CONSTRAINT `progressions_classeId_fkey` FOREIGN KEY (`classeId`) REFERENCES `classes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
