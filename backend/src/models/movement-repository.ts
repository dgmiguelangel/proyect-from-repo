import type Database from "better-sqlite3";
import type { Movement, MovementType } from "../types/domain.js";

type MovementRow = { id: number; product_id: number; type: MovementType; quantity: number; created_at: string };
const mapMovement = (row: MovementRow): Movement => ({
  id: row.id, productId: row.product_id, type: row.type, quantity: row.quantity, createdAt: row.created_at
});

export class MovementRepository {
  constructor(private readonly db: Database.Database) {}

  create(productId: number, type: MovementType, quantity: number): Movement {
    const result = this.db.prepare("INSERT INTO movements (product_id, type, quantity) VALUES (?, ?, ?)")
      .run(productId, type, quantity);
    const row = this.db.prepare("SELECT * FROM movements WHERE id = ?").get(result.lastInsertRowid) as MovementRow;
    return mapMovement(row);
  }

  listByProduct(productId: number): Movement[] {
    return (this.db.prepare("SELECT * FROM movements WHERE product_id = ? ORDER BY id").all(productId) as MovementRow[]).map(mapMovement);
  }

  hasForProduct(productId: number): boolean {
    return Boolean(this.db.prepare("SELECT 1 FROM movements WHERE product_id = ? LIMIT 1").get(productId));
  }
}
