import Router from 'koa-router'
import healthRoute from '../core/health/route';
import userRoute from '../core/user/route';
import config from '../config';

const router = new Router({prefix: config.app.baseApi});

router.use(healthRoute);
router.use(userRoute);

export default router.middleware();
