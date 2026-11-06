CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL CHECK (trim(name) <> ''),
  description TEXT NOT NULL CHECK (trim(description) <> ''),
  price REAL NOT NULL CHECK (price >= 0),
  quantity_available INTEGER NOT NULL DEFAULT 0 CHECK (quantity_available >= 0),
  minimum_stock INTEGER NOT NULL CHECK (minimum_stock >= 0)
);

CREATE TABLE IF NOT EXISTS movements (
  id INTEGER PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  type TEXT NOT NULL CHECK (type IN ('ENTRY', 'EXIT')),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
