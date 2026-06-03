CREATE TABLE `dreams` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`dreamContent` text NOT NULL,
	`interpretation` text,
	`mood` varchar(64),
	`isSaved` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dreams_id` PRIMARY KEY(`id`)
);
