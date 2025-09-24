const Joi = require('joi');

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { 
      abortEarly: false,
      stripUnknown: true 
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }
    
    req.body = value;
    next();
  };
};

// Common validation schemas
const schemas = {
  // User schemas
  userRegister: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(2).max(100).required(),
    role: Joi.string().valid('admin', 'client').default('client'),
    clientId: Joi.string().optional()
  }),

  userLogin: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  // Client schemas
  clientCreate: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\+254\d{9}$/).optional(),
    company: Joi.string().max(100).optional(),
    serviceTier: Joi.string().valid('lite', 'core', 'prime', 'titan', 'shop').required(),
    contractValue: Joi.number().min(0).optional(),
    notes: Joi.string().max(1000).optional()
  }),

  // Shop schemas
  shopCreate: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    domain: Joi.string().domain().optional(),
    designTheme: Joi.string().valid('modern', 'luxury', 'minimal', 'vibrant', 'heavy', 'titan').required(),
    features: Joi.array().items(Joi.string()).default([]),
    hostingTier: Joi.string().valid('basic', 'standard', 'premium').default('standard'),
    transactionFee: Joi.number().min(0).max(10).default(2.0)
  }),

  // Product schemas
  productCreate: Joi.object({
    name: Joi.string().min(1).max(200).required(),
    description: Joi.string().max(2000).optional(),
    price: Joi.number().min(0).required(),
    comparePrice: Joi.number().min(0).optional(),
    cost: Joi.number().min(0).optional(),
    sku: Joi.string().max(100).optional(),
    inventory: Joi.object({
      quantity: Joi.number().integer().min(0).default(0),
      trackInventory: Joi.boolean().default(true),
      allowBackorders: Joi.boolean().default(false)
    }).optional(),
    categoryId: Joi.string().optional(),
    images: Joi.array().items(Joi.object({
      url: Joi.string().uri().required(),
      alt: Joi.string().optional(),
      isPrimary: Joi.boolean().default(false)
    })).default([]),
    tags: Joi.array().items(Joi.string()).default([])
  }),

  // Order schemas
  orderCreate: Joi.object({
    customerId: Joi.string().required(),
    items: Joi.array().items(Joi.object({
      productId: Joi.string().required(),
      quantity: Joi.number().integer().min(1).required(),
      price: Joi.number().min(0).optional()
    })).min(1).required(),
    addresses: Joi.object({
      shipping: Joi.object().optional(),
      billing: Joi.object().optional()
    }).optional(),
    paymentMethod: Joi.string().valid('mpesa', 'stripe', 'paystack', 'bank_transfer', 'cash_on_delivery').required(),
    notes: Joi.object({
      customer: Joi.string().max(500).optional(),
      internal: Joi.string().max(500).optional()
    }).optional()
  })
};

module.exports = { validate, schemas };