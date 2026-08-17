import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { createRemoteJWKSet, jwtVerify } from "jose";
import type { User } from "../../drizzle/schema";
import { getUserByOpenId, upsertUser } from "../db";
import { sdk } from "./sdk";

export type TrpcContext = { req: CreateExpressContextOptions["req"]; res: CreateExpressContextOptions["res"]; user: User | null };

let supabaseJwks: ReturnType<typeof createRemoteJWKSet> | null = null;
function getSupabaseJwks() {
  const base = process.env.SUPABASE_URL;
  if (!base) return null;
  if (!supabaseJwks) supabaseJwks = createRemoteJWKSet(new URL(`${base.replace(/\/$/, "")}/auth/v1/.well-known/jwks.json`));
  return supabaseJwks;
}

async function authenticateSupabaseRequest(req: CreateExpressContextOptions["req"]): Promise<User | null> {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return null;
  const jwks = getSupabaseJwks();
  const base = process.env.SUPABASE_URL;
  if (!jwks || !base) return null;
  try {
    const { payload } = await jwtVerify(header.slice(7), jwks, { issuer: `${base.replace(/\/$/, "")}/auth/v1`, audience: "authenticated" });
    const openId = typeof payload.sub === "string" ? payload.sub : null;
    if (!openId) return null;
    const metadata = (payload.user_metadata ?? {}) as Record<string, unknown>;
    const name = typeof metadata.display_name === "string" ? metadata.display_name : typeof payload.email === "string" ? payload.email.split("@")[0] : null;
    await upsertUser({ openId, name, email: typeof payload.email === "string" ? payload.email : null, loginMethod: "supabase", lastSignedIn: new Date() });
    return (await getUserByOpenId(openId)) ?? null;
  } catch (error) {
    console.warn("[Supabase Auth] Invalid bearer token", error instanceof Error ? error.message : error);
    return null;
  }
}

export async function createContext(opts: CreateExpressContextOptions): Promise<TrpcContext> {
  let user: User | null = null;
  try { user = await sdk.authenticateRequest(opts.req); } catch { user = null; }
  if (!user) user = await authenticateSupabaseRequest(opts.req);
  return { req: opts.req, res: opts.res, user };
}
