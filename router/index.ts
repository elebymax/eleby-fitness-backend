import Router from 'koa-router'
import healthRoute from '../core/health/route';
import userRoute from '../core/user/route';
import mealRoute from '../core/meal/route';
import config from '../config';

const router = new Router({prefix: config.app.baseApi});

router.use(healthRoute);
router.use(userRoute);
router.use(mealRoute);

export default router.middleware();
