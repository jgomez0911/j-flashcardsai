/*import { loadStripe } from "@stripe/stripe-js";
let stripePromise;

const getStripe = () => {
    if (!stripePromise) {
        stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
    }
    return stripePromise;
}
export default getStripe; */

import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

const getStripe = () => {
  return new Stripe(stripeSecretKey, {
    apiVersion: '2022-09-14',
  });
};

export default getStripe;