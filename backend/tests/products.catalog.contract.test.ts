import request from "supertest";
import { describe, expect, it } from "vitest";
import { createTestApp } from "./test-app.js";

const product = { code: "A-001", name: "Arroz", description: "Bolsa de arroz", price: 12.5, minimumStock: 3 };

describe("catálogo de productos", () => {
  it("crea productos con saldo cero y los lista por código", async () => {
    const app = createTestApp();
    await request(app).post("/products").send({ ...product, code: "B-001" }).expect(201);
    const created = await request(app).post("/products").send(product).expect(201);
    expect(created.body.quantityAvailable).toBe(0);
    const catalog = await request(app).get("/products").expect(200);
    expect(catalog.body.map((item: { code: string }) => item.code)).toEqual(["A-001", "B-001"]);
    await request(app).get("/products/A-001").expect(200).expect(({ body }) => expect(body.name).toBe("Arroz"));
  });

  it("rechaza datos inválidos y códigos duplicados", async () => {
    const app = createTestApp();
    await request(app).post("/products").send({ ...product, name: " " }).expect(400);
    await request(app).post("/products").send(product).expect(201);
    const duplicate = await request(app).post("/products").send(product).expect(409);
    expect(duplicate.body.error.code).toBe("DUPLICATE_CODE");
  });
});
