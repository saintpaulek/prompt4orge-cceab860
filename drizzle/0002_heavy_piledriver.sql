CREATE TABLE `prompts` (
	`id` varchar(8) NOT NULL,
	`title` varchar(255) NOT NULL,
	`category` varchar(120) NOT NULL,
	`role` varchar(255) NOT NULL,
	`tags` varchar(255) NOT NULL,
	`access` enum('FREE','LOCKED') NOT NULL,
	`prompt_body` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `prompts_id` PRIMARY KEY(`id`)
);
