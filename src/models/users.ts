// @ts-ignore
import client from '../database';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const { SALT_ROUNDS, BCRYPT_PASSWORD } = process.env;

export type User = {
  id: string;
  firstname: string;
  lastname: string;
  password: string;
};

export class Users {
  async create(u: User): Promise<User> {
    try {
      const sql =
        'INSERT INTO users (firstname, lastname, password) VALUES($1, $2, $3) RETURNING id, firstname, lastname';
      // @ts-ignore
      const conn = await client.connect();
      const hash = bcrypt.hashSync(
        u.password + BCRYPT_PASSWORD,
        //@ts-ignore
        parseInt(SALT_ROUNDS)
      );
      const result = await conn.query(sql, [u.firstname, u.lastname, hash]);

      const user = result.rows[0];

      conn.release();

      return user;
    } catch (err) {
      throw new Error(`Could not add new user ${u.firstname}. Error: ${err}`);
    }
  }

  async index(): Promise<User[]> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sql = 'SELECT id, firstname, lastname FROM users';

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`);
    }
  }

  async show(id: string): Promise<User> {
    try {
      const sql = 'SELECT id, firstname, lastname FROM users WHERE id=($1)';
      // @ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find user ${id}. Error: ${err}`);
    }
  }

  async update(u: User): Promise<User> {
    try {
      const sql =
        'UPDATE users SET firstname=$1, lastname=$2, password=$3 WHERE id=$4 RETURNING id, firstname, lastname';
      // @ts-ignore
      const conn = await client.connect();
      const hash = bcrypt.hashSync(
        u.password + BCRYPT_PASSWORD,
        //@ts-ignore
        parseInt(SALT_ROUNDS)
      );
      const result = await conn.query(sql, [
        u.firstname,
        u.lastname,
        hash,
        u.id,
      ]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not update user ${u.id}. Error: ${err}`);
    }
  }
  async delete(id: string): Promise<User> {
    try {
      const sql =
        'DELETE FROM users WHERE id=($1) RETURNING id, firstname, lastname';
      // @ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [id]);

      const user = result.rows[0];

      conn.release();

      return user;
    } catch (err) {
      throw new Error(`Could not delete user ${id}. Error: ${err}`);
    }
  }
  async authenticate(
    firstname: string,
    lastname: string,
    password: string
  ): Promise<User | null> {
    try {
      //@ts-ignore
      const conn = await client.connect();
      const sql =
        'SELECT password FROM users WHERE firstname=($1) AND lastname=($2)';
      const result = await conn.query(sql, [firstname, lastname]);
      if (result.rows.length) {
        const isPasswordValid = result.rows[0];

        if (
          bcrypt.compareSync(
            password + BCRYPT_PASSWORD,
            isPasswordValid.password
          )
        ) {
          const userInfo = await conn.query(
            'SELECT id, firstname, lastname FROM users WHERE firstname=($1) AND lastname=($2)',
            [firstname, lastname]
          );
          return userInfo.rows[0];
        }
      }
      conn.release();
      return null;
    } catch (err) {
      throw new Error(`Unable to authenticate : ${err}`);
    }
  }
}
