//@ts-ignore
import client from '../database';
import { Order } from '../models/orders';
export class DashboardQueries {
  async addProduct(
    quantity: number,
    orderId: string,
    productId: string
  ): Promise<Order> {
    try {
      const ordersql = 'SELECT * FROM orders WHERE id=($1)';
      //@ts-ignore
      const conn = await client.connect();

      const result = await conn.query(ordersql, [orderId]);

      const order = result.rows[0];

      if (order.status !== 'Active') {
        throw new Error(
          `Could not add product ${productId} to order ${orderId} because order status is ${order.status}`
        );
      }

      conn.release();
    } catch (err) {
      throw new Error(`${err}`);
    }
    try {
      const sql =
        'INSERT INTO orders_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *';
      //@ts-ignore
      const conn = await client.connect();
      const result = await conn.query(sql, [quantity, orderId, productId]);
      const order = result.rows[0];
      conn.release();
      return order;
    } catch (err) {
      throw new Error(`unable add product in order: ${err}`);
    }
  }

  // Orders per User
  async OrdersperUser(user_id: string): Promise<[]> {
    try {
      //@ts-ignore
      const conn = await client.connect();
      const sql = 'SELECT * FROM orders WHERE user_id=$1';
      const result = await conn.query(sql, [user_id]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`unable get users with orders: ${err}`);
    }
  }

  //// Completed Order per user
  async completedOrderperUser(id: string): Promise<[]> {
    try {
      //@ts-ignore
      const conn = await client.connect();
      const sql =
        "SELECT * FROM orders WHERE user_id = ($1) AND status = 'Complete'";
      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`unable get users with orders: ${err}`);
    }
  }

  // Get all products that have been included in orders
  async productsInOrders(id: string): Promise<[]> {
    try {
      //@ts-ignore
      const conn = await client.connect();
      const sql =
        'SELECT id, product_id, order_id FROM orders_products WHERE order_id = ($1)';
      const result = await conn.query(sql, [id]);

      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`unable get products and orders: ${err}`);
    }
  }

  /// Quanitiy of product in 1 order

  async quantityOfProductOnOrder(id: string, productId: string): Promise<[]> {
    try {
      //@ts-ignore
      const conn = await client.connect();
      const sql =
        'SELECT SUM(quantity), product_id FROM orders_products WHERE order_id = ($1) AND product_id = ($2) GROUP BY product_id;';
      const result = await conn.query(sql, [id, productId]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`unable get products and orders: ${err}`);
    }
  }
  ///////////// most common product in order

  async mostfiveCommonProduct(): Promise<[]> {
    try {
      //@ts-ignore
      const conn = await client.connect();
      const sql =
        'SELECT name, COUNT(name)  AS "NumberOfAppear" FROM products INNER JOIN orders_products ON products.id = orders_products.product_id GROUP BY name ORDER BY "NumberOfAppear" DESC LIMIT 5';
      const result = await conn.query(sql);
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`unable get products by price: ${err}`);
    }
  }
}
