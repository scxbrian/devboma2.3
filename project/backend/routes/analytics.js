const express = require('express');
const { Pool } = require('pg');

const router = express.Router();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Get analytics dashboard data for a client
router.get('/:clientId/dashboard', async (req, res) => {
  try {
    const { clientId } = req.params;
    const { period = '30' } = req.query; // days

    // Check access permissions
    if (req.user.role === 'client' && req.user.clientId !== clientId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const periodDays = parseInt(period);
    const startDate = new Date(Date.now() - (periodDays * 24 * 60 * 60 * 1000));

    // Get total revenue
    const revenueResult = await pool.query(
      `SELECT 
        COALESCE(SUM(total_amount), 0) as total_revenue,
        COUNT(*) as total_orders
       FROM orders 
       WHERE client_id = $1 AND status = 'completed' AND created_at >= $2`,
      [clientId, startDate]
    );

    // Get orders count and trends
    const ordersResult = await pool.query(
      `SELECT 
        COUNT(*) as count,
        DATE_TRUNC('day', created_at) as date
       FROM orders 
       WHERE client_id = $1 AND created_at >= $2
       GROUP BY DATE_TRUNC('day', created_at)
       ORDER BY date`,
      [clientId, startDate]
    );

    // Get top products
    const topProductsResult = await pool.query(
      `SELECT 
        p.name,
        SUM(oi.quantity) as total_sold,
        SUM(oi.total) as total_revenue
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       JOIN orders o ON oi.order_id = o.id
       WHERE o.client_id = $1 AND o.created_at >= $2 AND o.status = 'completed'
       GROUP BY p.id, p.name
       ORDER BY total_revenue DESC
       LIMIT 5`,
      [clientId, startDate]
    );

    // Get customer insights
    const customerResult = await pool.query(
      `SELECT 
        COUNT(DISTINCT customer_id) as unique_customers,
        AVG(total_amount) as avg_order_value
       FROM orders 
       WHERE client_id = $1 AND status = 'completed' AND created_at >= $2`,
      [clientId, startDate]
    );

    const analytics = {
      revenue: {
        total: parseFloat(revenueResult.rows[0].total_revenue) || 0,
        orders: parseInt(revenueResult.rows[0].total_orders) || 0
      },
      trends: {
        orders: ordersResult.rows
      },
      topProducts: topProductsResult.rows,
      customers: {
        unique: parseInt(customerResult.rows[0].unique_customers) || 0,
        averageOrderValue: parseFloat(customerResult.rows[0].avg_order_value) || 0
      }
    };

    res.json(analytics);

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to get analytics data' });
  }
});

// Get sales report
router.get('/:clientId/sales-report', async (req, res) => {
  try {
    const { clientId } = req.params;
    const { startDate, endDate, format = 'json' } = req.query;

    // Check access permissions
    if (req.user.role === 'client' && req.user.clientId !== clientId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await pool.query(
      `SELECT 
        o.id as order_id,
        o.created_at,
        o.total_amount,
        o.status,
        c.name as customer_name,
        c.email as customer_email,
        p.name as product_name,
        oi.quantity,
        oi.price,
        oi.total as item_total
       FROM orders o
       LEFT JOIN customers c ON o.customer_id = c.id
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE o.client_id = $1 
       AND o.created_at >= $2 
       AND o.created_at <= $3
       ORDER BY o.created_at DESC`,
      [clientId, startDate, endDate]
    );

    if (format === 'csv') {
      // Convert to CSV format
      const headers = 'Order ID,Date,Customer Name,Customer Email,Product Name,Quantity,Price,Item Total,Order Total,Status\n';
      const csvData = result.rows.map(row => 
        `${row.order_id},${row.created_at},${row.customer_name},${row.customer_email},${row.product_name},${row.quantity},${row.price},${row.item_total},${row.total_amount},${row.status}`
      ).join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=sales-report.csv');
      res.send(headers + csvData);
    } else {
      res.json({ report: result.rows });
    }

  } catch (error) {
    console.error('Sales report error:', error);
    res.status(500).json({ error: 'Failed to generate sales report' });
  }
});

module.exports = router;