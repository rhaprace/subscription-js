import * as SubscriptionModel from '../models/subscription.model.js';
import pool from '../database/postgresdb.js';
import {SERVER_URL} from '../config/env.js';
import {workflowClient} from '../config/upstash.js'
export const createSubscription = async (req, res, next) => {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        const subscriptionData = {
            ...req.body,
            user_id: req.user.id
        };

        const subscription = await SubscriptionModel.create(subscriptionData);

        await client.query('COMMIT');

        const { workflowRunId } = await workflowClient.trigger({
            url: `${SERVER_URL}/v1/workflows/subscription/reminder`,
            body:{
                subscriptionId: subscription.id,
            },
            headers:{
                'Content-Type': 'application/json',
            },
            retries: 0,
        })


        res.status(201).json({
            success: true,
            data: {subscription, workflowRunId},
        });

      
    } catch (e) {
        await client.query('ROLLBACK');
        next({
            statusCode: e.statusCode || 500,
            message: e.message || 'Error creating subscription'
        });
    } finally {
        client.release();
    }
};

export const getAllSubscriptions = async (req, res, next) => {
    try {
        const subscriptions = await SubscriptionModel.findByUserId(req.user.id);
        res.json({
            success: true,
            data: subscriptions
        });
    } catch (error) {
        next(error);
    }
};

export const getSubscriptionById = async (req, res, next) => {
    try {
        const subscription = await SubscriptionModel.findById(req.params.id);
        
        if (!subscription) {
            throw { statusCode: 404, message: 'Subscription not found' };
        }

        if (subscription.user_id !== req.user.id) {
            throw { statusCode: 403, message: 'Not authorized to access this subscription' };
        }

        res.json({
            success: true,
            data: subscription
        });
    } catch (error) {
        next(error);
    }
};

export const updateSubscription = async (req, res, next) => {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        const subscription = await SubscriptionModel.findById(req.params.id);
        
        if (!subscription) {
            throw { statusCode: 404, message: 'Subscription not found' };
        }

        if (subscription.user_id !== req.user.id) {
            throw { statusCode: 403, message: 'Not authorized to update this subscription' };
        }

        const updatedSubscription = await SubscriptionModel.update(req.params.id, req.body);

        await client.query('COMMIT');

        res.json({
            success: true,
            message: 'Subscription updated successfully',
            data: updatedSubscription
        });
    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
};

export const deleteSubscription = async (req, res, next) => {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        const subscription = await SubscriptionModel.findById(req.params.id);
        
        if (!subscription) {
            throw { statusCode: 404, message: 'Subscription not found' };
        }

        if (subscription.user_id !== req.user.id) {
            throw { statusCode: 403, message: 'Not authorized to delete this subscription' };
        }

        await SubscriptionModel.remove(req.params.id);

        await client.query('COMMIT');

        res.json({
            success: true,
            message: 'Subscription deleted successfully'
        });
    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
};

export const cancelSubscription = async (req, res, next) => {
    try {
        const subscription = await SubscriptionModel.findById(req.params.id);
        
        if (!subscription) {
            throw { statusCode: 404, message: 'Subscription not found' };
        }

        if (subscription.user_id !== req.user.id) {
            throw { statusCode: 403, message: 'Not authorized to cancel this subscription' };
        }

        const updatedSubscription = await SubscriptionModel.update(req.params.id, { status: 'cancelled' });

        res.json({
            success: true,
            message: 'Subscription cancelled successfully',
            data: updatedSubscription
        });
    } catch (error) {
        next(error);
    }
};

export const getUpcomingRenewals = async (req, res, next) => {
    try {
        const today = new Date();
        const upcomingRenewals = await SubscriptionModel.findUpcomingRenewals(today);

        res.json({
            success: true,
            data: upcomingRenewals
        });
    } catch (error) {
        next(error);
    }
}

export const getSubscriptionDetails = async (req, res, next) => {
    try {
        const subscription = await SubscriptionModel.findById(req.params.id);
        
        if (!subscription) {
            throw { statusCode: 404, message: 'Subscription not found' };
        }

        if (subscription.user_id !== req.user.id) {
            throw { statusCode: 403, message: 'Not authorized to access this subscription' };
        }

        res.json({
            success: true,
            data: subscription
        });
    } catch (error) {
        next(error);
    }
}