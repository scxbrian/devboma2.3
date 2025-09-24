const express = require('express');
const { Pool } = require('pg');

const router = express.Router();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Middleware to check admin access
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

router.use(requireAdmin);

// Get platform statistics
router.get('/stats', async (req, res) => {
  try {
    // Get total revenue
    const revenueResult = await pool.query(
      'SELECT COALESCE(SUM(total_amount), 0) as total_revenue FROM orders WHERE status = $1',
      ['completed']
    );

    // Get client counts by tier
    const clientsResult = await pool.query(
      `SELECT 
        COUNT(*) as total_clients,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_clients
       FROM clients`
    );

    // Get shop counts
    const shopsResult = await pool.query(
      `SELECT 
        COUNT(*) as total_shops,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_shops
       FROM shops`
    );

    // Get revenue by tier
    const tierRevenueResult = await pool.query(
      `SELECT 
        c.service_tier,
        COALESCE(SUM(o.total_amount), 0) as revenue
       FROM clients c
       LEFT JOIN orders o ON c.id = o.client_id AND o.status = 'completed'
       GROUP BY c.service_tier`
    );

    const stats = {
      revenue: {
        total: parseFloat(revenueResult.rows[0].total_revenue) || 0
      },
      clients: {
        total: parseInt(clientsResult.rows[0].total_clients) || 0,
        active: parseInt(clientsResult.rows[0].active_clients) || 0
      },
      shops: {
        total: parseInt(shopsResult.rows[0].total_shops) || 0,
        active: parseInt(shopsResult.rows[0].active_shops) || 0
      },
      tierRevenue: tierRevenueResult.rows
    };

    res.json(stats);

  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Failed to get platform statistics' });
  }
});

// Get all clients
router.get('/clients', async (req, res) => {
  try {
    const { status, tier, limit, offset = 0 } = req.query;

    let query = `
      SELECT 
        c.*,
        COUNT(s.id) as shop_count,
        COALESCE(SUM(o.total_amount), 0) as total_revenue
      FROM clients c
      LEFT JOIN shops s ON c.id = s.client_id
      LEFT JOIN orders o ON c.id = o.client_id AND o.status = 'completed'
      WHERE 1=1
    `;
    let params = [];
    let paramIndex = 1;

    if (status) {
      query += ` AND c.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (tier) {
      query += ` AND c.service_tier = $${paramIndex}`;
      params.push(tier);
      paramIndex++;
    }

    query += ' GROUP BY c.id ORDER BY c.created_at DESC';

    if (limit) {
      query += ` LIMIT $${paramIndex}`;
      params.push(parseInt(limit));
      paramIndex++;
    }

    if (offset) {
      query += ` OFFSET $${paramIndex}`;
      params.push(parseInt(offset));
    }

    const result = await pool.query(query, params);

    res.json({ clients: result.rows });

  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({ error: 'Failed to get clients' });
  }
});

// Create new client
router.post('/clients', async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      company, 
      serviceTier, 
      contractValue,
      notes 
    } = req.body;

    if (!name || !email || !serviceTier) {
      return res.status(400).json({ error: 'Name, email, and service tier are required' });
    }

    // Check if client already exists
    const existingClient = await pool.query(
      'SELECT id FROM clients WHERE email = $1',
      [email]
    );

    if (existingClient.rows.length > 0) {
      return res.status(400).json({ error: 'Client with this email already exists' });
    }

    const result = await pool.query(
      `INSERT INTO clients (name, email, phone, company, service_tier, contract_value, notes, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'active', NOW())
       RETURNING *`,
      [name, email, phone, company, serviceTier, contractValue, notes]
    );

    res.status(201).json({
      message: 'Client created successfully',
      client: result.rows[0]
    });

  } catch (error) {
    console.error('Client creation error:', error);
    res.status(500).json({ error: 'Failed to create client' });
  }
});

// Update client
router.put('/clients/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    const { 
      name, 
      email, 
      phone, 
      company, 
      serviceTier, 
      contractValue,
      status,
      notes 
    } = req.body;

    const result = await pool.query(
      `UPDATE clients 
       SET name = $1, email = $2, phone = $3, company = $4, service_tier = $5, 
           contract_value = $6, status = $7, notes = $8, updated_at = NOW()
       WHERE id = $9
       RETURNING *`,
      [name, email, phone, company, serviceTier, contractValue, status, notes, clientId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({
      message: 'Client updated successfully',
      client: result.rows[0]
    });

  } catch (error) {
    console.error('Client update error:', error);
    res.status(500).json({ error: 'Failed to update client' });
  }
});

// Get platform activity logs
router.get('/activity', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT 
        al.*,
        u.name as user_name,
        c.name as client_name
       FROM activity_logs al
       LEFT JOIN users u ON al.user_id = u.id
       LEFT JOIN clients c ON al.client_id = c.id
       ORDER BY al.created_at DESC
       LIMIT $1 OFFSET $2`,
      [parseInt(limit), parseInt(offset)]
    );

    res.json({ activities: result.rows });

  } catch (error) {
    console.error('Activity logs error:', error);
    res.status(500).json({ error: 'Failed to get activity logs' });
  }
});

module.exports = router;