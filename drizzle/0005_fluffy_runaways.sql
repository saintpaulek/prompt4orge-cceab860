CREATE TABLE `unlock_code_audits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`adminUserId` int NOT NULL,
	`generatedCount` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `unlock_code_audits_id` PRIMARY KEY(`id`)
);
