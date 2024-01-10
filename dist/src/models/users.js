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
exports.Users = void 0;
// @ts-ignore
const database_1 = __importDefault(require("../database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { SALT_ROUNDS, BCRYPT_PASSWORD } = process.env;
class Users {
    create(u) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = 'INSERT INTO users (firstname, lastname, password) VALUES($1, $2, $3) RETURNING id, firstname, lastname';
                // @ts-ignore
                const conn = yield database_1.default.connect();
                const hash = bcrypt_1.default.hashSync(u.password + BCRYPT_PASSWORD, 
                //@ts-ignore
                parseInt(SALT_ROUNDS));
                const result = yield conn.query(sql, [u.firstname, u.lastname, hash]);
                const user = result.rows[0];
                conn.release();
                return user;
            }
            catch (err) {
                throw new Error(`Could not add new user ${u.firstname}. Error: ${err}`);
            }
        });
    }
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // @ts-ignore
                const conn = yield database_1.default.connect();
                const sql = 'SELECT id, firstname, lastname FROM users';
                const result = yield conn.query(sql);
                conn.release();
                return result.rows;
            }
            catch (err) {
                throw new Error(`Could not get users. Error: ${err}`);
            }
        });
    }
    show(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = 'SELECT id, firstname, lastname FROM users WHERE id=($1)';
                // @ts-ignore
                const conn = yield database_1.default.connect();
                const result = yield conn.query(sql, [id]);
                conn.release();
                return result.rows[0];
            }
            catch (err) {
                throw new Error(`Could not find user ${id}. Error: ${err}`);
            }
        });
    }
    update(u) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = 'UPDATE users SET firstname=$1, lastname=$2, password=$3 WHERE id=$4 RETURNING id, firstname, lastname';
                // @ts-ignore
                const conn = yield database_1.default.connect();
                const hash = bcrypt_1.default.hashSync(u.password + BCRYPT_PASSWORD, 
                //@ts-ignore
                parseInt(SALT_ROUNDS));
                const result = yield conn.query(sql, [
                    u.firstname,
                    u.lastname,
                    hash,
                    u.id,
                ]);
                conn.release();
                return result.rows[0];
            }
            catch (err) {
                throw new Error(`Could not update user ${u.id}. Error: ${err}`);
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = 'DELETE FROM users WHERE id=($1) RETURNING id, firstname, lastname';
                // @ts-ignore
                const conn = yield database_1.default.connect();
                const result = yield conn.query(sql, [id]);
                const user = result.rows[0];
                conn.release();
                return user;
            }
            catch (err) {
                throw new Error(`Could not delete user ${id}. Error: ${err}`);
            }
        });
    }
    authenticate(firstname, lastname, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //@ts-ignore
                const conn = yield database_1.default.connect();
                const sql = 'SELECT password FROM users WHERE firstname=($1) AND lastname=($2)';
                const result = yield conn.query(sql, [firstname, lastname]);
                if (result.rows.length) {
                    const isPasswordValid = result.rows[0];
                    if (bcrypt_1.default.compareSync(password + BCRYPT_PASSWORD, isPasswordValid.password)) {
                        const userInfo = yield conn.query('SELECT id, firstname, lastname FROM users WHERE firstname=($1) AND lastname=($2)', [firstname, lastname]);
                        return userInfo.rows[0];
                    }
                }
                conn.release();
                return null;
            }
            catch (err) {
                throw new Error(`Unable to authenticate : ${err}`);
            }
        });
    }
}
exports.Users = Users;
