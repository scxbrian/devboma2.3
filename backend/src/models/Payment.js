const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  reference: {
    type: String,
    unique: true,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    default: 'KES',
    uppercase: true
  },
  paymentMethod: {
    type: String,
    enum: ['mpesa', 'stripe', 'paystack', 'bank_transfer', 'cash_on_delivery'],
    required: true
  },
  paymentProvider: {
    type: String,
    enum: ['safaricom', 'stripe', 'paystack', 'bank', 'manual'],
    required: true
  },
  providerTransactionId: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  customerInfo: {
    email: String,
    phone: String,
    name: String
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  verificationData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  // M-Pesa specific fields
  mpesaCheckoutId: {
    type: String
  },
  mpesaReceiptNumber: {
    type: String
  },
  // Stripe specific fields
  stripePaymentIntentId: {
    type: String
  },
  stripeChargeId: {
    type: String
  },
  // Paystack specific fields
  paystackReference: {
    type: String
  },
  paystackAccessCode: {
    type: String
  },
  // Timestamps
  processedAt: {
    type: Date
  },
  verifiedAt: {
    type: Date
  },
  failedAt: {
    type: Date
  },
  refundedAt: {
    type: Date
  },
  // Failure information
  failureReason: {
    type: String
  },
  // Refund information
  refundAmount: {
    type: Number,
    default: 0
  },
  refundReason: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ clientId: 1 });
paymentSchema.index({ reference: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ paymentMethod: 1 });
paymentSchema.index({ providerTransactionId: 1 });
paymentSchema.index({ createdAt: -1 });

// Compound indexes
paymentSchema.index({ clientId: 1, status: 1 });
paymentSchema.index({ orderId: 1, status: 1 });

// Generate reference if not provided
paymentSchema.pre('save', function(next) {
  if (this.isNew && !this.reference) {
    this.reference = `PAY_${Date.now()}_${Math.random().toString(36).substring(7).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);