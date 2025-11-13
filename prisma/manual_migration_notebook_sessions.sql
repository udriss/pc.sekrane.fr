-- Migration manuelle pour ajouter la table notebook_sessions
-- Cette migration ajoute la nouvelle table sans modifier les tables existantes

CREATE TABLE IF NOT EXISTS `notebook_sessions` (
  `id` VARCHAR(191) NOT NULL,
  `uniqueId` VARCHAR(191) NOT NULL,
  `dirPath` VARCHAR(191) NOT NULL,
  `originalFileName` VARCHAR(191) NOT NULL,
  `userName` VARCHAR(191) NOT NULL,
  `courseId` INTEGER NOT NULL,
  `activityId` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `notebook_sessions_uniqueId_key`(`uniqueId`),
  INDEX `notebook_sessions_uniqueId_idx`(`uniqueId`),
  INDEX `notebook_sessions_courseId_idx`(`courseId`),
  INDEX `notebook_sessions_activityId_idx`(`activityId`),
  CONSTRAINT `notebook_sessions_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `notebook_sessions_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `activities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
