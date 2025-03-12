import { env } from "@/env";
import Stripe from "stripe";
const stripeSecretKey = env.STRIPE_SECRET_KEY;
export const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2025-02-24.acacia",
    appInfo: {
        name: 'Pizza Shop',
    }
});
