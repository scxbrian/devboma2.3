const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
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
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  description: {
    type: String,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [500, 'Short description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  comparePrice: {
    type: Number,
    min: [0, 'Compare price cannot be negative']
  },
  cost: {
    type: Number,
    min: [0, 'Cost cannot be negative']
  },
  sku: {
    type: String,
    trim: true,
    uppercase: true,
    maxlength: [100, 'SKU cannot exceed 100 characters']
  },
  barcode: {
    type: String,
    trim: true
  },
  inventory: {
    quantity: {
      type: Number,
      default: 0,
      min: [0, 'Inventory quantity cannot be negative']
    },
    trackInventory: {
      type: Boolean,
      default: true
    },
    allowBackorders: {
      type: Boolean,
      default: false
    },
    lowStockThreshold: {
      type: Number,
      default: 5
    }
  },
  shipping: {
    weight: {
      type: Number,
      min: [0, 'Weight cannot be negative']
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: { type: String, default: 'cm' }
    },
    requiresShipping: {
      type: Boolean,
      default: true
    }
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  variants: [{
    name: String,
    options: [String],
    price: Number,
    sku: String,
    inventory: Number
  }],
  tags: [String],
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  // Statistics
  totalSold: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
productSchema.index({ clientId: 1 });
productSchema.index({ shopId: 1 });
productSchema.index({ categoryId: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ status: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ createdAt: -1 });

// Compound indexes
productSchema.index({ clientId: 1, sku: 1 }, { unique: true, sparse: true });
productSchema.index({ shopId: 1, status: 1 });

// Virtual for profit margin
productSchema.virtual('profitMargin').get(function() {
  if (this.cost && this.price) {
    return ((this.price - this.cost) / this.price * 100).toFixed(2);
  }
  return 0;
});

module.exports = mongoose.model('Product', productSchema);