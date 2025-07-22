# Database Integration Setup Guide

This guide explains how to complete the donation database integration for the Marcha Brasil platform.

## ✅ What's Already Done

- ✅ Database schema created (`supabase-donations-schema.sql`)
- ✅ Supabase helper functions added
- ✅ API endpoints for donation tracking
- ✅ Stripe webhook handler for payment completion
- ✅ DonationStats component updated to fetch real data

## 🚀 Setup Steps Required

### 1. Create Database Tables

Run the SQL schema in your Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase-donations-schema.sql`
4. Click **Run** to create the tables

### 2. Configure Stripe Webhooks

1. Go to your Stripe Dashboard → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Set endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to send:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `invoice.payment_succeeded`
   - `customer.subscription.created`
   - `customer.subscription.deleted`
5. Copy the **Signing secret**
6. Add to your `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```

### 3. Test the Integration

1. Make a test donation via the `/support` page
2. Complete the Stripe checkout
3. Check your Supabase `donations` table for the new record
4. Verify the `donation_stats` table has updated totals
5. Refresh the support page to see updated numbers

## 📊 How It Works

### Payment Flow:
1. User selects donation tier and clicks "Pagar com Stripe"
2. Stripe checkout session is created
3. Donation record is inserted with `pending` status
4. User completes payment on Stripe
5. Stripe webhook fires `checkout.session.completed`
6. Donation status is updated to `completed`
7. Database trigger automatically updates `donation_stats`
8. Frontend fetches new stats every 30 seconds

### Database Structure:

**donations table:**
- Records individual donation attempts
- Tracks Stripe session/payment IDs
- Stores amount, currency, payment method
- Handles both one-time and recurring payments

**donation_stats table:**
- Aggregated statistics (total raised, donor count)
- Updated automatically via database triggers
- Single source of truth for display numbers

## 🔧 Environment Variables Needed

```bash
# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe (already configured)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
STRIPE_SECRET_KEY=sk_live_your_key

# NEW: Stripe Webhooks
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_signing_secret
```

## 🎯 Expected Behavior After Setup

- ✅ Real donations will increment the displayed totals
- ✅ Stats update automatically within 30 seconds
- ✅ Both one-time and monthly donations are tracked
- ✅ Failed payments don't affect totals
- ✅ Refunds can be handled via Stripe dashboard

## 🔍 Testing Checklist

- [ ] Database tables created successfully
- [ ] Stripe webhook endpoint configured
- [ ] Test donation completes successfully
- [ ] Donation appears in `donations` table
- [ ] Stats update in `donation_stats` table
- [ ] Frontend displays updated numbers
- [ ] Monthly subscriptions work correctly

## 🚨 Troubleshooting

**If stats don't update:**
1. Check Supabase logs for database errors
2. Verify webhook is receiving events
3. Check browser console for fetch errors

**If donations aren't recorded:**
1. Verify Supabase connection
2. Check API endpoint logs
3. Ensure database permissions are correct

Once this setup is complete, your donation system will be fully functional with real-time stats updates!