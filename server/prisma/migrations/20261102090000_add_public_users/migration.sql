-- Allow OAuth users without a password
ALTER TABLE `users` MODIFY `password` VARCHAR(191) NULL;

-- Add OAuth identity columns
ALTER TABLE `users` ADD COLUMN `googleId` VARCHAR(191) NULL,
    ADD COLUMN `appleId` VARCHAR(191) NULL,
    ADD COLUMN `avatarUrl` VARCHAR(191) NULL;

-- Add USER role for public accounts
ALTER TABLE `users` MODIFY `role` ENUM('ADMIN', 'EDITOR', 'USER') NOT NULL DEFAULT 'USER';

-- CreateIndex
CREATE UNIQUE INDEX `users_googleId_key` ON `users`(`googleId`);
CREATE UNIQUE INDEX `users_appleId_key` ON `users`(`appleId`);
