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
const users_1 = require("../users");
const usertest = new users_1.Users();
describe('Users Model', () => {
    it('should have an Authenticate method', () => {
        expect(usertest.authenticate).toBeDefined();
    });
    it('should have an index method', () => {
        expect(usertest.index).toBeDefined();
    });
    it('should have an show method', () => {
        expect(usertest.show).toBeDefined();
    });
    it('should have an create method', () => {
        expect(usertest.create).toBeDefined();
    });
    it('should have an delete method', () => {
        expect(usertest.delete).toBeDefined();
    });
    it('should have an show method', () => {
        expect(usertest.update).toBeDefined();
    });
    describe('Test User model', () => {
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
            const sql = 'DELETE FROM users';
            //@ts-ignore
            const conn = yield database_1.default.connect();
            yield conn.query(sql);
            conn.release();
        }));
        it('Create method should return a new user', () => __awaiter(void 0, void 0, void 0, function* () {
            //@ts-ignore
            const createUser = (yield usertest.create({
                firstname: 'Faisal2',
                lastname: 'Alsulaiman2',
                password: 'password',
            }));
            //@ts-ignore
            expect(createUser).toEqual({
                id: createUser.id,
                firstname: 'Faisal2',
                lastname: 'Alsulaiman2',
            });
        }));
        it('Index method should return list of users', () => __awaiter(void 0, void 0, void 0, function* () {
            const users = yield usertest.index();
            expect(users.length).toBe(2);
        }));
        it('Show method should return a user', () => __awaiter(void 0, void 0, void 0, function* () {
            const returnedUser = yield usertest.show(user.id);
            expect(returnedUser.id).toBe(user.id);
            expect(returnedUser.firstname).toBe(user.firstname);
            expect(returnedUser.lastname).toBe(user.lastname);
        }));
        it('Update method should update and return a user', () => __awaiter(void 0, void 0, void 0, function* () {
            //@ts-ignore
            const updateUser = yield usertest.update(Object.assign(Object.assign({}, user), { firstname: 'Faisal test', lastname: 'Alsulaiman test' }));
            expect(updateUser.id).toBe(user.id);
            expect(updateUser.firstname).toBe('Faisal test');
            expect(updateUser.lastname).toBe('Alsulaiman test');
        }));
        it('Delete method should delete user from db', () => __awaiter(void 0, void 0, void 0, function* () {
            const deletedUser = yield usertest.delete(user.id);
            expect(deletedUser.id).toBe(user.id);
        }));
    });
    describe('Test Authentication Login', () => {
        const user = {
            firstname: 'Faisal',
            lastname: 'Alsulaiman',
            password: 'password',
        };
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            const createdUser = yield usertest.create(user);
            user.id = createdUser.id;
        }));
        it('Authenticate method should return the authenticated user', () => __awaiter(void 0, void 0, void 0, function* () {
            const authenticatedUser = yield usertest.authenticate(user.firstname, user.lastname, user.password);
            //@ts-ignore
            expect(authenticatedUser['firstname']).toBe(user.firstname);
            //@ts-ignore
            expect(authenticatedUser['lastname']).toBe(user.lastname);
        }));
        it('Authenticate method should return null for wrong credentials', () => __awaiter(void 0, void 0, void 0, function* () {
            const authenticatedUser = yield usertest.authenticate('testwrong', 'testwrong', 'testwrong');
            expect(authenticatedUser).toBe(null);
        }));
    });
});
