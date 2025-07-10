import { emailTemplates } from "./email-template.js";
import dayjs from "dayjs";
import transporter, { accountEmail } from "../config/nodemailer.js";


export const sendReminderEmail = async ({to,type, subscription}) => {
    if(!to || !type) throw new Error('Missing required parameters: to or type');

    const template = emailTemplates.find(t => t.label === type);

    if (!template) {
        throw new Error('Invalid email template type');
    }

    const renewalDate = subscription.end_date 
        ? dayjs(subscription.end_date).format('MMMM D, YYYY')
        : 'Unknown';

    const mailInfo = {
        userName: subscription.user?.username || 'Valued Customer', 
        subscriptionName: subscription.plan || 'Subscription',
        renewalDate: renewalDate,
        planName: subscription.plan || 'Standard Plan',
        price: `$${subscription.price || '0.00'}`,
        paymentMethod: subscription.payment_method || 'Credit Card',
        supportLink: 'https://subdub.com/support',
        accountSettingsLink: 'https://subdub.com/account'
    }

    const message = template.generateBody(mailInfo);
    const subject = template.generateSubject(mailInfo);

    const mailOptions = {
        from: accountEmail,
        to: to,
        subject: subject,
        html: message, 
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) return console.error('Error sending email:', error);

        console.log('Email sent successfully:', info.response);
    });
}