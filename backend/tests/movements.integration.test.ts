import request from "supertest";
import { describe, expect, it } from "vitest";
import { createTestApp } from "./test-app.js";

describe("integridad de inventario", () => {
  it("mantiene el saldo tras cien movimientos", async () => {
    const app = createTestApp();
    await request(app).post("/products").send({ code: "A-001", name: "Arroz", description: "Bolsa", price: 1, minimumStock: 2 });
    for (let index = 0; index < 100; index += 1) {
      await request(app).post("/products/A-001/movements").send({ type: "ENTRY", quantity: 1 }).expect(201);
    }
    const product = await request(app).get("/products/A-001").expect(200);
    expect(product.body.quantityAvailable).toBe(100);
    expect((await request(app).get("/products/A-001/movements")).body).toHaveLength(100);
  });
});
