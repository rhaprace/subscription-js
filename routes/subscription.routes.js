import {Router} from 'express';
import authorize from '../middleware/auth.middleware.js';
import {createSubscription,
getAllSubscriptions,
getSubscriptionById,
updateSubscription,
deleteSubscription,
cancelSubscription,
getUpcomingRenewals
} from '../controllers/subscription.controller.js';
const subscriptionRouter = Router();

subscriptionRouter.get('/', authorize, getAllSubscriptions);

subscriptionRouter.get('/:id', authorize, getSubscriptionById);

subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.put('/:id', authorize, updateSubscription);

subscriptionRouter.delete('/:id', authorize, deleteSubscription);

subscriptionRouter.get('/user/:id', authorize, getAllSubscriptions);

subscriptionRouter.put('/:id/cancel', authorize , cancelSubscription);

subscriptionRouter.get('/upcoming-renewals', authorize, getUpcomingRenewals);

export default subscriptionRouter;