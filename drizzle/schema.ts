import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 128 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  isUnlocked: int("isUnlocked").default(0).notNull(),
  unlockedAt: timestamp("unlockedAt"),
  unlockCode: varchar("unlockCode", { length: 80 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const unlockCodes = mysqlTable("unlock_codes", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 80 }).notNull().unique(),
  isUsed: int("isUsed").default(0).notNull(),
  usedBy: int("usedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const unlockCodeAudits = mysqlTable("unlock_code_audits", {
  id: int("id").autoincrement().primaryKey(),
  adminUserId: int("adminUserId").notNull(),
  generatedCount: int("generatedCount").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const prompts = mysqlTable("prompts", {
  id: varchar("id", { length: 8 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 120 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  tags: varchar("tags", { length: 255 }).notNull(),
  access: mysqlEnum("access", ["FREE", "LOCKED"]).notNull(),
  promptBody: text("prompt_body").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const savedPrompts = mysqlTable("saved_prompts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 120 }).notNull(),
  content: text("content").notNull(),
  isFavorite: int("isFavorite").default(0).notNull(),
  tags: varchar("tags", { length: 500 }).default("").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type UnlockCode = typeof unlockCodes.$inferSelect;
export type UnlockCodeAudit = typeof unlockCodeAudits.$inferSelect;
export type Prompt = typeof prompts.$inferSelect;
export type InsertPrompt = typeof prompts.$inferInsert;
export type SavedPrompt = typeof savedPrompts.$inferSelect;
export type InsertSavedPrompt = typeof savedPrompts.$inferInsert;

export const collections = mysqlTable("prompt_collections", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const collectionItems = mysqlTable("prompt_collection_items", {
  id: int("id").autoincrement().primaryKey(),
  collectionId: int("collectionId").notNull(),
  savedPromptId: int("savedPromptId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const promptVersions = mysqlTable("saved_prompt_versions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  savedPromptId: int("savedPromptId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 120 }).notNull(),
  content: text("content").notNull(),
  tags: varchar("tags", { length: 500 }).default("").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Collection = typeof collections.$inferSelect;
export type CollectionItem = typeof collectionItems.$inferSelect;
export type PromptVersion = typeof promptVersions.$inferSelect;
