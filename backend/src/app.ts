import Database from "better-sqlite3";
import express from "express";
import { createMovementRouter } from "./api/movement-routes.js";
import { createProductRouter } from "./api/product-routes.js";
import { errorHandler } from "./api/errors.js";
import { initializeDatabase, openDatabase } from "./db/database.js";
import { MovementRepository } from "./models/movement-repository.js";
import { ProductRepository } from "./models/product-repository.js";
import { MovementService } from "./services/movement-service.js";
import { ProductService } from "./services/product-service.js";

export function createApp(database?: Database.Database) {
  const db = initializeDatabase(database ?? openDatabase());
  const products = new ProductRepository(db);
  const movements = new MovementRepository(db);
  const productService = new ProductService(products, movements);
  const movementService = new MovementService(db, products, movements);
  const app = express();
  app.use(express.json());
  app.use("/products", createProductRouter(productService));
  app.use("/products/:code/movements", createMovementRouter(movementService));
  app.use(errorHandler);
  return app;
}
