const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+254\d{9}$/, 'Please enter a valid Kenyan phone number (+254XXXXXXXXX)']
  },
  company: {
    type: String,
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  serviceTier: {
    type: String,
    enum: ['lite', 'core', 'prime', 'titan', 'shop'],
    default: 'lite',
    required: true
  },
  contractValue: {
    type: Number,
    default: 0,
    min: [0, 'Contract value cannot be negative']
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'cancelled'],
    default: 'active'
  },
  billingAddress: {
    street: String,
    city: String,
    state: String,
    country: { type: String, default: 'Kenya' },
    postalCode: String
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  // Statistics
  totalRevenue: {
    type: Number,
    default: 0
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  lastOrderDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
clientSchema.index({ email: 1 });
clientSchema.index({ serviceTier: 1 });
clientSchema.index({ status: 1 });
clientSchema.index({ createdAt: -1 });

// Virtual for shops
clientSchema.virtual('shops', {
  ref: 'Shop',
  localField: '_id',
  foreignField: 'clientId'
});

// Virtual for users
clientSchema.virtual('users', {
  ref: 'User',
  localField: '_id',
  foreignField: 'clientId'
});

module.exports = mongoose.model('Client', clientSchema);