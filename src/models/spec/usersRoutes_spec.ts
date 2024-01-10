//@ts-ignore
import client from '../../database';
import supertest from 'supertest';
import { User, Users } from '../users';
import { app } from '../../server';
const usertest = new Users();
const request = supertest(app);
let usertoken = '';

describe('Testing API Endpoint', () => {
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
    //@ts-ignore
    const conn = await client.connect();
    const sql = 'DELETE FROM users';
    await conn.query(sql);
    conn.release();
  });

  describe('Test Authenticattion API', () => {
    it('should be able to authenticate to get token', async () => {
      const res = await request
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
    });
  });

  describe('Test CRUD API methods', () => {
    it('Create new user API', async () => {
      const res = await request
        .post('/users')
        .set('Content-type', 'application/json')
        .send({
          firstname: 'Salah',
          lastname: 'Alhrbi',
          password: 'password',
        } as User);
      expect(res.status).toBe(200);
      const { firstname, lastname } = res.body.data;
      expect(firstname).toBe('Salah');
      expect(lastname).toBe('Alhrbi');
    });
    it('index API to get list of users', async () => {
      const res = await request
        .get('/users')
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${usertoken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
    });

    it('show to get indiviudal user API', async () => {
      const res = await request
        .get(`/users/${user.id}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${usertoken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.firstname).toBe('Faisal');
      expect(res.body.data.lastname).toBe('Alsulaiman');
    });

    it('Update user info API', async () => {
      const res = await request
        .patch(`/users/${user.id}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${usertoken}`)
        .send({
          firstname: 'FaisalAfterUpdate',
          lastname: 'Updated',
          password: 'password',
        } as User);
      expect(res.status).toBe(200);
      const { id, firstname, lastname } = res.body.data;
      expect(id).toBe(user.id);
      expect(firstname).toBe('FaisalAfterUpdate');
      expect(lastname).toBe('Updated');
    });
    it('Delete method API', async () => {
      const res = await request
        .delete(`/users/${user.id}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${usertoken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(user.id);
      expect(res.body.data.firstname).toBe('FaisalAfterUpdate');
      expect(res.body.data.lastname).toBe('Updated');
    });
  });
});
