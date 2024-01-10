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
const supertest_1 = __importDefault(require("supertest"));
const products_1 = require("../products");
const users_1 = require("../users");
const server_1 = require("../../server");
const producttest = new products_1.ProductCart();
const usertest = new users_1.Users();
const request = (0, supertest_1.default)(server_1.app);
let usertoken = '';
describe('Testing API Endpoint', () => {
    const product = {
        name: 'Sword-I',
        price: 200,
        category: 'Weapons',
    };
    const user = {
        firstname: 'Faisal',
        lastname: 'Alsulaiman',
        password: 'password',
    };
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const createdProduct = yield producttest.create(product);
        product.id = createdProduct.id;
        const createdUser = yield usertest.create(user);
        user.id = createdUser.id;
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        //@ts-ignore
        const conn = yield database_1.default.connect();
        const sql = 'DELETE FROM products';
        yield conn.query(sql);
        const sqlUser = 'DELETE FROM users';
        yield conn.query(sqlUser);
        conn.release();
    }));
    describe('Test Authenticattion API', () => {
        it('should be able to authenticate to get token', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request
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
        }));
    });
    describe('Test Proudcts (CRUD) API', () => {
        it('Create new product API', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request
                .post('/products')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${usertoken}`)
                .send({
                name: 'Armor-I',
                price: 300,
                category: 'Armor Kit',
            });
            expect(res.status).toBe(200);
            const { name, price, category } = res.body.data;
            expect(name).toBe('Armor-I');
            expect(price).toBe(300);
            expect(category).toBe('Armor Kit');
        }));
        it('index API to get list of products', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request
                .get('/products')
                .set('Content-type', 'application/json');
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBe(2);
        }));
        it('show to get indiviudal Product API', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request
                .get(`/products/${product.id}`)
                .set('Content-type', 'application/json');
            expect(res.status).toBe(200);
            expect(res.body.data.name).toBe('Sword-I');
            expect(res.body.data.price).toBe(200);
            expect(res.body.data.category).toBe('Weapons');
        }));
        it('Update Product  API', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request
                .patch(`/products/${product.id}`)
                .set('Content-type', 'application/json')
                .send({
                name: 'SwordUpdated',
                price: 200,
                category: 'New Weapons',
            });
            expect(res.status).toBe(200);
            const { id, name, price, category } = res.body.data;
            expect(id).toBe(product.id);
            expect(name).toBe('SwordUpdated');
            expect(price).toBe(200);
            expect(category).toBe('New Weapons');
        }));
        it('Get Product by Category API', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request
                .get('/category')
                .set('Content-type', 'application/json')
                .send({
                category: 'New Weapons',
            });
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBe(1);
        }));
        it('Delete method API', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request
                .delete(`/products/${product.id}`)
                .set('Content-type', 'application/json');
            expect(res.status).toBe(200);
            expect(res.body.data.id).toBe(product.id);
            expect(res.body.data.name).toBe('SwordUpdated');
            expect(res.body.data.price).toBe(200);
            expect(res.body.data.category).toBe('New Weapons');
        }));
    });
});
