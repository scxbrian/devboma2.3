-- DevBoma SaaS Platform Sample Data
-- This creates realistic sample data for testing and demonstration

-- Insert sample clients
INSERT INTO clients (id, name, email, phone, company, service_tier, contract_value, status, notes) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Artisan Crafts Kenya', 'contact@artisancrafts.co.ke', '+254701234567', 'Artisan Crafts Ltd', 'shop', 89000, 'active', 'Handmade crafts and jewelry shop'),
    ('550e8400-e29b-41d4-a716-446655440002', 'TechStart Kenya', 'info@techstartke.com', '+254702345678', 'TechStart Ltd', 'titan', 499000, 'active', 'Technology startup platform development'),
    ('550e8400-e29b-41d4-a716-446655440003', 'Wellness Hub', 'hello@wellnesshub.co.ke', '+254703456789', 'Wellness Solutions', 'prime', 299000, 'active', 'Health and wellness platform'),
    ('550e8400-e29b-41d4-a716-446655440004', 'Local Restaurant', 'orders@localrest.co.ke', '+254704567890', 'Local Eats', 'core', 145000, 'development', 'Restaurant ordering system'),
    ('550e8400-e29b-41d4-a716-446655440005', 'Fashion Boutique', 'style@fashionke.com', '+254705678901', 'Fashion Forward', 'shop', 65000, 'active', 'Fashion and clothing online store')
ON CONFLICT (email) DO NOTHING;

