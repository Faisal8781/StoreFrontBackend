//@ts-ignore
import client from '../../database';
import supertest from 'supertest';
import { Order, OrderStore } from '../orders';
import { User, Users } from '../users';
import { app } from '../../server';
const ordertest = new OrderStore();
const usertest = new Users();
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

  beforeAll(async () => {
    const createdUser = await usertest.create(user);
    user.id = createdUser.id;
    order.user_id = createdUser.id;

    const createdOrder = await ordertest.create(order);
    order.id = createdOrder.id;
  });
  afterAll(async () => {
    //@ts-ignore
    const conn = await client.connect();
    const sql = 'DELETE FROM orders';
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

  describe('Test Orders (CRUD) API', () => {
    it('Create new order API', async () => {
      const res = await request
        .post('/orders')
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${usertoken}`)
        .send({
          status: 'Active',
          user_id: order.user_id,
        } as Order);
      expect(res.status).toBe(200);
      const { status, user_id } = res.body.data;
      expect(status).toBe('Active');
      expect(user_id).toBe(user.id);
    });
    it('index API to get list of orders', async () => {
      const res = await request
        .get('/orders')
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${usertoken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
    });

    it('show to get indiviudal Order API', async () => {
      const res = await request
        .get(`/orders/${order.id}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${usertoken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('Active');
      expect(res.body.data.user_id).toBe(order.user_id);
    });

    it('Update Order API', async () => {
      const res = await request
        .patch(`/orders/${order.id}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${usertoken}`)
        .send({
          status: 'Complete',
        } as Order);
      expect(res.status).toBe(200);
      const { status, user_id } = res.body.data;
      expect(status).toBe('Complete');
      expect(user_id).toBe(order.user_id);
    });

    it('Delete method API', async () => {
      const res = await request
        .delete(`/orders/${order.id}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${usertoken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(order.id);
      expect(res.body.data.status).toBe('Complete');
      expect(res.body.data.user_id).toBe(order.user_id);
    });
  });
});
