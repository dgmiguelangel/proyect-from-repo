import type Database from "better-sqlite3";
import type { Product } from "../types/domain.js";

type ProductRow = {
  id: number; code: string; name: string; description: string; price: number;
  quantity_available: number; minimum_stock: number;
};

const mapProduct = (row: ProductRow): Product => ({
  id: row.id, code: row.code, name: row.name, description: row.description, price: row.price,
  quantityAvailable: row.quantity_available, minimumStock: row.minimum_stock
});

export class ProductRepository {
  constructor(private readonly db: Database.Database) {}

  create(input: Omit<Product, "id" | "quantityAvailable">): Product {
    const result = this.db.prepare(
      "INSERT INTO products (code, name, description, price, minimum_stock) VALUES (?, ?, ?, ?, ?)"
    ).run(input.code, input.name, input.description, input.price, input.minimumStock);
    return this.findById(Number(result.lastInsertRowid))!;
  }

  findById(id: number): Product | undefined {
    const row = this.db.prepare("SELECT * FROM products WHERE id = ?").get(id) as ProductRow | undefined;
    return row && mapProduct(row);
  }

  findByCode(code: string): Product | undefined {
    const row = this.db.prepare("SELECT * FROM products WHERE code = ?").get(code) as ProductRow | undefined;
    return row && mapProduct(row);
  }

  list(): Product[] {
    return (this.db.prepare("SELECT * FROM products ORDER BY code").all() as ProductRow[]).map(mapProduct);
  }

  listLowStock(): Product[] {
    return (this.db.prepare("SELECT * FROM products WHERE quantity_available <= minimum_stock ORDER BY code").all() as ProductRow[]).map(mapProduct);
  }

  update(code: string, changes: Partial<Pick<Product, "name" | "description" | "price" | "minimumStock">>): Product {
    const product = this.findByCode(code)!;
    const next = { ...product, ...changes };
    this.db.prepare("UPDATE products SET name = ?, description = ?, price = ?, minimum_stock = ? WHERE code = ?")
      .run(next.name, next.description, next.price, next.minimumStock, code);
    return this.findByCode(code)!;
  }

  delete(code: string): void {
    this.db.prepare("DELETE FROM products WHERE code = ?").run(code);
  }

  updateQuantity(id: number, quantityAvailable: number): void {
    this.db.prepare("UPDATE products SET quantity_available = ? WHERE id = ?").run(quantityAvailable, id);
  }
}
