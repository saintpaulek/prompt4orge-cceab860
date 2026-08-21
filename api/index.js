// server/vercelApi.ts
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";
var OAUTH_STATE_COOKIE = "__Host-oauth_state";
var decodeOAuthState = (state) => {
  let decoded;
  try {
    decoded = atob(state);
  } catch {
    return { redirectUri: "" };
  }
  try {
    const parsed = JSON.parse(decoded);
    if (parsed && typeof parsed.redirectUri === "string") return parsed;
  } catch {
  }
  return { redirectUri: decoded };
};

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
import { TRPCError } from "@trpc/server";

// server/_core/env.ts
var ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
};

// server/_core/notification.ts
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers.ts
import { TRPCError as TRPCError3 } from "@trpc/server";
import { z as z2 } from "zod";

// server/db.ts
import { randomBytes } from "node:crypto";
import { and, asc, count, desc, eq, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";

// drizzle/schema.ts
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
var users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 128 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  isUnlocked: int("isUnlocked").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
});
var unlockCodes = mysqlTable("unlock_codes", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 80 }).notNull().unique(),
  isUsed: int("isUsed").default(0).notNull(),
  usedBy: int("usedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var prompts = mysqlTable("prompts", {
  id: varchar("id", { length: 8 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 120 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  tags: varchar("tags", { length: 255 }).notNull(),
  access: mysqlEnum("access", ["FREE", "LOCKED"]).notNull(),
  promptBody: text("prompt_body").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var savedPrompts = mysqlTable("saved_prompts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 120 }).notNull(),
  content: text("content").notNull(),
  isFavorite: int("isFavorite").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});

// server/db.ts
var _db = null;
async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
async function upsertUser(user) {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values = { openId: user.openId };
  const updateSet = {};
  for (const field of ["name", "email", "loginMethod"]) {
    if (user[field] !== void 0) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  if (user.lastSignedIn !== void 0) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== void 0) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  if (user.isUnlocked !== void 0) {
    values.isUnlocked = user.isUnlocked;
    updateSet.isUnlocked = user.isUnlocked;
  }
  if (!values.lastSignedIn) values.lastSignedIn = /* @__PURE__ */ new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = /* @__PURE__ */ new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}
function makeUnlockCode() {
  const left = randomBytes(3).toString("hex").toUpperCase();
  const right = randomBytes(3).toString("hex").toUpperCase();
  return `PF-${left}-${right}`;
}
async function createUnlockCodes(count2) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const values = Array.from({ length: count2 }, () => ({ code: makeUnlockCode(), isUsed: 0, usedBy: null }));
  await db.insert(unlockCodes).values(values);
  return values.map((value) => value.code);
}
async function listUnlockCodes(limit = 100) {
  const db = await getDb();
  if (!db) return [];
  return db.select({ id: unlockCodes.id, code: unlockCodes.code, isUsed: unlockCodes.isUsed, usedBy: unlockCodes.usedBy, createdAt: unlockCodes.createdAt }).from(unlockCodes).orderBy(desc(unlockCodes.createdAt)).limit(limit);
}
async function redeemUnlockCode(userId, code) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const normalized = code.trim().toUpperCase();
  const matches = await db.select().from(unlockCodes).where(and(eq(unlockCodes.code, normalized), eq(unlockCodes.isUsed, 0))).limit(1);
  const found = matches[0];
  if (!found) return false;
  const updateResult = await db.update(unlockCodes).set({ isUsed: 1, usedBy: userId }).where(and(eq(unlockCodes.id, found.id), eq(unlockCodes.isUsed, 0)));
  const affectedRows = updateResult.affectedRows ?? 0;
  if (affectedRows !== 1) return false;
  await db.update(users).set({ isUnlocked: 1 }).where(eq(users.id, userId));
  return true;
}
async function updateUserProfile(userId, name) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(users).set({ name }).where(eq(users.id, userId));
}
async function getUserById(userId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return result[0];
}
function catalogConditions(input) {
  const conditions = [];
  if (input.category && input.category !== "ALL") conditions.push(eq(prompts.category, input.category));
  if (input.access && input.access !== "ALL") conditions.push(eq(prompts.access, input.access));
  if (input.search?.trim()) {
    const term = `%${input.search.trim()}%`;
    conditions.push(or(like(prompts.title, term), like(prompts.category, term), like(prompts.tags, term)));
  }
  return conditions;
}
async function listPrompts(input, viewer) {
  const db = await getDb();
  if (!db) return [];
  const conditions = catalogConditions(input);
  const order = input.sort === "OLDEST" ? [asc(prompts.createdAt), asc(prompts.id)] : input.sort === "POPULAR" ? [desc(prompts.access), desc(prompts.createdAt), asc(prompts.id)] : [desc(prompts.createdAt), desc(prompts.id)];
  const rows = await db.select().from(prompts).where(conditions.length ? and(...conditions) : void 0).orderBy(...order).limit(input.limit).offset(input.offset);
  const canViewLocked = viewer?.role === "admin" || viewer?.isUnlocked === 1;
  return rows.map((row) => canViewLocked || row.access === "FREE" ? row : { ...row, promptBody: "" });
}
async function countPrompts(input) {
  const db = await getDb();
  if (!db) return 0;
  const conditions = input ? catalogConditions(input) : [];
  const result = await db.select({ value: count() }).from(prompts).where(conditions.length ? and(...conditions) : void 0);
  return Number(result[0]?.value ?? 0);
}
async function listSavedPrompts(userId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(savedPrompts).where(eq(savedPrompts.userId, userId)).orderBy(desc(savedPrompts.createdAt));
}
async function createSavedPrompt(input) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(savedPrompts).values(input).$returningId();
  return result[0];
}
async function deleteSavedPrompt(userId, id) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.delete(savedPrompts).where(and(eq(savedPrompts.userId, userId), eq(savedPrompts.id, id)));
}
async function setSavedPromptFavorite(userId, id, isFavorite) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(savedPrompts).set({ isFavorite }).where(and(eq(savedPrompts.userId, userId), eq(savedPrompts.id, id)));
}

