//@ts-ignore
import client from '../../database';
import supertest from 'supertest';
import { Product, ProductCart } from '../products';
import { User, Users } from '../users';
import { app } from '../../server';
const producttest = new ProductCart();
const usertest = new Users();
const request = supertest(app);
let usertoken = '';

describe('Testing API Endpoint', () => {
  const product = {
    name: 'Sword-I',
    price: 200,
    category: 'Weapons',
  } as Product;

  const user = {
    firstname: 'Faisal',
    lastname: 'Alsulaiman',
    password: 'password',
  } as User;

  beforeAll(async () => {
    const createdProduct = await producttest.create(product);
    product.id = createdProduct.id;

    const createdUser = await usertest.create(user);
    user.id = createdUser.id;
  });
  afterAll(async () => {
    //@ts-ignore
    const conn = await client.connect();
    const sql = 'DELETE FROM products';
    await conn.query(sql);
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

  describe('Test Proudcts (CRUD) API', () => {
    it('Create new product API', async () => {
      const res = await request
        .post('/products')
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${usertoken}`)
        .send({
          name: 'Armor-I',
          price: 300,
          category: 'Armor Kit',
        } as Product);
      expect(res.status).toBe(200);
      const { name, price, category } = res.body.data;
      expect(name).toBe('Armor-I');
      expect(price).toBe(300);
      expect(category).toBe('Armor Kit');
    });
    it('index API to get list of products', async () => {
      const res = await request
        .get('/products')
        .set('Content-type', 'application/json');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
    });

    it('show to get indiviudal Product API', async () => {
      const res = await request
        .get(`/products/${product.id}`)
        .set('Content-type', 'application/json');
      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('Sword-I');
      expect(res.body.data.price).toBe(200);
      expect(res.body.data.category).toBe('Weapons');
    });

    it('Update Product  API', async () => {
      const res = await request
        .patch(`/products/${product.id}`)
        .set('Content-type', 'application/json')
        .send({
          name: 'SwordUpdated',
          price: 200,
          category: 'New Weapons',
        } as Product);
      expect(res.status).toBe(200);
      const { id, name, price, category } = res.body.data;
      expect(id).toBe(product.id);
      expect(name).toBe('SwordUpdated');
      expect(price).toBe(200);
      expect(category).toBe('New Weapons');
    });

    it('Get Product by Category API', async () => {
      const res = await request
        .get('/category')
        .set('Content-type', 'application/json')
        .send({
          category: 'New Weapons',
        });
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
    });
    it('Delete method API', async () => {
      const res = await request
        .delete(`/products/${product.id}`)
        .set('Content-type', 'application/json');
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(product.id);
      expect(res.body.data.name).toBe('SwordUpdated');
      expect(res.body.data.price).toBe(200);
      expect(res.body.data.category).toBe('New Weapons');
    });
  });
});
