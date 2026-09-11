const express = require('express');
const pool = require('../db');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// All admin routes require service_team role
router.use(authenticateToken);
router.use(requireRole('service_team'));

/**
 * GET /api/admin/stats
 * Get dashboard statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const [customers, bookings, completed, quickRequests] = await Promise.all([
      pool.query("SELECT COUNT(*) as count FROM users WHERE role = 'customer'"),
      pool.query("SELECT COUNT(*) as count FROM bookings"),
      pool.query("SELECT COUNT(*) as count FROM bookings WHERE status = 'completed'"),
      pool.query("SELECT COUNT(*) as count FROM quick_service_requests"),
    ]);

    const revenueResult = await pool.query(
      "SELECT COALESCE(SUM(price), 0) as total FROM bookings WHERE status = 'completed'"
    );

    res.json({
      totalCustomers: parseInt(customers.rows[0].count),
      totalBookings: parseInt(bookings.rows[0].count),
      completedBookings: parseInt(completed.rows[0].count),
      totalQuickRequests: parseInt(quickRequests.rows[0].count),
      totalRevenue: parseFloat(revenueResult.rows[0].total),
    });
  } catch (err) {
    console.error('Get stats error:', err);
    res.status(500).json({ error: 'Server error fetching stats' });
  }
});

/**
 * GET /api/admin/customers
 * Get all customers with search
 */
router.get('/customers', async (req, res) => {
  try {
    const { search } = req.query;
    let sql = `
      SELECT id, name, email, phone, address, lat, lng, created_at
      FROM users
      WHERE role = 'customer'
    `;
    const params = [];

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      sql += ` AND (LOWER(name) LIKE $${params.length} OR LOWER(email) LIKE $${params.length} OR LOWER(phone) LIKE $${params.length})`;
    }

    sql += ' ORDER BY created_at DESC';

    const result = await pool.query(sql, params);

    const customers = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      address: row.address,
      coordinates: row.lat && row.lng ? { lat: row.lat, lng: row.lng } : null,
      createdAt: row.created_at,
    }));

    res.json(customers);
  } catch (err) {
    console.error('Get customers error:', err);
    res.status(500).json({ error: 'Server error fetching customers' });
  }
});

/**
 * GET /api/admin/customers/:id
 * Get single customer with their bookings and quick service history
 */
router.get('/customers/:id', async (req, res) => {
  try {
    const userResult = await pool.query(
      `SELECT id, name, email, phone, address, lat, lng, created_at
       FROM users WHERE id = $1 AND role = 'customer'`,
      [req.params.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const customer = userResult.rows[0];

    // Get their bookings
    const bookingsResult = await pool.query(
      `SELECT b.*, s.title as service_title, s.category as service_category
       FROM bookings b
       LEFT JOIN services s ON b.service_id = s.id
       WHERE b.customer_id = $1
       ORDER BY b.created_at DESC`,
      [req.params.id]
    );

    // Get their quick service requests
    const quickResult = await pool.query(
      `SELECT * FROM quick_service_requests
       WHERE customer_id = $1
       ORDER BY requested_at DESC`,
      [req.params.id]
    );

    res.json({
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        coordinates: customer.lat && customer.lng ? { lat: customer.lat, lng: customer.lng } : null,
        createdAt: customer.created_at,
      },
      bookings: bookingsResult.rows.map(row => ({
        id: row.id,
        serviceTitle: row.service_title,
        serviceCategory: row.service_category,
        scheduledTime: row.scheduled_time,
        status: row.status,
        price: parseFloat(row.price),
        reviewRating: row.review_rating,
        createdAt: row.created_at,
      })),
      quickRequests: quickResult.rows.map(row => ({
        id: row.id,
        serviceType: row.service_type,
        location: row.location,
        status: row.status,
        requestedAt: row.requested_at,
        matchedAt: row.matched_at,
      })),
    });
  } catch (err) {
    console.error('Get customer detail error:', err);
    res.status(500).json({ error: 'Server error fetching customer details' });
  }
});

/**
 * GET /api/admin/bookings
 * Get all bookings with customer info
 */
router.get('/bookings', async (req, res) => {
  try {
    const { status, search } = req.query;
    let sql = `
      SELECT b.*, 
        s.title as service_title, s.category as service_category,
        cu.name as customer_name, cu.email as customer_email, cu.phone as customer_phone,
        pu.name as professional_name
      FROM bookings b
      LEFT JOIN services s ON b.service_id = s.id
      LEFT JOIN users cu ON b.customer_id = cu.id
      LEFT JOIN users pu ON b.professional_id = pu.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      params.push(status);
      sql += ` AND b.status = $${params.length}`;
    }

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      sql += ` AND (LOWER(cu.name) LIKE $${params.length} OR LOWER(s.title) LIKE $${params.length})`;
    }

    sql += ' ORDER BY b.created_at DESC';

    const result = await pool.query(sql, params);

    const bookings = result.rows.map(row => ({
      id: row.id,
      serviceTitle: row.service_title,
      serviceCategory: row.service_category,
      customerName: row.customer_name,
      customerEmail: row.customer_email,
      customerPhone: row.customer_phone,
      professionalName: row.professional_name,
      scheduledTime: row.scheduled_time,
      status: row.status,
      price: parseFloat(row.price),
      reviewRating: row.review_rating,
      reviewComment: row.review_comment,
      createdAt: row.created_at,
    }));

    res.json(bookings);
  } catch (err) {
    console.error('Get all bookings error:', err);
    res.status(500).json({ error: 'Server error fetching bookings' });
  }
});

/**
 * GET /api/admin/quick-requests
 * Get all quick service requests with customer info
 */
router.get('/quick-requests', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT qsr.*, 
        cu.name as customer_name, cu.email as customer_email, cu.phone as customer_phone,
        pu.name as professional_name
       FROM quick_service_requests qsr
       LEFT JOIN users cu ON qsr.customer_id = cu.id
       LEFT JOIN users pu ON qsr.professional_id = pu.id
       ORDER BY qsr.requested_at DESC`
    );

    const requests = result.rows.map(row => ({
      id: row.id,
      serviceType: row.service_type,
      location: row.location,
      status: row.status,
      customerName: row.customer_name,
      customerEmail: row.customer_email,
      customerPhone: row.customer_phone,
      professionalName: row.professional_name,
      requestedAt: row.requested_at,
      matchedAt: row.matched_at,
      distanceKm: row.distance_km ? parseFloat(row.distance_km) : null,
      etaMinutes: row.eta_minutes,
    }));

    res.json(requests);
  } catch (err) {
    console.error('Get quick requests error:', err);
    res.status(500).json({ error: 'Server error fetching quick requests' });
  }
});

module.exports = router;
