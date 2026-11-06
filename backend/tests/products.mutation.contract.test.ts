import request from "supertest";
import { describe, expect, it } from "vitest";
import { createTestApp } from "./test-app.js";

const product = { code: "A-001", name: "Arroz", description: "Bolsa", price: 12.5, minimumStock: 3 };

describe("modificación de productos", () => {
  it("actualiza campos permitidos y elimina un producto sin movimientos", async () => {
    const app = createTestApp();
    await request(app).post("/products").send(product).expect(201);
    const updated = await request(app).patch("/products/A-001").send({ price: 15 }).expect(200);
    expect(updated.body.price).toBe(15);
    await request(app).delete("/products/A-001").expect(204);
    await request(app).get("/products/A-001").expect(404);
  });

  it("rechaza una modificación vacía", async () => {
    const app = createTestApp();
    await request(app).post("/products").send(product).expect(201);
    await request(app).patch("/products/A-001").send({}).expect(400);
  });
});
