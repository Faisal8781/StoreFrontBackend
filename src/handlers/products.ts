import express, { Request, Response } from 'express';
import { Product, ProductCart } from '../models/products';
import dotenv from 'dotenv';
import validateTokenMiddleware from '../middleware/authentication.middleware';
dotenv.config();

const store = new ProductCart();

const index = async (req: Request, res: Response) => {
  try {
    const products = await store.index();
    res.json({
      data: products,
      message: 'Products retrived successfully',
    });
  } catch (err) {
    res.json(err);
  }
};
const show = async (req: Request, res: Response) => {
  try {
    const product = await store.show(req.params.id);
    res.json({ data: product, message: 'Product retrived successfully' });
  } catch (err) {
    res.json(err);
  }
};

const create = async (req: Request, res: Response) => {
  //@ts-ignore
  const product: Product = {
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
  };

  try {
    const newProduct = await store.create(product);
    res.json({
      data: { ...newProduct },
      message: 'Product Created Successfully',
    });
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const update = async (req: Request, res: Response) => {
  const prodctBody = {
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    id: req.params.id,
  };
  try {
    const prodct = await store.update(prodctBody);
    res.json({ data: prodct, message: 'Product updated successfully' });
  } catch (err) {
    res.json(err);
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    const deletedProduct = await store.delete(req.params.id);
    res.json({
      data: deletedProduct,
      message: 'Product deleted successfully',
    });
  } catch (err) {
    res.json(err);
  }
};

const byCategory = async (req: Request, res: Response) => {
  try {
    const products = await store.byCategory(req.body.category);
    res.json({
      data: products,
      message: 'Products by category retrived successfully',
    });
  } catch (err) {
    res.json(err);
  }
};

const products_routes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', validateTokenMiddleware, create);
  app.delete('/products/:id', destroy);
  app.get('/category', byCategory);
  app.patch('/products/:id', update);
};

export default products_routes;
