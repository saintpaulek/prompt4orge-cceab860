import fs from "node:fs/promises";
import mysql from "mysql2/promise";

const source = new URL("../data/promptforge-expansion-2026-08-29.json", import.meta.url);
const rows = JSON.parse(await fs.readFile(source, "utf8"));
if (!Array.isArray(rows) || rows.length !== 720) throw new Error(`Expected 720 records, received ${rows?.length ?? 0}`);

const byCategory = new Map();
for (const row of rows) {
  if (!row.id || !row.title || !row.category || !row.role || !row.tags || !row.access || !row.prompt) throw new Error(`Incomplete row ${JSON.stringify(row)}`);
  byCategory.set(row.category, (byCategory.get(row.category) ?? 0) + 1);
}
if (byCategory.size !== 12 || [...byCategory.values()].some((count) => count !== 60)) throw new Error("Every new category must contain exactly 60 rows");

const connection = await mysql.createConnection(process.env.DATABASE_URL);
try {
  for (let offset = 0; offset < rows.length; offset += 120) {
    const batch = rows.slice(offset, offset + 120).map((row) => [String(row.id), String(row.title), String(row.category), String(row.role), String(row.tags), String(row.access).toUpperCase(), String(row.prompt)]);
    await connection.query(
      `INSERT INTO prompts (id, title, category, role, tags, access, prompt_body)
       VALUES ?
       ON DUPLICATE KEY UPDATE
         title = VALUES(title), category = VALUES(category), role = VALUES(role),
         tags = VALUES(tags), access = VALUES(access), prompt_body = VALUES(prompt_body)`,
      [batch],
    );
    console.log(`Imported ${Math.min(offset + batch.length, rows.length)}/${rows.length}`);
  }
} finally {
  await connection.end();
}
