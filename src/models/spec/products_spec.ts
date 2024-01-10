//@ts-ignore
import client from '../../database';
import { Product, ProductCart } from '../products';
const producttest = new ProductCart();

describe('Proudcts Model', () => {
  it('should have an By Category method', () => {
    expect(producttest.byCategory).toBeDefined();
  });

  it('should have an index method', () => {
    expect(producttest.index).toBeDefined();
  });

  it('should have an show method', () => {
    expect(producttest.show).toBeDefined();
  });
  it('should have an create method', () => {
    expect(producttest.create).toBeDefined();
  });
  it('should have an delete method', () => {
    expect(producttest.delete).toBeDefined();
  });
  it('should have an show method', () => {
    expect(producttest.update).toBeDefined();
  });
  describe('Test Prodct model', () => {
    const product = {
      name: 'Sword-I',
      price: 200,
      category: 'Weapons',
    } as Product;

    beforeAll(async () => {
      const createdProduct = await producttest.create(product);
      product.id = createdProduct.id;
    });
    afterAll(async () => {
      const sql = 'DELETE FROM products';
      //@ts-ignore

      const conn = await client.connect();

      await conn.query(sql);

      conn.release();
    });

    it('Create method should return a new product', async () => {
      //@ts-ignore
      const createProduct = (await producttest.create({
        name: 'Sword-II',
        price: 300,
        category: 'Weapons',
      })) as Product;
      //@ts-ignore
      expect(createProduct).toEqual({
        id: createProduct.id,
        name: 'Sword-II',
        price: 300,
        category: 'Weapons',
      });
    });
    it('Index method should return list of Products', async () => {
      const products = await producttest.index();
      expect(products.length).toBe(2);
    });

    it('Show method should return a product', async () => {
      const returnedProduct = await producttest.show(product.id);
      expect(returnedProduct.id).toBe(product.id);
      expect(returnedProduct.name).toBe(product.name);
      expect(returnedProduct.price).toBe(product.price);
      expect(returnedProduct.category).toBe(product.category);
    });

    it('Update method should update and return a user', async () => {
      //@ts-ignore
      const updateProduct = await producttest.update({
        ...product,
        name: 'SuperSword',
        price: 345,
        category: 'Weapons',
      });
      expect(updateProduct.id).toBe(product.id);
      expect(updateProduct.name).toBe('SuperSword');
      expect(updateProduct.price).toBe(345);
      expect(updateProduct.category).toBe('Weapons');
    });

    it('Delete method should delete user from db', async () => {
      const deletedProduct = await producttest.delete(product.id);
      expect(deletedProduct.id).toBe(product.id);
    });
  });
});
