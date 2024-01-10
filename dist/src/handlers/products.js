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
const products_1 = require("../models/products");
const dotenv_1 = __importDefault(require("dotenv"));
const authentication_middleware_1 = __importDefault(require("../middleware/authentication.middleware"));
dotenv_1.default.config();
const store = new products_1.ProductCart();
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield store.index();
        res.json({
            data: products,
            message: 'Products retrived successfully',
        });
    }
    catch (err) {
        res.json(err);
    }
});
const show = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield store.show(req.params.id);
        res.json({ data: product, message: 'Product retrived successfully' });
    }
    catch (err) {
        res.json(err);
    }
});
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const product = {
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
    };
    try {
        const newProduct = yield store.create(product);
        res.json({
            data: Object.assign({}, newProduct),
            message: 'Product Created Successfully',
        });
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
});
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prodctBody = {
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        id: req.params.id,
    };
    try {
        const prodct = yield store.update(prodctBody);
        res.json({ data: prodct, message: 'Product updated successfully' });
    }
    catch (err) {
        res.json(err);
    }
});
const destroy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedProduct = yield store.delete(req.params.id);
        res.json({
            data: deletedProduct,
            message: 'Product deleted successfully',
        });
    }
    catch (err) {
        res.json(err);
    }
});
const byCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield store.byCategory(req.body.category);
        res.json({
            data: products,
            message: 'Products by category retrived successfully',
        });
    }
    catch (err) {
        res.json(err);
    }
});
const products_routes = (app) => {
    app.get('/products', index);
    app.get('/products/:id', show);
    app.post('/products', authentication_middleware_1.default, create);
    app.delete('/products/:id', destroy);
    app.get('/category', byCategory);
    app.patch('/products/:id', update);
};
exports.default = products_routes;
