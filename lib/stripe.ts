import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_API_KEY!, {         // put the exclamation point (!) at the end to avoind the error
    apiVersion: '2023-10-16', // Use the latest API version
    typescript: true
})