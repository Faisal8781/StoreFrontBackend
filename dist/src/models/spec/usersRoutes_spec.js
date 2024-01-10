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
const users_1 = require("../users");
const server_1 = require("../../server");
const usertest = new users_1.Users();
const request = (0, supertest_1.default)(server_1.app);
let usertoken = '';
describe('Testing API Endpoint', () => {
    const user = {
        firstname: 'Faisal',
        lastname: 'Alsulaiman',
        password: 'password',
    };
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const createdUser = yield usertest.create(user);
        user.id = createdUser.id;
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        //@ts-ignore
        const conn = yield database_1.default.connect();
        const sql = 'DELETE FROM users';
        yield conn.query(sql);
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
    describe('Test CRUD API methods', () => {
        it('Create new user API', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request
                .post('/users')
                .set('Content-type', 'application/json')
                .send({
                firstname: 'Salah',
                lastname: 'Alhrbi',
                password: 'password',
            });
            expect(res.status).toBe(200);
            const { firstname, lastname } = res.body.data;
            expect(firstname).toBe('Salah');
            expect(lastname).toBe('Alhrbi');
        }));
        it('index API to get list of users', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request
                .get('/users')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${usertoken}`);
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBe(2);
        }));
        it('show to get indiviudal user API', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request
                .get(`/users/${user.id}`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${usertoken}`);
            expect(res.status).toBe(200);
            expect(res.body.data.firstname).toBe('Faisal');
            expect(res.body.data.lastname).toBe('Alsulaiman');
        }));
        it('Update user info API', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request
                .patch(`/users/${user.id}`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${usertoken}`)
                .send({
                firstname: 'FaisalAfterUpdate',
                lastname: 'Updated',
                password: 'password',
            });
            expect(res.status).toBe(200);
            const { id, firstname, lastname } = res.body.data;
            expect(id).toBe(user.id);
            expect(firstname).toBe('FaisalAfterUpdate');
            expect(lastname).toBe('Updated');
        }));
        it('Delete method API', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request
                .delete(`/users/${user.id}`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${usertoken}`);
            expect(res.status).toBe(200);
            expect(res.body.data.id).toBe(user.id);
            expect(res.body.data.firstname).toBe('FaisalAfterUpdate');
            expect(res.body.data.lastname).toBe('Updated');
        }));
    });
});
