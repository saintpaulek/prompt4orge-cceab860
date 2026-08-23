import fs from "node:fs/promises";
import mysql from "mysql2/promise";

const source = "/home/ubuntu/upload/pasted_content_3.txt";
const rows = JSON.parse(await fs.readFile(source, "utf8"));
if (!Array.isArray(rows) || rows.length !== 3000) throw new Error(`Expected 3000 records, received ${rows?.length ?? 0}`);

const connection = await mysql.createConnection(process.env.DATABASE_URL);
try {
  for (let offset = 0; offset < rows.length; offset += 250) {
    const batch = rows.slice(offset, offset + 250).map((row) => [
      String(row.id),
      String(row.title),
      String(row.category),
      String(row.role),
      String(row.tags),
      String(row.access).toUpperCase(),
      String(row.prompt),
    ]);
    await connection.query(
      `INSERT INTO prompts (id, title, category, role, tags, access, prompt_body)
       VALUES ?
       ON DUPLICATE KEY UPDATE
         title = VALUES(title), category = VALUES(category), role = VALUES(role),
         tags = VALUES(tags), access = VALUES(access), prompt_body = VALUES(prompt_body)`,
      [batch],
    );
    console.log(`Seeded ${Math.min(offset + batch.length, rows.length)}/${rows.length}`);
  }
} finally {
  await connection.end();
}
