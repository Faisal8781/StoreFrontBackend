CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE products (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,    
    name VARCHAR(64) NOT NULL,
    price integer NOT NULL,
    category VARCHAR(64)
);