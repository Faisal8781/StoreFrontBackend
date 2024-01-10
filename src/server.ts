import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import users_routes from './handlers/users';
import orders_routes from './handlers/orders';
import dashboard_routes from './handlers/dashboard';
import products_routes from './handlers/products';

const app: express.Application = express();
const address: string = '0.0.0.0:3000';

const corsOptions = {
  origin: 'http://someotherdomain.com',
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.get('/', function (req: Request, res: Response) {
  res.send('Hello World!');
});

users_routes(app);
orders_routes(app);
dashboard_routes(app);
products_routes(app);

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});

export { app };
