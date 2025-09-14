
import Stripe from 'stripe';

export const dynamic = 'force-dynamic'; // ensure it runs on the server each request

// Create the Stripe client with your LIVE secret key
const secret = process.env.STRIPE_SECRET_KEY;
if (!secret) {
  console.warn('STRIPE_SECRET_KEY is missing. Payments will not work.');
}
const stripe = secret ? new Stripe(secret, { apiVersion: '2024-06-20' }) : null;

export async function POST(req: Request) {
  try {
    if (!stripe) {
      return new Response(JSON.stringify({ error: 'Stripe not configured' }), { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const amount = Number(body?.amount);
    const currency = (body?.currency || 'BRL').toLowerCase();

    if (!amount || Number.isNaN(amount) || amount < 5) {
      return new Response(JSON.stringify({ error: 'Invalid amount' }), { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'], // add 'pix' here if Pix is enabled on your Stripe account
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: Math.round(amount * 100),
            product_data: {
              name: 'Doação para Marcha Brasil',
            },
          },
        },
      ],
      success_url: process.env.STRIPE_SUCCESS_URL || 'http://localhost:3000/apoie/contribuir?success=true',
      cancel_url: process.env.STRIPE_CANCEL_URL || 'http://localhost:3000/apoie/contribuir?canceled=true',
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error('Stripe create session error:', err);
    return new Response(JSON.stringify({ error: 'Stripe error' }), { status: 500 });
  }
}

