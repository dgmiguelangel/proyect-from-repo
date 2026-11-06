import Database from "better-sqlite3";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const migrationPath = resolve(rootDirectory, "db/migrations/001_initial_schema.sql");

export function initializeDatabase(db: Database.Database): Database.Database {
  db.pragma("foreign_keys = ON");
  if (!existsSync(migrationPath)) throw new Error("No se encontró la migración inicial de la base de datos.");
  db.exec(readFileSync(migrationPath, "utf8"));
  return db;
}

export function openDatabase(): Database.Database {
  return initializeDatabase(new Database(process.env.STOCK_DB_PATH ?? resolve(rootDirectory, "db/stock.db")));
}
