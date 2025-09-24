const express = require('express');
const { Pool } = require('pg');

const router = express.Router();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Create new shop
router.post('/create', async (req, res) => {
  try {
    const { name, domain, design, features, hostingTier, transactionFee } = req.body;
    const { userId, clientId } = req.user;

    if (!name || !design) {
      return res.status(400).json({ error: 'Shop name and design are required' });
    }

    const result = await pool.query(
      `INSERT INTO shops (client_id, name, domain, design_theme, features, hosting_tier, transaction_fee, created_by, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       RETURNING *`,
      [clientId, name, domain, design, JSON.stringify(features), hostingTier, transactionFee, userId]
    );

    res.status(201).json({
      message: 'Shop created successfully',
      shop: result.rows[0]
    });

  } catch (error) {
    console.error('Shop creation error:', error);
    res.status(500).json({ error: 'Failed to create shop' });
  }
});

// Get shops for client
router.get('/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;

    // Check access permissions
    if (req.user.role === 'client' && req.user.clientId !== clientId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await pool.query(
      'SELECT * FROM shops WHERE client_id = $1 ORDER BY created_at DESC',
      [clientId]
    );

    res.json({ shops: result.rows });

  } catch (error) {
    console.error('Get shops error:', error);
    res.status(500).json({ error: 'Failed to get shops' });
  }
});

// Update shop
router.put('/:clientId/:shopId', async (req, res) => {
  try {
    const { clientId, shopId } = req.params;
    const { name, domain, design, features, hostingTier, status } = req.body;

    // Check access permissions
    if (req.user.role === 'client' && req.user.clientId !== clientId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await pool.query(
      `UPDATE shops 
       SET name = $1, domain = $2, design_theme = $3, features = $4, hosting_tier = $5, status = $6, updated_at = NOW()
       WHERE id = $7 AND client_id = $8
       RETURNING *`,
      [name, domain, design, JSON.stringify(features), hostingTier, status, shopId, clientId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    res.json({
      message: 'Shop updated successfully',
      shop: result.rows[0]
    });

  } catch (error) {
    console.error('Shop update error:', error);
    res.status(500).json({ error: 'Failed to update shop' });
  }
});

// Delete shop
router.delete('/:clientId/:shopId', async (req, res) => {
  try {
    const { clientId, shopId } = req.params;

    // Only admins can delete shops
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const result = await pool.query(
      'DELETE FROM shops WHERE id = $1 AND client_id = $2 RETURNING id',
      [shopId, clientId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    res.json({ message: 'Shop deleted successfully' });

  } catch (error) {
    console.error('Shop deletion error:', error);
    res.status(500).json({ error: 'Failed to delete shop' });
  }
});

module.exports = router;