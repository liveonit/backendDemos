CREATE TABLE `role_permissions_permission` (
  `roleId` varchar(36) NOT NULL,
  `permissionId` varchar(36) NOT NULL,
  INDEX `IDX_b36cb2e04bc353ca4ede00d87b` (`roleId`),
  INDEX `IDX_bfbc9e263d4cea6d7a8c9eb3ad` (`permissionId`),
  PRIMARY KEY (`roleId`, `permissionId`)
);
