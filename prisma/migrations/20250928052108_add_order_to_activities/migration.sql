/*
  Warnings:

  - You are about to drop the `conquete` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `enigmes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rebus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `structure` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `activities` ADD COLUMN `order` INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE `conquete`;

-- DropTable
DROP TABLE `enigmes`;

-- DropTable
DROP TABLE `rebus`;

-- DropTable
DROP TABLE `sessions`;

-- DropTable
DROP TABLE `structure`;
