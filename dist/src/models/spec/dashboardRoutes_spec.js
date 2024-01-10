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
const orders_1 = require("../orders");
const users_1 = require("../users");
const products_1 = require("../products");
const dashboard_1 = require("../../services/dashboard");
const server_1 = require("../../server");
const usertest = new users_1.Users();
const ordertest = new orders_1.OrderStore();
const producttest = new products_1.ProductCart();
const dashboardtest = new dashboard_1.DashboardQueries();
const request = (0, supertest_1.default)(server_1.app);
let usertoken = '';
describe('Testing API Endpoint', () => {
    const order = {
        status: 'Active',
    };
    const user = {
        firstname: 'Faisal',
        lastname: 'Alsulaiman',
        password: 'password',
    };
    const product = {
        name: 'Sword-I',
        price: 100,
        category: 'Weapons',
    };
    const orders_products = {
        id: '',
        quantity: 200,
        order_id: '',
        product_id: '',
    };
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const createdUser = yield usertest.create(user);
        user.id = createdUser.id;
        order.user_id = createdUser.id;
        const createdOrder = yield ordertest.create(order);
        order.id = createdOrder.id;
        orders_products.order_id = createdOrder.id;
        const createdProduct = yield producttest.create(product);
        product.id = createdProduct.id;
        orders_products.product_id = createdProduct.id;
        const createdOrderProduct = yield dashboardtest.addProduct(orders_products.quantity, orders_products.order_id, orders_products.product_id);
        orders_products.id = createdOrderProduct.id;
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        //@ts-ignore
        const conn = yield database_1.default.connect();
        const sql = 'DELETE FROM orders_products';
        yield conn.query(sql);
        const sqlProduct = 'DELETE FROM products';
        yield conn.query(sqlProduct);
        const sqlOrder = 'DELETE FROM orders';
        yield conn.query(sqlOrder);
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
    describe('Test Dashboard (CRUD) API', () => {
        it('AddProduct API', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request
                .post(`/order/${order.id}/product`)
                .set('Content-type', 'application/json')
                .send({
                productId: product.id,
                quantity: 200,
            });
            const { order_id, product_id } = res.body.data;
            expect(res.status).toBe(200);
            expect(order_id).toBe(order.id);
            expect(product_id).toBe(product.id);
        }));
        it('OrdersperUser API to get list of orders peruser', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request
                .get(`/all_orders/${user.id}`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${usertoken}`);
            expect(res.body.data.length).toBe(1);
        }));
        it('completedOrderperUser to get completed Order for user', () => __awaiter(void 0, void 0, void 0, function* () {
            const updateOrder = ordertest.update('Complete', order.id);
            const res = yield request
                .get(`/complete_orders/${user.id}`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${usertoken}`);
            expect(res.body.data.length).toBe(1);
            expect(res.body.data[0].user_id).toBe(user.id);
            expect(res.body.data[0].id).toBe(order.id);
        }));
        it('productsInOrders Dashboard API to retrive product assigned with order', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request
                .get(`/products_in_orders/${order.id}`)
                .set('Content-type', 'application/json');
            expect(res.body.data.length).toBe(2);
        }));
        it('quantityOfProductOnOrder API to get the quantity of the prodct in order using orders_products Table', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request
                .get(`/quantity_product_order/${order.id}`)
                .set('Content-type', 'application/json')
                .send({
                productId: product.id,
            });
            expect(res.body.data[0].sum).toBe('400');
        }));
        it('mostfiveCommonProduct API to get the quantity of the prodct in order using orders_products Table', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request
                .get('/most_common_product')
                .set('Content-type', 'application/json');
            expect(res.body.data[0].NumberOfAppear).toBe('2');
        }));
    });
});
