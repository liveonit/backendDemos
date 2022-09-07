CREATE TABLE `user_roles_role` (
  `userId` varchar(36) NOT NULL,
  `roleId` varchar(36) NOT NULL,
  INDEX `IDX_5f9286e6c25594c6b88c108db7` (`userId`),
  INDEX `IDX_4be2f7adf862634f5f803d246b` (`roleId`),
  PRIMARY KEY (`userId`, `roleId`)
);
