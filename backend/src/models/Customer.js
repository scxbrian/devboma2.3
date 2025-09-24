const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+254\d{9}$/, 'Please enter a valid Kenyan phone number (+254XXXXXXXXX)']
  },
  dateOfBirth: {
    type: Date
  },
  addresses: [{
    type: {
      type: String,
      enum: ['billing', 'shipping', 'both'],
      default: 'both'
    },
    firstName: String,
    lastName: String,
    company: String,
    address1: { type: String, required: true },
    address2: String,
    city: { type: String, required: true },
    state: String,
    country: { type: String, default: 'Kenya' },
    postalCode: String,
    phone: String,
    isDefault: { type: Boolean, default: false }
  }],
  marketingConsent: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  tags: [String],
  // Statistics
  totalSpent: {
    type: Number,
    default: 0
  },
  ordersCount: {
    type: Number,
    default: 0
  },
  averageOrderValue: {
    type: Number,
    default: 0
  },
  lastOrderAt: {
    type: Date,
    default: null
  },
  firstOrderAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
customerSchema.index({ clientId: 1 });
customerSchema.index({ shopId: 1 });
customerSchema.index({ email: 1 });
customerSchema.index({ phone: 1 });
customerSchema.index({ createdAt: -1 });

// Compound indexes
customerSchema.index({ clientId: 1, email: 1 }, { unique: true });
customerSchema.index({ shopId: 1, email: 1 });

// Virtual for orders
customerSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'customerId'
});

// Calculate customer lifetime value
customerSchema.virtual('lifetimeValue').get(function() {
  return this.totalSpent;
});

module.exports = mongoose.model('Customer', customerSchema);