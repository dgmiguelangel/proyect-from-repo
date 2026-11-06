export type MovementType = "ENTRY" | "EXIT";

export interface Product {
  id: number;
  code: string;
  name: string;
  description: string;
  price: number;
  quantityAvailable: number;
  minimumStock: number;
}

export interface Movement {
  id: number;
  productId: number;
  type: MovementType;
  quantity: number;
  createdAt: string;
}
