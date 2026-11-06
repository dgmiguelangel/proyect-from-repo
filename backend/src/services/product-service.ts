import { AppError } from "../api/errors.js";
import { MovementRepository } from "../models/movement-repository.js";
import { ProductRepository } from "../models/product-repository.js";
import type { Product } from "../types/domain.js";

export type ProductInput = Omit<Product, "id" | "quantityAvailable">;
export type ProductUpdate = Partial<Omit<ProductInput, "code">>;

export class ProductService {
  constructor(private readonly products: ProductRepository, private readonly movements: MovementRepository) {}

  create(input: ProductInput): Product {
    if (this.products.findByCode(input.code)) throw new AppError(409, "DUPLICATE_CODE", "El código de producto ya existe.");
    return this.products.create(input);
  }

  list(): Product[] { return this.products.list(); }
  listLowStock(): Product[] { return this.products.listLowStock(); }

  get(code: string): Product {
    const product = this.products.findByCode(code);
    if (!product) throw new AppError(404, "PRODUCT_NOT_FOUND", "El producto no fue encontrado.");
    return product;
  }

  update(code: string, changes: ProductUpdate): Product {
    this.get(code);
    return this.products.update(code, changes);
  }

  delete(code: string): void {
    const product = this.get(code);
    if (this.movements.hasForProduct(product.id)) {
      throw new AppError(409, "PRODUCT_HAS_MOVEMENTS", "No se puede eliminar un producto con movimientos.");
    }
    this.products.delete(code);
  }
}
