import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminAuth, adminDb } from '@/config/firebaseadmin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const idToken = authHeader.split('Bearer ')[1];

        // Verify the ID token and extract the userId
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const userId = decodedToken.uid;

        const origin = request.headers.get('origin') || 'https://j-flashcardsai.vercel.app/'; // Replace with your actual Vercel URL
        const requestData = await request.json();
        const { priceId, applyTrial } = requestData || {};  // Expecting applyTrial boolean

        if (!userId) {
            console.error('User ID is missing or invalid');
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const sessionParams = {
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [
              {
                price: priceId,
                quantity: 1,
              },
            ],
            success_url: `${origin}/flashcards`,
            cancel_url: `${origin}/subscription-failed`,
            metadata: { userId: userId }, // Include the user ID in metadata
        };

        if (applyTrial) {
            sessionParams.subscription_data = {
                trial_period_days: 5,  // Apply the 5-day trial period
            };
        }

        const checkoutSession = await stripe.checkout.sessions.create(sessionParams);

        // Store that the user is subscribed in Firestore without a subscriptionId initially
        await adminDb.collection('users').doc(userId).set(
            { isSubscribed: true },
            { merge: true }
        );

        return NextResponse.json(checkoutSession);
    } catch (error) {
        console.error('Error creating Stripe session:', error);
        return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
    }
}
