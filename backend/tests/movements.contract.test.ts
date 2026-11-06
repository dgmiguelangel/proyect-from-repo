import request from "supertest";
import { describe, expect, it } from "vitest";
import { createTestApp } from "./test-app.js";

describe("movimientos", () => {
  it("registra entradas, salidas e historial", async () => {
    const app = createTestApp();
    await request(app).post("/products").send({ code: "A-001", name: "Arroz", description: "Bolsa", price: 1, minimumStock: 2 }).expect(201);
    await request(app).post("/products/A-001/movements").send({ type: "ENTRY", quantity: 5 }).expect(201);
    await request(app).post("/products/A-001/movements").send({ type: "EXIT", quantity: 2 }).expect(201);
    const product = await request(app).get("/products/A-001").expect(200);
    expect(product.body.quantityAvailable).toBe(3);
    const history = await request(app).get("/products/A-001/movements").expect(200);
    expect(history.body).toHaveLength(2);
  });

  it("preserva el saldo cuando la salida excede el disponible", async () => {
    const app = createTestApp();
    await request(app).post("/products").send({ code: "A-001", name: "Arroz", description: "Bolsa", price: 1, minimumStock: 2 });
    await request(app).post("/products/A-001/movements").send({ type: "ENTRY", quantity: 1 });
    const rejected = await request(app).post("/products/A-001/movements").send({ type: "EXIT", quantity: 2 }).expect(409);
    expect(rejected.body.error.code).toBe("INSUFFICIENT_STOCK");
    expect((await request(app).get("/products/A-001")).body.quantityAvailable).toBe(1);
    expect((await request(app).get("/products/A-001/movements")).body).toHaveLength(1);
  });
});
