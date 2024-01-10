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
const dashboard_1 = require("../services/dashboard");
const authentication_middleware_1 = __importDefault(require("../middleware/authentication.middleware"));
const dashboard_routes = (app) => {
    app.get('/products_in_orders/:id', productsInOrders);
    app.post('/order/:id/product', addProduct);
    app.get('/complete_orders/:id', authentication_middleware_1.default, completedOrderperUser);
    app.get('/all_orders/:id', authentication_middleware_1.default, OrdersperUser);
    app.get('/most_common_product', mostfiveCommonProduct);
    app.get('/quantity_product_order/:id', quantityOfProductOnOrder);
};
const dashboard = new dashboard_1.DashboardQueries();
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    const productId = req.body.productId;
    const quantity = parseInt(req.body.quantity);
    try {
        const addedProduct = yield dashboard.addProduct(quantity, orderId, productId);
        res.json({
            data: addedProduct,
            message: 'Order_Product Added successfully',
        });
    }
    catch (err) {
        console.log(err);
        res.json(err);
        res.status(400);
    }
});
const completedOrderperUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userWithOrder = yield dashboard.completedOrderperUser(req.params.id);
        res.json({
            data: userWithOrder,
            message: 'Order_Product Added successfully',
        });
    }
    catch (err) {
        res.json(err);
    }
});
const OrdersperUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userWithOrder = yield dashboard.OrdersperUser(req.params.id);
        res.json({
            data: userWithOrder,
            message: 'Order_Product Added successfully',
        });
    }
    catch (err) {
        res.json(err);
    }
});
const productsInOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productsOrders = yield dashboard.productsInOrders(req.params.id);
        res.json({
            data: productsOrders,
            message: 'Order_Product Added successfully',
        });
    }
    catch (err) {
        res.json(err);
    }
});
const mostfiveCommonProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fiveMostExpensive = yield dashboard.mostfiveCommonProduct();
        res.json({
            data: fiveMostExpensive,
            message: 'mostfiveCommonProduct Retrieved successfully',
        });
    }
    catch (err) {
        res.json(err);
    }
});
const quantityOfProductOnOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quantityOfProductOnOrder = yield dashboard.quantityOfProductOnOrder(req.params.id, req.body.productId);
        res.json({
            data: quantityOfProductOnOrder,
            message: 'quantityOfProductOnOrder Retrieved successfully',
        });
    }
    catch (err) {
        res.json(err);
    }
});
exports.default = dashboard_routes;
