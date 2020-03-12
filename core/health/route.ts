import Router from 'koa-router'
import {Context} from "koa";

const router = new Router({prefix: '/health'});

router.get('/',
  async (ctx: Context, next: () => Promise<void>): Promise<void> => {
    ctx.status = 200;
    ctx.body = 'I am healthy!';
    return;
  });

export default router.middleware();
