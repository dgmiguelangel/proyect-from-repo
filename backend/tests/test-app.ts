import Database from "better-sqlite3";
import { createApp } from "../src/app.js";

export function createTestApp() {
  return createApp(new Database(":memory:"));
}
