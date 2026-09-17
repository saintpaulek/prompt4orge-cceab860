import mysql from "mysql2/promise";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is required");
const connection = await mysql.createConnection(url);
try {
  await connection.execute(`CREATE TABLE IF NOT EXISTS unlock_code_audits (
    id int AUTO_INCREMENT NOT NULL,
    adminUserId int NOT NULL,
    generatedCount int NOT NULL,
    createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unlock_code_audits_id PRIMARY KEY (id)
  )`);
  console.log("unlock_code_audits is ready");
} finally {
  await connection.end();
}
