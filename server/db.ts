import { randomBytes } from "node:crypto";
import { and, asc, count, desc, eq, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertSavedPrompt, InsertUser, collectionItems, collections, promptVersions, prompts, savedPrompts, unlockCodes, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Supabase account UUIDs change when an Auth user is deleted and recreated.
// The verified owner email is therefore the durable recovery identity for the
// one owner-controlled administrative account.
export const PROMPTFORGE_OWNER_EMAIL = "saintpaulek@gmail.com";

export function isPromptForgeOwnerEmail(email: string | null | undefined) {
  return email?.trim().toLowerCase() === PROMPTFORGE_OWNER_EMAIL;
}

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  for (const field of ["name", "email", "loginMethod"] as const) {
    if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; }
  }
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId || isPromptForgeOwnerEmail(user.email)) {
    values.role = "admin";
    values.isUnlocked = 1;
    updateSet.role = "admin";
    updateSet.isUnlocked = 1;
  }
  if (user.isUnlocked !== undefined) { values.isUnlocked = user.isUnlocked; updateSet.isUnlocked = user.isUnlocked; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export const UNLOCK_CODE_PATTERN = /^PF-[0-9A-F]{6}-[0-9A-F]{6}$/;

export function makeUnlockCode() {
  const left = randomBytes(3).toString("hex").toUpperCase();
  const right = randomBytes(3).toString("hex").toUpperCase();
  return `PF-${left}-${right}`;
}

export async function createUnlockCodes(count: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const values = Array.from({ length: count }, () => ({ code: makeUnlockCode(), isUsed: 0, usedBy: null }));
  await db.insert(unlockCodes).values(values);
  return values.map(value => value.code);
}

export async function listUnlockCodes(limit = 100) {
  const db = await getDb();
  if (!db) return [];
  return db.select({ id: unlockCodes.id, code: unlockCodes.code, isUsed: unlockCodes.isUsed, usedBy: unlockCodes.usedBy, createdAt: unlockCodes.createdAt }).from(unlockCodes).orderBy(desc(unlockCodes.createdAt)).limit(limit);
}

export async function redeemUnlockCode(userId: number, code: string) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const normalized = code.trim().toUpperCase();
  if (!normalized) return { status: "invalid" as const };

  return db.transaction(async tx => {
    const matches = await tx.select({ id: unlockCodes.id, isUsed: unlockCodes.isUsed })
      .from(unlockCodes)
      .where(eq(unlockCodes.code, normalized))
      .limit(1);
    const found = matches[0];
    if (!found) return { status: "invalid" as const };
    if (found.isUsed) return { status: "already_used" as const };

    // The conditional update is the single-use guard. Concurrent attempts for
    // the same code can never both claim it because only the first update can
    // change isUsed from 0 to 1.
    const updateResult = await tx.update(unlockCodes)
      .set({ isUsed: 1, usedBy: userId })
      .where(and(eq(unlockCodes.id, found.id), eq(unlockCodes.isUsed, 0)));
    const affectedRows = (updateResult as { affectedRows?: number }).affectedRows ?? 0;
    if (affectedRows !== 1) return { status: "already_used" as const };

    const unlockedAt = new Date();
    // Persist access and redemption history on the authenticated account. The
    // profile is keyed by account id, so access follows that account across
    // devices after the user signs in again.
    await tx.update(users).set({ isUnlocked: 1, unlockedAt, unlockCode: normalized }).where(eq(users.id, userId));
    return { status: "success" as const, redeemedCode: normalized, unlockedAt };
  });
}

export async function updateUserProfile(userId: number, name: string) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(users).set({ name }).where(eq(users.id, userId));
}

export async function getUserById(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return result[0];
}

type CatalogInput = { search?: string; category?: string; access?: "ALL" | "FREE" | "LOCKED"; sort?: "NEWEST" | "OLDEST" | "POPULAR"; limit: number; offset: number };

function catalogConditions(input: CatalogInput) {
  const conditions = [];
  if (input.category && input.category !== "ALL") conditions.push(eq(prompts.category, input.category));
  if (input.access && input.access !== "ALL") conditions.push(eq(prompts.access, input.access));
  if (input.search?.trim()) {
    const term = `%${input.search.trim()}%`;
    conditions.push(or(like(prompts.title, term), like(prompts.category, term), like(prompts.tags, term)));
  }
  return conditions;
}

export async function listPrompts(input: CatalogInput, viewer?: { role?: string; isUnlocked?: number }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = catalogConditions(input);
  const order = input.sort === "OLDEST" ? [asc(prompts.createdAt), asc(prompts.id)] : input.sort === "POPULAR" ? [desc(prompts.access), desc(prompts.createdAt), asc(prompts.id)] : [desc(prompts.createdAt), desc(prompts.id)];
  const rows = await db.select().from(prompts).where(conditions.length ? and(...conditions) : undefined).orderBy(...order).limit(input.limit).offset(input.offset);
  const canViewLocked = viewer?.role === "admin" || viewer?.isUnlocked === 1;
  return rows.map(row => canViewLocked || row.access === "FREE" ? row : { ...row, promptBody: "" });
}

