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
const orders_1 = require("../orders");
const users_1 = require("../users");
const ordertest = new orders_1.OrderStore();
const usertest = new users_1.Users();
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
        };
        const user = {
            firstname: 'Faisal',
            lastname: 'Alsulaiman',
            password: 'password',
        };
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            const createdUser = yield usertest.create(user);
            user.id = createdUser.id;
            const createdOrder = yield ordertest.create(order);
            order.id = createdOrder.id;
            order.user_id = createdUser.id;
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
        it('Create method should return a new Order', () => __awaiter(void 0, void 0, void 0, function* () {
            //@ts-ignore
            const createOrder = (yield ordertest.create({
                status: 'Active',
                user_id: user.id,
            }));
            //@ts-ignore
            expect(createOrder).toEqual({
                id: createOrder.id,
                status: 'Active',
                user_id: createOrder.user_id,
            });
        }));
        it('Index method should return list of Orders', () => __awaiter(void 0, void 0, void 0, function* () {
            const orders = yield ordertest.index();
            expect(orders.length).toBe(2);
        }));
        it('Show method should return a Order', () => __awaiter(void 0, void 0, void 0, function* () {
            const returnedOrder = yield ordertest.show(order.id);
            expect(returnedOrder.id).toBe(order.id);
            expect(returnedOrder.status).toBe(order.status);
            expect(order.user_id).toBe(order.user_id);
        }));
        it('Update method should update and return a Order', () => __awaiter(void 0, void 0, void 0, function* () {
            //@ts-ignore
            const updateOrder = yield ordertest.update('Complete', order.id);
            expect(updateOrder.id).toBe(order.id);
            expect(updateOrder.status).toBe('Complete');
            expect(order.user_id).toBe(order.user_id);
        }));
        it('Delete method should delete Order from db', () => __awaiter(void 0, void 0, void 0, function* () {
            const deletedProduct = yield ordertest.delete(order.id);
            expect(deletedProduct.id).toBe(order.id);
            expect(deletedProduct.status).toBe('Complete');
            expect(order.user_id).toBe(order.user_id);
        }));
    });
});
