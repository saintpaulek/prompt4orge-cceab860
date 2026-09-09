const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").replace(/\/$/, "");
const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const ownerEmail = "saintpaulek@gmail.com";
const redirectTo = "https://promptforge.com.ng/auth";

if (!supabaseUrl || !anonKey) throw new Error("Missing active Supabase public configuration");
const response = await fetch(`${supabaseUrl}/auth/v1/recover`, {
  method: "POST",
  headers: { apikey: anonKey, "Content-Type": "application/json" },
  body: JSON.stringify({ email: ownerEmail, redirect_to: redirectTo }),
});
if (!response.ok) {
  const body = await response.text();
  throw new Error(`Supabase recovery request failed with HTTP ${response.status}: ${body.slice(0, 240)}`);
}
console.log("Password recovery email requested for the owner account; no credential or token was printed.");
