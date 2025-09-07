-- CreateTable
CREATE TABLE `connection_logs` (
    `id` VARCHAR(191) NOT NULL,
    `ip` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endpoint` VARCHAR(191) NOT NULL,
    `method` VARCHAR(191) NOT NULL,
    `userAgent` VARCHAR(191) NULL,
    `language` VARCHAR(191) NULL,
    `screen` VARCHAR(191) NULL,
    `timezone` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
