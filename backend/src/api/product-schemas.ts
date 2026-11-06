import { z } from "zod";

const requiredText = z.string().trim().min(1, "El campo es obligatorio.");
const nonNegative = z.number().finite().min(0, "El valor debe ser mayor o igual que cero.");

export const createProductSchema = z.object({
  code: requiredText,
  name: requiredText,
  description: requiredText,
  price: nonNegative,
  minimumStock: z.number().int().min(0, "El valor debe ser mayor o igual que cero.")
});

export const updateProductSchema = z.object({
  name: requiredText.optional(),
  description: requiredText.optional(),
  price: nonNegative.optional(),
  minimumStock: z.number().int().min(0, "El valor debe ser mayor o igual que cero.").optional()
}).refine((value) => Object.keys(value).length > 0, "Debe indicar al menos un campo para actualizar.");
