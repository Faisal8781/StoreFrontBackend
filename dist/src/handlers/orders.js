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
const orders_1 = require("../models/orders");
const authentication_middleware_1 = __importDefault(require("../middleware/authentication.middleware"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const store = new orders_1.OrderStore();
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield store.index();
        res.json({
            data: orders,
            message: 'Orders retrived successfully',
        });
    }
    catch (err) {
        res.json(err);
    }
});
const show = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield store.show(req.params.id);
        res.json({ data: orders, message: 'Orders retrived successfully' });
    }
    catch (err) {
        res.json(err);
    }
});
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield store.update(req.body.status, req.params.id);
        res.json({ data: orders, message: 'Order updated succefully' });
    }
    catch (err) {
        res.json(err);
    }
});
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const order = {
        status: req.body.status,
        user_id: req.body.user_id,
    };
    try {
        const newOrder = yield store.create(order);
        res.json({
            data: Object.assign({}, newOrder),
            message: 'Order Created Successfully',
        });
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
});
const destroy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield store.delete(req.params.id);
        res.json({
            data: deleted,
            message: 'Order deleted successfully',
        });
    }
    catch (err) {
        res.json(err);
    }
});
const orders_routes = (app) => {
    app.get('/orders', authentication_middleware_1.default, index);
    app.get('/orders/:id', authentication_middleware_1.default, show);
    app.post('/orders', authentication_middleware_1.default, create);
    app.patch('/orders/:id', authentication_middleware_1.default, update);
    app.delete('/orders/:id', authentication_middleware_1.default, destroy);
};
exports.default = orders_routes;