-- Insert sample users (password is 'password' hashed with bcrypt)
INSERT INTO users (id, email, password_hash, name, role, client_id) VALUES
    ('660e8400-e29b-41d4-a716-446655440001', 'admin@devboma.com', '$2b$10$rOjLrS3PjkU5S1wQ9X.xfuFZVzK1J2LMnO3zY7vB8QwXrT6uI0pKS', 'DevBoma Admin', 'admin', NULL),
    ('660e8400-e29b-41d4-a716-446655440002', 'contact@artisancrafts.co.ke', '$2b$10$rOjLrS3PjkU5S1wQ9X.xfuFZVzK1J2LMnO3zY7vB8QwXrT6uI0pKS', 'Sarah Kimani', 'client', '550e8400-e29b-41d4-a716-446655440001'),
    ('660e8400-e29b-41d4-a716-446655440003', 'info@techstartke.com', '$2b$10$rOjLrS3PjkU5S1wQ9X.xfuFZVzK1J2LMnO3zY7vB8QwXrT6uI0pKS', 'David Mwangi', 'client', '550e8400-e29b-41d4-a716-446655440002'),
    ('660e8400-e29b-41d4-a716-446655440004', 'hello@wellnesshub.co.ke', '$2b$10$rOjLrS3PjkU5S1wQ9X.xfuFZVzK1J2LMnO3zY7vB8QwXrT6uI0pKS', 'Grace Wanjiku', 'client', '550e8400-e29b-41d4-a716-446655440003'),
    ('660e8400-e29b-41d4-a716-446655440005', 'style@fashionke.com', '$2b$10$rOjLrS3PjkU5S1wQ9X.xfuFZVzK1J2LMnO3zY7vB8QwXrT6uI0pKS', 'Mary Njoki', 'client', '550e8400-e29b-41d4-a716-446655440005'),
    ('660e8400-e29b-41d4-a716-446655440006', 'demo@devboma.com', '$2b$10$rOjLrS3PjkU5S1wQ9X.xfuFZVzK1J2LMnO3zY7vB8QwXrT6uI0pKS', 'Demo User', 'client', '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT (email) DO NOTHING;

-- Insert sample shops (for shop tier clients)
INSERT INTO shops (id, client_id, name, domain, subdomain, design_theme, features, hosting_tier, transaction_fee, status) VALUES
    ('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Artisan Crafts Store', 'artisancrafts.co.ke', 'artisan', 'luxury', '["advanced-analytics", "custom-domain", "social-integration"]', 'premium', 1.5, 'active'),
    ('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', 'Fashion Forward Boutique', 'fashionforward.shop', 'fashion', 'vibrant', '["inventory-management", "email-marketing"]', 'standard', 2.0, 'active')
ON CONFLICT (subdomain) DO NOTHING;

-- Insert sample categories
INSERT INTO categories (id, client_id, shop_id, name, description, slug, sort_order) VALUES
    ('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'Jewelry', 'Handmade jewelry and accessories', 'jewelry', 1),
    ('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'Home Decor', 'Decorative items for the home', 'home-decor', 2),
    ('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440002', 'Women''s Clothing', 'Fashion for women', 'womens-clothing', 1),
    ('880e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440002', 'Accessories', 'Fashion accessories', 'accessories', 2)
ON CONFLICT (client_id, slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (id, client_id, shop_id, category_id, name, description, price, compare_price, sku, inventory_quantity, images, status) VALUES
    ('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'Beaded Necklace', 'Beautiful handmade beaded necklace with traditional patterns', 2500.00, 3000.00, 'BN001', 15, '["https://images.pexels.com/photos/1453898/pexels-photo-1453898.jpeg"]', 'active'),
    ('990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'Silver Bracelet', 'Elegant silver bracelet with local gemstones', 1800.00, NULL, 'SB001', 8, '["https://images.pexels.com/photos/691046/pexels-photo-691046.jpeg"]', 'active'),
    ('990e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440002', 'Wooden Sculpture', 'Hand-carved wooden sculpture representing Kenyan wildlife', 4500.00, 5500.00, 'WS001', 5, '["https://images.pexels.com/photos/2049422/pexels-photo-2049422.jpeg"]', 'active'),
    ('990e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440003', 'Summer Dress', 'Elegant summer dress perfect for any occasion', 3200.00, 4000.00, 'SD001', 12, '["https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg"]', 'active'),
    ('990e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440004', 'Designer Handbag', 'Premium leather handbag with modern design', 5800.00, 6500.00, 'DH001', 6, '["https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg"]', 'active')
ON CONFLICT (client_id, sku) DO NOTHING;

-- Insert sample customers
INSERT INTO customers (id, client_id, shop_id, email, name, phone, marketing_consent, total_spent, orders_count) VALUES
    ('aa0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'jane.doe@email.com', 'Jane Doe', '+254711234567', TRUE, 7300.00, 3),
    ('aa0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'john.smith@email.com', 'John Smith', '+254722345678', FALSE, 4500.00, 1),
    ('aa0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440002', 'mary.johnson@email.com', 'Mary Johnson', '+254733456789', TRUE, 9000.00, 2)
ON CONFLICT (client_id, email) DO NOTHING;

-- Insert sample orders
INSERT INTO orders (id, client_id, shop_id, customer_id, order_number, subtotal, shipping_cost, tax_amount, total_amount, status, payment_status, payment_method) VALUES
    ('bb0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440001', 'ORD-000001', 2500.00, 500.00, 400.00, 3400.00, 'completed', 'paid', 'mpesa'),
    ('bb0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440002', 'ORD-000002', 4500.00, 500.00, 720.00, 5720.00, 'processing', 'paid', 'stripe'),
    ('bb0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440002', 'aa0e8400-e29b-41d4-a716-446655440003', 'ORD-000003', 5800.00, 500.00, 928.00, 7228.00, 'shipped', 'paid', 'mpesa')
ON CONFLICT (order_number) DO NOTHING;

-- Insert sample order items
INSERT INTO order_items (order_id, product_id, quantity, price, total) VALUES
    ('bb0e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', 1, 2500.00, 2500.00),
    ('bb0e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440003', 1, 4500.00, 4500.00),
    ('bb0e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440005', 1, 5800.00, 5800.00);

-- Insert sample payments
INSERT INTO payments (id, order_id, client_id, reference, amount, payment_method, payment_provider, provider_transaction_id, status, processed_at) VALUES
    ('cc0e8400-e29b-41d4-a716-446655440001', 'bb0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'PAY_001_' || extract(epoch from now()), 3400.00, 'mpesa', 'safaricom', 'MPE123456789', 'completed', NOW()),
    ('cc0e8400-e29b-41d4-a716-446655440002', 'bb0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'PAY_002_' || extract(epoch from now()), 5720.00, 'card', 'stripe', 'ch_1234567890', 'completed', NOW()),
    ('cc0e8400-e29b-41d4-a716-446655440003', 'bb0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005', 'PAY_003_' || extract(epoch from now()), 7228.00, 'mpesa', 'safaricom', 'MPE987654321', 'completed', NOW())
ON CONFLICT (reference) DO NOTHING;

-- Insert sample domain registrations
INSERT INTO domain_registrations (client_id, domain, price, status, registration_id, registered_at, expires_at) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'artisancrafts.co.ke', 2000.00, 'active', 'DOM_001_' || extract(epoch from now()), NOW(), NOW() + INTERVAL '1 year'),
    ('550e8400-e29b-41d4-a716-446655440005', 'fashionforward.shop', 3500.00, 'active', 'DOM_002_' || extract(epoch from now()), NOW(), NOW() + INTERVAL '1 year');

-- Insert sample activity logs
INSERT INTO activity_logs (user_id, client_id, action, resource_type, resource_id, metadata) VALUES
    ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'product_created', 'product', '990e8400-e29b-41d4-a716-446655440001', '{"product_name": "Beaded Necklace"}'),
    ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'order_received', 'order', 'bb0e8400-e29b-41d4-a716-446655440001', '{"order_number": "ORD-000001", "amount": 3400}'),
    ('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 'shop_created', 'shop', '770e8400-e29b-41d4-a716-446655440002', '{"shop_name": "Fashion Forward Boutique"}');

-- Update customer statistics
UPDATE customers SET 
    total_spent = (
        SELECT COALESCE(SUM(total_amount), 0) 
        FROM orders 
        WHERE customer_id = customers.id AND status = 'completed'
    ),
    orders_count = (
        SELECT COUNT(*) 
        FROM orders 
        WHERE customer_id = customers.id
    ),
    last_order_at = (
        SELECT MAX(created_at) 
        FROM orders 
        WHERE customer_id = customers.id
    );

-- Add some realistic timestamps
UPDATE orders SET created_at = NOW() - INTERVAL '1 day' WHERE order_number = 'ORD-000001';
UPDATE orders SET created_at = NOW() - INTERVAL '2 days' WHERE order_number = 'ORD-000002';
UPDATE orders SET created_at = NOW() - INTERVAL '3 days' WHERE order_number = 'ORD-000003';