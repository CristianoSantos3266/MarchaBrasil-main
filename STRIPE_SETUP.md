# Stripe Payment Integration Setup

This document explains how to configure Stripe payments for the Marcha Brasil platform.

## Prerequisites

1. Create a Stripe account at https://stripe.com
2. Access your Stripe Dashboard at https://dashboard.stripe.com

## Configuration Steps

### 1. Get Stripe API Keys

1. In your Stripe dashboard, navigate to **Developers > API keys**
2. Copy your **Publishable key** (starts with `pk_test_` for test mode)
3. Copy your **Secret key** (starts with `sk_test_` for test mode)

### 2. Environment Variables

Update your `.env.local` file with your Stripe keys:

```bash
# For testing (recommended for development)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
```

For production deployment, use live keys:
```bash
# For production
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_actual_publishable_key_here
STRIPE_SECRET_KEY=sk_live_your_actual_secret_key_here
```

### 3. Test the Integration

1. Start the development server: `npm run dev`
2. Navigate to `/support`
3. Select "Cartão" payment method
4. Choose a donation tier or enter a custom amount
5. Click the Stripe payment button
6. You'll be redirected to Stripe's secure checkout page

## Features

### Supported Payment Types
- **One-time payments**: Single donations
- **Recurring payments**: Monthly subscriptions

### Supported Features
- All major credit and debit cards
- Brazilian Real (BRL) currency
- Automatic tax handling
- Secure PCI-compliant processing
- Mobile-optimized checkout

### Security
- All payments are processed securely by Stripe
- No card information is stored on our servers
- PCI DSS compliance handled by Stripe

## Testing

### Test Card Numbers (Stripe Test Mode)
- **Visa**: 4242424242424242
- **Visa (debit)**: 4000056655665556
- **Mastercard**: 5555555555554444
- **American Express**: 378282246310005
- **Declined card**: 4000000000000002

### Test Scenarios
1. **Successful payment**: Use test card numbers above
2. **Declined payment**: Use 4000000000000002
3. **Requires authentication**: Use 4000002500003155

## Webhook Configuration (Optional)

For production, you may want to set up webhooks to handle payment confirmations:

1. In Stripe Dashboard, go to **Developers > Webhooks**
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events: `payment_intent.succeeded`, `invoice.payment_succeeded`

## Currency Support

Currently configured for Brazilian Real (BRL). To support other currencies, update the API endpoint in:
`src/app/api/create-checkout-session/route.ts`

## Troubleshooting

### Common Issues

1. **"Invalid API key"**: Verify your keys in `.env.local`
2. **"Currency not supported"**: Ensure BRL is supported in your Stripe account
3. **CORS errors**: Check your domain is added to Stripe's allowed origins

### Debug Mode

Enable Stripe debug mode by setting:
```bash
STRIPE_DEBUG=true
```

## Support

For Stripe-related issues:
- Stripe Documentation: https://stripe.com/docs
- Stripe Support: https://support.stripe.com

For integration issues:
- Check the browser console for errors
- Verify environment variables are set correctly
- Ensure you're using the correct API version (2025-01-27.acacia)