import { Router, type Request } from "express";
import type { MovementService } from "../services/movement-service.js";
import { AppError } from "./errors.js";
import { movementSchema } from "./movement-schemas.js";

export function createMovementRouter(service: MovementService): Router {
  const router = Router({ mergeParams: true });
  router.get("/", (request: Request<{ code: string }>, response) => response.json(service.list(request.params.code)));
  router.post("/", (request: Request<{ code: string }>, response) => {
    const parsed = movementSchema.safeParse(request.body);
    if (!parsed.success) throw new AppError(400, "VALIDATION_ERROR", "Los datos ingresados no son válidos.", parsed.error.issues);
    response.status(201).json(service.register(request.params.code, parsed.data.type, parsed.data.quantity));
  });
  return router;
}
