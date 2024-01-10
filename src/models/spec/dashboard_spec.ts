//@ts-ignore
import client from '../../database';
import { Order, OrderStore } from '../orders';
import { User, Users } from '../users';
import { Product, ProductCart } from '../products';
import { DashboardQueries } from '../../services/dashboard';

const usertest = new Users();
const ordertest = new OrderStore();
const producttest = new ProductCart();
const dashboardtest = new DashboardQueries();
describe('Dashboard Model', () => {
  it('should have an Add Product method', () => {
    expect(dashboardtest.addProduct).toBeDefined();
  });

  it('should have an OrdersperUser method', () => {
    expect(dashboardtest.OrdersperUser).toBeDefined();
  });
  it('should have an completedOrderperUser method', () => {
    expect(dashboardtest.completedOrderperUser).toBeDefined();
  });
  it('should have an productsInOrders method', () => {
    expect(dashboardtest.productsInOrders).toBeDefined();
  });
  it('should have an quantityOfProductOnOrder method', () => {
    expect(dashboardtest.quantityOfProductOnOrder).toBeDefined();
  });
  it('should have an mostfiveCommonProduct method', () => {
    expect(dashboardtest.mostfiveCommonProduct).toBeDefined();
  });
  describe('Test Dashboard model', () => {
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

    it('AddProduct method should return a new Order in product', async () => {
      //@ts-ignore
      const createOrderProduct = await dashboardtest.addProduct(
        150,
        order.id,
        product.id
      );
      //@ts-ignore
      expect(createOrderProduct).toEqual({
        id: createOrderProduct.id,
        //@ts-ignore
        quantity: 150,
        order_id: order.id,
        product_id: product.id,
      });
    });
    it('OrdersperUser method should return list of Orders per user', async () => {
      const userOrder = await dashboardtest.OrdersperUser(user.id);
      //@ts-ignore
      expect(userOrder.length).toBe(1);
    });

    it('completedOrderperUser method should return a list of order which are completed', async () => {
      const updateOrder = ordertest.update('Complete', order.id);
      const CompletedOrder = await dashboardtest.completedOrderperUser(user.id);
      //@ts-ignore
      expect(CompletedOrder[0].id).toBe(order.id);
      //@ts-ignore
      expect(CompletedOrder[0].status).toBe('Complete');
      //@ts-ignore
      expect(CompletedOrder[0].user_id).toBe(user.id);
    });

    it('productsInOrders method should show all product that assigned by order', async () => {
      const prodctOrders = await dashboardtest.productsInOrders(order.id);
      //@ts-ignore
      expect(prodctOrders.length).toBe(2);
    });

    it('quantityOfProductOnOrder method should return the quantity of each product in Order', async () => {
      const quantityofProduct = await dashboardtest.quantityOfProductOnOrder(
        order.id,
        product.id
      );
      //@ts-ignore
      expect(quantityofProduct[0].sum).toBe('350');
    });

    it('mostfiveCommonProduct method should return the quantity of each product in  Order', async () => {
      const mostfiveCommonProducts =
        await dashboardtest.mostfiveCommonProduct();
      //@ts-ignore
      expect(mostfiveCommonProducts[0].NumberOfAppear).toBe('2');
    });
  });
});
