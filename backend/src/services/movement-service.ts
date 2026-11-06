import type Database from "better-sqlite3";
import { AppError } from "../api/errors.js";
import { MovementRepository } from "../models/movement-repository.js";
import { ProductRepository } from "../models/product-repository.js";
import type { Movement, MovementType } from "../types/domain.js";

export class MovementService {
  constructor(
    private readonly db: Database.Database,
    private readonly products: ProductRepository,
    private readonly movements: MovementRepository
  ) {}

  register(code: string, type: MovementType, quantity: number): Movement {
    return this.db.transaction(() => {
      const product = this.products.findByCode(code);
      if (!product) throw new AppError(404, "PRODUCT_NOT_FOUND", "El producto no fue encontrado.");
      if (type === "EXIT" && quantity > product.quantityAvailable) {
        throw new AppError(409, "INSUFFICIENT_STOCK", "Stock disponible insuficiente.");
      }
      const balance = type === "ENTRY" ? product.quantityAvailable + quantity : product.quantityAvailable - quantity;
      this.products.updateQuantity(product.id, balance);
      return this.movements.create(product.id, type, quantity);
    })();
  }

  list(code: string): Movement[] {
    const product = this.products.findByCode(code);
    if (!product) throw new AppError(404, "PRODUCT_NOT_FOUND", "El producto no fue encontrado.");
    return this.movements.listByProduct(product.id);
  }
}
