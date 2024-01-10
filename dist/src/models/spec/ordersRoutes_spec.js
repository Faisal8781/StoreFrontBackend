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
const server_1 = require("../../server");
const ordertest = new orders_1.OrderStore();
const usertest = new users_1.Users();
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
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const createdUser = yield usertest.create(user);
        user.id = createdUser.id;
        order.user_id = createdUser.id;
        const createdOrder = yield ordertest.create(order);
        order.id = createdOrder.id;
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        //@ts-ignore
        const conn = yield database_1.default.connect();
        const sql = 'DELETE FROM orders';
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
    describe('Test Orders (CRUD) API', () => {
        it('Create new order API', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request
                .post('/orders')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${usertoken}`)
                .send({
                status: 'Active',
                user_id: order.user_id,
            });
            expect(res.status).toBe(200);
            const { status, user_id } = res.body.data;
            expect(status).toBe('Active');
            expect(user_id).toBe(user.id);
        }));
        it('index API to get list of orders', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request
                .get('/orders')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${usertoken}`);
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBe(2);
        }));
        it('show to get indiviudal Order API', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request
                .get(`/orders/${order.id}`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${usertoken}`);
            expect(res.status).toBe(200);
            expect(res.body.data.status).toBe('Active');
            expect(res.body.data.user_id).toBe(order.user_id);
        }));
        it('Update Order API', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request
                .patch(`/orders/${order.id}`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${usertoken}`)
                .send({
                status: 'Complete',
            });
            expect(res.status).toBe(200);
            const { status, user_id } = res.body.data;
            expect(status).toBe('Complete');
            expect(user_id).toBe(order.user_id);
        }));
        it('Delete method API', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request
                .delete(`/orders/${order.id}`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${usertoken}`);
            expect(res.status).toBe(200);
            expect(res.body.data.id).toBe(order.id);
            expect(res.body.data.status).toBe('Complete');
            expect(res.body.data.user_id).toBe(order.user_id);
        }));
    });
});
