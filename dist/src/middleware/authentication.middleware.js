"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const validateTokenMiddleware = (req, res, next) => {
    try {
        const authHeader = req.get('Authorization');
        if (authHeader) {
            const bearer = authHeader.split(' ')[0].toLowerCase();
            const token = authHeader.split(' ')[1];
            if (token && bearer === 'bearer') {
                const decode = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
                if (decode) {
                    next();
                }
                else {
                    throw new Error('Failed to auth User');
                }
            }
            else {
                throw new Error('Error Login');
            }
        }
        else {
            // No token provided
            throw new Error('Error Login');
        }
    }
    catch (err) {
        throw new Error('Login Error: Please try again');
    }
};
exports.default = validateTokenMiddleware;
