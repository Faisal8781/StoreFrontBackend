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
const users_1 = require("../models/users");
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authentication_middleware_1 = __importDefault(require("../middleware/authentication.middleware"));
dotenv_1.default.config();
const { TOKEN_SECRET } = process.env;
const store = new users_1.Users();
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield store.index();
        res.json({
            data: users,
            message: 'User retrived successfully',
        });
    }
    catch (err) {
        res.json(err);
    }
});
const show = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield store.show(req.params.id);
        res.json({ data: user, message: 'User retrived successfully' });
    }
    catch (err) {
        res.json(err);
    }
});
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userBody = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: req.body.password,
        id: req.params.id,
    };
    try {
        const user = yield store.update(userBody);
        res.json({ data: user, message: 'User updated successfully' });
    }
    catch (err) {
        res.json(err);
    }
});
const deleteOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield store.delete(req.params.id);
        res.json({
            data: user,
            message: 'User deleted successfully',
        });
    }
    catch (err) {
        res.json(err);
    }
});
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const user = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: req.body.password,
        };
        const newUser = yield store.create(user);
        var token = jsonwebtoken_1.default.sign({ user: newUser }, TOKEN_SECRET);
        res.json({
            token: token,
            data: Object.assign({}, newUser),
            message: 'User Created Successfully',
        });
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
});
const authenticate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const user = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: req.body.password,
        };
        const authUser = yield store.authenticate(user.firstname, user.lastname, user.password);
        const token = jsonwebtoken_1.default.sign({ authUser }, TOKEN_SECRET);
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'the username and password do not match please try again',
            });
        }
        return res.json({
            data: Object.assign(Object.assign({}, authUser), { token }),
            message: 'user authenticated successfully',
        });
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
});
const users_routes = (app) => {
    app.get('/users', authentication_middleware_1.default, index);
    app.get('/users/:id', authentication_middleware_1.default, show);
    app.post('/users', create);
    app.patch('/users/:id', authentication_middleware_1.default, update);
    app.delete('/users/:id', authentication_middleware_1.default, deleteOne);
    app.post('/authenticate', authenticate);
};
exports.default = users_routes;
