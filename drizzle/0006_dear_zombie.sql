CREATE TABLE `unlock_redemption_audits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`code` varchar(80) NOT NULL,
	`outcome` enum('SUCCESS','ALREADY_USED','INVALID','RACE_LOST') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `unlock_redemption_audits_id` PRIMARY KEY(`id`)
);
