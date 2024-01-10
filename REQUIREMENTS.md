# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Orders

- Index API ENDPoint get('/orders')
- Show API ENDPoint get('/orders/:orderid') (req.params.id)
- Create API ENDPoint post('/orders') (req.body.status,req.body.user_id)
- Delete API ENDPoint delete('/orders/:orderid') (req.params.id)
- Update API ENDPoint patch('/orders/:orderid') (req.body.status, req.params.id)

#### Users

- Index [token required] API ENDPoint get('/users')
- Show [token required] API ENDPoint get('/users/:userId') (req.params.id)
- Create API ENDPoint post('/users') (req.body.firstname,req.body.lastname,req.body.password)
- Update[token required] API ENDPoint patch('/users/:userId') (req.body.firstname,req.body.lastname,req.body.password, req.params.id)
- Delete[token required] API ENDPoint delete('/users:userId') (req.params.id)
- Authenticate API ENDPoint post('/authenticate') (req.body.firstname,req.body.lastname,req.body.password)

#### Products

- Index API ENDPoint get('/orders')
- Show API ENDPoint get('/orders/:orderid') (req.params.id)
- Create API ENDPoint post('/orders') (req.body.name,req.body.price,req.body.category)
- Delete API ENDPoint delete('/orders/:orderid') (req.params.id)
- Update API ENDPoint patch('/orders/:orderid') (req.body.name,req.body.price,category req.body.category,req.params.id)
- byCategory API ENDPoint ('/category') (req.body.category)

### DashBoard

- Product assigned to Order API ENDPoint get(/products_in_orders/:order_id) (req.params.order_id)
- Add Product to an order API ENDPoint create(/order/:order_id/product) (req.params.order_id, req.body.productId, req.body.quantity)
- All completed order per user [token required] API ENDPoint get('/complete_orders/:user_id') (req.params.user_id)
- Current Order by user [token required] API ENDPoint get('/all_orders/:user_id') (req.params.user_id)
- Top 5 most popular products API ENDPoint get('/most_common_product')
- Quantity of product in order API ENDPoint get('/quantity_product_order/:id') (req.params.order_id, req.body.productId)

## Data Shapes

#### Product

- uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
- name VARCHAR(64) NOT NULL,
- price integer NOT NULL,
- category VARCHAR(64)

#### User

- id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
- firstName VARCHAR(200) NOT NULL,
- lastName VARCHAR(200) NOT NULL,
- password VARCHAR NOT NULL

#### Orders

- id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
- status of order (active or complete)
- id of each product in the order
- user_id uuid REFERENCES users(id)

### Orders_Products

- id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
- quantity integer,
- order_id uuid REFERENCES orders(id),
- product_id uuid REFERENCES products(id)
