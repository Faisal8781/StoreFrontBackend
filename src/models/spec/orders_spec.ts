//@ts-ignore
import client from '../../database';
import { Order, OrderStore } from '../orders';
import { User, Users } from '../users';

const ordertest = new OrderStore();
const usertest = new Users();

describe('Orders Model', () => {
  it('should have an index method', () => {
    expect(ordertest.index).toBeDefined();
  });

  it('should have an show method', () => {
    expect(ordertest.show).toBeDefined();
  });
  it('should have an create method', () => {
    expect(ordertest.create).toBeDefined();
  });
  it('should have an delete method', () => {
    expect(ordertest.delete).toBeDefined();
  });
  it('should have an show method', () => {
    expect(ordertest.update).toBeDefined();
  });
  describe('Test Orders model', () => {
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
      const createdOrder = await ordertest.create(order);
      order.id = createdOrder.id;
      order.user_id = createdUser.id;
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

    it('Create method should return a new Order', async () => {
      //@ts-ignore
      const createOrder = (await ordertest.create({
        status: 'Active',
        user_id: user.id,
      })) as Order;

      //@ts-ignore
      expect(createOrder).toEqual({
        id: createOrder.id,
        status: 'Active',
        user_id: createOrder.user_id,
      });
    });
    it('Index method should return list of Orders', async () => {
      const orders = await ordertest.index();
      expect(orders.length).toBe(2);
    });

    it('Show method should return a Order', async () => {
      const returnedOrder = await ordertest.show(order.id);
      expect(returnedOrder.id).toBe(order.id);
      expect(returnedOrder.status).toBe(order.status);
      expect(order.user_id).toBe(order.user_id);
    });

    it('Update method should update and return a Order', async () => {
      //@ts-ignore
      const updateOrder = await ordertest.update('Complete', order.id);
      expect(updateOrder.id).toBe(order.id);
      expect(updateOrder.status).toBe('Complete');
      expect(order.user_id).toBe(order.user_id);
    });

    it('Delete method should delete Order from db', async () => {
      const deletedProduct = await ordertest.delete(order.id);
      expect(deletedProduct.id).toBe(order.id);
      expect(deletedProduct.status).toBe('Complete');
      expect(order.user_id).toBe(order.user_id);
    });
  });
});
