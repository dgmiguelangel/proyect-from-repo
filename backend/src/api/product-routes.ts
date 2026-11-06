import { Router } from "express";
import type { ProductService } from "../services/product-service.js";
import { AppError } from "./errors.js";
import { createProductSchema, updateProductSchema } from "./product-schemas.js";

const parse = <T>(schema: { safeParse: (input: unknown) => { success: boolean; data?: T; error?: { issues: unknown } } }, input: unknown): T => {
  const result = schema.safeParse(input);
  if (!result.success) throw new AppError(400, "VALIDATION_ERROR", "Los datos ingresados no son válidos.", result.error?.issues);
  return result.data!;
};

export function createProductRouter(service: ProductService): Router {
  const router = Router();
  router.get("/", (_request, response) => response.json(service.list()));
  router.post("/", (request, response) => response.status(201).json(service.create(parse(createProductSchema, request.body))));
  router.get("/low-stock", (_request, response) => response.json(service.listLowStock()));
  router.get("/:code", (request, response) => response.json(service.get(request.params.code)));
  router.patch("/:code", (request, response) => response.json(service.update(request.params.code, parse(updateProductSchema, request.body))));
  router.delete("/:code", (request, response) => {
    service.delete(request.params.code);
    response.status(204).end();
  });
  return router;
}
