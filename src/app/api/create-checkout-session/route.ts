import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createDonation } from '@/lib/supabase';
import { getPaymentMethods, SUPPORTED_CURRENCIES } from '@/lib/stripe';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(req: NextRequest) {
  try {
    console.log('Stripe API route called');
    const body = await req.json();
    console.log('Request body:', body);
    
    const { amount, currency = 'brl', isMonthly = false, donationTier, country } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Check if Stripe is properly configured
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_your_secret_key_here') {
      console.error('STRIPE_SECRET_KEY not configured');
      return NextResponse.json({ error: 'Payment system not configured' }, { status: 500 });
    }

    // Validate currency
    const upperCurrency = currency.toUpperCase();
    if (!SUPPORTED_CURRENCIES[upperCurrency as keyof typeof SUPPORTED_CURRENCIES]) {
      return NextResponse.json({ error: 'Unsupported currency' }, { status: 400 });
    }

    // Convert amount to Stripe format (handles zero-decimal currencies)
    const currencyConfig = SUPPORTED_CURRENCIES[upperCurrency as keyof typeof SUPPORTED_CURRENCIES];
    const stripeAmount = currencyConfig.zeroDecimal ? Math.round(amount) : Math.round(amount * 100);

    // Get appropriate payment methods for the currency/country
    const paymentMethods = getPaymentMethods(upperCurrency);
    
    const params: Stripe.Checkout.SessionCreateParams = {
      mode: isMonthly ? 'subscription' : 'payment',
      payment_method_types: paymentMethods,
      success_url: `${req.nextUrl.origin}/apoie/contribuir?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/apoie/contribuir?canceled=true`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      shipping_address_collection: country ? {
        allowed_countries: [country.toUpperCase()]
      } : undefined,
      metadata: {
        donationTier: donationTier || 'custom',
        isMonthly: isMonthly.toString(),
        currency: upperCurrency,
        country: country || 'unknown'
      },
    };

    if (isMonthly) {
      // Create a subscription for monthly donations
      params.line_items = [
        {
          price_data: {
            currency: upperCurrency.toLowerCase(),
            product_data: {
              name: `Monthly Support - ${donationTier || 'Custom Donation'}`,
              description: 'Monthly support for Marcha Brasil civic infrastructure',
              images: [`${req.nextUrl.origin}/logo-stripe.png`],
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
            currency: upperCurrency.toLowerCase(),
            product_data: {
              name: `One-time Donation - ${donationTier || 'Custom Amount'}`,
              description: 'One-time donation to support Marcha Brasil civic infrastructure',
              images: [`${req.nextUrl.origin}/logo-stripe.png`],
            },
            unit_amount: stripeAmount,
          },
          quantity: 1,
        },
      ];
    }

    console.log('Creating Stripe session with params:', JSON.stringify(params, null, 2));
    const checkoutSession = await stripe.checkout.sessions.create(params);
    console.log('Stripe session created:', checkoutSession.id);

    // Record the donation in database
    if (checkoutSession.id) {
      try {
        await createDonation({
          stripe_session_id: checkoutSession.id,
          amount: amount,
          payment_method: 'stripe',
          is_monthly: isMonthly,
          donation_tier: donationTier || 'custom',
          tier_name: donationTier || 'Custom Amount',
          metadata: {
            stripe_session_id: checkoutSession.id,
            amount: amount,
            currency: upperCurrency,
            is_monthly: isMonthly,
            country: country || 'unknown',
            payment_methods: paymentMethods
          }
        });
      } catch (dbError) {
        console.error('Failed to record donation in database:', dbError);
        // Don't fail the checkout if database recording fails
      }
    }

    return NextResponse.json({ 
      id: checkoutSession.id,
      url: checkoutSession.url 
    });
  } catch (err: any) {
    console.error('Stripe checkout session creation failed:', err);
    console.error('Error details:', err.message, err.stack);
    return NextResponse.json(
      { error: err.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}