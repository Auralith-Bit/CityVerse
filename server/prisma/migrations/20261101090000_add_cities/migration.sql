-- CreateTable
CREATE TABLE `cities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `cities_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Seed existing cities so current places keep their city
INSERT INTO `cities` (`name`, `slug`, `description`, `createdAt`, `updatedAt`) VALUES
    ('Butwal', 'butwal', 'Commercial crossroads at the base of the Chure hills, bordered by the Tinau river.', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
    ('Bhairahawa', 'bhairahawa', 'Southern aviation and trading gateway to Lumbini and the Terai plains.', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));

-- AlterTable
ALTER TABLE `places` ADD COLUMN `cityId` INTEGER NULL;

-- Preserve existing place city assignments
UPDATE `places` SET `cityId` = (SELECT `id` FROM `cities` WHERE `slug` = 'butwal') WHERE `city` = 'BUTWAL';
UPDATE `places` SET `cityId` = (SELECT `id` FROM `cities` WHERE `slug` = 'bhairahawa') WHERE `city` = 'BHAIRAHWA';

-- AlterTable
ALTER TABLE `places` DROP INDEX `places_city_idx`,
    DROP COLUMN `city`,
    MODIFY `cityId` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `places_cityId_idx` ON `places`(`cityId`);

-- AddForeignKey
ALTER TABLE `places` ADD CONSTRAINT `places_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `cities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
