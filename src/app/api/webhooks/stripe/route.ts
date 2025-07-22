import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateDonationStatus } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

// Webhook secret for verifying requests come from Stripe
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    console.log('Received Stripe webhook event:', event.type);

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        
        try {
          await updateDonationStatus(
            session.id,
            'completed',
            session.payment_intent as string,
            new Date().toISOString()
          );
          console.log('Donation marked as completed:', session.id);
        } catch (error) {
          console.error('Failed to update donation status:', error);
        }
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment succeeded:', paymentIntent.id);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        
        // Try to update donation status to failed
        // We need to find the donation by payment_intent_id
        try {
          // Note: This requires additional logic to find donation by payment_intent_id
          console.log('Payment failed:', failedPayment.id);
        } catch (error) {
          console.error('Failed to update failed payment status:', error);
        }
        break;

      case 'invoice.payment_succeeded':
        // Handle recurring payment success (monthly donations)
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Recurring payment succeeded:', invoice.id);
        break;

      case 'customer.subscription.created':
        // Handle new subscription creation
        const subscription = event.data.object as Stripe.Subscription;
        console.log('New subscription created:', subscription.id);
        break;

      case 'customer.subscription.deleted':
        // Handle subscription cancellation
        const canceledSubscription = event.data.object as Stripe.Subscription;
        console.log('Subscription canceled:', canceledSubscription.id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Webhook error:', err);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}