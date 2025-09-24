const crypto = require('crypto');

/**
 * Generate a secure random string
 */
function generateSecureId(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate a subdomain from a shop name
 */
function generateSubdomain(shopName) {
  return shopName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 30);
}

/**
 * Calculate transaction fee based on tier and amount
 */
function calculateTransactionFee(amount, tier, customFee = null) {
  if (customFee !== null) {
    return (amount * customFee) / 100;
  }

  const defaultFees = {
    'basic': 3.0,
    'standard': 2.0,
    'premium': 1.0
  };

  const feePercentage = defaultFees[tier] || 2.0;
  return (amount * feePercentage) / 100;
}

/**
 * Format currency for Kenyan Shilling
 */
function formatKES(amount) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES'
  }).format(amount);
}

/**
 * Generate order number
 */
function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `ORD-${timestamp}${random}`;
}

/**
 * Validate Kenyan phone number
 */
function isValidKenyanPhone(phone) {
  const kenyanPhoneRegex = /^\+254[17]\d{8}$/;
  return kenyanPhoneRegex.test(phone);
}

/**
 * Calculate taxes (VAT for Kenya)
 */
function calculateVAT(amount, rate = 0.16) {
  return amount * rate;
}

/**
 * Generate shop configuration based on selections
 */
function generateShopConfig(design, features, hostingTier) {
  return {
    theme: design,
    features: features,
    hosting: {
      tier: hostingTier,
      storage: hostingTier === 'basic' ? '1GB' : hostingTier === 'standard' ? '5GB' : '20GB',
      bandwidth: hostingTier === 'basic' ? '10GB' : hostingTier === 'standard' ? '50GB' : 'unlimited'
    },
    integrations: {
      analytics: features.includes('advanced-analytics'),
      socialMedia: features.includes('social-integration'),
      emailMarketing: features.includes('email-marketing')
    }
  };
}

/**
 * Sanitize user input
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/[<>]/g, ''); // Remove angle brackets
}

/**
 * Log activity for admin monitoring
 */
async function logActivity(pool, userId, clientId, action, resourceType = null, resourceId = null, metadata = {}) {
  try {
    await pool.query(
      `INSERT INTO activity_logs (user_id, client_id, action, resource_type, resource_id, metadata, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [userId, clientId, action, resourceType, resourceId, JSON.stringify(metadata)]
    );
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}

/**
 * Calculate shipping cost based on location and weight
 */
function calculateShipping(location, weight = 1) {
  const baseCost = 500; // Base shipping cost in KES
  const locationMultipliers = {
    'nairobi': 1.0,
    'mombasa': 1.5,
    'kisumu': 1.3,
    'nakuru': 1.2,
    'other': 2.0
  };

  const locationKey = location.toLowerCase();
  const multiplier = locationMultipliers[locationKey] || locationMultipliers['other'];
  
  return Math.round(baseCost * multiplier * Math.max(1, weight));
}

module.exports = {
  generateSecureId,
  generateSubdomain,
  calculateTransactionFee,
  formatKES,
  generateOrderNumber,
  isValidKenyanPhone,
  calculateVAT,
  generateShopConfig,
  sanitizeInput,
  logActivity,
  calculateShipping
};