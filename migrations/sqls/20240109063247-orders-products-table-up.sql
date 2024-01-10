CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE orders_products (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY, 
    quantity integer,
    order_id  uuid REFERENCES orders(id),
    product_id  uuid REFERENCES products(id)
);