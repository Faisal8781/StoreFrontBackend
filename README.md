# Storefront Backend Project

## Getting Started

## Required Technologies

Your application must make use of the following libraries:

- Postgres for the database
- Node/Express for the application logic
- dotenv from npm for managing environment variables
- db-migrate from npm for migrations
- jsonwebtoken from npm for working with JWTs
- jasmine from npm for testing

## Steps to run the code

### 1. npm init to download all the node modules

**\_Create .env File to use the jwt**
BCRYPT_PASSWORD = example-peppper-bcrypt-password
SALT_ROUNDS=10 : Describe how many the password will be hashed
TOKEN_SECRET= example123! :The secret which will check if the token is valid or not valid.

### 2. need to set up postgres database matches the .env include all the postgres credentials to sign in to database

- ### DEFAULT DATABASE PORT = 5432
  **_CREATE USER_**
  CREATE USER example_user WITH PASSWORD 'Password1234';

or you use the default user you should create 2 database.

**_CREATE DATABASE FOR DEV AND TEST_**

- CREATE DATABASE storefront_dev;
- CREATE DATABASE storefront_test;

**_ADD UP .ENV File to include all the credentials to connect to database_**

- Now Add up to .env to make sure database.json have the database credentials
  POSTGRES_HOST=127.0.0.1
  POSTGRES_DB=storefront_dev
  POSTGRES_USER=example_user
  POSTGRES_PASSWORD=Password1234
  POSTGRES_TEST_DB=storefront_test
  ENV=dev

### 3.db-migrate

- db-migrate create users-table --sql-file
- db-migrate create orders-table --sql-file
- db-migrate create products-table --sql-file
- db-migrate create orders_products-table --sql-file

### 4. after that need to put this SQL Querys in the table up and down inside the new migration folder

- users, up: CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  CREATE TABLE users (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  firstName VARCHAR(200) NOT NULL,
  lastName VARCHAR(200) NOT NULL,
  password VARCHAR NOT NULL
  );

  down:DROP TABLE users;

- products, up: CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  CREATE TABLE products (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,  
   name VARCHAR(64) NOT NULL,
  price integer NOT NULL,
  category VARCHAR(64)
  );

  down:DROP TABLE products;

- orders, up: CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  CREATE TABLE orders (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  status VARCHAR(64),
  user_id uuid REFERENCES users(id)
  );

  down:DROP TABLE orders;

- orders_proudcts, up: CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  CREATE TABLE products (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,  
   name VARCHAR(64) NOT NULL,
  price integer NOT NULL,
  category VARCHAR(64)
  );

  down:DROP TABLE orders_products;

Before npm start you should type in the terimnal db-migrate up to create the tables in your dev enviorment

### 5. npm start in terimnal will start the server in development mode and you can use postman and in requirements.md file you can see all the endpoints you can use

### 6. "npm test" in terimnal will run test jasmine and this is the script: "set ENV=test && npx tsc && db-migrate --env test up && jasmine && db-migrate --env test reset" and it will run the data base in test mode by setting ENV=test after that will drop the table
