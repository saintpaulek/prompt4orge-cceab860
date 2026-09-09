const token = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const parts = token.split(".");
if (parts.length !== 3) throw new Error("Configured service-role key is not a JWT");
const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
console.log(JSON.stringify({ ref: payload.ref || null, role: payload.role || null, exp: payload.exp || null, activeProjectRef: "rupzljrpzdfrehgvbwdt" }));
