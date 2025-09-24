const Joi = require('joi');

// User validation schemas
const userSchemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(2).max(100).required(),
    role: Joi.string().valid('admin', 'client').default('client'),
    clientId: Joi.string().uuid().optional()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};

// Client validation schemas
const clientSchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\+254\d{9}$/).optional(),
    company: Joi.string().max(100).optional(),
    serviceTier: Joi.string().valid('lite', 'core', 'prime', 'titan', 'shop').required(),
    contractValue: Joi.number().min(0).optional(),
    notes: Joi.string().max(1000).optional()
  })
};

// Shop validation schemas
const shopSchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    domain: Joi.string().domain().optional(),
    design: Joi.string().valid('modern', 'luxury', 'minimal', 'vibrant').required(),
    features: Joi.array().items(Joi.string()).default([]),
    hostingTier: Joi.string().valid('basic', 'standard', 'premium').default('standard'),
    transactionFee: Joi.number().min(0).max(10).default(2.0)
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    domain: Joi.string().domain().optional(),
    design: Joi.string().valid('modern', 'luxury', 'minimal', 'vibrant').optional(),
    features: Joi.array().items(Joi.string()).optional(),
    hostingTier: Joi.string().valid('basic', 'standard', 'premium').optional(),
    status: Joi.string().valid('active', 'suspended', 'development').optional()
  })
};

// Product validation schemas
const productSchemas = {
  create: Joi.object({
    shopId: Joi.string().uuid().optional(),
    name: Joi.string().min(1).max(200).required(),
    description: Joi.string().max(2000).optional(),
    price: Joi.number().min(0).required(),
    comparePrice: Joi.number().min(0).optional(),
    cost: Joi.number().min(0).optional(),
    sku: Joi.string().max(100).optional(),
    inventory: Joi.number().integer().min(0).required(),
    images: Joi.array().items(Joi.string().uri()).default([]),
    category: Joi.string().max(100).optional(),
    tags: Joi.array().items(Joi.string()).default([]),
    variants: Joi.array().default([])
  }),

  update: Joi.object({
    name: Joi.string().min(1).max(200).optional(),
    description: Joi.string().max(2000).optional(),
    price: Joi.number().min(0).optional(),
    comparePrice: Joi.number().min(0).optional(),
    cost: Joi.number().min(0).optional(),
    sku: Joi.string().max(100).optional(),
    inventory: Joi.number().integer().min(0).optional(),
    images: Joi.array().items(Joi.string().uri()).optional(),
    category: Joi.string().max(100).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    variants: Joi.array().optional(),
    status: Joi.string().valid('active', 'inactive', 'archived').optional()
  })
};

// Order validation schemas
const orderSchemas = {
  create: Joi.object({
    customerId: Joi.string().uuid().required(),
    shopId: Joi.string().uuid().optional(),
    items: Joi.array().items(Joi.object({
      productId: Joi.string().uuid().required(),
      quantity: Joi.number().integer().min(1).required(),
      price: Joi.number().min(0).optional()
    })).min(1).required(),
    shippingAddress: Joi.object().optional(),
    billingAddress: Joi.object().optional(),
    paymentMethod: Joi.string().required(),
    notes: Joi.string().max(500).optional()
  }),

  updateStatus: Joi.object({
    status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded').required(),
    trackingNumber: Joi.string().optional()
  })
};

// Validation middleware factory
function validateSchema(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    
    req.body = value;
    next();
  };
}

module.exports = {
  userSchemas,
  clientSchemas,
  shopSchemas,
  productSchemas,
  orderSchemas,
  validateSchema
};