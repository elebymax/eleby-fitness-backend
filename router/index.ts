import Router from 'koa-router'
import healthRoute from '../core/health/route';
import userRoute from '../core/user/route';
import mealRoute from '../core/meal/route';
import diaryRoute from '../core/diary/route';
import config from '../config';

const router = new Router({prefix: config.app.baseApi});

router.use(healthRoute);
router.use(userRoute);
router.use(mealRoute);
router.use(diaryRoute);

export default router.middleware();
