# 🚀 Production Launch Guide - Marcha Brasil

## Pre-Launch Checklist (Launch in 2 days)

### ✅ **Step 1: Database Setup**
Run the following SQL in your Supabase dashboard:

1. Go to your Supabase project: https://xjkaqdsldskhlhjptrga.supabase.co
2. Navigate to **SQL Editor**
3. Execute the file: `setup-production-database.sql`
4. Verify setup by checking the `donation_stats` table

### ✅ **Step 2: Environment Configuration**
Your `.env.local` is configured with:
- ✅ **Supabase**: Connected to your database
- ✅ **Stripe**: Live keys configured
- ✅ **Demo Mode**: Disabled for production
- ⚠️ **Webhook Secret**: Update this from Stripe dashboard

### ✅ **Step 3: Stripe Webhook Setup**
1. Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
2. Create new webhook endpoint:
   - **URL**: `https://yourdomain.com/api/webhooks/stripe`
   - **Events**: Select these events:
     - `checkout.session.completed`
     - `payment_intent.succeeded` 
     - `payment_intent.payment_failed`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
3. Copy the **Webhook Secret** and update `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_actual_secret_here
   ```

### 🎯 **Step 4: Deploy to Production**
1. Deploy updated `.env.local` to your production server
2. Restart the application
3. Test donation flow

## 💰 **How Real Donations Will Work**

### **Payment Methods:**
1. **💳 Credit Card (Stripe)**
   - International support (USD, EUR, GBP, BRL)
   - One-time and monthly recurring
   - Automatic counter updates via webhooks

2. **🏦 PIX (Brazilian)**
   - Shows PIX key: `d271a5b0-4256-4c14-a3cc-0f71f3bf5bce`
   - Manual verification currently
   - Counter updates when you mark as received

3. **₿ Cryptocurrency**
   - Manual verification with provided addresses
   - Update counters manually in admin dashboard

### **Real-Time Updates:**
- ✅ **Counters update automatically** when Stripe payments complete
- ✅ **Admin dashboard** shows real transaction data
- ✅ **Statistics refresh** every 30 seconds on support page
- ✅ **Database triggers** ensure data consistency

### **Admin Management:**
Access `/admin/donations` to:
- View all real transactions
- Manually mark PIX/crypto donations as received  
- Generate financial reports
- Track monthly recurring revenue

## 🔧 **Testing Before Launch**

### **Test Stripe Integration:**
1. Use Stripe test cards in development
2. Process test donation
3. Verify webhook receives payment confirmation
4. Check database shows completed transaction
5. Confirm counter increases

### **Test PIX Flow:**
1. Create donation with PIX
2. Copy PIX key displayed
3. Admin marks as received in dashboard
4. Verify counter updates

## 🚨 **Launch Day Tasks**

### **Morning:**
1. ✅ Run database setup script
2. ✅ Deploy production environment 
3. ✅ Configure webhook endpoint
4. ✅ Test one small donation

### **Go Live:**
1. 🎯 Switch DNS/domain to production
2. 📱 Announce on social media
3. 👀 Monitor `/admin/donations` dashboard
4. 🔄 Check counters update correctly

## 📊 **Monitoring & Maintenance**

### **Key Metrics to Watch:**
- Total raised counter on `/support`
- Transaction success rate in Stripe
- Database growth in Supabase
- Webhook delivery success

### **Regular Tasks:**
- Weekly: Review admin donations dashboard
- Monthly: Reconcile Stripe with database
- Ongoing: Mark PIX/crypto donations as received

## 🎉 **Expected Results**

After launch, your donation system will:
- ✅ **Process real credit card payments** globally
- ✅ **Update counters automatically** in real-time  
- ✅ **Track monthly recurring** donations
- ✅ **Provide detailed reporting** for transparency
- ✅ **Support Brazilian PIX** payments
- ✅ **Accept cryptocurrency** donations

The system is professionally built and ready for scale! 🚀