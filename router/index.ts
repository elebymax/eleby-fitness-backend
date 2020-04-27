import Router from 'koa-router'
import healthRoute from '../core/health/route';
import config from '../config';

const router = new Router({prefix: config.app.baseApi});

router.use(healthRoute);

export default router.middleware();