// server/routers.ts
var appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true
      };
    })
  }),
  contact: router({
    submit: publicProcedure.input(z2.object({ name: z2.string().trim().min(2).max(120), email: z2.string().trim().email().max(254), subject: z2.string().trim().min(3).max(180), message: z2.string().trim().min(10).max(5e3) })).mutation(async ({ input }) => {
      const delivered = await notifyOwner({
        title: `PromptForge contact: ${input.subject}`,
        content: `From: ${input.name} <${input.email}>\\n\\n${input.message}`
      });
      if (!delivered) throw new TRPCError3({ code: "SERVICE_UNAVAILABLE", message: "We could not deliver your message right now. Please email saintpaulek@gmail.com directly." });
      return { success: true };
    })
  }),
  catalog: router({
    list: publicProcedure.input(z2.object({ search: z2.string().optional(), category: z2.string().optional(), access: z2.enum(["ALL", "FREE", "LOCKED"]).default("ALL"), sort: z2.enum(["NEWEST", "OLDEST", "POPULAR"]).default("NEWEST"), limit: z2.number().int().min(1).max(100).default(60), offset: z2.number().int().min(0).default(0) })).query(async ({ ctx, input }) => {
      const [items, total] = await Promise.all([listPrompts(input, ctx.user ?? void 0), countPrompts(input)]);
      return { items, total };
    })
  }),
  profile: router({
    me: protectedProcedure.query(({ ctx }) => getUserById(ctx.user.id)),
    update: protectedProcedure.input(z2.object({ name: z2.string().min(1).max(120) })).mutation(async ({ ctx, input }) => {
      await updateUserProfile(ctx.user.id, input.name);
      return getUserById(ctx.user.id);
    }),
    redeemCode: protectedProcedure.input(z2.object({ code: z2.string().min(4).max(80) })).mutation(async ({ ctx, input }) => ({ success: await redeemUnlockCode(ctx.user.id, input.code) }))
  }),
  admin: router({
    unlocks: router({
      list: adminProcedure.input(z2.object({ limit: z2.number().int().min(1).max(200).default(100) }).optional()).query(({ input }) => listUnlockCodes(input?.limit ?? 100)),
      generate: adminProcedure.input(z2.object({ count: z2.number().int().min(1).max(50).default(1) })).mutation(async ({ input }) => ({ codes: await createUnlockCodes(input.count) }))
    })
  }),
  prompts: router({
    list: protectedProcedure.query(({ ctx }) => listSavedPrompts(ctx.user.id)),
    create: protectedProcedure.input(z2.object({ title: z2.string().min(1).max(255), category: z2.string().min(1).max(120), content: z2.string().min(1) })).mutation(({ ctx, input }) => createSavedPrompt({ userId: ctx.user.id, title: input.title, category: input.category, content: input.content })),
    remove: protectedProcedure.input(z2.object({ id: z2.number().int().positive() })).mutation(({ ctx, input }) => deleteSavedPrompt(ctx.user.id, input.id)),
    favorite: protectedProcedure.input(z2.object({ id: z2.number().int().positive(), isFavorite: z2.boolean() })).mutation(({ ctx, input }) => setSavedPromptFavorite(ctx.user.id, input.id, input.isFavorite ? 1 : 0))
  })
});

