const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Client = require('../models/Client');
const Shop = require('../models/Shop');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const Payment = require('../models/Payment');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Sample data
const sampleData = {
  clients: [
    {
      name: 'Artisan Crafts Kenya',
      email: 'contact@artisancrafts.co.ke',
      phone: '+254701234567',
      company: 'Artisan Crafts Ltd',
      serviceTier: 'shop',
      contractValue: 89000,
      status: 'active'
    },
    {
      name: 'TechStart Kenya',
      email: 'info@techstartke.com',
      phone: '+254702345678',
      company: 'TechStart Ltd',
      serviceTier: 'titan',
      contractValue: 499000,
      status: 'active'
    },
    {
      name: 'Wellness Hub',
      email: 'hello@wellnesshub.co.ke',
      phone: '+254703456789',
      company: 'Wellness Solutions',
      serviceTier: 'prime',
      contractValue: 299000,
      status: 'active'
    },
    {
      name: 'Fashion Boutique',
      email: 'style@fashionke.com',
      phone: '+254705678901',
      company: 'Fashion Forward',
      serviceTier: 'shop',
      contractValue: 65000,
      status: 'active'
    }
  ],

  users: [
    {
      email: 'admin@devboma.com',
      password: 'password123',
      name: 'DevBoma Admin',
      role: 'admin'
    }
  ],

  shops: [
    {
      name: 'Artisan Crafts Store',
      domain: 'artisancrafts.co.ke',
      subdomain: 'artisan',
      designTheme: 'luxury',
      features: ['advanced-analytics', 'custom-domain', 'social-integration'],
      hostingTier: 'premium',
      transactionFee: 1.5,
      status: 'active'
    },
    {
      name: 'Fashion Forward Boutique',
      subdomain: 'fashion',
      designTheme: 'vibrant',
      features: ['inventory-management', 'email-marketing'],
      hostingTier: 'standard',
      transactionFee: 2.0,
      status: 'active'
    }
  ],

  categories: [
    { name: 'Jewelry', description: 'Handmade jewelry and accessories', slug: 'jewelry' },
    { name: 'Home Decor', description: 'Decorative items for the home', slug: 'home-decor' },
    { name: 'Women\'s Clothing', description: 'Fashion for women', slug: 'womens-clothing' },
    { name: 'Accessories', description: 'Fashion accessories', slug: 'accessories' }
  ],

  products: [
    {
      name: 'Beaded Necklace',
      description: 'Beautiful handmade beaded necklace with traditional patterns',
      price: 2500,
      comparePrice: 3000,
      sku: 'BN001',
      inventory: { quantity: 15, trackInventory: true },
      images: [{ url: 'https://images.pexels.com/photos/1453898/pexels-photo-1453898.jpeg', isPrimary: true }],
      status: 'active'
    },
    {
      name: 'Silver Bracelet',
      description: 'Elegant silver bracelet with local gemstones',
      price: 1800,
      sku: 'SB001',
      inventory: { quantity: 8, trackInventory: true },
      images: [{ url: 'https://images.pexels.com/photos/691046/pexels-photo-691046.jpeg', isPrimary: true }],
      status: 'active'
    },
    {
      name: 'Summer Dress',
      description: 'Elegant summer dress perfect for any occasion',
      price: 3200,
      comparePrice: 4000,
      sku: 'SD001',
      inventory: { quantity: 12, trackInventory: true },
      images: [{ url: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg', isPrimary: true }],
      status: 'active'
    }
  ],

  customers: [
    {
      email: 'jane.doe@email.com',
      name: 'Jane Doe',
      phone: '+254711234567',
      marketingConsent: true
    },
    {
      email: 'john.smith@email.com',
      name: 'John Smith',
      phone: '+254722345678',
      marketingConsent: false
    }
  ]
};

// Seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Client.deleteMany({}),
      Shop.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Customer.deleteMany({}),
      Order.deleteMany({}),
      Payment.deleteMany({})
    ]);

    console.log('🗑️ Cleared existing data');

    // Create clients
    const clients = await Client.create(sampleData.clients);
    console.log(`✅ Created ${clients.length} clients`);

    // Create admin user
    const adminUser = await User.create(sampleData.users[0]);
    console.log('✅ Created admin user');

    // Create client users
    const clientUsers = [];
    for (let i = 0; i < clients.length; i++) {
      const client = clients[i];
      const userData = {
        email: client.email,
        password: 'password123',
        name: client.name.split(' ')[0] + ' User',
        role: 'client',
        clientId: client._id
      };
      const user = await User.create(userData);
      clientUsers.push(user);
    }
    console.log(`✅ Created ${clientUsers.length} client users`);

    // Create shops for shop-tier clients
    const shopClients = clients.filter(c => c.serviceTier === 'shop');
    const shops = [];
    for (let i = 0; i < shopClients.length && i < sampleData.shops.length; i++) {
      const shopData = {
        ...sampleData.shops[i],
        clientId: shopClients[i]._id,
        createdBy: clientUsers.find(u => u.clientId.toString() === shopClients[i]._id.toString())._id
      };
      const shop = await Shop.create(shopData);
      shops.push(shop);
    }
    console.log(`✅ Created ${shops.length} shops`);

    // Create categories
    const categories = [];
    for (let i = 0; i < shops.length; i++) {
      const shop = shops[i];
      const categoryData = sampleData.categories.slice(i * 2, (i + 1) * 2);
      for (const catData of categoryData) {
        const category = await Category.create({
          ...catData,
          clientId: shop.clientId,
          shopId: shop._id
        });
        categories.push(category);
      }
    }
    console.log(`✅ Created ${categories.length} categories`);

    // Create products
    const products = [];
    for (let i = 0; i < shops.length; i++) {
      const shop = shops[i];
      const shopCategories = categories.filter(c => c.shopId.toString() === shop._id.toString());
      const productData = sampleData.products.slice(i * 2, (i + 1) * 2);
      
      for (let j = 0; j < productData.length; j++) {
        const product = await Product.create({
          ...productData[j],
          clientId: shop.clientId,
          shopId: shop._id,
          categoryId: shopCategories[j % shopCategories.length]?._id
        });
        products.push(product);
      }
    }
    console.log(`✅ Created ${products.length} products`);

    // Create customers
    const customers = [];
    for (let i = 0; i < shops.length; i++) {
      const shop = shops[i];
      for (const custData of sampleData.customers) {
        const customer = await Customer.create({
          ...custData,
          clientId: shop.clientId,
          shopId: shop._id
        });
        customers.push(customer);
      }
    }
    console.log(`✅ Created ${customers.length} customers`);

    // Create sample orders
    const orders = [];
    for (let i = 0; i < Math.min(shops.length, 3); i++) {
      const shop = shops[i];
      const shopProducts = products.filter(p => p.shopId.toString() === shop._id.toString());
      const shopCustomers = customers.filter(c => c.shopId.toString() === shop._id.toString());
      
      if (shopProducts.length > 0 && shopCustomers.length > 0) {
        const orderData = {
          clientId: shop.clientId,
          shopId: shop._id,
          customerId: shopCustomers[0]._id,
          items: [{
            productId: shopProducts[0]._id,
            name: shopProducts[0].name,
            quantity: 1,
            price: shopProducts[0].price,
            total: shopProducts[0].price
          }],
          pricing: {
            subtotal: shopProducts[0].price,
            shippingCost: 500,
            taxAmount: shopProducts[0].price * 0.16,
            totalAmount: shopProducts[0].price + 500 + (shopProducts[0].price * 0.16)
          },
          status: 'completed',
          paymentStatus: 'paid',
          paymentMethod: 'mpesa'
        };
        
        const order = await Order.create(orderData);
        orders.push(order);

        // Create payment record
        await Payment.create({
          orderId: order._id,
          clientId: shop.clientId,
          amount: order.pricing.totalAmount,
          paymentMethod: 'mpesa',
          paymentProvider: 'safaricom',
          status: 'completed',
          processedAt: new Date()
        });
      }
    }
    console.log(`✅ Created ${orders.length} orders with payments`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📝 Login credentials:');
    console.log('   Admin: admin@devboma.com / password123');
    console.log('   Clients: Use client email / password123');
    console.log('\n🌐 API Server: http://localhost:3001');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

// Run seeding
connectDB().then(seedDatabase);