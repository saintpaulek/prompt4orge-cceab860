CREATE TABLE `unlock_codes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(80) NOT NULL,
	`isUsed` int NOT NULL DEFAULT 0,
	`usedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `unlock_codes_id` PRIMARY KEY(`id`),
	CONSTRAINT `unlock_codes_code_unique` UNIQUE(`code`)
);
