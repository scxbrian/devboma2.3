const express = require('express');
const { Pool } = require('pg');

const router = express.Router();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Get all orders for a client
router.get('/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    const { status, limit, offset = 0 } = req.query;

    // Check access permissions
    if (req.user.role === 'client' && req.user.clientId !== clientId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    let query = `
      SELECT o.*, c.name as customer_name, c.email as customer_email
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE o.client_id = $1
    `;
    let params = [clientId];
    let paramIndex = 2;

    if (status) {
      query += ` AND o.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    query += ' ORDER BY o.created_at DESC';

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

    res.json({ orders: result.rows });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
});

// Create new order
router.post('/:clientId', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const { clientId } = req.params;
    const { 
      customerId,
      shopId,
      items, // [{ productId, quantity, price }]
      shippingAddress,
      billingAddress,
      paymentMethod,
      notes
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order items are required' });
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      // Get product details and check inventory
      const productResult = await client.query(
        'SELECT id, name, price, inventory_quantity FROM products WHERE id = $1 AND client_id = $2',
        [item.productId, clientId]
      );

      if (productResult.rows.length === 0) {
        throw new Error(`Product ${item.productId} not found`);
      }

      const product = productResult.rows[0];
      
      if (product.inventory_quantity < item.quantity) {
        throw new Error(`Insufficient inventory for ${product.name}`);
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal
      });

      // Update inventory
      await client.query(
        'UPDATE products SET inventory_quantity = inventory_quantity - $1 WHERE id = $2',
        [item.quantity, item.productId]
      );
    }

    const shipping = 500; // Fixed shipping for demo
    const tax = subtotal * 0.16; // 16% VAT
    const total = subtotal + shipping + tax;

    // Create order
    const orderResult = await client.query(
      `INSERT INTO orders (
        client_id, shop_id, customer_id, subtotal, shipping_cost, tax_amount, total_amount,
        shipping_address, billing_address, payment_method, notes, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'pending', NOW())
       RETURNING *`,
      [
        clientId, shopId, customerId, subtotal, shipping, tax, total,
        JSON.stringify(shippingAddress), JSON.stringify(billingAddress), 
        paymentMethod, notes
      ]
    );

    const order = orderResult.rows[0];

    // Create order items
    for (const item of orderItems) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price, total) VALUES ($1, $2, $3, $4, $5)',
        [order.id, item.productId, item.quantity, item.price, item.total]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Order created successfully',
      order: { ...order, items: orderItems }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Order creation error:', error);
    res.status(500).json({ error: error.message || 'Failed to create order' });
  } finally {
    client.release();
  }
});

// Update order status
router.patch('/:clientId/:orderId/status', async (req, res) => {
  try {
    const { clientId, orderId } = req.params;
    const { status, trackingNumber } = req.body;

    // Check access permissions
    if (req.user.role === 'client' && req.user.clientId !== clientId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const result = await pool.query(
      `UPDATE orders 
       SET status = $1, tracking_number = $2, updated_at = NOW()
       WHERE id = $3 AND client_id = $4
       RETURNING *`,
      [status, trackingNumber, orderId, clientId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      message: 'Order status updated successfully',
      order: result.rows[0]
    });

  } catch (error) {
    console.error('Order status update error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;