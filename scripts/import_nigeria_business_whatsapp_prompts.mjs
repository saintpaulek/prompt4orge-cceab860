import fs from "node:fs/promises";
import mysql from "mysql2/promise";

const source = new URL("../data/nigeria-business-growth-whatsapp.json", import.meta.url);
const rows = JSON.parse(await fs.readFile(source, "utf8"));

if (!Array.isArray(rows) || rows.length !== 150) throw new Error("Expected exactly 150 prompt records");
if (rows.filter((row) => row.access === "FREE").length !== 20) throw new Error("Expected exactly 20 FREE prompts");
if (!rows.every((row) => row.category === "Nigeria Business Growth & WhatsApp")) throw new Error("Unexpected category");

const connection = await mysql.createConnection(process.env.DATABASE_URL);
try {
  const ids = rows.map((row) => row.id);
  const titles = rows.map((row) => row.title);
  const [conflicts] = await connection.query(
    "SELECT id, title FROM prompts WHERE id IN (?) OR title IN (?)",
    [ids, titles],
  );
  if (conflicts.length > 0) {
    throw new Error(`Refusing import because existing prompt IDs or titles conflict: ${JSON.stringify(conflicts)}`);
  }

  for (let offset = 0; offset < rows.length; offset += 50) {
    const batch = rows.slice(offset, offset + 50).map((row) => [
      row.id,
      row.title,
      row.category,
      row.role,
      row.tags,
      row.access,
      row.prompt,
    ]);
    await connection.query(
      "INSERT INTO prompts (id, title, category, role, tags, access, prompt_body) VALUES ?",
      [batch],
    );
    console.log(`Imported ${Math.min(offset + batch.length, rows.length)}/${rows.length}`);
  }
} finally {
  await connection.end();
}
