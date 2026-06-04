CREATE TABLE `bibleBookmarks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`verseId` int NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bibleBookmarks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bibleBooks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bookNumber` int NOT NULL,
	`bookName` varchar(64) NOT NULL,
	`testament` enum('Old Testament','New Testament') NOT NULL,
	`abbreviation` varchar(10) NOT NULL,
	`chapterCount` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bibleBooks_id` PRIMARY KEY(`id`),
	CONSTRAINT `bibleBooks_bookNumber_unique` UNIQUE(`bookNumber`),
	CONSTRAINT `bibleBooks_bookName_unique` UNIQUE(`bookName`)
);
--> statement-breakpoint
CREATE TABLE `bibleReadingProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`bookId` int NOT NULL,
	`chapter` int NOT NULL,
	`isRead` boolean NOT NULL DEFAULT false,
	`lastReadAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bibleReadingProgress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bibleVerses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bookId` int NOT NULL,
	`chapter` int NOT NULL,
	`verse` int NOT NULL,
	`text` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bibleVerses_id` PRIMARY KEY(`id`)
);
