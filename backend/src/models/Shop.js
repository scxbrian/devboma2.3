const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Shop name is required'],
    trim: true,
    maxlength: [100, 'Shop name cannot exceed 100 characters']
  },
  domain: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },
  subdomain: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Subdomain can only contain lowercase letters, numbers, and hyphens']
  },
  designTheme: {
    type: String,
    enum: ['modern', 'luxury', 'minimal', 'vibrant', 'heavy', 'titan'],
    default: 'modern'
  },
  features: [{
    type: String,
    enum: [
      'basic-analytics',
      'advanced-analytics',
      'inventory-management',
      'multi-payment',
      'custom-domain',
      'email-marketing',
      'social-integration'
    ]
  }],
  hostingTier: {
    type: String,
    enum: ['basic', 'standard', 'premium'],
    default: 'standard'
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'yearly'],
    default: 'yearly'
  },
  transactionFee: {
    type: Number,
    default: 2.0,
    min: [0, 'Transaction fee cannot be negative'],
    max: [10, 'Transaction fee cannot exceed 10%']
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'development', 'archived'],
    default: 'development'
  },
  settings: {
    currency: { type: String, default: 'KES' },
    timezone: { type: String, default: 'Africa/Nairobi' },
    language: { type: String, default: 'en' },
    taxRate: { type: Number, default: 0.16 }, // 16% VAT for Kenya
    shippingRates: [{
      name: String,
      rate: Number,
      conditions: mongoose.Schema.Types.Mixed
    }]
  },
  branding: {
    logo: String,
    primaryColor: { type: String, default: '#1E40AF' },
    secondaryColor: { type: String, default: '#F59E0B' },
    favicon: String
  },
  seoSettings: {
    title: String,
    description: String,
    keywords: [String],
    ogImage: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  launchedAt: {
    type: Date,
    default: null
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
  totalProducts: {
    type: Number,
    default: 0
  },
  totalCustomers: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
shopSchema.index({ clientId: 1 });
shopSchema.index({ domain: 1 });
shopSchema.index({ subdomain: 1 });
shopSchema.index({ status: 1 });
shopSchema.index({ createdAt: -1 });

// Virtual for products
shopSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'shopId'
});

// Virtual for orders
shopSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'shopId'
});

// Generate subdomain from name
shopSchema.pre('save', function(next) {
  if (this.isNew && !this.subdomain) {
    this.subdomain = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 30);
  }
  next();
});

module.exports = mongoose.model('Shop', shopSchema);