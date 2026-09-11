const express = require('express');
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/bookings
 * Create a new booking
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { serviceId, professionalId, scheduledTime, price } = req.body;
    const customerId = req.user.id;

    const result = await pool.query(
      `INSERT INTO bookings (service_id, professional_id, customer_id, scheduled_time, price, status)
       VALUES ($1, $2, $3, $4, $5, 'confirmed')
       RETURNING *`,
      [serviceId, professionalId || null, customerId, scheduledTime, price]
    );

    const row = result.rows[0];
    res.status(201).json({
      id: row.id,
      serviceId: row.service_id,
      professionalId: row.professional_id,
      customerId: row.customer_id,
      scheduledTime: row.scheduled_time,
      status: row.status,
      price: parseFloat(row.price),
      createdAt: row.created_at,
      review: row.review_rating ? { rating: row.review_rating, comment: row.review_comment } : undefined,
    });
  } catch (err) {
    console.error('Create booking error:', err);
    res.status(500).json({ error: 'Server error creating booking' });
  }
});

/**
 * GET /api/bookings/my
 * Get bookings for the authenticated customer
 */
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, s.title as service_title, s.category as service_category,
              u.name as professional_name
       FROM bookings b
       LEFT JOIN services s ON b.service_id = s.id
       LEFT JOIN users u ON b.professional_id = u.id
       WHERE b.customer_id = $1
       ORDER BY b.created_at DESC`,
      [req.user.id]
    );

    const bookings = result.rows.map(row => ({
      id: row.id,
      serviceId: row.service_id,
      professionalId: row.professional_id,
      customerId: row.customer_id,
      scheduledTime: row.scheduled_time,
      status: row.status,
      price: parseFloat(row.price),
      createdAt: row.created_at,
      review: row.review_rating ? { rating: row.review_rating, comment: row.review_comment } : undefined,
      serviceTitle: row.service_title,
      serviceCategory: row.service_category,
      professionalName: row.professional_name,
    }));

    res.json(bookings);
  } catch (err) {
    console.error('Get my bookings error:', err);
    res.status(500).json({ error: 'Server error fetching bookings' });
  }
});

/**
 * GET /api/bookings/:id
 * Get single booking by ID
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, s.title as service_title, s.category as service_category,
              u.name as professional_name
       FROM bookings b
       LEFT JOIN services s ON b.service_id = s.id
       LEFT JOIN users u ON b.professional_id = u.id
       WHERE b.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const row = result.rows[0];
    res.json({
      id: row.id,
      serviceId: row.service_id,
      professionalId: row.professional_id,
      customerId: row.customer_id,
      scheduledTime: row.scheduled_time,
      status: row.status,
      price: parseFloat(row.price),
      createdAt: row.created_at,
      review: row.review_rating ? { rating: row.review_rating, comment: row.review_comment } : undefined,
      serviceTitle: row.service_title,
      serviceCategory: row.service_category,
      professionalName: row.professional_name,
    });
  } catch (err) {
    console.error('Get booking error:', err);
    res.status(500).json({ error: 'Server error fetching booking' });
  }
});

/**
 * PUT /api/bookings/:id/rate
 * Rate a completed booking
 */
router.put('/:id/rate', authenticateToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const result = await pool.query(
      `UPDATE bookings SET review_rating = $1, review_comment = $2, status = 'completed'
       WHERE id = $3
       RETURNING *`,
      [rating, comment || null, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const row = result.rows[0];
    res.json({
      id: row.id,
      serviceId: row.service_id,
      professionalId: row.professional_id,
      customerId: row.customer_id,
      scheduledTime: row.scheduled_time,
      status: row.status,
      price: parseFloat(row.price),
      createdAt: row.created_at,
      review: { rating: row.review_rating, comment: row.review_comment },
    });
  } catch (err) {
    console.error('Rate booking error:', err);
    res.status(500).json({ error: 'Server error rating booking' });
  }
});

/**
 * PUT /api/bookings/:id/status
 * Update booking status
 */
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;

    const result = await pool.query(
      `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const row = result.rows[0];
    res.json({
      id: row.id,
      serviceId: row.service_id,
      professionalId: row.professional_id,
      customerId: row.customer_id,
      scheduledTime: row.scheduled_time,
      status: row.status,
      price: parseFloat(row.price),
      createdAt: row.created_at,
    });
  } catch (err) {
    console.error('Update booking status error:', err);
    res.status(500).json({ error: 'Server error updating booking' });
  }
});

module.exports = router;
