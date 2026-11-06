import { z } from "zod";

export const movementSchema = z.object({
  type: z.enum(["ENTRY", "EXIT"]),
  quantity: z.number().int().positive("La cantidad debe ser un entero positivo.")
});
