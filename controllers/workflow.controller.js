import {createRequire} from 'module';
const require = createRequire(import.meta.url);
const {serve} = require('@upstash/workflow/express');
import dayjs from 'dayjs';
import * as SubscriptionModel from '../models/subscription.model.js';
import * as UserModel from '../models/user.model.js';
import {sendReminderEmail} from '../utils/send-email.js';
const REMINDERS = [7,5,2,1];

export const sendReminders = serve(async (context) => {
    const { subscriptionId } = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);


    if(!subscription || subscription.status !== 'active') return

    const renewalDate = dayjs(subscription.renewalDate);

    if(renewalDate.isBefore(dayjs())) {
        console.log(`Renewal date has passed subscription ${subscription.id}. Stoppin workflow.`);
        return;
    }


    for(const daysBefore of REMINDERS) {
        const reminderDate = renewalDate.subtract(daysBefore, 'day');

        if(reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(context, `Reminder${daysBefore} days before`, reminderDate);
        }

        if(dayjs().isSame(reminderDate, 'day')){
            await triggerReminders(context, `${daysBefore} days before reminder`, subscription);
        }
    }
})

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', async () => {
        
        const subscription = await SubscriptionModel.findById(subscriptionId);
        
        if (!subscription) return null;
        

        const user = await UserModel.findById(subscription.user_id);
       
        return {
            ...subscription,
            user: user || {}
        };
    });
}

const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleeping until ${label} reminder at ${date}`);

    await context.sleepUntil(label, date.toDate());
}

const triggerReminders = async (context, label, subscription) => {
    return await context.run(label, async() => {
        console.log(`Triggering ${label} reminders`);
        
        if (!subscription.user || !subscription.user.email) {
            console.log(`Cannot send ${label} email: Missing user email for subscription ${subscription.id}`);
            return;
        }

        await sendReminderEmail({
            to: subscription.user.email,
            type: label,
            subscription,
        })
    })
}