import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = 'brl', isMonthly = false, donationTier } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Convert amount to cents (Stripe expects amounts in smallest currency unit)
    const stripeAmount = Math.round(amount * 100);

    const params: Stripe.Checkout.SessionCreateParams = {
      mode: isMonthly ? 'subscription' : 'payment',
      payment_method_types: ['card'],
      success_url: `${req.nextUrl.origin}/support?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/support?canceled=true`,
      metadata: {
        donationTier: donationTier || 'custom',
        isMonthly: isMonthly.toString(),
      },
    };

    if (isMonthly) {
      // Create a subscription for monthly donations
      params.line_items = [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: `Apoio Mensal - ${donationTier || 'Doação Personalizada'}`,
              description: 'Apoio mensal à infraestrutura cívica da Marcha Brasil',
            },
            unit_amount: stripeAmount,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ];
    } else {
      // Create a one-time payment
      params.line_items = [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: `Doação Única - ${donationTier || 'Doação Personalizada'}`,
              description: 'Doação única para apoiar a infraestrutura cívica da Marcha Brasil',
            },
            unit_amount: stripeAmount,
          },
          quantity: 1,
        },
      ];
    }

    const checkoutSession = await stripe.checkout.sessions.create(params);

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err: any) {
    console.error('Stripe checkout session creation failed:', err);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}