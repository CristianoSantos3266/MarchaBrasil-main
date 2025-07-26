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
      // Verify webhook signature (skip if no webhook secret configured)
      if (webhookSecret) {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } else {
        console.warn('STRIPE_WEBHOOK_SECRET not configured - skipping signature verification');
        event = JSON.parse(body);
      }
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
          // Get additional session details for international transactions
          const sessionDetails = await stripe.checkout.sessions.retrieve(session.id, {
            expand: ['payment_intent', 'subscription', 'customer']
          });
          
          await updateDonationStatus(
            session.id,
            'completed',
            session.payment_intent as string,
            new Date().toISOString(),
            {
              currency: sessionDetails.currency?.toUpperCase(),
              amount_total: sessionDetails.amount_total,
              customer_details: sessionDetails.customer_details,
              payment_method_types: sessionDetails.payment_method_types,
              locale: sessionDetails.locale
            }
          );
          console.log('International donation completed:', {
            sessionId: session.id,
            currency: sessionDetails.currency,
            amount: sessionDetails.amount_total,
            country: sessionDetails.customer_details?.address?.country
          });
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
        
        try {
          console.log('International payment failed:', {
            paymentIntentId: failedPayment.id,
            currency: failedPayment.currency?.toUpperCase(),
            amount: failedPayment.amount,
            failureReason: failedPayment.last_payment_error?.message,
            failureCode: failedPayment.last_payment_error?.code,
            country: failedPayment.shipping?.address?.country
          });
          
          // Try to update donation status if we can find it
          // This would require additional database queries
          // await updateDonationStatusByPaymentIntent(failedPayment.id, 'failed');
        } catch (error) {
          console.error('Failed to process payment failure:', error);
        }
        break;

      case 'invoice.payment_succeeded':
        // Handle recurring payment success (monthly donations)
        const invoice = event.data.object as Stripe.Invoice;
        
        try {
          // Record recurring payment success
          console.log('International recurring payment succeeded:', {
            invoiceId: invoice.id,
            subscriptionId: invoice.subscription,
            currency: invoice.currency?.toUpperCase(),
            amount: invoice.amount_paid,
            customerEmail: invoice.customer_email
          });
          
          // You can add logic here to track recurring donations
          // await recordRecurringPayment(invoice);
        } catch (error) {
          console.error('Failed to process recurring payment:', error);
        }
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