import React from 'react';
import getStripe from '@/utils/get-stripe';
import { Button } from '@mui/material';
import { auth } from '@/app/firebase';

const StripeBtn = ({ priceId, applyTrial }) => {

    const handleClick = async () => {
        try {
            const stripe = await getStripe();
            if (!stripe) {
                console.error('Failed to get Stripe instance');
                return;
            }

            const user = auth.currentUser;
            if (!user) {
                console.error('User is not authenticated');
                return;
            }

            const idToken = await user.getIdToken();
            if (!idToken) {
                console.error('Failed to get ID token');
                return;
            }

            const response = await fetch('/api/checkout_sessions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`,
                },
                body: JSON.stringify({ priceId, applyTrial }), // Pass priceId and applyTrial
            });

            if (!response.ok) {
                console.error('Error creating Stripe session:', response.statusText);
                return;
            }

            try {
                const session = await response.json();
                if (!session || !session.id) {
                    console.error('Invalid session response');
                    return;
                }
                await stripe.redirectToCheckout({ sessionId: session.id });
            } catch (err) {
                console.error('Failed to parse response JSON:', err);
            }
        } catch (err) {
            console.error('Error handling click:', err);
        }
    };

    return (
        <Button onClick={handleClick} style={{ width: '100%' }}>
            Subscribe Now
        </Button>
    );
};

export default StripeBtn;