export async function countPrompts(input?: CatalogInput) {
  const db = await getDb();
  if (!db) return 0;
  const conditions = input ? catalogConditions(input) : [];
  const result = await db.select({ value: count() }).from(prompts).where(conditions.length ? and(...conditions) : undefined);
  return Number(result[0]?.value ?? 0);
}

export async function listSavedPrompts(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(savedPrompts).where(eq(savedPrompts.userId, userId)).orderBy(desc(savedPrompts.createdAt));
}

export async function createSavedPrompt(input: InsertSavedPrompt) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(savedPrompts).values(input).$returningId();
  return result[0];
}

export async function deleteSavedPrompt(userId: number, id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.delete(savedPrompts).where(and(eq(savedPrompts.userId, userId), eq(savedPrompts.id, id)));
}

export async function setSavedPromptFavorite(userId: number, id: number, isFavorite: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(savedPrompts).set({ isFavorite }).where(and(eq(savedPrompts.userId, userId), eq(savedPrompts.id, id)));
}

export async function updateSavedPromptTags(userId: number, id: number, tags: string) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(savedPrompts).set({ tags }).where(and(eq(savedPrompts.userId, userId), eq(savedPrompts.id, id)));
}

export async function listCollections(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(collections).where(eq(collections.userId, userId)).orderBy(asc(collections.name));
}

export async function createCollection(userId: number, name: string) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(collections).values({ userId, name }).$returningId();
  return result[0];
}

export async function deleteCollection(userId: number, id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.delete(collectionItems).where(eq(collectionItems.collectionId, id));
  await db.delete(collections).where(and(eq(collections.userId, userId), eq(collections.id, id)));
}

export async function listCollectionItems(userId: number, collectionId: number) {
  const db = await getDb();
  if (!db) return [];
  const owned = await db.select({ id: collections.id }).from(collections).where(and(eq(collections.id, collectionId), eq(collections.userId, userId))).limit(1);
  if (!owned[0]) return [];
  return db.select({ membershipId: collectionItems.id, savedPromptId: savedPrompts.id, title: savedPrompts.title, category: savedPrompts.category, content: savedPrompts.content, tags: savedPrompts.tags })
    .from(collectionItems)
    .innerJoin(savedPrompts, eq(savedPrompts.id, collectionItems.savedPromptId))
    .where(and(eq(collectionItems.collectionId, collectionId), eq(savedPrompts.userId, userId)))
    .orderBy(desc(collectionItems.createdAt));
}

export async function addPromptToCollection(userId: number, collectionId: number, savedPromptId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const [collection, prompt] = await Promise.all([
    db.select({ id: collections.id }).from(collections).where(and(eq(collections.id, collectionId), eq(collections.userId, userId))).limit(1),
    db.select({ id: savedPrompts.id }).from(savedPrompts).where(and(eq(savedPrompts.id, savedPromptId), eq(savedPrompts.userId, userId))).limit(1),
  ]);
  if (!collection[0] || !prompt[0]) return { status: "not_found" as const };
  const existing = await db.select({ id: collectionItems.id }).from(collectionItems).where(and(eq(collectionItems.collectionId, collectionId), eq(collectionItems.savedPromptId, savedPromptId))).limit(1);
  if (!existing[0]) await db.insert(collectionItems).values({ collectionId, savedPromptId });
  return { status: "added" as const };
}

export async function removePromptFromCollection(userId: number, collectionId: number, savedPromptId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const owned = await db.select({ id: collections.id }).from(collections).where(and(eq(collections.id, collectionId), eq(collections.userId, userId))).limit(1);
  if (!owned[0]) return { status: "not_found" as const };
  await db.delete(collectionItems).where(and(eq(collectionItems.collectionId, collectionId), eq(collectionItems.savedPromptId, savedPromptId)));
  return { status: "removed" as const };
}

export async function createPromptVersion(userId: number, savedPromptId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const source = await db.select({ title: savedPrompts.title, category: savedPrompts.category, content: savedPrompts.content, tags: savedPrompts.tags })
    .from(savedPrompts).where(and(eq(savedPrompts.id, savedPromptId), eq(savedPrompts.userId, userId))).limit(1);
  if (!source[0]) return { status: "not_found" as const };
  const result = await db.insert(promptVersions).values({ userId, savedPromptId, ...source[0] }).$returningId();
  return { status: "created" as const, id: result[0]?.id };
}

export async function listPromptVersions(userId: number, savedPromptId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(promptVersions).where(and(eq(promptVersions.userId, userId), eq(promptVersions.savedPromptId, savedPromptId))).orderBy(desc(promptVersions.createdAt));
}
