import request from "supertest";
import { describe, expect, it } from "vitest";
import { createTestApp } from "./test-app.js";

describe("stock bajo", () => {
  it("incluye cantidades iguales o inferiores al mínimo", async () => {
    const app = createTestApp();
    for (const [code, minimumStock] of [["LOW", 1], ["EQUAL", 2], ["HIGH", 1]] as const) {
      await request(app).post("/products").send({ code, name: code, description: code, price: 1, minimumStock }).expect(201);
    }
    await request(app).post("/products/HIGH/movements").send({ type: "ENTRY", quantity: 2 });
    const response = await request(app).get("/products/low-stock").expect(200);
    expect(response.body.map((product: { code: string }) => product.code)).toEqual(["EQUAL", "LOW"]);
  });
});
