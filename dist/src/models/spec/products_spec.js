"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-ignore
const database_1 = __importDefault(require("../../database"));
const products_1 = require("../products");
const producttest = new products_1.ProductCart();
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
        };
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            const createdProduct = yield producttest.create(product);
            product.id = createdProduct.id;
        }));
        afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
            const sql = 'DELETE FROM products';
            //@ts-ignore
            const conn = yield database_1.default.connect();
            yield conn.query(sql);
            conn.release();
        }));
        it('Create method should return a new product', () => __awaiter(void 0, void 0, void 0, function* () {
            //@ts-ignore
            const createProduct = (yield producttest.create({
                name: 'Sword-II',
                price: 300,
                category: 'Weapons',
            }));
            //@ts-ignore
            expect(createProduct).toEqual({
                id: createProduct.id,
                name: 'Sword-II',
                price: 300,
                category: 'Weapons',
            });
        }));
        it('Index method should return list of Products', () => __awaiter(void 0, void 0, void 0, function* () {
            const products = yield producttest.index();
            expect(products.length).toBe(2);
        }));
        it('Show method should return a product', () => __awaiter(void 0, void 0, void 0, function* () {
            const returnedProduct = yield producttest.show(product.id);
            expect(returnedProduct.id).toBe(product.id);
            expect(returnedProduct.name).toBe(product.name);
            expect(returnedProduct.price).toBe(product.price);
            expect(returnedProduct.category).toBe(product.category);
        }));
        it('Update method should update and return a user', () => __awaiter(void 0, void 0, void 0, function* () {
            //@ts-ignore
            const updateProduct = yield producttest.update(Object.assign(Object.assign({}, product), { name: 'SuperSword', price: 345, category: 'Weapons' }));
            expect(updateProduct.id).toBe(product.id);
            expect(updateProduct.name).toBe('SuperSword');
            expect(updateProduct.price).toBe(345);
            expect(updateProduct.category).toBe('Weapons');
        }));
        it('Delete method should delete user from db', () => __awaiter(void 0, void 0, void 0, function* () {
            const deletedProduct = yield producttest.delete(product.id);
            expect(deletedProduct.id).toBe(product.id);
        }));
    });
});
