//@ts-ignore
import client from '../../database';
import { User, Users } from '../users';
const usertest = new Users();

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
    } as User;

    beforeAll(async () => {
      const createdUser = await usertest.create(user);
      user.id = createdUser.id;
    });
    afterAll(async () => {
      const sql = 'DELETE FROM users';
      //@ts-ignore

      const conn = await client.connect();

      await conn.query(sql);

      conn.release();
    });

    it('Create method should return a new user', async () => {
      //@ts-ignore
      const createUser = (await usertest.create({
        firstname: 'Faisal2',
        lastname: 'Alsulaiman2',
        password: 'password',
      })) as User;
      //@ts-ignore
      expect(createUser).toEqual({
        id: createUser.id,
        firstname: 'Faisal2',
        lastname: 'Alsulaiman2',
      });
    });
    it('Index method should return list of users', async () => {
      const users = await usertest.index();
      expect(users.length).toBe(2);
    });

    it('Show method should return a user', async () => {
      const returnedUser = await usertest.show(user.id);
      expect(returnedUser.id).toBe(user.id);
      expect(returnedUser.firstname).toBe(user.firstname);
      expect(returnedUser.lastname).toBe(user.lastname);
    });

    it('Update method should update and return a user', async () => {
      //@ts-ignore
      const updateUser = await usertest.update({
        ...user,
        firstname: 'Faisal test',
        lastname: 'Alsulaiman test',
      });
      expect(updateUser.id).toBe(user.id);
      expect(updateUser.firstname).toBe('Faisal test');
      expect(updateUser.lastname).toBe('Alsulaiman test');
    });

    it('Delete method should delete user from db', async () => {
      const deletedUser = await usertest.delete(user.id);
      expect(deletedUser.id).toBe(user.id);
    });
  });

  describe('Test Authentication Login', () => {
    const user = {
      firstname: 'Faisal',
      lastname: 'Alsulaiman',
      password: 'password',
    } as User;

    beforeAll(async () => {
      const createdUser = await usertest.create(user);
      user.id = createdUser.id;
    });
    it('Authenticate method should return the authenticated user', async () => {
      const authenticatedUser = await usertest.authenticate(
        user.firstname,
        user.lastname,
        user.password
      );
      //@ts-ignore
      expect(authenticatedUser['firstname']).toBe(user.firstname);
      //@ts-ignore
      expect(authenticatedUser['lastname']).toBe(user.lastname);
    });
    it('Authenticate method should return null for wrong credentials', async () => {
      const authenticatedUser = await usertest.authenticate(
        'testwrong',
        'testwrong',
        'testwrong'
      );
      expect(authenticatedUser).toBe(null);
    });
  });
});
