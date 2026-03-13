-- CreateTable
CREATE TABLE `intrusionevent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eventMasterId` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `severity` ENUM('low', 'medium', 'high', 'critical') NOT NULL DEFAULT 'medium',

    UNIQUE INDEX `IntrusionEvent_eventMasterId_key`(`eventMasterId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `intrusionevent` ADD CONSTRAINT `IntrusionEvent_eventMasterId_fkey` FOREIGN KEY (`eventMasterId`) REFERENCES `eventmaster`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