// server/_core/context.ts
import { createRemoteJWKSet, jwtVerify as jwtVerify2 } from "jose";

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString2 = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    return decodeOAuthState(state).redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString2(openId) || !isNonEmptyString2(appId) || !isNonEmptyString2(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    let sessionToken = cookies.get(COOKIE_NAME);
    if (!sessionToken) {
      const authHeader = req.headers.authorization;
      if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
        sessionToken = authHeader.slice(7);
      }
    }
    const session = await this.verifySession(sessionToken);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    if (session.openId.startsWith(CRON_OPEN_ID_PREFIX)) {
      const userInfo = await this.getUserInfoWithJwt(sessionToken ?? "");
      const taskUid = userInfo.taskUid ?? null;
      if (!taskUid) {
        throw ForbiddenError("Cron session missing task_uid");
      }
      return buildCronUser(userInfo);
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionToken ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var CRON_OPEN_ID_PREFIX = "cron_";
function buildCronUser(userInfo) {
  const now = /* @__PURE__ */ new Date();
  return {
    id: -1,
    openId: userInfo.openId,
    name: userInfo.name || "Manus Scheduled Task",
    email: null,
    loginMethod: null,
    role: "user",
    createdAt: now,
    updatedAt: now,
    lastSignedIn: now,
    taskUid: userInfo.taskUid ?? void 0,
    isCron: true
  };
}
var sdk = new SDKServer();

// server/_core/context.ts
var supabaseJwks = null;
function getSupabaseJwks() {
  const base = process.env.SUPABASE_URL;
  if (!base) return null;
  if (!supabaseJwks) supabaseJwks = createRemoteJWKSet(new URL(`${base.replace(/\/$/, "")}/auth/v1/.well-known/jwks.json`));
  return supabaseJwks;
}
async function authenticateSupabaseRequest(req) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return null;
  const jwks = getSupabaseJwks();
  const base = process.env.SUPABASE_URL;
  if (!jwks || !base) return null;
  try {
    const { payload } = await jwtVerify2(header.slice(7), jwks, { issuer: `${base.replace(/\/$/, "")}/auth/v1`, audience: "authenticated" });
    const openId = typeof payload.sub === "string" ? payload.sub : null;
    if (!openId) return null;
    const metadata = payload.user_metadata ?? {};
    const name = typeof metadata.display_name === "string" ? metadata.display_name : typeof payload.email === "string" ? payload.email.split("@")[0] : null;
    await upsertUser({ openId, name, email: typeof payload.email === "string" ? payload.email : null, loginMethod: "supabase", lastSignedIn: /* @__PURE__ */ new Date() });
    return await getUserByOpenId(openId) ?? null;
  } catch (error) {
    console.warn("[Supabase Auth] Invalid bearer token", error instanceof Error ? error.message : error);
    return null;
  }
}
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch {
    user = null;
  }
  if (!user) user = await authenticateSupabaseRequest(opts.req);
  return { req: opts.req, res: opts.res, user };
}

// server/_core/oauth.ts
import { parse as parseCookieHeader2 } from "cookie";
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app2) {
  app2.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    const { nonce } = decodeOAuthState(state);
    const expectedNonce = parseCookieHeader2(req.headers.cookie ?? "")[OAUTH_STATE_COOKIE];
    if (!nonce || nonce !== expectedNonce) {
      res.status(403).json({ error: "invalid oauth state" });
      return;
    }
    res.clearCookie(OAUTH_STATE_COOKIE, { path: "/", secure: true, sameSite: "none" });
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/_core/storageProxy.ts
function registerStorageProxy(app2) {
  app2.get("/manus-storage/*", async (req, res) => {
    const key = req.params[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }
    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }
    try {
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/"
      );
      forgeUrl.searchParams.set("path", key);
      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` }
      });
      if (!forgeResp.ok) {
        const body = await forgeResp.text().catch(() => "");
        console.error(`[StorageProxy] forge error: ${forgeResp.status} ${body}`);
        res.status(502).send("Storage backend error");
        return;
      }
      const { url } = await forgeResp.json();
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }
      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}

// server/vercelApi.ts
var app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
registerStorageProxy(app);
registerOAuthRoutes(app);
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext
  })
);
app.use("/api", (_req, res) => {
  res.status(404).json({
    error: {
      json: {
        message: "API route not found",
        code: "NOT_FOUND",
        data: { httpStatus: 404 }
      }
    }
  });
});
var vercelApi_default = app;
export {
  vercelApi_default as default
};
