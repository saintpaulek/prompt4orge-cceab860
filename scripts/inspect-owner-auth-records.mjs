const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").replace(/\/$/, "");
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ownerEmail = "saintpaulek@gmail.com";

if (!supabaseUrl || !serviceRoleKey) throw new Error("Missing active Supabase admin configuration");
const response = await fetch(`${supabaseUrl}/auth/v1/admin/users?page=1&per_page=100`, {
  headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` },
});
if (!response.ok) throw new Error(`Supabase user lookup failed with HTTP ${response.status}`);
const body = await response.json();
const matches = (body.users || [])
  .filter((user) => user.email?.toLowerCase() === ownerEmail)
  .map((user) => ({
    id: user.id,
    email: user.email,
    email_confirmed_at: Boolean(user.email_confirmed_at),
    phone_confirmed_at: Boolean(user.phone_confirmed_at),
    banned_until: user.banned_until || null,
    deleted_at: user.deleted_at || null,
    providers: user.app_metadata?.providers || [],
    identities: (user.identities || []).map((identity) => identity.provider),
    created_at: user.created_at,
    last_sign_in_at: user.last_sign_in_at || null,
  }));
console.log(JSON.stringify({ count: matches.length, matches }));
