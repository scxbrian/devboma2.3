const express = require('express');
const { Pool } = require('pg');
const crypto = require('crypto');

const router = express.Router();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize Paystack payment
router.post('/paystack/initialize', async (req, res) => {
  try {
    const { email, amount, currency = 'KES', metadata = {} } = req.body;

    if (!email || !amount) {
      return res.status(400).json({ error: 'Email and amount are required' });
    }

    // In production, make actual Paystack API call
    const paystackData = {
      email,
      amount: amount * 100, // Paystack uses kobo/cents
      currency,
      metadata,
      callback_url: `${process.env.FRONTEND_URL}/payment/callback`,
      reference: `devboma_${Date.now()}_${Math.random().toString(36).substring(7)}`
    };

    // Simulate Paystack response for demo
    const response = {
      status: true,
      message: 'Authorization URL created',
      data: {
        authorization_url: `https://checkout.paystack.com/demo?reference=${paystackData.reference}`,
        access_code: 'demo_access_code',
        reference: paystackData.reference
      }
    };

    // Store payment record
    await pool.query(
      `INSERT INTO payments (reference, email, amount, currency, status, provider, metadata, created_at)
       VALUES ($1, $2, $3, $4, 'pending', 'paystack', $5, NOW())`,
      [paystackData.reference, email, amount, currency, JSON.stringify(metadata)]
    );

    res.json({ success: true, data: response.data });

  } catch (error) {
    console.error('Paystack initialization error:', error);
    res.status(500).json({ error: 'Payment initialization failed' });
  }
});

// Verify Paystack payment
router.post('/paystack/verify', async (req, res) => {
  try {
    const { reference } = req.body;

    if (!reference) {
      return res.status(400).json({ error: 'Payment reference is required' });
    }

    // In production, verify with Paystack API
    // For demo, simulate successful verification
    const verificationResponse = {
      status: true,
      message: 'Verification successful',
      data: {
        reference,
        amount: 25000 * 100, // Demo amount
        status: 'success',
        paid_at: new Date().toISOString(),
        customer: {
          email: 'demo@example.com'
        }
      }
    };

    // Update payment record
    await pool.query(
      `UPDATE payments 
       SET status = 'completed', verified_at = NOW(), verification_data = $1
       WHERE reference = $2`,
      [JSON.stringify(verificationResponse.data), reference]
    );

    res.json({ success: true, data: verificationResponse.data });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// Paystack webhook
router.post('/paystack/webhook', (req, res) => {
  try {
    const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY || 'demo-secret')
                      .update(JSON.stringify(req.body))
                      .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = req.body;
    
    if (event.event === 'charge.success') {
      // Handle successful payment
      console.log('Payment successful:', event.data.reference);
      
      // Update database, send notifications, etc.
    }

    res.status(200).json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Stripe payment intent
router.post('/stripe/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', metadata = {} } = req.body;

    // In production, create actual Stripe PaymentIntent
    const paymentIntent = {
      id: `pi_demo_${Date.now()}`,
      client_secret: `pi_demo_${Date.now()}_secret_demo`,
      amount: amount * 100,
      currency,
      status: 'requires_payment_method'
    };

    res.json({ success: true, data: paymentIntent });

  } catch (error) {
    console.error('Stripe payment intent error:', error);
    res.status(500).json({ error: 'Payment intent creation failed' });
  }
});

// M-Pesa STK Push (for Kenyan market)
router.post('/mpesa/stk-push', async (req, res) => {
  try {
    const { phone, amount, reference } = req.body;

    if (!phone || !amount) {
      return res.status(400).json({ error: 'Phone and amount are required' });
    }

    // In production, integrate with Safaricom M-Pesa API
    const stkResponse = {
      MerchantRequestID: `demo_${Date.now()}`,
      CheckoutRequestID: `ws_CO_${Date.now()}`,
      ResponseCode: '0',
      ResponseDescription: 'Success. Request accepted for processing',
      CustomerMessage: 'Success. Request accepted for processing'
    };

    // Store M-Pesa transaction
    await pool.query(
      `INSERT INTO payments (reference, phone, amount, currency, status, provider, mpesa_checkout_id, created_at)
       VALUES ($1, $2, $3, 'KES', 'pending', 'mpesa', $4, NOW())`,
      [reference, phone, amount, stkResponse.CheckoutRequestID]
    );

    res.json({ success: true, data: stkResponse });

  } catch (error) {
    console.error('M-Pesa STK Push error:', error);
    res.status(500).json({ error: 'M-Pesa payment failed' });
  }
});

module.exports = router;