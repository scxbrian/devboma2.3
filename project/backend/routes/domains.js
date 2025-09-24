const express = require('express');
const { Pool } = require('pg');
const dns = require('dns').promises;

const router = express.Router();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Domain pricing
const domainPrices = {
  '.com': 1500,
  '.co.ke': 2000,
  '.ke': 3000,
  '.org': 1800,
  '.net': 1600,
  '.biz': 2200,
  '.info': 1400,
  '.shop': 3500,
  '.store': 4000,
  '.online': 3200,
  '.site': 2800,
  '.tech': 4500
};

// Check domain availability
router.post('/check-availability', async (req, res) => {
  try {
    const { domain } = req.body;

    if (!domain) {
      return res.status(400).json({ error: 'Domain is required' });
    }

    const extension = '.' + domain.split('.').pop();
    const basePrice = domainPrices[extension] || 2000;

    // In production, integrate with domain registrar API
    // For demo, simulate availability check
    let available = true;
    
    try {
      // Check if domain resolves (basic availability check)
      await dns.lookup(domain);
      available = false; // If it resolves, it's likely taken
    } catch (error) {
      // If lookup fails, domain might be available
      available = Math.random() > 0.3; // 70% chance available for demo
    }

    // Store domain check
    await pool.query(
      `INSERT INTO domain_checks (domain, available, price, checked_at, client_id)
       VALUES ($1, $2, $3, NOW(), $4)`,
      [domain, available, basePrice, req.user.clientId]
    );

    res.json({
      success: true,
      data: {
        domain,
        available,
        price: basePrice,
        currency: 'KES',
        extension
      }
    });

  } catch (error) {
    console.error('Domain availability check error:', error);
    res.status(500).json({ error: 'Domain check failed' });
  }
});

// Register domain
router.post('/register', async (req, res) => {
  try {
    const { domain, customerInfo, paymentReference } = req.body;

    if (!domain || !customerInfo) {
      return res.status(400).json({ error: 'Domain and customer info are required' });
    }

    const extension = '.' + domain.split('.').pop();
    const price = domainPrices[extension] || 2000;

    // In production, integrate with domain registrar API
    // For demo, simulate domain registration
    const registrationId = `DOM_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Store domain registration
    const result = await pool.query(
      `INSERT INTO domain_registrations (
        client_id, domain, price, currency, status, registration_id, 
        customer_info, payment_reference, registered_at, expires_at
      ) VALUES ($1, $2, $3, 'KES', 'pending', $4, $5, $6, NOW(), NOW() + INTERVAL '1 year')
       RETURNING *`,
      [
        req.user.clientId,
        domain,
        price,
        registrationId,
        JSON.stringify(customerInfo),
        paymentReference
      ]
    );

    // Simulate successful registration after payment verification
    setTimeout(async () => {
      await pool.query(
        `UPDATE domain_registrations 
         SET status = 'active', activated_at = NOW()
         WHERE registration_id = $1`,
        [registrationId]
      );
    }, 5000);

    res.json({
      success: true,
      data: {
        registrationId,
        domain,
        price,
        status: 'pending',
        message: 'Domain registration initiated. You will receive confirmation shortly.'
      }
    });

  } catch (error) {
    console.error('Domain registration error:', error);
    res.status(500).json({ error: 'Domain registration failed' });
  }
});

// Get client domains
router.get('/my-domains', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM domain_registrations 
       WHERE client_id = $1 
       ORDER BY registered_at DESC`,
      [req.user.clientId]
    );

    res.json({ success: true, data: result.rows });

  } catch (error) {
    console.error('Get domains error:', error);
    res.status(500).json({ error: 'Failed to get domains' });
  }
});

// Renew domain
router.post('/renew', async (req, res) => {
  try {
    const { domain, years = 1 } = req.body;

    const extension = '.' + domain.split('.').pop();
    const price = domainPrices[extension] * years;

    // Update domain expiration
    await pool.query(
      `UPDATE domain_registrations 
       SET expires_at = expires_at + INTERVAL '${years} years',
           last_renewed_at = NOW()
       WHERE domain = $1 AND client_id = $2`,
      [domain, req.user.clientId]
    );

    res.json({
      success: true,
      data: {
        domain,
        years,
        price,
        message: `Domain ${domain} renewed for ${years} year(s)`
      }
    });

  } catch (error) {
    console.error('Domain renewal error:', error);
    res.status(500).json({ error: 'Domain renewal failed' });
  }
});

module.exports = router;