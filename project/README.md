# DevBoma SaaS Platform

A comprehensive multi-tenant SaaS platform for DevBoma, providing web and software solutions across multiple service tiers, with a specialized e-commerce shop-building system.

## 🌟 Features

### Service Tiers
- **Boma Lite** (KES 39,000): Basic web applications with responsive design
- **Boma Core** (KES 145,000): Full-stack applications with database integration
- **Boma Prime** (KES 299,000): Enterprise platforms with advanced features
- **Boma Titan** (KES 499,000): Custom software solutions with DevOps
- **Boma Shop** (Dynamic pricing): Complete e-commerce solution with custom frontend and shared backend

### Platform Capabilities
- 🏪 Multi-tenant e-commerce system
- 🎨 Interactive shop design builder with real-time pricing
- 📊 Advanced analytics and reporting
- 💳 Payment integration (Mpesa, Stripe)
- 👥 User management with role-based access
- 📱 Responsive design across all devices
- 🔒 Enterprise-grade security

## 🏗️ Architecture

### Frontend (React + TypeScript)
```
src/
├── components/          # Reusable UI components
├── pages/              # Main application pages
├── contexts/           # React contexts (Auth, etc.)
├── data/               # Static data and configurations
└── utils/              # Helper functions
```

### Backend (Node.js + Express)
```
backend/
├── routes/             # API route handlers
├── middleware/         # Custom middleware
├── database/           # Database schema and migrations
├── scripts/            # Database initialization scripts
└── utils/              # Backend helper functions
```

### Database (PostgreSQL)
- Multi-tenant architecture with client isolation
- Row Level Security (RLS) for data protection
- Optimized indexes for performance
- Comprehensive audit logging

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- Redis (optional, for caching)

### Installation

1. **Clone and setup frontend:**
```bash
npm install
npm run dev
```

2. **Setup backend:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database and API keys
npm run init-db
npm run dev
```

3. **Access the platform:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Admin login: admin@devboma.com (any password)
- Client login: Any other email (any password)

## 📊 Database Setup

1. Create PostgreSQL database:
```sql
CREATE DATABASE devboma_db;
```

2. Update `.env` file with your database connection:
```
DATABASE_URL=postgresql://username:password@localhost:5432/devboma_db
```

3. Initialize database:
```bash
cd backend
npm run init-db
```

This will create all tables, indexes, and sample data.

## 🔐 Authentication

The platform uses JWT-based authentication with two user roles:
- **Admin**: Full platform access for DevBoma staff
- **Client**: Access to own shops and data only

### Sample Users (created by seed data):
- Admin: `admin@devboma.com`
- Client: `contact@artisancrafts.co.ke`
- Client: `style@fashionke.com`

## 🏪 Multi-Tenant Shop System

### Boma Shop Features:
- **Custom Frontend**: Each shop gets unique branding and design
- **Shared Backend**: Efficient resource utilization across all shops
- **Dynamic Pricing**: Real-time cost calculation based on selected features
- **Feature Selection**: Advanced analytics, inventory management, payment options
- **Hosting Tiers**: Basic, Standard, Premium with different resource allocations

### Shop Builder Flow:
1. Select design theme (Modern, Luxury, Minimal, Vibrant)
2. Choose additional features (analytics, inventory, payments, etc.)
3. Pick hosting tier (Basic, Standard, Premium)
4. Set transaction fee preference (1%, 2%, 3%)
5. Review total cost and proceed with shop creation

## 🎨 Design System

### Color Palette:
- **Primary**: Blue (#1E40AF) - Trust and professionalism
- **Secondary**: Indigo (#4338CA) - Innovation
- **Accent**: Yellow (#F59E0B) - Energy and growth
- **Success**: Green (#10B981) - Success states
- **Error**: Red (#EF4444) - Error states
- **Neutral**: Gray scale for backgrounds and text

### Typography:
- **Font Family**: Inter (system font fallback)
- **Weights**: 400 (Regular), 600 (Semi-bold), 700 (Bold)
- **Line Heights**: 150% for body text, 120% for headings

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Shops Management
- `GET /api/shops/:clientId` - Get client shops
- `POST /api/shops/create` - Create new shop
- `PUT /api/shops/:clientId/:shopId` - Update shop

### Products
- `GET /api/products/:clientId` - Get client products
- `POST /api/products/:clientId` - Create product
- `PUT /api/products/:clientId/:productId` - Update product
- `DELETE /api/products/:clientId/:productId` - Delete product

### Orders
- `GET /api/orders/:clientId` - Get client orders
- `POST /api/orders/:clientId` - Create order
- `PATCH /api/orders/:clientId/:orderId/status` - Update order status

### Analytics
- `GET /api/analytics/:clientId/dashboard` - Get dashboard data
- `GET /api/analytics/:clientId/sales-report` - Generate sales report

### Admin (Admin only)
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/clients` - All clients
- `POST /api/admin/clients` - Create client
- `PUT /api/admin/clients/:clientId` - Update client

## 💳 Payment Integration

### Supported Providers:
- **M-Pesa**: Primary payment method for Kenyan market
- **Stripe**: International card payments
- **Bank Transfer**: Manual verification system

### Transaction Fees:
- Configurable per shop (1%, 2%, 3%)
- Lower upfront costs for higher transaction fees
- Higher upfront costs for lower transaction fees

## 📈 Analytics & Reporting

### Dashboard Metrics:
- Total revenue and growth trends
- Order volume and conversion rates
- Top-selling products
- Customer acquisition and retention
- Inventory levels and alerts

### Exportable Reports:
- Sales reports (CSV/PDF)
- Customer reports
- Inventory reports
- Financial summaries

## 🛡️ Security Features

- **Row Level Security (RLS)**: Database-level tenant isolation
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Protection against API abuse
- **Input Validation**: Comprehensive input sanitization
- **SQL Injection Protection**: Parameterized queries
- **CORS Configuration**: Secure cross-origin requests

## 🚀 Deployment

### Production Checklist:
1. Set up PostgreSQL database
2. Configure environment variables
3. Set strong JWT secrets
4. Configure payment gateway credentials
5. Set up SSL certificates
6. Configure backup strategy
7. Set up monitoring and logging

### Environment Variables:
```bash
DATABASE_URL=postgresql://user:pass@host:port/database
JWT_SECRET=your-production-jwt-secret
STRIPE_SECRET_KEY=sk_live_your_stripe_key
MPESA_CONSUMER_KEY=your_mpesa_key
MPESA_CONSUMER_SECRET=your_mpesa_secret
```

## 🔧 Development

### Running Tests:
```bash
# Frontend tests
npm test

# Backend tests
cd backend
npm test
```

### Database Migrations:
```bash
cd backend
npm run migrate
```

### Seeding Development Data:
```bash
cd backend
npm run seed-db
```

## 📞 Support

For technical support or questions:
- Email: tech@devboma.com
- Phone: +254 700 123 456
- Documentation: docs.devboma.com

## 📄 License

Copyright © 2025 DevBoma. All rights reserved.

Built with faith and excellence. 🙏