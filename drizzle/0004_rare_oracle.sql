CREATE TABLE `prompt_collection_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`collectionId` int NOT NULL,
	`savedPromptId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `prompt_collection_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `prompt_collections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(120) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `prompt_collections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `saved_prompt_versions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`savedPromptId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`category` varchar(120) NOT NULL,
	`content` text NOT NULL,
	`tags` varchar(500) NOT NULL DEFAULT '',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `saved_prompt_versions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `saved_prompts` ADD `tags` varchar(500) DEFAULT '' NOT NULL;