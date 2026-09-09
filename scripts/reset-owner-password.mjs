const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").replace(/\/$/, "");
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ownerEmail = "saintpaulek@gmail.com";
const replacementPassword = process.env.PROMPTFORGE_OWNER_NEW_PASSWORD;

if (!supabaseUrl || !serviceRoleKey || !replacementPassword) {
  throw new Error("Missing Supabase URL, service-role key, or replacement password");
}

const headers = {
  apikey: serviceRoleKey,
  Authorization: `Bearer ${serviceRoleKey}`,
  "Content-Type": "application/json",
};

let page = 1;
let user;
while (!user && page <= 20) {
  const response = await fetch(`${supabaseUrl}/auth/v1/admin/users?page=${page}&per_page=100`, { headers });
  if (!response.ok) throw new Error(`Supabase user lookup failed with HTTP ${response.status}`);
  const body = await response.json();
  user = body.users?.find((candidate) => candidate.email?.toLowerCase() === ownerEmail);
  if (!body.next_page || !body.users?.length) break;
  page += 1;
}

if (!user?.id) throw new Error("Owner account was not found in the active Supabase project");

const update = await fetch(`${supabaseUrl}/auth/v1/admin/users/${user.id}`, {
  method: "PUT",
  headers,
  body: JSON.stringify({ password: replacementPassword, email_confirm: true }),
});

if (!update.ok) {
  throw new Error(`Supabase password reset failed with HTTP ${update.status}`);
}

console.log("Owner password reset completed for the requested email; credential value intentionally omitted.");
