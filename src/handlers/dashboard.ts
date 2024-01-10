import express, { Request, Response } from 'express';
import { DashboardQueries } from '../services/dashboard';
import validateTokenMiddleware from '../middleware/authentication.middleware';

const dashboard_routes = (app: express.Application) => {
  app.get('/products_in_orders/:id', productsInOrders);
  app.post('/order/:id/product', addProduct);
  app.get(
    '/complete_orders/:id',
    validateTokenMiddleware,
    completedOrderperUser
  );
  app.get('/all_orders/:id', validateTokenMiddleware, OrdersperUser);
  app.get('/most_common_product', mostfiveCommonProduct);
  app.get('/quantity_product_order/:id', quantityOfProductOnOrder);
};

const dashboard = new DashboardQueries();

const addProduct = async (req: Request, res: Response) => {
  const orderId: string = req.params.id;
  const productId: string = req.body.productId;
  const quantity: number = parseInt(req.body.quantity);

  try {
    const addedProduct = await dashboard.addProduct(
      quantity,
      orderId,
      productId
    );
    res.json({
      data: addedProduct,
      message: 'Order_Product Added successfully',
    });
  } catch (err) {
    console.log(err);
    res.json(err);
    res.status(400);
  }
};

const completedOrderperUser = async (req: Request, res: Response) => {
  try {
    const userWithOrder = await dashboard.completedOrderperUser(req.params.id);
    res.json({
      data: userWithOrder,
      message: 'Order_Product Added successfully',
    });
  } catch (err) {
    res.json(err);
  }
};

const OrdersperUser = async (req: Request, res: Response) => {
  try {
    const userWithOrder = await dashboard.OrdersperUser(req.params.id);
    res.json({
      data: userWithOrder,
      message: 'Order_Product Added successfully',
    });
  } catch (err) {
    res.json(err);
  }
};

const productsInOrders = async (req: Request, res: Response) => {
  try {
    const productsOrders = await dashboard.productsInOrders(req.params.id);
    res.json({
      data: productsOrders,
      message: 'Order_Product Added successfully',
    });
  } catch (err) {
    res.json(err);
  }
};

const mostfiveCommonProduct = async (req: Request, res: Response) => {
  try {
    const fiveMostExpensive = await dashboard.mostfiveCommonProduct();
    res.json({
      data: fiveMostExpensive,
      message: 'mostfiveCommonProduct Retrieved successfully',
    });
  } catch (err) {
    res.json(err);
  }
};

const quantityOfProductOnOrder = async (req: Request, res: Response) => {
  try {
    const quantityOfProductOnOrder = await dashboard.quantityOfProductOnOrder(
      req.params.id,
      req.body.productId
    );
    res.json({
      data: quantityOfProductOnOrder,
      message: 'quantityOfProductOnOrder Retrieved successfully',
    });
  } catch (err) {
    res.json(err);
  }
};
export default dashboard_routes;
