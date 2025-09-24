const express = require('express');
const { Pool } = require('pg');

const router = express.Router();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Get all products for a client's shop
router.get('/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    const { shopId } = req.query;

    // Check access permissions
    if (req.user.role === 'client' && req.user.clientId !== clientId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    let query = 'SELECT * FROM products WHERE client_id = $1';
    let params = [clientId];

    if (shopId) {
      query += ' AND shop_id = $2';
      params.push(shopId);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);

    res.json({ products: result.rows });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to get products' });
  }
});

// Create new product
router.post('/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    const { 
      shopId, 
      name, 
      description, 
      price, 
      comparePrice, 
      cost,
      sku,
      inventory,
      images,
      category,
      tags,
      variants 
    } = req.body;

    // Check access permissions
    if (req.user.role === 'client' && req.user.clientId !== clientId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!name || !price || inventory === undefined) {
      return res.status(400).json({ error: 'Name, price, and inventory are required' });
    }

    const result = await pool.query(
      `INSERT INTO products (
        client_id, shop_id, name, description, price, compare_price, cost, 
        sku, inventory_quantity, images, category, tags, variants, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
       RETURNING *`,
      [
        clientId, shopId, name, description, price, comparePrice, cost,
        sku, inventory, JSON.stringify(images), category, JSON.stringify(tags), 
        JSON.stringify(variants)
      ]
    );

    res.status(201).json({
      message: 'Product created successfully',
      product: result.rows[0]
    });

  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product
router.put('/:clientId/:productId', async (req, res) => {
  try {
    const { clientId, productId } = req.params;
    const { 
      name, 
      description, 
      price, 
      comparePrice, 
      cost,
      sku,
      inventory,
      images,
      category,
      tags,
      variants,
      status
    } = req.body;

    // Check access permissions
    if (req.user.role === 'client' && req.user.clientId !== clientId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await pool.query(
      `UPDATE products 
       SET name = $1, description = $2, price = $3, compare_price = $4, cost = $5,
           sku = $6, inventory_quantity = $7, images = $8, category = $9, 
           tags = $10, variants = $11, status = $12, updated_at = NOW()
       WHERE id = $13 AND client_id = $14
       RETURNING *`,
      [
        name, description, price, comparePrice, cost, sku, inventory, 
        JSON.stringify(images), category, JSON.stringify(tags), 
        JSON.stringify(variants), status, productId, clientId
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      message: 'Product updated successfully',
      product: result.rows[0]
    });

  } catch (error) {
    console.error('Product update error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
router.delete('/:clientId/:productId', async (req, res) => {
  try {
    const { clientId, productId } = req.params;

    // Check access permissions
    if (req.user.role === 'client' && req.user.clientId !== clientId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 AND client_id = $2 RETURNING id',
      [productId, clientId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });

  } catch (error) {
    console.error('Product deletion error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Update product inventory
router.patch('/:clientId/:productId/inventory', async (req, res) => {
  try {
    const { clientId, productId } = req.params;
    const { quantity, operation = 'set' } = req.body; // operation: 'set', 'add', 'subtract'

    // Check access permissions
    if (req.user.role === 'client' && req.user.clientId !== clientId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    let query;
    let params;

    switch (operation) {
      case 'add':
        query = `UPDATE products SET inventory_quantity = inventory_quantity + $1, updated_at = NOW()
                 WHERE id = $2 AND client_id = $3 RETURNING inventory_quantity`;
        params = [quantity, productId, clientId];
        break;
      case 'subtract':
        query = `UPDATE products SET inventory_quantity = GREATEST(0, inventory_quantity - $1), updated_at = NOW()
                 WHERE id = $2 AND client_id = $3 RETURNING inventory_quantity`;
        params = [quantity, productId, clientId];
        break;
      default: // 'set'
        query = `UPDATE products SET inventory_quantity = $1, updated_at = NOW()
                 WHERE id = $2 AND client_id = $3 RETURNING inventory_quantity`;
        params = [quantity, productId, clientId];
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      message: 'Inventory updated successfully',
      newQuantity: result.rows[0].inventory_quantity
    });

  } catch (error) {
    console.error('Inventory update error:', error);
    res.status(500).json({ error: 'Failed to update inventory' });
  }
});

module.exports = router;