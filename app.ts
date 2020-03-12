import Koa from 'koa'
import cors from 'koa2-cors';
import config from './config';
import bodyparser from 'koa-bodyparser'
import errorHandler from './core/error';
import logger from './logger';
import BadRequestError from "./core/error/BadRequestError";
import router from './router';

export const koa = new Koa();

koa.use(errorHandler);
koa.use(
  bodyparser({
    onerror: () => {
      throw new BadRequestError('Invalid JSON', 400);
    },
  }),
);
koa.use(cors({
  origin: function (ctx: any) {
    return '*';
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'Access-Control-Allow-Origin'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowHeaders: ['Origin', 'Content-Type', 'Authorization', 'Accept'],
}));
koa.use(router);

koa.listen(config.app.port, () => {
  logger('App').info(`The server is running on http://localhost:${config.app.port}`);
});
