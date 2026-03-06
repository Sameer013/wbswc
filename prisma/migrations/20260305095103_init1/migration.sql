-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Event_Type` (
    `eventId` INTEGER NOT NULL AUTO_INCREMENT,
    `eventType` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,

    UNIQUE INDEX `Event_Type_eventType_key`(`eventType`),
    PRIMARY KEY (`eventId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EventMaster` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eventId` INTEGER NOT NULL,
    `eventTimestamp` DATETIME(3) NOT NULL,
    `value` VARCHAR(191) NULL,

    INDEX `EventMaster_eventTimestamp_idx`(`eventTimestamp`),
    INDEX `EventMaster_eventId_idx`(`eventId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnprEvent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eventMasterId` INTEGER NOT NULL,
    `vehicleNo` VARCHAR(191) NOT NULL,
    `vehicleWt` DOUBLE NULL,

    UNIQUE INDEX `AnprEvent_eventMasterId_key`(`eventMasterId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EventMaster` ADD CONSTRAINT `EventMaster_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event_Type`(`eventId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnprEvent` ADD CONSTRAINT `AnprEvent_eventMasterId_fkey` FOREIGN KEY (`eventMasterId`) REFERENCES `EventMaster`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
