CREATE TABLE `book` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NULL,
  `isPublished` tinyint NOT NULL DEFAULT 0,
  `authorId` int NOT NULL,
  PRIMARY KEY (`id`)
);
