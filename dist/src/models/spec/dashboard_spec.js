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
const products_1 = require("../products");
const dashboard_1 = require("../../services/dashboard");
const usertest = new users_1.Users();
const ordertest = new orders_1.OrderStore();
const producttest = new products_1.ProductCart();
const dashboardtest = new dashboard_1.DashboardQueries();
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
        it('AddProduct method should return a new Order in product', () => __awaiter(void 0, void 0, void 0, function* () {
            //@ts-ignore
            const createOrderProduct = yield dashboardtest.addProduct(150, order.id, product.id);
            //@ts-ignore
            expect(createOrderProduct).toEqual({
                id: createOrderProduct.id,
                //@ts-ignore
                quantity: 150,
                order_id: order.id,
                product_id: product.id,
            });
        }));
        it('OrdersperUser method should return list of Orders per user', () => __awaiter(void 0, void 0, void 0, function* () {
            const userOrder = yield dashboardtest.OrdersperUser(user.id);
            //@ts-ignore
            expect(userOrder.length).toBe(1);
        }));
        it('completedOrderperUser method should return a list of order which are completed', () => __awaiter(void 0, void 0, void 0, function* () {
            const updateOrder = ordertest.update('Complete', order.id);
            const CompletedOrder = yield dashboardtest.completedOrderperUser(user.id);
            //@ts-ignore
            expect(CompletedOrder[0].id).toBe(order.id);
            //@ts-ignore
            expect(CompletedOrder[0].status).toBe('Complete');
            //@ts-ignore
            expect(CompletedOrder[0].user_id).toBe(user.id);
        }));
        it('productsInOrders method should show all product that assigned by order', () => __awaiter(void 0, void 0, void 0, function* () {
            const prodctOrders = yield dashboardtest.productsInOrders(order.id);
            //@ts-ignore
            expect(prodctOrders.length).toBe(2);
        }));
        it('quantityOfProductOnOrder method should return the quantity of each product in Order', () => __awaiter(void 0, void 0, void 0, function* () {
            const quantityofProduct = yield dashboardtest.quantityOfProductOnOrder(order.id, product.id);
            //@ts-ignore
            expect(quantityofProduct[0].sum).toBe('350');
        }));
        it('mostfiveCommonProduct method should return the quantity of each product in  Order', () => __awaiter(void 0, void 0, void 0, function* () {
            const mostfiveCommonProducts = yield dashboardtest.mostfiveCommonProduct();
            //@ts-ignore
            expect(mostfiveCommonProducts[0].NumberOfAppear).toBe('2');
        }));
    });
});
