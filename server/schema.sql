-- UrbanServe Database Schema
-- PostgreSQL 15

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS quick_service_requests CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- USERS TABLE (customers + service team)
-- ============================================
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'service_team')),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  address TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  service_category VARCHAR(100),
  approval_status VARCHAR(20) CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SERVICES TABLE (service catalog)
-- ============================================
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price_min NUMERIC(10, 2),
  price_max NUMERIC(10, 2),
  professional_id UUID REFERENCES users(id) ON DELETE SET NULL,
  available_slots JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  professional_id UUID REFERENCES users(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  scheduled_time TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'in_progress', 'completed', 'cancelled')),
  price NUMERIC(10, 2),
  review_rating INTEGER CHECK (review_rating >= 1 AND review_rating <= 5),
  review_comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- QUICK SERVICE REQUESTS TABLE
-- ============================================
CREATE TABLE quick_service_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  service_type VARCHAR(255) NOT NULL,
  location TEXT,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  status VARCHAR(20) DEFAULT 'searching' CHECK (status IN ('searching', 'matched', 'no_match', 'en_route', 'in_progress', 'completed', 'cancelled')),
  professional_id UUID REFERENCES users(id) ON DELETE SET NULL,
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  matched_at TIMESTAMPTZ,
  estimated_arrival TIMESTAMPTZ,
  distance_km NUMERIC(10, 2),
  eta_minutes INTEGER
);

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_professional ON bookings(professional_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_quick_service_customer ON quick_service_requests(customer_id);
CREATE INDEX idx_quick_service_status ON quick_service_requests(status);
CREATE INDEX idx_services_category ON services(category);

-- ============================================
-- SEED DATA: Default services
-- ============================================
INSERT INTO services (category, title, description, price_min, price_max, available_slots) VALUES
  ('Cleaning', 'Deep Home Cleaning', 'Complete deep cleaning of your home including bathrooms, kitchen, and living areas.', 99, 299, '[]'::jsonb),
  ('Cleaning', 'Bathroom Deep Clean', 'Thorough sanitization and cleaning of all bathroom fixtures and tiles.', 49, 129, '[]'::jsonb),
  ('Home Repair', 'Plumbing Service', 'Fix leaks, unclog drains, and install new fixtures.', 50, 150, '[]'::jsonb),
  ('Home Repair', 'Electrical Wiring', 'Electrical repairs, switch replacement, and wiring fixes.', 60, 200, '[]'::jsonb),
  ('Personal Care', 'Men''s Haircut & Grooming', 'Professional haircut, beard styling, and facial massage at home.', 30, 60, '[]'::jsonb),
  ('Personal Care', 'Women''s Salon at Home', 'Haircut, styling, facial, and beauty services at your doorstep.', 50, 150, '[]'::jsonb),
  ('Appliance Repair', 'AC Service & Repair', 'AC gas refilling, deep cleaning, and component repair.', 40, 120, '[]'::jsonb),
  ('Appliance Repair', 'Washing Machine Repair', 'Diagnose and fix washing machine issues of all brands.', 45, 130, '[]'::jsonb);

SELECT 'Schema created and seed data inserted successfully!' AS status;
