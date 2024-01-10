"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const users_1 = __importDefault(require("./handlers/users"));
const orders_1 = __importDefault(require("./handlers/orders"));
const dashboard_1 = __importDefault(require("./handlers/dashboard"));
const products_1 = __importDefault(require("./handlers/products"));
const app = (0, express_1.default)();
exports.app = app;
const address = '0.0.0.0:3000';
const corsOptions = {
    origin: 'http://someotherdomain.com',
    optionSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json());
app.get('/', function (req, res) {
    res.send('Hello World!');
});
(0, users_1.default)(app);
(0, orders_1.default)(app);
(0, dashboard_1.default)(app);
(0, products_1.default)(app);
app.listen(3000, function () {
    console.log(`starting app on: ${address}`);
});
