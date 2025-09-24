const express = require('express');
const Client = require('../models/Client');
const User = require('../models/User');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/clients
// @desc    Get all clients (admin only)
// @access  Private/Admin
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, serviceTier, page = 1, limit = 10, search } = req.query;

    // Build query
    const query = {};
    if (status) query.status = status;
    if (serviceTier) query.serviceTier = serviceTier;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const clients = await Client.find(query)
      .populate('shops', 'name status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Client.countDocuments(query);

    res.json({
      success: true,
      data: {
        clients,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get clients'
    });
  }
});

// @route   GET /api/clients/:id
// @desc    Get single client
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check access permissions
    if (req.user.role === 'client' && req.user.clientId.toString() !== id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const client = await Client.findById(id)
      .populate('shops', 'name domain status totalRevenue totalOrders')
      .populate('users', 'name email role lastLogin');

    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }

    res.json({
      success: true,
      data: { client }
    });

  } catch (error) {
    console.error('Get client error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get client'
    });
  }
});

// @route   POST /api/clients
// @desc    Create new client (admin only)
// @access  Private/Admin
router.post('/', authenticateToken, requireAdmin, validate(schemas.clientCreate), async (req, res) => {
  try {
    const clientData = req.body;

    // Check if client already exists
    const existingClient = await Client.findOne({ email: clientData.email });
    if (existingClient) {
      return res.status(400).json({
        success: false,
        error: 'Client with this email already exists'
      });
    }

    const client = await Client.create(clientData);

    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: { client }
    });

  } catch (error) {
    console.error('Client creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create client'
    });
  }
});

// @route   PUT /api/clients/:id
// @desc    Update client
// @access  Private
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check access permissions
    if (req.user.role === 'client' && req.user.clientId.toString() !== id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const client = await Client.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }

    res.json({
      success: true,
      message: 'Client updated successfully',
      data: { client }
    });

  } catch (error) {
    console.error('Client update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update client'
    });
  }
});

// @route   DELETE /api/clients/:id
// @desc    Delete client (admin only)
// @access  Private/Admin
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }

    // Delete associated users
    await User.deleteMany({ clientId: id });

    // Delete client
    await Client.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Client deleted successfully'
    });

  } catch (error) {
    console.error('Client deletion error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete client'
    });
  }
});

// @route   GET /api/clients/:id/stats
// @desc    Get client statistics
// @access  Private
router.get('/:id/stats', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check access permissions
    if (req.user.role === 'client' && req.user.clientId.toString() !== id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }

    // Get aggregated statistics
    const Shop = require('../models/Shop');
    const Order = require('../models/Order');
    const Product = require('../models/Product');
    const Customer = require('../models/Customer');

    const [shops, orders, products, customers] = await Promise.all([
      Shop.countDocuments({ clientId: id }),
      Order.aggregate([
        { $match: { clientId: mongoose.Types.ObjectId(id) } },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: '$pricing.totalAmount' },
            avgOrderValue: { $avg: '$pricing.totalAmount' }
          }
        }
      ]),
      Product.countDocuments({ clientId: id }),
      Customer.countDocuments({ clientId: id })
    ]);

    const stats = {
      shops,
      products,
      customers,
      orders: orders[0]?.totalOrders || 0,
      revenue: orders[0]?.totalRevenue || 0,
      averageOrderValue: orders[0]?.avgOrderValue || 0
    };

    res.json({
      success: true,
      data: { stats }
    });

  } catch (error) {
    console.error('Get client stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get client statistics'
    });
  }
});

module.exports = router;