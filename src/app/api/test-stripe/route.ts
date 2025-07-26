import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

export async function GET() {
  try {
    console.log('Testing Stripe connection...');
    
    // Check if environment variables are set
    const hasPublishableKey = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    const hasSecretKey = !!process.env.STRIPE_SECRET_KEY;
    
    console.log('Environment check:');
    console.log('- Publishable key:', hasPublishableKey ? 'Set' : 'Missing');
    console.log('- Secret key:', hasSecretKey ? 'Set' : 'Missing');
    
    if (!hasSecretKey) {
      return NextResponse.json({
        error: 'STRIPE_SECRET_KEY not configured',
        config: {
          hasPublishableKey,
          hasSecretKey
        }
      }, { status: 500 });
    }

    // Test Stripe API connection
    const account = await stripe.accounts.retrieve();
    
    return NextResponse.json({
      success: true,
      message: 'Stripe connection successful',
      accountId: account.id,
      country: account.country,
      defaultCurrency: account.default_currency,
      config: {
        hasPublishableKey,
        hasSecretKey
      }
    });
    
  } catch (error: any) {
    console.error('Stripe test failed:', error);
    return NextResponse.json({
      error: error.message,
      type: error.type,
      code: error.code
    }, { status: 500 });
  }
}