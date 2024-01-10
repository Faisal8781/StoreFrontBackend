//@ts-ignore
import client from '../../database';
import supertest from 'supertest';
import { Order, OrderStore } from '../orders';
import { User, Users } from '../users';
import { Product, ProductCart } from '../products';
import { DashboardQueries } from '../../services/dashboard';
import { app } from '../../server';
const usertest = new Users();
const ordertest = new OrderStore();
const producttest = new ProductCart();
const dashboardtest = new DashboardQueries();
const request = supertest(app);
let usertoken = '';

describe('Testing API Endpoint', () => {
  const order = {
    status: 'Active',
  } as Order;

  const user = {
    firstname: 'Faisal',
    lastname: 'Alsulaiman',
    password: 'password',
  } as User;

  const product = {
    name: 'Sword-I',
    price: 100,
    category: 'Weapons',
  } as Product;

  const orders_products = {
    id: '',
    quantity: 200,
    order_id: '',
    product_id: '',
  };

  beforeAll(async () => {
    const createdUser = await usertest.create(user);
    user.id = createdUser.id;
    order.user_id = createdUser.id;
    const createdOrder = await ordertest.create(order);
    order.id = createdOrder.id;
    orders_products.order_id = createdOrder.id;
    const createdProduct = await producttest.create(product);
    product.id = createdProduct.id;
    orders_products.product_id = createdProduct.id;
    const createdOrderProduct = await dashboardtest.addProduct(
      orders_products.quantity,
      orders_products.order_id,
      orders_products.product_id
    );
    orders_products.id = createdOrderProduct.id;
  });
  afterAll(async () => {
    //@ts-ignore
    const conn = await client.connect();
    const sql = 'DELETE FROM orders_products';
    await conn.query(sql);

    const sqlProduct = 'DELETE FROM products';
    await conn.query(sqlProduct);

    const sqlOrder = 'DELETE FROM orders';
    await conn.query(sqlOrder);
    const sqlUser = 'DELETE FROM users';
    await conn.query(sqlUser);
    conn.release();
  });

  describe('Test Authenticattion API', () => {
    it('should be able to authenticate to get token', async () => {
      const res = await request
        .post('/authenticate')
        .set('Content-type', 'application/json')
        .send({
          firstname: 'Faisal',
          lastname: 'Alsulaiman',
          password: 'password',
        });
      expect(res.status).toBe(200);
      const { id, firstname, lastname, token } = res.body.data;
      expect(id).toBe(user.id);
      expect(firstname).toBe('Faisal');
      expect(lastname).toBe('Alsulaiman');
      usertoken = token;
    });
  });

  describe('Test Dashboard (CRUD) API', () => {
    it('AddProduct API', async () => {
      const res = await request
        .post(`/order/${order.id}/product`)
        .set('Content-type', 'application/json')
        .send({
          productId: product.id,
          quantity: 200,
        });

      const { order_id, product_id } = res.body.data;

      expect(res.status).toBe(200);
      expect(order_id).toBe(order.id);
      expect(product_id).toBe(product.id);
    });
    it('OrdersperUser API to get list of orders peruser', async () => {
      const res = await request
        .get(`/all_orders/${user.id}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${usertoken}`);

      expect(res.body.data.length).toBe(1);
    });

    it('completedOrderperUser to get completed Order for user', async () => {
      const updateOrder = ordertest.update('Complete', order.id);
      const res = await request
        .get(`/complete_orders/${user.id}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${usertoken}`);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].user_id).toBe(user.id);
      expect(res.body.data[0].id).toBe(order.id);
    });

    it('productsInOrders Dashboard API to retrive product assigned with order', async () => {
      const res = await request
        .get(`/products_in_orders/${order.id}`)
        .set('Content-type', 'application/json');

      expect(res.body.data.length).toBe(2);
    });

    it('quantityOfProductOnOrder API to get the quantity of the prodct in order using orders_products Table', async () => {
      const res = await request
        .get(`/quantity_product_order/${order.id}`)
        .set('Content-type', 'application/json')
        .send({
          productId: product.id,
        });
      expect(res.body.data[0].sum).toBe('400');
    });
    it('mostfiveCommonProduct API to get the quantity of the prodct in order using orders_products Table', async () => {
      const res = await request
        .get('/most_common_product')
        .set('Content-type', 'application/json');

      expect(res.body.data[0].NumberOfAppear).toBe('2');
    });
  });
});
