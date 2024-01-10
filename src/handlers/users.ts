import express, { Request, Response } from 'express';
import { User, Users } from '../models/users';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import validateTokenMiddleware from '../middleware/authentication.middleware';

dotenv.config();
const { TOKEN_SECRET } = process.env;
const store = new Users();

const index = async (req: Request, res: Response) => {
  try {
    const users = await store.index();
    res.json({
      data: users,
      message: 'User retrived successfully',
    });
  } catch (err) {
    res.json(err);
  }
};
const show = async (req: Request, res: Response) => {
  try {
    const user = await store.show(req.params.id);
    res.json({ data: user, message: 'User retrived successfully' });
  } catch (err) {
    res.json(err);
  }
};

const update = async (req: Request, res: Response) => {
  const userBody = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: req.body.password,
    id: req.params.id,
  };
  try {
    const user = await store.update(userBody);
    res.json({ data: user, message: 'User updated successfully' });
  } catch (err) {
    res.json(err);
  }
};

const deleteOne = async (req: Request, res: Response) => {
  try {
    const user = await store.delete(req.params.id);
    res.json({
      data: user,
      message: 'User deleted successfully',
    });
  } catch (err) {
    res.json(err);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    const user: User = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: req.body.password,
    };
    const newUser = await store.create(user);
    var token = jwt.sign({ user: newUser }, TOKEN_SECRET as string);
    res.json({
      token: token,
      data: { ...newUser },
      message: 'User Created Successfully',
    });
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const authenticate = async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    const user: User = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: req.body.password,
    };
    const authUser = await store.authenticate(
      user.firstname,
      user.lastname,
      user.password
    );
    const token = jwt.sign({ authUser }, TOKEN_SECRET as unknown as string);
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'the username and password do not match please try again',
      });
    }

    return res.json({
      data: { ...authUser, token },
      message: 'user authenticated successfully',
    });
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const users_routes = (app: express.Application) => {
  app.get('/users', validateTokenMiddleware, index);
  app.get('/users/:id', validateTokenMiddleware, show);
  app.post('/users', create);
  app.patch('/users/:id', validateTokenMiddleware, update);
  app.delete('/users/:id', validateTokenMiddleware, deleteOne);
  app.post('/authenticate', authenticate);
};

export default users_routes;
