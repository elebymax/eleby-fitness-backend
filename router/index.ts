import Router from 'koa-router'
import healthRoute from '../core/health/route';

const router = new Router({prefix: '/api'});

router.use(healthRoute);

export default router.middleware();
