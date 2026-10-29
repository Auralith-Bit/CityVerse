-- AlterTable
ALTER TABLE `places` ADD COLUMN `highlights` JSON NULL,
    ADD COLUMN `bestTime` VARCHAR(120) NULL,
    ADD COLUMN `gettingThere` TEXT NULL,
    ADD COLUMN `travelTips` TEXT NULL;
