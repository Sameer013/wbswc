/*
  Warnings:

  - You are about to drop the column `title` on the `intrusionevent` table. All the data in the column will be lost.
  - Added the required column `description` to the `intrusionevent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `intrusionevent` DROP COLUMN `title`,
    ADD COLUMN `description` VARCHAR(191) NOT NULL;
